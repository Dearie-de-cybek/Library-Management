const express = require('express');
const rateLimit = require('express-rate-limit');

// Import controllers
const { authController } = require('../controllers');

// Import middleware
const {
  auth,
  validateRegister,
  validateLogin,
  validateUpdateUser,
  validateChangePassword,
  checkAccountStatus,
  logUserAction
} = require('../middleware');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window for general auth operations
  message: {
    status: 'error',
    message: 'Too many requests, please try again later'
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', 
  authLimiter,
  validateRegister,
  logUserAction('User Registration'),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
  authLimiter,
  validateLogin,
  logUserAction('User Login'),
  authController.login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout',
  generalAuthLimiter,
  auth,
  logUserAction('User Logout'),
  authController.logout
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me',
  generalAuthLimiter,
  auth,
  checkAccountStatus,
  authController.getMe
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  generalAuthLimiter,
  auth,
  checkAccountStatus,
  validateUpdateUser,
  logUserAction('Profile Update'),
  authController.updateProfile
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.put('/change-password',
  authLimiter,
  auth,
  checkAccountStatus,
  validateChangePassword,
  logUserAction('Password Change'),
  authController.changePassword
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Forgot password - send reset email
 * @access  Public
 */
router.post('/forgot-password',
  authLimiter,
  logUserAction('Password Reset Request'),
  authController.forgotPassword
);

/**
 * @route   PUT /api/auth/reset-password/:resetToken
 * @desc    Reset password with token
 * @access  Public
 */
router.put('/reset-password/:resetToken',
  authLimiter,
  logUserAction('Password Reset'),
  authController.resetPassword
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh',
  generalAuthLimiter,
  authController.refreshToken
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token validity
 * @access  Private
 */
router.get('/verify',
  generalAuthLimiter,
  auth,
  authController.verifyToken
);

module.exports = router;