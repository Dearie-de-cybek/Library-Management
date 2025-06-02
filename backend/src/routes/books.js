const express = require('express');

// Import controllers
const { bookController } = require('../controllers');

// Import middleware
const {
  auth,
  optionalAuth,
  isAdmin,
  checkAccountStatus,
  logUserAction,
  validateCreateBook,
  validateUpdateBook,
  validateSearch,
  validateMongoId,
  validatePagination,
  uploadBookFile,
  uploadCoverImage,
  uploadBookWithCover,
  handleUploadError,
  validateUploadedFile,
  cleanupFiles
} = require('../middleware');

const router = express.Router();

/**
 * @route   GET /api/books
 * @desc    Get all books with pagination and filtering
 * @access  Public
 */
router.get('/',
  optionalAuth, // Optional auth to track user activity
  validatePagination,
  validateSearch,
  bookController.getAllBooks
);

/**
 * @route   GET /api/books/search
 * @desc    Advanced search books
 * @access  Public
 */
router.get('/search',
  optionalAuth,
  validateSearch,
  bookController.searchBooks
);

/**
 * @route   GET /api/books/popular
 * @desc    Get popular books
 * @access  Public
 */
router.get('/popular',
  optionalAuth,
  bookController.getPopularBooks
);

/**
 * @route   GET /api/books/recent
 * @desc    Get recently added books
 * @access  Public
 */
router.get('/recent',
  optionalAuth,
  bookController.getRecentBooks
);

/**
 * @route   GET /api/books/category/:category
 * @desc    Get books by category
 * @access  Public
 */
router.get('/category/:category',
  optionalAuth,
  validatePagination,
  bookController.getBooksByCategory
);

/**
 * @route   POST /api/books
 * @desc    Create new book (Admin only)
 * @access  Private (Admin)
 */
router.post('/',
  auth,
  checkAccountStatus,
  isAdmin,
  validateCreateBook,
  logUserAction('Create Book'),
  bookController.createBook
);

/**
 * @route   POST /api/books/upload
 * @desc    Create book with file upload (Admin only)
 * @access  Private (Admin)
 */
router.post('/upload',
  auth,
  checkAccountStatus,
  isAdmin,
  cleanupFiles,
  uploadBookWithCover,
  handleUploadError,
  validateCreateBook,
  logUserAction('Create Book with Upload'),
  bookController.createBook
);

/**
 * @route   GET /api/books/:id
 * @desc    Get single book by ID
 * @access  Public
 */
router.get('/:id',
  validateMongoId,
  optionalAuth,
  bookController.getBook
);

/**
 * @route   PUT /api/books/:id
 * @desc    Update book (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id',
  validateMongoId,
  auth,
  checkAccountStatus,
  isAdmin,
  validateUpdateBook,
  logUserAction('Update Book'),
  bookController.updateBook
);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete book (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id',
  validateMongoId,
  auth,
  checkAccountStatus,
  isAdmin,
  logUserAction('Delete Book'),
  bookController.deleteBook
);

/**
 * @route   POST /api/books/:id/upload-book
 * @desc    Upload book PDF file (Admin only)
 * @access  Private (Admin)
 */
router.post('/:id/upload-book',
  validateMongoId,
  auth,
  checkAccountStatus,
  isAdmin,
  cleanupFiles,
  uploadBookFile,
  handleUploadError,
  validateUploadedFile,
  logUserAction('Upload Book File'),
  bookController.uploadBookFile
);

/**
 * @route   POST /api/books/:id/upload-cover
 * @desc    Upload book cover image (Admin only)
 * @access  Private (Admin)
 */
router.post('/:id/upload-cover',
  validateMongoId,
  auth,
  checkAccountStatus,
  isAdmin,
  cleanupFiles,
  uploadCoverImage,
  handleUploadError,
  validateUploadedFile,
  logUserAction('Upload Book Cover'),
  bookController.uploadCoverImage
);

module.exports = router;