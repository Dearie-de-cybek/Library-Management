const express = require('express');

// Import all route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const bookRoutes = require('./books');
const scholarRoutes = require('./scholars');
const downloadRoutes = require('./downloads');

// Import models for categories endpoint
const { Category } = require('../models');
const { catchAsync } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * API Status endpoint
 */
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Islamic Library API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users', 
      books: '/api/books',
      scholars: '/api/scholars',
      downloads: '/api/downloads',
      categories: '/api/categories'
    },
    documentation: '/api/docs',
    timestamp: new Date().toISOString()
  });
});

/**
 * Categories endpoint (simple read-only)
 * @route   GET /api/categories
 * @desc    Get all Islamic categories
 * @access  Public
 */
router.get('/categories', catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ sortOrder: 1 })
    .select('name nameArabic description booksCount totalDownloads color icon')
    .lean();

  res.json({
    status: 'success',
    count: categories.length,
    data: {
      categories
    }
  });
}));

/**
 * Get single category by name
 * @route   GET /api/categories/:name
 * @desc    Get category by name
 * @access  Public
 */
router.get('/categories/:name', catchAsync(async (req, res) => {
  const category = await Category.findOne({ 
    name: req.params.name, 
    isActive: true 
  }).lean();

  if (!category) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found'
    });
  }

  res.json({
    status: 'success',
    data: {
      category
    }
  });
}));

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/scholars', scholarRoutes);
router.use('/downloads', downloadRoutes);

module.exports = router;