const express = require('express');

// Import controllers
const { scholarController } = require('../controllers');

// Import middleware
const {
  auth,
  optionalAuth,
  isAdmin,
  checkAccountStatus,
  logUserAction,
  validateCreateScholar,
  validateMongoId,
  validatePagination,
  uploadScholarImage,
  handleUploadError,
  validateUploadedFile,
  cleanupFiles
} = require('../middleware');

const router = express.Router();

/**
 * @route   GET /api/scholars
 * @desc    Get all scholars with pagination and filtering
 * @access  Public
 */
router.get('/',
  optionalAuth,
  validatePagination,
  scholarController.getAllScholars
);

/**
 * @route   GET /api/scholars/popular
 * @desc    Get popular scholars
 * @access  Public
 */
router.get('/popular',
  optionalAuth,
  scholarController.getPopularScholars
);

/**
 * @route   GET /api/scholars/living
 * @desc    Get living scholars
 * @access  Public
 */
router.get('/living',
  optionalAuth,
  scholarController.getLivingScholars
);

/**
 * @route   GET /api/scholars/classical
 * @desc    Get classical (deceased) scholars
 * @access  Public
 */
router.get('/classical',
  optionalAuth,
  scholarController.getClassicalScholars
);

/**
 * @route   GET /api/scholars/specialization/:specialization
 * @desc    Get scholars by specialization
 * @access  Public
 */
router.get('/specialization/:specialization',
  optionalAuth,
  validatePagination,
  scholarController.getScholarsBySpecialization
);

/**
 * @route   POST /api/scholars
 * @desc    Create new scholar (Admin only)
 * @access  Private (Admin)
 */
router.post('/',
  auth,
  checkAccountStatus,
  isAdmin,
  validateCreateScholar,
  logUserAction('Create Scholar'),
  scholarController.createScholar
);

/**
 * @route   GET /api/scholars/:id
 * @desc    Get single scholar by ID
 * @access  Public
 */
router.get('/:id',
  validateMongoId,
  optionalAuth,
  scholarController.getScholar
);

/**
 * @route   PUT /api/scholars/:id
 * @desc    Update scholar (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id',
  validateMongoId,
  auth,
  checkAccountStatus,
  isAdmin,
  logUserAction('Update Scholar'),
  scholarController.updateScholar
);

/**
 * @route   DELETE /api/scholars/:id
 * @desc    Delete scholar (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id',
  validateMongoId,
  auth,
  checkAccountStatus,
  isAdmin,
  logUserAction('Delete Scholar'),
  scholarController.deleteScholar
);

/**
 * @route   POST /api/scholars/:id/upload-image
 * @desc    Upload scholar image (Admin only)
 * @access  Private (Admin)
 */
router.post('/:id/upload-image',
  validateMongoId,
  auth,
  checkAccountStatus,
  isAdmin,
  cleanupFiles,
  uploadScholarImage,
  handleUploadError,
  validateUploadedFile,
  logUserAction('Upload Scholar Image'),
  scholarController.uploadScholarImage
);

/**
 * @route   GET /api/scholars/:id/books
 * @desc    Get books by scholar
 * @access  Public
 */
router.get('/:id/books',
  validateMongoId,
  optionalAuth,
  validatePagination,
  scholarController.getScholarBooks
);

/**
 * @route   GET /api/scholars/:id/stats
 * @desc    Get scholar statistics
 * @access  Public
 */
router.get('/:id/stats',
  validateMongoId,
  optionalAuth,
  scholarController.getScholarStats
);

/**
 * @route   POST /api/scholars/:id/works
 * @desc    Add work to scholar (Admin only)
 * @access  Private (Admin)
 */
router.post('/:id/works',
  validateMongoId,
  auth,
  checkAccountStatus,
  isAdmin,
  logUserAction('Add Scholar Work'),
  scholarController.addScholarWork
);

/**
 * @route   PUT /api/scholars/:id/works/:workId
 * @desc    Update scholar work (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/works/:workId',
  validateMongoId,
  auth,
  checkAccountStatus,
  isAdmin,
  logUserAction('Update Scholar Work'),
  scholarController.updateScholarWork
);

/**
 * @route   DELETE /api/scholars/:id/works/:workId
 * @desc    Delete scholar work (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id/works/:workId',
  validateMongoId,
  auth,
  checkAccountStatus,
  isAdmin,
  logUserAction('Delete Scholar Work'),
  scholarController.deleteScholarWork
);

module.exports = router;