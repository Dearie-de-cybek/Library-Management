const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
    index: true
  },
  
  scholar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholar',
    default: null,
    index: true
  },
  
  downloadDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Technical information
  userAgent: {
    type: String,
    trim: true
  },
  
  ipAddress: {
    type: String,
    trim: true
  },
  
  downloadSize: {
    type: Number, // File size in bytes
    min: 0
  },
  
  // Download status
  status: {
    type: String,
    enum: ['completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  
  // Download source tracking
  source: {
    type: String,
    enum: ['web', 'mobile', 'api'],
    default: 'web'
  },
  
  // Denormalized data for faster queries and analytics
  bookTitle: {
    type: String,
    required: true
  },
  
  bookCategory: {
    type: String,
    required: true
  },
  
  bookLanguage: {
    type: String,
    required: true
  },
  
  userEmail: {
    type: String,
    required: true
  },
  
  scholarName: {
    type: String,
    default: null
  },
  
  // Geographic information (optional)
  country: String,
  city: String,
  
  // Session information
  sessionId: String,
  
  // Download completion time (in milliseconds)
  downloadDuration: {
    type: Number,
    min: 0
  }

}, {
  timestamps: true
});

// Indexes for analytics and performance
downloadSchema.index({ downloadDate: -1 });
downloadSchema.index({ user: 1, downloadDate: -1 });
downloadSchema.index({ book: 1, downloadDate: -1 });
downloadSchema.index({ bookCategory: 1, downloadDate: -1 });
downloadSchema.index({ status: 1 });

// Compound indexes for common queries
downloadSchema.index({ user: 1, book: 1 });
downloadSchema.index({ downloadDate: -1, status: 1 });
downloadSchema.index({ bookCategory: 1, downloadDate: -1 });

// Index for monthly analytics
downloadSchema.index({ 
  downloadDate: -1,
  status: 1,
  bookCategory: 1 
});

// Static method to get download statistics
downloadSchema.statics.getDownloadStats = async function(startDate = null, endDate = null) {
  const matchConditions = { status: 'completed' };
  
  if (startDate || endDate) {
    matchConditions.downloadDate = {};
    if (startDate) matchConditions.downloadDate.$gte = startDate;
    if (endDate) matchConditions.downloadDate.$lte = endDate;
  }
  
  const stats = await this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: null,
        totalDownloads: { $sum: 1 },
        uniqueUsers: { $addToSet: '$user' },
        uniqueBooks: { $addToSet: '$book' },
        totalSize: { $sum: '$downloadSize' },
        avgDownloadSize: { $avg: '$downloadSize' }
      }
    },
    {
      $project: {
        totalDownloads: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        uniqueBooks: { $size: '$uniqueBooks' },
        totalSize: 1,
        avgDownloadSize: 1
      }
    }
  ]);
  
  return stats[0] || {
    totalDownloads: 0,
    uniqueUsers: 0,
    uniqueBooks: 0,
    totalSize: 0,
    avgDownloadSize: 0
  };
};

// Static method to get category download statistics
downloadSchema.statics.getCategoryStats = async function(startDate = null, endDate = null) {
  const matchConditions = { status: 'completed' };
  
  if (startDate || endDate) {
    matchConditions.downloadDate = {};
    if (startDate) matchConditions.downloadDate.$gte = startDate;
    if (endDate) matchConditions.downloadDate.$lte = endDate;
  }
  
  return await this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: '$bookCategory',
        downloads: { $sum: 1 },
        uniqueUsers: { $addToSet: '$user' },
        uniqueBooks: { $addToSet: '$book' },
        totalSize: { $sum: '$downloadSize' }
      }
    },
    {
      $project: {
        category: '$_id',
        downloads: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        uniqueBooks: { $size: '$uniqueBooks' },
        totalSize: 1,
        _id: 0
      }
    },
    { $sort: { downloads: -1 } }
  ]);
};

// Static method to get monthly download trends
downloadSchema.statics.getMonthlyTrends = async function(months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return await this.aggregate([
    {
      $match: {
        downloadDate: { $gte: startDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$downloadDate' },
          month: { $month: '$downloadDate' }
        },
        downloads: { $sum: 1 },
        uniqueUsers: { $addToSet: '$user' },
        uniqueBooks: { $addToSet: '$book' }
      }
    },
    {
      $project: {
        year: '$_id.year',
        month: '$_id.month',
        downloads: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        uniqueBooks: { $size: '$uniqueBooks' },
        _id: 0
      }
    },
    { $sort: { year: 1, month: 1 } }
  ]);
};

// Static method to get most popular books
downloadSchema.statics.getPopularBooks = async function(limit = 10, startDate = null, endDate = null) {
  const matchConditions = { status: 'completed' };
  
  if (startDate || endDate) {
    matchConditions.downloadDate = {};
    if (startDate) matchConditions.downloadDate.$gte = startDate;
    if (endDate) matchConditions.downloadDate.$lte = endDate;
  }
  
  return await this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: '$book',
        downloads: { $sum: 1 },
        bookTitle: { $first: '$bookTitle' },
        bookCategory: { $first: '$bookCategory' },
        uniqueUsers: { $addToSet: '$user' }
      }
    },
    {
      $project: {
        bookId: '$_id',
        bookTitle: 1,
        bookCategory: 1,
        downloads: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        _id: 0
      }
    },
    { $sort: { downloads: -1 } },
    { $limit: limit }
  ]);
};

// Static method to get user download activity
downloadSchema.statics.getUserActivity = async function(limit = 20, startDate = null, endDate = null) {
  const matchConditions = { status: 'completed' };
  
  if (startDate || endDate) {
    matchConditions.downloadDate = {};
    if (startDate) matchConditions.downloadDate.$gte = startDate;
    if (endDate) matchConditions.downloadDate.$lte = endDate;
  }
  
  return await this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: '$user',
        downloads: { $sum: 1 },
        userEmail: { $first: '$userEmail' },
        uniqueBooks: { $addToSet: '$book' },
        favoriteCategory: { $first: '$bookCategory' },
        lastDownload: { $max: '$downloadDate' }
      }
    },
    {
      $project: {
        userId: '$_id',
        userEmail: 1,
        downloads: 1,
        uniqueBooks: { $size: '$uniqueBooks' },
        favoriteCategory: 1,
        lastDownload: 1,
        _id: 0
      }
    },
    { $sort: { downloads: -1 } },
    { $limit: limit }
  ]);
};

// Static method to get scholar popularity
downloadSchema.statics.getScholarPopularity = async function(limit = 10, startDate = null, endDate = null) {
  const matchConditions = { 
    status: 'completed',
    scholar: { $ne: null }
  };
  
  if (startDate || endDate) {
    matchConditions.downloadDate = {};
    if (startDate) matchConditions.downloadDate.$gte = startDate;
    if (endDate) matchConditions.downloadDate.$lte = endDate;
  }
  
  return await this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: '$scholar',
        downloads: { $sum: 1 },
        scholarName: { $first: '$scholarName' },
        uniqueUsers: { $addToSet: '$user' },
        uniqueBooks: { $addToSet: '$book' }
      }
    },
    {
      $project: {
        scholarId: '$_id',
        scholarName: 1,
        downloads: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        uniqueBooks: { $size: '$uniqueBooks' },
        _id: 0
      }
    },
    { $sort: { downloads: -1 } },
    { $limit: limit }
  ]);
};

// Static method to check if user has downloaded a book
downloadSchema.statics.hasUserDownloaded = async function(userId, bookId) {
  const download = await this.findOne({
    user: userId,
    book: bookId,
    status: 'completed'
  });
  
  return !!download;
};

// Static method to get user's recent downloads
downloadSchema.statics.getUserRecentDownloads = async function(userId, limit = 10) {
  return await this.find({
    user: userId,
    status: 'completed'
  })
  .sort({ downloadDate: -1 })
  .limit(limit)
  .populate('book', 'title author coverImage category')
  .select('downloadDate bookTitle bookCategory');
};

// Instance method to mark download as failed
downloadSchema.methods.markAsFailed = function() {
  this.status = 'failed';
  return this.save();
};

// Instance method to mark download as completed
downloadSchema.methods.markAsCompleted = function(duration = null) {
  this.status = 'completed';
  if (duration) this.downloadDuration = duration;
  return this.save();
};

// Virtual for formatted download date
downloadSchema.virtual('formattedDate').get(function() {
  return this.downloadDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Virtual for formatted file size
downloadSchema.virtual('formattedSize').get(function() {
  if (!this.downloadSize) return 'Unknown';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = this.downloadSize;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
});

// Ensure virtual fields are serialized
downloadSchema.set('toJSON', { virtuals: true });
downloadSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Download', downloadSchema);