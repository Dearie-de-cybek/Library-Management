const express = require('express');

// Import controllers
const { userController } = require('../controllers');

// Import middleware
const {
  auth,
  isAdmin,
  isOwnerOrAdmin,
  checkAccountStatus,
  logUserAction,
  validateMongoId,
  validatePagination
} = require('../middleware');

const router = express.Router();

// Apply authentication to all routes
router.use(auth);
router.use(checkAccountStatus);

/**
 * @route   GET /api/users/dashboard
 * @desc    Get user dashboard data
 * @access  Private (User's own dashboard)
 */
router.get('/dashboard',
  logUserAction('View Dashboard'),
  userController.getDashboard
);

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
router.get('/',
  isAdmin,
  validatePagination,
  logUserAction('View All Users'),
  userController.getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get single user by ID
 * @access  Private (Admin or Own Profile)
 */
router.get('/:id',
  validateMongoId,
  isOwnerOrAdmin,
  logUserAction('View User Profile'),
  userController.getUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id',
  validateMongoId,
  isAdmin,
  logUserAction('Update User'),
  userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id',
  validateMongoId,
  isAdmin,
  logUserAction('Delete User'),
  userController.deleteUser
);

/**
 * @route   PUT /api/users/:id/status
 * @desc    Update user status (activate/deactivate) (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/status',
  validateMongoId,
  isAdmin,
  logUserAction('Update User Status'),
  userController.updateUserStatus
);

/**
 * @route   GET /api/users/:id/downloads
 * @desc    Get user's download history
 * @access  Private (Admin or Own Downloads)
 */
router.get('/:id/downloads',
  validateMongoId,
  isOwnerOrAdmin,
  validatePagination,
  logUserAction('View User Downloads'),
  userController.getUserDownloads
);

/**
 * @route   GET /api/users/:id/stats
 * @desc    Get user statistics
 * @access  Private (Admin or Own Stats)
 */
router.get('/:id/stats',
  validateMongoId,
  isOwnerOrAdmin,
  logUserAction('View User Statistics'),
  userController.getUserStats
);

module.exports = router;