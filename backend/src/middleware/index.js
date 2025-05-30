const { auth, optionalAuth } = require('./auth');
const {
  authorize,
  isAdmin,
  isOwnerOrAdmin,
  canModifyResource,
  rateLimitByRole,
  checkAccountStatus,
  logUserAction,
  checkDownloadLimits
} = require('./authorize');

const {
  validate,
  schemas,
  validateRegister,
  validateLogin,
  validateUpdateUser,
  validateChangePassword,
  validateCreateBook,
  validateUpdateBook,
  validateCreateScholar,
  validateSearch,
  validateMongoId,
  validatePagination
} = require('./validation');

const {
  ApiError,
  errorHandler,
  notFound,
  catchAsync,
  handleUnhandledRejection,
  handleUncaughtException,
  createValidationError,
  createNotFoundError,
  createForbiddenError,
  createUnauthorizedError,
  createRateLimitError
} = require('./errorHandler');

const {
  uploadBookFile,
  uploadCoverImage,
  uploadScholarImage,
  uploadBookWithCover,
  handleUploadError,
  validateUploadedFile,
  cleanupFiles,
  getFileUrl,
  deleteFile,
  getFileStats,
  formatFileSize,
  limits
} = require('./fileUpload');

module.exports = {
  // Authentication & Authorization
  auth,
  optionalAuth,
  authorize,
  isAdmin,
  isOwnerOrAdmin,
  canModifyResource,
  rateLimitByRole,
  checkAccountStatus,
  logUserAction,
  checkDownloadLimits,

  // Validation
  validate,
  schemas,
  validateRegister,
  validateLogin,
  validateUpdateUser,
  validateChangePassword,
  validateCreateBook,
  validateUpdateBook,
  validateCreateScholar,
  validateSearch,
  validateMongoId,
  validatePagination,

  // Error Handling
  ApiError,
  errorHandler,
  notFound,
  catchAsync,
  createValidationError,
  createNotFoundError,
  createForbiddenError,
  createUnauthorizedError,
  createRateLimitError,

  // File Upload
  uploadBookFile,
  uploadCoverImage,
  uploadScholarImage,
  uploadBookWithCover,
  handleUploadError,
  validateUploadedFile,
  cleanupFiles,
  getFileUrl,
  deleteFile,
  getFileStats,
  formatFileSize,
  limits
};