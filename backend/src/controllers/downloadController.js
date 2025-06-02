const path = require('path');
const fs = require('fs');
const { Book, User, Download, Scholar, Category } = require('../models');
const { catchAsync, ApiError } = require('../middleware/errorHandler');

/**
 * @desc    Download a book
 * @route   POST /api/downloads/book/:bookId
 * @access  Private (Authenticated users)
 */
const downloadBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  // Get book details
  const book = await Book.findById(bookId).populate('scholarAuthor');

  if (!book || !book.isActive) {
    return next(new ApiError('Book not found or not available', 404));
  }

  // Check if book has a file
  if (!book.bookFile || !book.bookFile.path) {
    return next(new ApiError('Book file not available for download', 400));
  }

  // Check if file exists on server
  const filePath = path.resolve(book.bookFile.path);
  if (!fs.existsSync(filePath)) {
    return next(new ApiError('Book file not found on server', 404));
  }

  // Check if user has already downloaded this book today (optional limit)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayDownload = await Download.findOne({
    user: userId,
    book: bookId,
    downloadDate: { $gte: today },
    status: 'completed'
  });

  // Allow re-downloads (but track them)
  const isRedownload = !!todayDownload;

  try {
    // Create download record
    const downloadRecord = new Download({
      user: userId,
      book: bookId,
      scholar: book.scholarAuthor ? book.scholarAuthor._id : null,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
      downloadSize: book.bookFile.size,
      bookTitle: book.title,
      bookCategory: book.category,
      bookLanguage: book.language,
      userEmail: req.user.email,
      scholarName: book.scholarAuthor ? book.scholarAuthor.name : null,
      source: req.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'web'
    });

    await downloadRecord.save();

    // Update counters only for new downloads (not re-downloads)
    if (!isRedownload) {
      // Update book download count
      await Book.findByIdAndUpdate(bookId, { $inc: { downloads: 1 } });

      // Update user download counts
      await User.findByIdAndUpdate(userId, {
        $inc: { 
          totalDownloads: 1, 
          monthlyDownloads: 1 
        },
        $push: { 
          downloadHistory: { 
            book: bookId, 
            downloadDate: new Date(), 
            bookTitle: book.title 
          }
        }
      });

      // Update scholar stats if applicable
      if (book.scholarAuthor) {
        await Scholar.findByIdAndUpdate(book.scholarAuthor._id, {
          $inc: { totalBooksDownloads: 1 }
        });
      }

      // Update category stats
      await Category.updateCategoryStats(book.category, 0, 1);
    }

    // Set download headers
    res.setHeader('Content-Type', book.bookFile.mimetype);
    res.setHeader('Content-Length', book.bookFile.size);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(book.bookFile.originalName)}"`);
    res.setHeader('Cache-Control', 'no-cache');

    // Track download start time
    const downloadStartTime = Date.now();

    // Create read stream
    const fileStream = fs.createReadStream(filePath);

    // Handle stream events
    fileStream.on('error', async (error) => {
      console.error('File stream error:', error);
      
      // Mark download as failed
      downloadRecord.status = 'failed';
      await downloadRecord.save();

      if (!res.headersSent) {
        return next(new ApiError('Error reading book file', 500));
      }
    });

    fileStream.on('end', async () => {
      // Calculate download duration
      const downloadDuration = Date.now() - downloadStartTime;
      
      // Mark download as completed
      downloadRecord.status = 'completed';
      downloadRecord.downloadDuration = downloadDuration;
      await downloadRecord.save();
    });

    // Pipe the file to response
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    
    // Mark download as failed if record was created
    if (downloadRecord && downloadRecord._id) {
      downloadRecord.status = 'failed';
      await downloadRecord.save();
    }

    return next(new ApiError('Download failed', 500));
  }
});

/**
 * @desc    Get user's download history
 * @route   GET /api/downloads/my-downloads
 * @access  Private
 */
const getMyDownloads = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, sort = '-downloadDate', status = 'completed' } = req.query;
  const skip = (page - 1) * limit;

  const filter = {
    user: req.user.id
  };

  if (status) {
    filter.status = status;
  }

  const downloads = await Download.find(filter)
    .populate('book', 'title author category coverImage publishedYear language')
    .populate('scholar', 'name title specialization')
    .sort(sort)
    .limit(limit * 1)
    .skip(skip)
    .lean();

  const total = await Download.countDocuments(filter);

  // Enhance download data
  const enhancedDownloads = downloads.map(download => ({
    id: download._id,
    book: download.book,
    scholar: download.scholar,
    downloadDate: download.downloadDate,
    formattedDate: download.downloadDate.toLocaleDateString(),
    downloadSize: download.downloadSize,
    formattedSize: download.formattedSize,
    status: download.status,
    source: download.source,
    downloadDuration: download.downloadDuration
  }));

  res.status(200).json({
    status: 'success',
    count: downloads.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      downloads: enhancedDownloads
    }
  });
});

/**
 * @desc    Get download statistics for current user
 * @route   GET /api/downloads/my-stats
 * @access  Private
 */
const getMyDownloadStats = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Overall stats
  const overallStats = await Download.aggregate([
    { $match: { user: userId, status: 'completed' } },
    {
      $group: {
        _id: null,
        totalDownloads: { $sum: 1 },
        totalSize: { $sum: '$downloadSize' },
        uniqueBooks: { $addToSet: '$book' },
        uniqueCategories: { $addToSet: '$bookCategory' },
        averageSize: { $avg: '$downloadSize' }
      }
    }
  ]);

  // This month stats
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const monthlyStats = await Download.aggregate([
    {
      $match: {
        user: userId,
        status: 'completed',
        downloadDate: { $gte: thisMonth }
      }
    },
    {
      $group: {
        _id: null,
        monthlyDownloads: { $sum: 1 },
        monthlySize: { $sum: '$downloadSize' }
      }
    }
  ]);

  // Category breakdown
  const categoryStats = await Download.aggregate([
    { $match: { user: userId, status: 'completed' } },
    {
      $group: {
        _id: '$bookCategory',
        downloads: { $sum: 1 },
        size: { $sum: '$downloadSize' }
      }
    },
    { $sort: { downloads: -1 } }
  ]);

  // Recent activity (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentActivity = await Download.countDocuments({
    user: userId,
    status: 'completed',
    downloadDate: { $gte: weekAgo }
  });

  const stats = overallStats[0] || {
    totalDownloads: 0,
    totalSize: 0,
    uniqueBooks: [],
    uniqueCategories: [],
    averageSize: 0
  };

  const monthly = monthlyStats[0] || {
    monthlyDownloads: 0,
    monthlySize: 0
  };

  res.status(200).json({
    status: 'success',
    data: {
      overview: {
        totalDownloads: stats.totalDownloads,
        totalSize: stats.totalSize,
        uniqueBooks: stats.uniqueBooks.length,
        uniqueCategories: stats.uniqueCategories.length,
        averageFileSize: stats.averageSize,
        thisMonth: monthly.monthlyDownloads,
        thisMonthSize: monthly.monthlySize,
        lastWeek: recentActivity
      },
      categoryBreakdown: categoryStats.map(cat => ({
        category: cat._id,
        downloads: cat.downloads,
        size: cat.size,
        percentage: ((cat.downloads / stats.totalDownloads) * 100).toFixed(1)
      }))
    }
  });
});

/**
 * @desc    Get all downloads (Admin only)
 * @route   GET /api/downloads
 * @access  Private (Admin)
 */
const getAllDownloads = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 50,
    sort = '-downloadDate',
    status,
    category,
    startDate,
    endDate,
    userId,
    bookId
  } = req.query;

  // Build filter
  const filter = {};

  if (status) filter.status = status;
  if (category) filter.bookCategory = category;
  if (userId) filter.user = userId;
  if (bookId) filter.book = bookId;

  // Date range filter
  if (startDate || endDate) {
    filter.downloadDate = {};
    if (startDate) filter.downloadDate.$gte = new Date(startDate);
    if (endDate) filter.downloadDate.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const downloads = await Download.find(filter)
    .populate('user', 'name email')
    .populate('book', 'title author category')
    .populate('scholar', 'name title')
    .sort(sort)
    .limit(limit * 1)
    .skip(skip)
    .lean();

  const total = await Download.countDocuments(filter);

  // Enhance download data
  const enhancedDownloads = downloads.map(download => ({
    id: download._id,
    user: download.user,
    book: download.book,
    scholar: download.scholar,
    downloadDate: download.downloadDate,
    formattedDate: download.downloadDate.toLocaleDateString(),
    downloadSize: download.downloadSize,
    formattedSize: download.formattedSize,
    status: download.status,
    source: download.source,
    ipAddress: download.ipAddress,
    downloadDuration: download.downloadDuration
  }));

  res.status(200).json({
    status: 'success',
    count: downloads.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      downloads: enhancedDownloads
    }
  });
});

/**
 * @desc    Get download analytics (Admin only)
 * @route   GET /api/downloads/analytics
 * @access  Private (Admin)
 */
const getDownloadAnalytics = catchAsync(async (req, res, next) => {
  const { period = '30d' } = req.query;

  // Calculate date range based on period
  let startDate;
  const endDate = new Date();

  switch (period) {
    case '7d':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  // Overall stats for the period
  const overallStats = await Download.getDownloadStats(startDate, endDate);

  // Daily download trends
  const dailyTrends = await Download.aggregate([
    {
      $match: {
        downloadDate: { $gte: startDate, $lte: endDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$downloadDate' },
          month: { $month: '$downloadDate' },
          day: { $dayOfMonth: '$downloadDate' }
        },
        downloads: { $sum: 1 },
        uniqueUsers: { $addToSet: '$user' },
        totalSize: { $sum: '$downloadSize' }
      }
    },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day'
          }
        },
        downloads: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        totalSize: 1
      }
    },
    { $sort: { date: 1 } }
  ]);

  // Category analytics
  const categoryAnalytics = await Download.getCategoryStats(startDate, endDate);

  // Popular books in period
  const popularBooks = await Download.getPopularBooks(10, startDate, endDate);

  // User activity
  const userActivity = await Download.getUserActivity(20, startDate, endDate);

  // Scholar popularity
  const scholarPopularity = await Download.getScholarPopularity(10, startDate, endDate);

  // Device/source breakdown
  const sourceBreakdown = await Download.aggregate([
    {
      $match: {
        downloadDate: { $gte: startDate, $lte: endDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: '$source',
        downloads: { $sum: 1 },
        uniqueUsers: { $addToSet: '$user' }
      }
    },
    {
      $project: {
        source: '$_id',
        downloads: 1,
        uniqueUsers: { $size: '$uniqueUsers' }
      }
    },
    { $sort: { downloads: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      period,
      dateRange: {
        start: startDate,
        end: endDate
      },
      overview: overallStats,
      trends: {
        daily: dailyTrends
      },
      categories: categoryAnalytics,
      popularBooks,
      topUsers: userActivity,
      popularScholars: scholarPopularity,
      sourceBreakdown: sourceBreakdown.map(item => ({
        source: item.source || 'unknown',
        downloads: item.downloads,
        uniqueUsers: item.uniqueUsers
      }))
    }
  });
});

/**
 * @desc    Check if user has downloaded a book
 * @route   GET /api/downloads/check/:bookId
 * @access  Private
 */
const checkDownloadStatus = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  const hasDownloaded = await Download.hasUserDownloaded(userId, bookId);

  // Get download count for this book by this user
  const downloadCount = await Download.countDocuments({
    user: userId,
    book: bookId,
    status: 'completed'
  });

  // Get latest download date
  const latestDownload = await Download.findOne({
    user: userId,
    book: bookId,
    status: 'completed'
  }).sort({ downloadDate: -1 });

  res.status(200).json({
    status: 'success',
    data: {
      hasDownloaded,
      downloadCount,
      latestDownload: latestDownload ? {
        date: latestDownload.downloadDate,
        formattedDate: latestDownload.downloadDate.toLocaleDateString()
      } : null
    }
  });
});

/**
 * @desc    Get download by ID (Admin only)
 * @route   GET /api/downloads/:id
 * @access  Private (Admin)
 */
const getDownload = catchAsync(async (req, res, next) => {
  const download = await Download.findById(req.params.id)
    .populate('user', 'name email role')
    .populate('book', 'title author category publishedYear')
    .populate('scholar', 'name title specialization')
    .lean();

  if (!download) {
    return next(new ApiError('Download record not found', 404));
  }

  const enhancedDownload = {
    ...download,
    formattedDate: download.downloadDate.toLocaleDateString(),
    formattedSize: download.formattedSize
  };

  res.status(200).json({
    status: 'success',
    data: {
      download: enhancedDownload
    }
  });
});

module.exports = {
  downloadBook,
  getMyDownloads,
  getMyDownloadStats,
  getAllDownloads,
  getDownloadAnalytics,
  checkDownloadStatus,
  getDownload
};