// src/utils/constants.js

/**
 * User roles
 */
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

/**
 * User status
 */
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

/**
 * Islamic categories (fixed list)
 */
const ISLAMIC_CATEGORIES = [
  'Islam. General Study and teaching.',
  'History & Biography.',
  'Prophet Muhammad (SAW).',
  'Prophets (AS).',
  'Islamic literature.',
  'Sacred books.',
  'Qur\'an, Special parts and chapters, Works about the Qur\'an.',
  'Hadith literature, Traditions, Sunnah.',
  'General works on Islam.',
  'Dogma (\'Aqa\'id).',
  'Theology (Kalaam).',
  'Works against Islam and the Qur\'an.',
  'Works in defense of Islam.',
  'Islamic apologetics.',
  'Benevolent work. Social work. Welfare works, etc.',
  'Missionary works of Islam.',
  'Relation of Islam to other religions.',
  'Islamic sociology.',
  'The practice of Islam, the five duties of a Muslim. Pillars of Islam.',
  'Jihad (Holy War).',
  'Religious ceremonies, rites, etc.',
  'Special days and seasons, fasts, feasts, festivals, etc.',
  'Relics Shrines, sacred places, etc.',
  'Islamic religious life.',
  'Devotional literature.',
  'Sufism. Mysticism. Dervishes.',
  'Monasticism Branches, sects, etc.',
  'Shiites.',
  'Black Muslims.'
];

/**
 * Supported languages
 */
const LANGUAGES = {
  ARABIC: 'العربية',
  ENGLISH: 'English',
  FRENCH: 'Français',
  GERMAN: 'Deutsch',
  URDU: 'اردو',
  PERSIAN: 'فارسی',
  TURKISH: 'Türkçe'
};

/**
 * Scholar specializations
 */
const SCHOLAR_SPECIALIZATIONS = [
  'Islamic Jurisprudence (Fiqh)',
  'Quranic Sciences',
  'Hadith Studies',
  'Islamic Theology (Aqeedah)',
  'Prophet\'s Biography (Seerah)',
  'Islamic History',
  'Quranic Exegesis (Tafsir)',
  'Principles of Jurisprudence (Usul al-Fiqh)',
  'Islamic Da\'wah',
  'Islamic Ethics',
  'Islamic Education',
  'Islamic Economics',
  'Islamic Philosophy',
  'Islamic Mysticism (Sufism)',
  'Objectives of Sharia (Maqasid)'
];

/**
 * Download status
 */
const DOWNLOAD_STATUS = {
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

/**
 * Download sources
 */
const DOWNLOAD_SOURCES = {
  WEB: 'web',
  MOBILE: 'mobile',
  API: 'api'
};

/**
 * File types and their configurations
 */
const FILE_TYPES = {
  BOOK: {
    ALLOWED_TYPES: ['application/pdf'],
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    UPLOAD_PATH: 'uploads/books/'
  },
  COVER: {
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    UPLOAD_PATH: 'uploads/covers/'
  },
  SCHOLAR_IMAGE: {
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    UPLOAD_PATH: 'uploads/scholars/'
  }
};

/**
 * Pagination defaults
 */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1
};

/**
 * Rate limiting
 */
const RATE_LIMITS = {
  GENERAL: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  },
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 5 // 5 login attempts per 15 minutes
  },
  DOWNLOAD: {
    DAILY_LIMIT: 50, // 50 downloads per day for regular users
    WINDOW_MS: 24 * 60 * 60 * 1000 // 24 hours
  }
};

/**
 * JWT configuration
 */
const JWT = {
  ACCESS_TOKEN_EXPIRE: '24h',
  REFRESH_TOKEN_EXPIRE: '7d',
  ISSUER: 'islamic-library',
  AUDIENCE: 'islamic-library-users'
};

/**
 * Email templates
 */
const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password-reset',
  ADMIN_NOTIFICATION: 'admin-notification'
};

/**
 * Sort options for different entities
 */
const SORT_OPTIONS = {
  BOOKS: {
    TITLE_ASC: 'title',
    TITLE_DESC: '-title',
    AUTHOR_ASC: 'author',
    AUTHOR_DESC: '-author',
    DOWNLOADS_ASC: 'downloads',
    DOWNLOADS_DESC: '-downloads',
    CREATED_ASC: 'createdAt',
    CREATED_DESC: '-createdAt',
    YEAR_ASC: 'publishedYear',
    YEAR_DESC: '-publishedYear'
  },
  USERS: {
    NAME_ASC: 'name',
    NAME_DESC: '-name',
    EMAIL_ASC: 'email',
    EMAIL_DESC: '-email',
    DOWNLOADS_ASC: 'totalDownloads',
    DOWNLOADS_DESC: '-totalDownloads',
    JOINED_ASC: 'createdAt',
    JOINED_DESC: '-createdAt'
  },
  SCHOLARS: {
    NAME_ASC: 'name',
    NAME_DESC: '-name',
    DOWNLOADS_ASC: 'totalBooksDownloads',
    DOWNLOADS_DESC: '-totalBooksDownloads',
    BOOKS_ASC: 'booksCount',
    BOOKS_DESC: '-booksCount',
    VIEWS_ASC: 'profileViews',
    VIEWS_DESC: '-profileViews'
  }
};

/**
 * HTTP status codes
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * Cache durations (in seconds)
 */
const CACHE_DURATION = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 2 * 60 * 60, // 2 hours
  VERY_LONG: 24 * 60 * 60 // 24 hours
};

/**
 * Search configuration
 */
const SEARCH = {
  MIN_QUERY_LENGTH: 1,
  MAX_QUERY_LENGTH: 200,
  DEFAULT_LIMIT: 20,
  MAX_RESULTS: 1000
};

/**
 * Validation rules
 */
const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000
  },
  BIO: {
    MIN_LENGTH: 50,
    MAX_LENGTH: 5000
  },
  YEAR: {
    MIN_YEAR: 600,
    MAX_YEAR: new Date().getFullYear()
  }
};

/**
 * Default colors for categories and themes
 */
const COLORS = {
  PRIMARY: '#059669', // Emerald 600
  SECONDARY: '#065f46', // Emerald 800
  SUCCESS: '#10B981', // Emerald 500
  WARNING: '#F59E0B', // Amber 500
  ERROR: '#EF4444', // Red 500
  INFO: '#3B82F6', // Blue 500
  
  CATEGORY_COLORS: [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
    '#14B8A6', '#F43F5E', '#8B5A00', '#7C3AED', '#0EA5E9'
  ]
};

/**
 * Regular expressions for validation
 */
const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{7,14}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  ARABIC: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/,
  MONGODB_OBJECTID: /^[0-9a-fA-F]{24}$/,
  ISBN_10: /^[0-9]{9}[0-9X]$/,
  ISBN_13: /^[0-9]{13}$/
};

/**
 * Error messages
 */
const ERROR_MESSAGES = {
  GENERAL: {
    INVALID_INPUT: 'Invalid input provided',
    SERVER_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    VALIDATION_FAILED: 'Validation failed'
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
    ACCOUNT_INACTIVE: 'Account is inactive',
    PASSWORD_TOO_WEAK: 'Password is too weak'
  },
  USER: {
    EMAIL_EXISTS: 'Email already exists',
    USER_NOT_FOUND: 'User not found',
    CANNOT_DELETE_ADMIN: 'Cannot delete admin user'
  },
  BOOK: {
    BOOK_NOT_FOUND: 'Book not found',
    INVALID_CATEGORY: 'Invalid book category',
    FILE_REQUIRED: 'Book file is required'
  },
  SCHOLAR: {
    SCHOLAR_NOT_FOUND: 'Scholar not found',
    HAS_BOOKS: 'Cannot delete scholar with associated books'
  },
  DOWNLOAD: {
    DAILY_LIMIT_EXCEEDED: 'Daily download limit exceeded',
    FILE_NOT_FOUND: 'Book file not found',
    DOWNLOAD_FAILED: 'Download failed'
  }
};

/**
 * Success messages
 */
const SUCCESS_MESSAGES = {
  GENERAL: {
    OPERATION_SUCCESSFUL: 'Operation completed successfully'
  },
  AUTH: {
    LOGIN_SUCCESSFUL: 'Login successful',
    LOGOUT_SUCCESSFUL: 'Logout successful',
    PASSWORD_CHANGED: 'Password changed successfully',
    PASSWORD_RESET_SENT: 'Password reset email sent'
  },
  USER: {
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully'
  },
  BOOK: {
    BOOK_CREATED: 'Book created successfully',
    BOOK_UPDATED: 'Book updated successfully',
    BOOK_DELETED: 'Book deleted successfully',
    FILE_UPLOADED: 'File uploaded successfully'
  },
  SCHOLAR: {
    SCHOLAR_CREATED: 'Scholar created successfully',
    SCHOLAR_UPDATED: 'Scholar updated successfully',
    SCHOLAR_DELETED: 'Scholar deleted successfully'
  }
};

/**
 * API endpoints
 */
const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  BOOKS: '/api/books',
  SCHOLARS: '/api/scholars',
  DOWNLOADS: '/api/downloads',
  ANALYTICS: '/api/analytics',
  CATEGORIES: '/api/categories'
};

/**
 * Log levels
 */
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  VERBOSE: 'verbose',
  DEBUG: 'debug',
  SILLY: 'silly'
};

/**
 * Environment types
 */
const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  TESTING: 'testing',
  STAGING: 'staging',
  PRODUCTION: 'production'
};

module.exports = {
  USER_ROLES,
  USER_STATUS,
  ISLAMIC_CATEGORIES,
  LANGUAGES,
  SCHOLAR_SPECIALIZATIONS,
  DOWNLOAD_STATUS,
  DOWNLOAD_SOURCES,
  FILE_TYPES,
  PAGINATION,
  RATE_LIMITS,
  JWT,
  EMAIL_TEMPLATES,
  SORT_OPTIONS,
  HTTP_STATUS,
  CACHE_DURATION,
  SEARCH,
  VALIDATION,
  COLORS,
  REGEX,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_ENDPOINTS,
  LOG_LEVELS,
  ENVIRONMENTS
};