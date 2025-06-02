const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

/**
 * Ensure directory exists
 * @param {string} dirPath - Directory path
 */
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dirPath, { recursive: true });
    } else {
      throw error;
    }
  }
};

/**
 * Generate unique filename
 * @param {string} originalName - Original filename
 * @param {string} prefix - Filename prefix
 */
const generateUniqueFilename = (originalName, prefix = 'file') => {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = crypto.randomBytes(6).toString('hex');
  return `${prefix}-${timestamp}-${random}${ext}`;
};

/**
 * Get file stats
 * @param {string} filePath - File path
 */
const getFileStats = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return {
      exists: true,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { exists: false };
    }
    throw error;
  }
};

/**
 * Delete file safely
 * @param {string} filePath - File path to delete
 */
const deleteFile = async (filePath) => {
  try {
    const stats = await getFileStats(filePath);
    if (stats.exists) {
      await fs.unlink(filePath);
      return { success: true, message: 'File deleted successfully' };
    }
    return { success: true, message: 'File does not exist' };
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return { success: false, message: error.message };
  }
};

/**
 * Move file from one location to another
 * @param {string} sourcePath - Source file path
 * @param {string} destinationPath - Destination file path
 */
const moveFile = async (sourcePath, destinationPath) => {
  try {
    // Ensure destination directory exists
    const destDir = path.dirname(destinationPath);
    await ensureDirectoryExists(destDir);
    
    // Copy file to destination
    await fs.copyFile(sourcePath, destinationPath);
    
    // Delete source file
    await fs.unlink(sourcePath);
    
    return { success: true, newPath: destinationPath };
  } catch (error) {
    console.error(`Error moving file from ${sourcePath} to ${destinationPath}:`, error);
    throw new Error(`Failed to move file: ${error.message}`);
  }
};

/**
 * Copy file to new location
 * @param {string} sourcePath - Source file path
 * @param {string} destinationPath - Destination file path
 */
const copyFile = async (sourcePath, destinationPath) => {
  try {
    // Ensure destination directory exists
    const destDir = path.dirname(destinationPath);
    await ensureDirectoryExists(destDir);
    
    // Copy file
    await fs.copyFile(sourcePath, destinationPath);
    
    return { success: true, newPath: destinationPath };
  } catch (error) {
    console.error(`Error copying file from ${sourcePath} to ${destinationPath}:`, error);
    throw new Error(`Failed to copy file: ${error.message}`);
  }
};

/**
 * Read file content
 * @param {string} filePath - File path
 * @param {string} encoding - File encoding (default: utf8)
 */
const readFile = async (filePath, encoding = 'utf8') => {
  try {
    const content = await fs.readFile(filePath, encoding);
    return { success: true, content };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return { success: false, message: error.message };
  }
};

/**
 * Write content to file
 * @param {string} filePath - File path
 * @param {string} content - Content to write
 * @param {string} encoding - File encoding (default: utf8)
 */
const writeFile = async (filePath, content, encoding = 'utf8') => {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await ensureDirectoryExists(dir);
    
    await fs.writeFile(filePath, content, encoding);
    return { success: true, filePath };
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw new Error(`Failed to write file: ${error.message}`);
  }
};

/**
 * Format file size to human readable format
 * @param {number} bytes - Size in bytes
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate file type
 * @param {string} filename - Filename
 * @param {Array} allowedTypes - Array of allowed file extensions
 */
const validateFileType = (filename, allowedTypes) => {
  const ext = path.extname(filename).toLowerCase();
  const isValid = allowedTypes.includes(ext);
  
  return {
    isValid,
    extension: ext,
    allowedTypes
  };
};

/**
 * Validate file size
 * @param {number} fileSize - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 */
const validateFileSize = (fileSize, maxSize) => {
  const isValid = fileSize <= maxSize;
  
  return {
    isValid,
    fileSize,
    maxSize,
    fileSizeFormatted: formatFileSize(fileSize),
    maxSizeFormatted: formatFileSize(maxSize)
  };
};

/**
 * Get directory listing
 * @param {string} dirPath - Directory path
 * @param {boolean} includeStats - Include file stats
 */
const getDirectoryListing = async (dirPath, includeStats = false) => {
  try {
    const files = await fs.readdir(dirPath);
    
    if (!includeStats) {
      return { success: true, files };
    }
    
    const filesWithStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const stats = await getFileStats(filePath);
        return {
          name: file,
          path: filePath,
          ...stats
        };
      })
    );
    
    return { success: true, files: filesWithStats };
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return { success: false, message: error.message };
  }
};

/**
 * Clean up old files
 * @param {string} dirPath - Directory path
 * @param {number} maxAge - Maximum age in milliseconds
 */
const cleanupOldFiles = async (dirPath, maxAge = 24 * 60 * 60 * 1000) => {
  try {
    const listing = await getDirectoryListing(dirPath, true);
    
    if (!listing.success) {
      return listing;
    }
    
    const now = Date.now();
    const filesToDelete = listing.files.filter(file => 
      file.isFile && (now - file.created.getTime()) > maxAge
    );
    
    const deleteResults = await Promise.all(
      filesToDelete.map(file => deleteFile(file.path))
    );
    
    const deletedCount = deleteResults.filter(result => result.success).length;
    
    return {
      success: true,
      message: `Cleaned up ${deletedCount} old files`,
      deletedCount,
      totalChecked: listing.files.length
    };
  } catch (error) {
    console.error(`Error cleaning up directory ${dirPath}:`, error);
    return { success: false, message: error.message };
  }
};

/**
 * Create backup of file
 * @param {string} filePath - File to backup
 * @param {string} backupDir - Backup directory
 */
const backupFile = async (filePath, backupDir = 'backups') => {
  try {
    const filename = path.basename(filePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `${timestamp}-${filename}`;
    const backupPath = path.join(backupDir, backupFilename);
    
    await ensureDirectoryExists(backupDir);
    await copyFile(filePath, backupPath);
    
    return {
      success: true,
      backupPath,
      originalPath: filePath
    };
  } catch (error) {
    console.error(`Error backing up file ${filePath}:`, error);
    throw new Error(`Failed to backup file: ${error.message}`);
  }
};

/**
 * Calculate directory size
 * @param {string} dirPath - Directory path
 */
const getDirectorySize = async (dirPath) => {
  try {
    const listing = await getDirectoryListing(dirPath, true);
    
    if (!listing.success) {
      return listing;
    }
    
    const totalSize = listing.files
      .filter(file => file.isFile)
      .reduce((sum, file) => sum + file.size, 0);
    
    return {
      success: true,
      totalSize,
      totalSizeFormatted: formatFileSize(totalSize),
      fileCount: listing.files.filter(file => file.isFile).length,
      directoryCount: listing.files.filter(file => file.isDirectory).length
    };
  } catch (error) {
    console.error(`Error calculating directory size ${dirPath}:`, error);
    return { success: false, message: error.message };
  }
};

/**
 * Get file type from extension
 * @param {string} filename - Filename
 */
const getFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  
  const typeMap = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.zip': 'application/zip',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  
  return typeMap[ext] || 'application/octet-stream';
};

/**
 * Sanitize filename
 * @param {string} filename - Filename to sanitize
 */
const sanitizeFilename = (filename) => {
  // Remove or replace unsafe characters
  return filename
    .replace(/[^a-zA-Z0-9\-_\.\s]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')                  // Replace spaces with hyphens
    .replace(/--+/g, '-')                  // Replace multiple hyphens with single
    .toLowerCase()                         // Convert to lowercase
    .trim();
};

module.exports = {
  ensureDirectoryExists,
  generateUniqueFilename,
  getFileStats,
  deleteFile,
  moveFile,
  copyFile,
  readFile,
  writeFile,
  formatFileSize,
  validateFileType,
  validateFileSize,
  getDirectoryListing,
  cleanupOldFiles,
  backupFile,
  getDirectorySize,
  getFileType,
  sanitizeFilename
};