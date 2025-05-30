const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ApiError } = require('./errorHandler');

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Initialize upload directories
ensureDirectoryExists('uploads/books');
ensureDirectoryExists('uploads/covers');
ensureDirectoryExists('uploads/scholars');

/**
 * Storage configuration for book files (PDFs)
 */
const bookStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/books';
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = `book-${uniqueSuffix}${ext}`;
    cb(null, name);
  }
});

/**
 * Storage configuration for cover images
 */
const coverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/covers';
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = `cover-${uniqueSuffix}${ext}`;
    cb(null, name);
  }
});

/**
 * Storage configuration for scholar images
 */
const scholarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/scholars';
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = `scholar-${uniqueSuffix}${ext}`;
    cb(null, name);
  }
});

/**
 * File filter for PDF files (books)
 */
const pdfFileFilter = (req, file, cb) => {
  // Check if file is PDF
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new ApiError('Only PDF files are allowed for books', 400), false);
  }
};

/**
 * File filter for image files (covers and scholar photos)
 */
const imageFileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    // Allow specific image types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError('Only JPEG, PNG, and WebP images are allowed', 400), false);
    }
  } else {
    cb(new ApiError('Only image files are allowed', 400), false);
  }
};

/**
 * File size limits
 */
const limits = {
  // 50MB for book PDFs
  bookFile: { fileSize: 50 * 1024 * 1024 },
  // 5MB for cover images
  coverImage: { fileSize: 5 * 1024 * 1024 },
  // 2MB for scholar images
  scholarImage: { fileSize: 2 * 1024 * 1024 }
};

/**
 * Multer configurations
 */
const uploadBookFile = multer({
  storage: bookStorage,
  fileFilter: pdfFileFilter,
  limits: limits.bookFile,
}).single('bookFile');

const uploadCoverImage = multer({
  storage: coverStorage,
  fileFilter: imageFileFilter,
  limits: limits.coverImage,
}).single('coverImage');

const uploadScholarImage = multer({
  storage: scholarStorage,
  fileFilter: imageFileFilter,
  limits: limits.scholarImage,
}).single('scholarImage');

/**
 * Multiple file upload (book + cover)
 */
const uploadBookWithCover = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'bookFile') {
        ensureDirectoryExists('uploads/books');
        cb(null, 'uploads/books');
      } else if (file.fieldname === 'coverImage') {
        ensureDirectoryExists('uploads/covers');
        cb(null, 'uploads/covers');
      } else {
        cb(new ApiError('Invalid field name', 400), null);
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      
      if (file.fieldname === 'bookFile') {
        cb(null, `book-${uniqueSuffix}${ext}`);
      } else if (file.fieldname === 'coverImage') {
        cb(null, `cover-${uniqueSuffix}${ext}`);
      }
    }
  }),
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'bookFile') {
      pdfFileFilter(req, file, cb);
    } else if (file.fieldname === 'coverImage') {
      imageFileFilter(req, file, cb);
    } else {
      cb(new ApiError('Invalid field name', 400), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // Max 50MB per file
    files: 2 // Max 2 files (book + cover)
  }
}).fields([
  { name: 'bookFile', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

/**
 * Error handling middleware for multer
 */
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError('File size too large', 400));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new ApiError('Too many files uploaded', 400));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new ApiError('Unexpected file field', 400));
    }
    return next(new ApiError('File upload error', 400));
  }
  next(err);
};

/**
 * Middleware to validate uploaded files
 */
const validateUploadedFile = (req, res, next) => {
  if (!req.file && !req.files) {
    return next(new ApiError('No file uploaded', 400));
  }

  // Validate file exists and is accessible
  const files = req.files || [req.file];
  
  for (const file of files) {
    if (!fs.existsSync(file.path)) {
      return next(new ApiError('Uploaded file not found', 500));
    }
  }

  next();
};

/**
 * Middleware to clean up uploaded files on error
 */
const cleanupFiles = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;

  const cleanup = () => {
    if (res.statusCode >= 400) {
      // Clean up uploaded files on error
      const files = [];
      
      if (req.file) files.push(req.file);
      if (req.files) {
        if (Array.isArray(req.files)) {
          files.push(...req.files);
        } else {
          Object.values(req.files).forEach(fileArray => {
            files.push(...fileArray);
          });
        }
      }

      files.forEach(file => {
        if (file && file.path && fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
            console.log(`Cleaned up file: ${file.path}`);
          } catch (error) {
            console.error(`Failed to clean up file: ${file.path}`, error);
          }
        }
      });
    }
  };

  res.send = function(...args) {
    cleanup();
    return originalSend.apply(this, args);
  };

  res.json = function(...args) {
    cleanup();
    return originalJson.apply(this, args);
  };

  next();
};

/**
 * Get file URL helper
 */
const getFileUrl = (req, filePath) => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/${filePath}`;
};

/**
 * Delete file helper
 */
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath || !fs.existsSync(filePath)) {
      return resolve();
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
        reject(err);
      } else {
        console.log(`File deleted: ${filePath}`);
        resolve();
      }
    });
  });
};

/**
 * Get file stats helper
 */
const getFileStats = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      exists: true
    };
  } catch (error) {
    return {
      size: 0,
      created: null,
      modified: null,
      exists: false
    };
  }
};

/**
 * Format file size helper
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

module.exports = {
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