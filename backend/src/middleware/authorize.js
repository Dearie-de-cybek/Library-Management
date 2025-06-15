/**
 * Role-based authorization middleware
 * @param {...string} roles - Allowed roles for the route
 * @returns {Function} Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Authentication required.'
      });
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions.',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. Authentication required.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

/**
 * Check if user can access own resources or is admin
 */
const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. Authentication required.'
    });
  }

  const userId = req.params.userId || req.params.id;
  const isOwner = req.user._id.toString() === userId;
  const isAdminUser = req.user.role === 'admin';

  if (!isOwner && !isAdminUser) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. You can only access your own resources.'
    });
  }

  next();
};

/**
 * Check if user can modify resource (admin or resource owner)
 */
const canModifyResource = (resourceUserField = 'addedBy') => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Authentication required.'
      });
    }

    // Admin can modify anything
    if (req.user.role === 'admin') {
      return next();
    }

    // For other users, we need to check if they own the resource
    // This will be handled in the controller where we have access to the resource
    req.canModify = {
      userField: resourceUserField,
      userId: req.user._id
    };

    next();
  };
};

/**
 * Rate limiting for specific users or roles
 */
const rateLimitByRole = (limits = {}) => {
  // Default limits: { user: 100, admin: 1000 }
  const defaultLimits = { user: 100, admin: 1000, ...limits };
  
  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userRole = req.user.role;
    const limit = defaultLimits[userRole] || defaultLimits.user;

    // Add limit info to request for rate limiter
    req.roleBasedLimit = limit;
    next();
  };
};

/**
 * Check if user account is in good standing
 */
const checkAccountStatus = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. Authentication required.'
    });
  }

  if (req.user.status !== 'active') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Account is not active.',
      accountStatus: req.user.status
    });
  }

  next();
};

/**
 * Log user actions for audit trail
 */
const logUserAction = (action) => {
  return (req, res, next) => {
    if (req.user) {
      console.log(`[AUDIT] User ${req.user.email} (${req.user.role}) performed: ${action} at ${new Date().toISOString()}`);
      
      // You can extend this to log to database or external service
      req.auditLog = {
        userId: req.user._id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: action,
        timestamp: new Date(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      };
    }
    next();
  };
};

/**
 * Check download limits for users
 */
const checkDownloadLimits = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. Authentication required.'
    });
  }

  // Admin has no limits
  if (req.user.role === 'admin') {
    return next();
  }

  // Check daily download limit for regular users
  const dailyLimit = 50; // Regular users can download 50 books per day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const { Download } = require('../models');
    
    const todayDownloads = await Download.countDocuments({
      user: req.user._id,
      downloadDate: { $gte: today },
      status: 'completed'
    });

    if (todayDownloads >= dailyLimit) {
      return res.status(429).json({
        status: 'error',
        message: 'Daily download limit exceeded. Please try again tomorrow.',
        limit: dailyLimit,
        used: todayDownloads
      });
    }

    // Add download count to request
    req.downloadCount = {
      today: todayDownloads,
      limit: dailyLimit,
      remaining: dailyLimit - todayDownloads
    };

    next();
  } catch (error) {
    console.error('Error checking download limits:', error);
    next(); // Continue even if check fails
  }
};

module.exports = {
  authorize,
  isAdmin,
  isOwnerOrAdmin,
  canModifyResource,
  rateLimitByRole,
  checkAccountStatus,
  logUserAction,
  checkDownloadLimits
};