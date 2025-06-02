const crypto = require('crypto');

/**
 * Generate random string
 * @param {number} length - Length of the string
 * @param {string} charset - Character set to use
 * @returns {string} Random string
 */
const generateRandomString = (length = 10, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
const generateUniqueId = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalize = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to title case
 * @returns {string} Title cased string
 */
const titleCase = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.split(' ').map(word => capitalize(word)).join(' ');
};

/**
 * Convert string to slug (URL-friendly)
 * @param {string} str - String to convert
 * @returns {string} Slug
 */
const slugify = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Remove duplicates from array
 * @param {Array} arr - Array to deduplicate
 * @param {string|Function} key - Key to deduplicate by (for objects)
 * @returns {Array} Deduplicated array
 */
const removeDuplicates = (arr, key = null) => {
  if (!Array.isArray(arr)) return [];
  
  if (!key) {
    return [...new Set(arr)];
  }
  
  const seen = new Set();
  return arr.filter(item => {
    const keyValue = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
};

/**
 * Deep clone object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
  return obj;
};

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean} True if empty
 */
const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Get nested object property safely
 * @param {object} obj - Object to traverse
 * @param {string} path - Path to property (e.g., 'user.profile.name')
 * @param {any} defaultValue - Default value if path not found
 * @returns {any} Property value or default
 */
const getNestedProperty = (obj, path, defaultValue = undefined) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current;
};

/**
 * Set nested object property
 * @param {object} obj - Object to modify
 * @param {string} path - Path to property
 * @param {any} value - Value to set
 * @returns {object} Modified object
 */
const setNestedProperty = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
const formatNumber = (num) => {
  if (typeof num !== 'number') return num;
  return num.toLocaleString();
};

/**
 * Format bytes to human readable size
 * @param {number} bytes - Bytes to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted size
 */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format duration in milliseconds to human readable
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted duration
 */
const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Generate pagination info
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {object} Pagination info
 */
const generatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {any} Function result
 */
const retry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, i);
      await sleep(waitTime);
    }
  }
};

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, delay) => {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Calculate age from date of birth
 * @param {Date|string} dateOfBirth - Date of birth
 * @param {Date} referenceDate - Reference date (default: now)
 * @returns {number} Age in years
 */
const calculateAge = (dateOfBirth, referenceDate = new Date()) => {
  const birthDate = new Date(dateOfBirth);
  const refDate = new Date(referenceDate);
  
  let age = refDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = refDate.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && refDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Generate excerpt from text
 * @param {string} text - Text to excerpt
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Excerpt
 */
const generateExcerpt = (text, maxLength = 150, suffix = '...') => {
  if (!text || typeof text !== 'string') return '';
  
  if (text.length <= maxLength) return text;
  
  // Find last space before maxLength to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + suffix;
  }
  
  return truncated + suffix;
};

/**
 * Convert Arabic/Persian numbers to English
 * @param {string} str - String containing numbers
 * @returns {string} String with English numbers
 */
const convertArabicNumbers = (str) => {
  const arabicNumbers = '٠١٢٣٤٥٦٧٨٩';
  const persianNumbers = '۰۱۲۳۴۵۶۷۸۹';
  const englishNumbers = '0123456789';
  
  let result = str;
  
  for (let i = 0; i < 10; i++) {
    const arabicRegex = new RegExp(arabicNumbers[i], 'g');
    const persianRegex = new RegExp(persianNumbers[i], 'g');
    
    result = result.replace(arabicRegex, englishNumbers[i]);
    result = result.replace(persianRegex, englishNumbers[i]);
  }
  
  return result;
};

/**
 * Sanitize filename for safe storage
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return 'file';
  
  return filename
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF._-]/g, '') // Keep Arabic letters, English letters, numbers, dots, underscores, hyphens
    .replace(/\.+/g, '.') // Replace multiple dots with single dot
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 255); // Limit length
};

/**
 * Check if string contains Arabic text
 * @param {string} text - Text to check
 * @returns {boolean} True if contains Arabic
 */
const containsArabic = (text) => {
  if (!text || typeof text !== 'string') return false;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicRegex.test(text);
};

/**
 * Generate hash of string
 * @param {string} str - String to hash
 * @param {string} algorithm - Hash algorithm (default: sha256)
 * @returns {string} Hash
 */
const generateHash = (str, algorithm = 'sha256') => {
  return crypto.createHash(algorithm).update(str).digest('hex');
};

/**
 * Generate random color hex code
 * @returns {string} Hex color code
 */
const generateRandomColor = () => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Parse boolean from string
 * @param {any} value - Value to parse
 * @returns {boolean} Boolean value
 */
const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }
  if (typeof value === 'number') return value !== 0;
  return false;
};

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} File extension (without dot)
 */
const getFileExtension = (filename) => {
  if (!filename || typeof filename !== 'string') return '';
  const ext = filename.split('.').pop();
  return ext ? ext.toLowerCase() : '';
};

/**
 * Check if value is a valid JSON string
 * @param {string} str - String to check
 * @returns {boolean} True if valid JSON
 */
const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  generateRandomString,
  generateUniqueId,
  sleep,
  capitalize,
  titleCase,
  slugify,
  removeDuplicates,
  deepClone,
  isEmpty,
  getNestedProperty,
  setNestedProperty,
  formatNumber,
  formatBytes,
  formatDuration,
  generatePagination,
  retry,
  throttle,
  debounce,
  calculateAge,
  generateExcerpt,
  convertArabicNumbers,
  sanitizeFilename,
  containsArabic,
  generateHash,
  generateRandomColor,
  parseBoolean,
  getFileExtension,
  isValidJSON
};