// src/utils/validators.js
const mongoose = require('mongoose');

/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {object} Validation result
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  
  return {
    isValid,
    message: isValid ? 'Valid email' : 'Invalid email format'
  };
};

/**
 * Password validation
 * @param {string} password - Password to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    maxLength = 128,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSpecialChars = false
  } = options;

  const errors = [];

  if (!password || password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (password && password.length > maxLength) {
    errors.push(`Password cannot exceed ${maxLength} characters`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

/**
 * Calculate password strength
 * @param {string} password - Password to analyze
 * @returns {object} Strength analysis
 */
const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, level: 'Very Weak' };

  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    specialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    longLength: password.length >= 12
  };

  // Calculate score
  Object.values(checks).forEach(check => {
    if (check) score += 1;
  });

  // Determine strength level
  let level;
  if (score <= 2) level = 'Very Weak';
  else if (score <= 3) level = 'Weak';
  else if (score <= 4) level = 'Medium';
  else if (score <= 5) level = 'Strong';
  else level = 'Very Strong';

  return {
    score,
    level,
    checks,
    percentage: Math.round((score / 6) * 100)
  };
};

/**
 * URL validation
 * @param {string} url - URL to validate
 * @returns {object} Validation result
 */
const validateURL = (url) => {
  try {
    const urlObj = new URL(url);
    const isValid = ['http:', 'https:'].includes(urlObj.protocol);
    
    return {
      isValid,
      message: isValid ? 'Valid URL' : 'URL must use HTTP or HTTPS protocol',
      protocol: urlObj.protocol,
      hostname: urlObj.hostname
    };
  } catch (error) {
    return {
      isValid: false,
      message: 'Invalid URL format'
    };
  }
};

/**
 * ISBN validation (ISBN-10 and ISBN-13)
 * @param {string} isbn - ISBN to validate
 * @returns {object} Validation result
 */
const validateISBN = (isbn) => {
  if (!isbn) {
    return { isValid: false, message: 'ISBN is required' };
  }

  // Remove spaces, hyphens, and convert to uppercase
  const cleanISBN = isbn.replace(/[\s-]/g, '').toUpperCase();

  // Check ISBN-10
  if (cleanISBN.length === 10) {
    return validateISBN10(cleanISBN);
  }

  // Check ISBN-13
  if (cleanISBN.length === 13) {
    return validateISBN13(cleanISBN);
  }

  return {
    isValid: false,
    message: 'ISBN must be 10 or 13 characters long'
  };
};

/**
 * Validate ISBN-10
 * @param {string} isbn - Clean ISBN-10
 * @returns {object} Validation result
 */
const validateISBN10 = (isbn) => {
  const regex = /^[0-9]{9}[0-9X]$/;
  
  if (!regex.test(isbn)) {
    return {
      isValid: false,
      message: 'Invalid ISBN-10 format'
    };
  }

  // Calculate checksum
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(isbn[i]) * (10 - i);
  }

  const checkDigit = isbn[9] === 'X' ? 10 : parseInt(isbn[9]);
  const calculatedCheck = (11 - (sum % 11)) % 11;

  return {
    isValid: checkDigit === calculatedCheck,
    message: checkDigit === calculatedCheck ? 'Valid ISBN-10' : 'Invalid ISBN-10 checksum',
    type: 'ISBN-10'
  };
};

/**
 * Validate ISBN-13
 * @param {string} isbn - Clean ISBN-13
 * @returns {object} Validation result
 */
const validateISBN13 = (isbn) => {
  const regex = /^[0-9]{13}$/;
  
  if (!regex.test(isbn)) {
    return {
      isValid: false,
      message: 'Invalid ISBN-13 format'
    };
  }

  // Calculate checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const multiplier = i % 2 === 0 ? 1 : 3;
    sum += parseInt(isbn[i]) * multiplier;
  }

  const checkDigit = parseInt(isbn[12]);
  const calculatedCheck = (10 - (sum % 10)) % 10;

  return {
    isValid: checkDigit === calculatedCheck,
    message: checkDigit === calculatedCheck ? 'Valid ISBN-13' : 'Invalid ISBN-13 checksum',
    type: 'ISBN-13'
  };
};

/**
 * Phone number validation (basic international format)
 * @param {string} phone - Phone number to validate
 * @returns {object} Validation result
 */
const validatePhoneNumber = (phone) => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }

  // Remove all non-digit characters except + at the beginning
  const cleanPhone = phone.replace(/(?!^\+)[^\d]/g, '');
  
  // Basic international format validation
  const phoneRegex = /^\+?[1-9]\d{7,14}$/;
  const isValid = phoneRegex.test(cleanPhone);

  return {
    isValid,
    message: isValid ? 'Valid phone number' : 'Invalid phone number format',
    cleanPhone
  };
};

/**
 * Date validation
 * @param {string|Date} date - Date to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
const validateDate = (date, options = {}) => {
  const {
    allowFuture = true,
    allowPast = true,
    minDate = null,
    maxDate = null
  } = options;

  let dateObj;
  
  try {
    dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return {
        isValid: false,
        message: 'Invalid date format'
      };
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Invalid date'
    };
  }

  const now = new Date();
  const errors = [];

  if (!allowFuture && dateObj > now) {
    errors.push('Date cannot be in the future');
  }

  if (!allowPast && dateObj < now) {
    errors.push('Date cannot be in the past');
  }

  if (minDate && dateObj < new Date(minDate)) {
    errors.push(`Date must be after ${new Date(minDate).toLocaleDateString()}`);
  }

  if (maxDate && dateObj > new Date(maxDate)) {
    errors.push(`Date must be before ${new Date(maxDate).toLocaleDateString()}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    date: dateObj
  };
};

/**
 * Name validation (for person names)
 * @param {string} name - Name to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
const validateName = (name, options = {}) => {
  const {
    minLength = 2,
    maxLength = 100,
    allowNumbers = false,
    allowSpecialChars = false
  } = options;

  if (!name || typeof name !== 'string') {
    return {
      isValid: false,
      message: 'Name is required'
    };
  }

  const trimmedName = name.trim();
  const errors = [];

  if (trimmedName.length < minLength) {
    errors.push(`Name must be at least ${minLength} characters long`);
  }

  if (trimmedName.length > maxLength) {
    errors.push(`Name cannot exceed ${maxLength} characters`);
  }

  if (!allowNumbers && /\d/.test(trimmedName)) {
    errors.push('Name cannot contain numbers');
  }

  if (!allowSpecialChars && /[!@#$%^&*(),.?":{}|<>]/.test(trimmedName)) {
    errors.push('Name cannot contain special characters');
  }

  // Check for reasonable name pattern (letters, spaces, hyphens, apostrophes)
  const namePattern = /^[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\-'\.]+$/;
  if (!namePattern.test(trimmedName)) {
    errors.push('Name contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanName: trimmedName
  };
};

/**
 * MongoDB ObjectId validation
 * @param {string} id - ID to validate
 * @returns {object} Validation result
 */
const validateObjectId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  
  return {
    isValid,
    message: isValid ? 'Valid ObjectId' : 'Invalid ObjectId format'
  };
};

/**
 * File validation
 * @param {object} file - File object to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
const validateFile = (file, options = {}) => {
  const {
    allowedTypes = [],
    maxSize = 10 * 1024 * 1024, // 10MB default
    requiredFields = ['originalname', 'mimetype', 'size']
  } = options;

  if (!file) {
    return {
      isValid: false,
      message: 'File is required'
    };
  }

  const errors = [];

  // Check required fields
  requiredFields.forEach(field => {
    if (!file[field]) {
      errors.push(`File ${field} is missing`);
    }
  });

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
    errors.push(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`);
  }

  // Check for potentially dangerous file types
  const dangerousTypes = [
    'application/x-executable',
    'application/x-msdownload',
    'application/x-msdos-program'
  ];

  if (dangerousTypes.includes(file.mimetype)) {
    errors.push('File type is not allowed for security reasons');
  }

  return {
    isValid: errors.length === 0,
    errors,
    fileInfo: {
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      formattedSize: formatFileSize(file.size)
    }
  };
};

/**
 * Format file size helper
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate year
 * @param {number|string} year - Year to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
const validateYear = (year, options = {}) => {
  const {
    minYear = 600,
    maxYear = new Date().getFullYear(),
    allowFuture = false
  } = options;

  const yearNum = parseInt(year);
  
  if (isNaN(yearNum)) {
    return {
      isValid: false,
      message: 'Year must be a valid number'
    };
  }

  const errors = [];
  
  if (yearNum < minYear) {
    errors.push(`Year must be ${minYear} or later`);
  }

  if (!allowFuture && yearNum > maxYear) {
    errors.push(`Year cannot be in the future (max: ${maxYear})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    year: yearNum
  };
};

/**
 * Validate pagination parameters
 * @param {object} params - Pagination parameters
 * @returns {object} Validation result
 */
const validatePagination = (params) => {
  const { page = 1, limit = 20 } = params;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  const errors = [];
  
  if (isNaN(pageNum) || pageNum < 1) {
    errors.push('Page must be a positive integer');
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    errors.push('Limit must be between 1 and 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    pagination: {
      page: Math.max(1, pageNum),
      limit: Math.min(100, Math.max(1, limitNum))
    }
  };
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized input
 */
const sanitizeString = (input, options = {}) => {
  const {
    trim = true,
    removeHtml = true,
    removeSpecialChars = false,
    maxLength = null
  } = options;

  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  if (trim) {
    sanitized = sanitized.trim();
  }

  if (removeHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  if (removeSpecialChars) {
    sanitized = sanitized.replace(/[^\w\s\-\.]/g, '');
  }

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

/**
 * Validate search query
 * @param {string} query - Search query to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
const validateSearchQuery = (query, options = {}) => {
  const {
    minLength = 1,
    maxLength = 200,
    allowSpecialChars = true
  } = options;

  if (!query || typeof query !== 'string') {
    return {
      isValid: false,
      message: 'Search query is required'
    };
  }

  const trimmedQuery = query.trim();
  const errors = [];

  if (trimmedQuery.length < minLength) {
    errors.push(`Search query must be at least ${minLength} character(s) long`);
  }

  if (trimmedQuery.length > maxLength) {
    errors.push(`Search query cannot exceed ${maxLength} characters`);
  }

  if (!allowSpecialChars && /[<>{}[\]\\\/]/.test(trimmedQuery)) {
    errors.push('Search query contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanQuery: trimmedQuery
  };
};

/**
 * Validate sort parameters
 * @param {string} sort - Sort parameter
 * @param {Array} allowedFields - Allowed sort fields
 * @returns {object} Validation result
 */
const validateSort = (sort, allowedFields = []) => {
  if (!sort) {
    return {
      isValid: true,
      sort: null
    };
  }

  const sortFields = sort.split(',');
  const errors = [];
  const validSorts = [];

  sortFields.forEach(field => {
    const trimmedField = field.trim();
    const direction = trimmedField.startsWith('-') ? -1 : 1;
    const fieldName = trimmedField.replace(/^-/, '');

    if (allowedFields.length > 0 && !allowedFields.includes(fieldName)) {
      errors.push(`Sort field '${fieldName}' is not allowed`);
    } else {
      validSorts.push({ [fieldName]: direction });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    sort: validSorts.length > 0 ? Object.assign({}, ...validSorts) : null
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  calculatePasswordStrength,
  validateURL,
  validateISBN,
  validateISBN10,
  validateISBN13,
  validatePhoneNumber,
  validateDate,
  validateName,
  validateObjectId,
  validateFile,
  validateYear,
  validatePagination,
  validateSearchQuery,
  validateSort,
  sanitizeString,
  formatFileSize
};