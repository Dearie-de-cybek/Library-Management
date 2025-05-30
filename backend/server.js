require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ 
    message: 'Islamic Library API Server is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Test route to check database models
app.get('/api/test/models', async (req, res) => {
  try {
    const { User, Book, Scholar, Download, Category } = require('./src/models');
    
    const modelStats = {
      users: await User.countDocuments(),
      books: await Book.countDocuments(),
      scholars: await Scholar.countDocuments(),
      downloads: await Download.countDocuments(),
      categories: await Category.countDocuments()
    };
    
    res.json({
      message: 'All models are working correctly!',
      stats: modelStats
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error testing models',
      error: error.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});