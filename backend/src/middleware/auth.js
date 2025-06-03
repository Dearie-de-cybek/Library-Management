
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided, authorization denied'
      });
    }

    // Check if token starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token format. Use Bearer <token>'
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided, authorization denied'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Token is valid but user not found'
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({
          status: 'error',
          message: 'User account is inactive'
        });
      }

      // Update last active date
      user.lastActive = new Date();
      await user.save();

      // Add user to request object
      req.user = user;
      next();

    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      }

      if (tokenError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
      }

      throw tokenError;
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during authentication'
    });
  }
};

// Optional auth - doesn't fail if no token, but adds user if token exists
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next(); // Continue without user
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.status === 'active') {
        req.user = user;
        user.lastActive = new Date();
        await user.save();
      }
    } catch (tokenError) {
      // Ignore token errors in optional auth
      console.log('Optional auth token error:', tokenError.message);
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
};

module.exports = { auth, optionalAuth };