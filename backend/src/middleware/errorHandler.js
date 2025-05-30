/**
 * Custom Error Class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Mongoose Validation Errors
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(error => ({
    field: error.path,
    message: error.message,
    value: error.value
  }));

  return new ApiError('Validation failed', 400, true);
};

/**
 * Handle Mongoose Duplicate Key Errors
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  
  const message = `${field} '${value}' already exists. Please use another value.`;
  return new ApiError(message, 400, true);
};

/**
 * Handle Mongoose Cast Errors (Invalid ObjectId)
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, 400, true);
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () => {
  return new ApiError('Invalid token. Please log in again.', 401, true);
};

/**
 * Handle JWT Expired Errors
 */
const handleJWTExpiredError = () => {
  return new ApiError('Token has expired. Please log in again.', 401, true);
};

/**
 * Handle Multer File Upload Errors
 */
const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new ApiError('File size too large. Maximum size allowed is 50MB.', 400, true);
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new ApiError('Too many files. Maximum 1 file allowed.', 400, true);
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new ApiError('Unexpected file field. Please check the field name.', 400, true);
  }

  return new ApiError('File upload error.', 400, true);
};

/**
 * Send error response for development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send error response for production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      timestamp: new Date().toISOString()
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥:', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
  } else {
    console.error('Error:', {
      message: err.message,
      statusCode: err.statusCode,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.name === 'ValidationError') {
      error = handleValidationError(err);
    }

    if (err.code === 11000) {
      error = handleDuplicateKeyError(err);
    }

    if (err.name === 'CastError') {
      error = handleCastError(err);
    }

    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    if (err.name === 'MulterError') {
      error = handleMulterError(err);
    }

    sendErrorProd(error, res);
  }
};

/**
 * Handle 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new ApiError(`Route ${req.originalUrl} not found`, 404, true);
  next(error);
};

/**
 * Async error wrapper - catches async errors and passes to error handler
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle unhandled promise rejections
 */
const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (err, promise) => {
    console.log('UNHANDLED PROMISE REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
};

/**
 * Handle uncaught exceptions
 */
const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
};

/**
 * Validation error helper
 */
const createValidationError = (message, field = null) => {
  const error = new ApiError(message, 400, true);
  if (field) {
    error.field = field;
  }
  return error;
};

/**
 * Not found error helper
 */
const createNotFoundError = (resource = 'Resource') => {
  return new ApiError(`${resource} not found`, 404, true);
};

/**
 * Forbidden error helper
 */
const createForbiddenError = (message = 'Access forbidden') => {
  return new ApiError(message, 403, true);
};

/**
 * Unauthorized error helper
 */
const createUnauthorizedError = (message = 'Unauthorized access') => {
  return new ApiError(message, 401, true);
};

/**
 * Rate limit error helper
 */
const createRateLimitError = (message = 'Too many requests') => {
  return new ApiError(message, 429, true);
};

module.exports = {
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
};