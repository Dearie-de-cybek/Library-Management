const express = require('express');
const rateLimit = require('express-rate-limit');

// Import controllers
const { downloadController } = require('../controllers');

// Import middleware
const {
  auth,
  isAdmin,
  checkAccountStatus,
  checkDownloadLimits,
  logUserAction,
  validateMongoId,
  validatePagination
} = require('../middleware');

const router = express.Router();

// Rate limiting for downloads
const downloadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 downloads per minute per IP
  message: {
    status: 'error',
    message: 'Too many download requests, please try again later',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route   POST /api/downloads/book/:bookId
 * @desc    Download a book
 * @access  Private (Authenticated users)
 */
router.post('/book/:bookId',
  downloadLimiter,
  validateMongoId,
  auth,
  checkAccountStatus,
  checkDownloadLimits,
  logUserAction('Download Book'),
  downloadController.downloadBook
);

/**
 * @route   GET /api/downloads/my-downloads
 * @desc    Get user's download history
 * @access  Private
 */
router.get('/my-downloads',
  auth,
  checkAccountStatus,
  validatePagination,
  downloadController.getMyDownloads
);

/**
 * @route   GET /api/downloads/my-stats
 * @desc    Get user's download statistics
 * @access  Private
 */
router.get('/my-stats',
  auth,
  checkAccountStatus,
  downloadController.getMyDownloadStats
);

/**
 * @route   GET /api/downloads/check/:bookId
 * @desc    Check if user has downloaded a book
 * @access  Private
 */
router.get('/check/:bookId',
  validateMongoId,
  auth,
  checkAccountStatus,
  downloadController.checkDownloadStatus
);

// Admin only routes
/**
 * @route   GET /api/downloads
 * @desc    Get all downloads (Admin only)
 * @access  Private (Admin)
 */
router.get('/',
  auth,
  checkAccountStatus,
  isAdmin,
  validatePagination,
  logUserAction('View All Downloads'),
  downloadController.getAllDownloads
);

/**
 * @route   GET /api/downloads/analytics
 * @desc    Get download analytics (Admin only)
 * @access  Private (Admin)
 */
router.get('/analytics',
  auth,
  checkAccountStatus,
  isAdmin,
  logUserAction('View Download Analytics'),
  downloadController.getDownloadAnalytics
);

/**
 * @route   GET /api/downloads/:id
 * @desc    Get download by ID (Admin only)
 * @access  Private (Admin)
 */
router.get('/:id',
  validateMongoId,
  auth,
  checkAccountStatus,
  isAdmin,
  logUserAction('View Download Details'),
  downloadController.getDownload
);

module.exports = router;