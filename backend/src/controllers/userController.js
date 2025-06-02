const { User, Download, Book } = require('../models');
const { catchAsync, ApiError } = require('../middleware/errorHandler');

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
const getAllUsers = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    sort = '-createdAt',
    status,
    role,
    search
  } = req.query;

  // Build filter
  const filter = {};
  
  if (status) filter.status = status;
  if (role) filter.role = role;
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const users = await User.find(filter)
    .sort(sort)
    .limit(limit * 1)
    .skip(skip)
    .select('-password')
    .lean();

  const total = await User.countDocuments(filter);

  // Enhance user data with recent downloads and favorite category
  const enhancedUsers = await Promise.all(
    users.map(async (user) => {
      // Get recent downloads for this user
      const recentDownloads = await Download.find({
        user: user._id,
        status: 'completed'
      })
        .sort({ downloadDate: -1 })
        .limit(5)
        .populate('book', 'title')
        .lean();

      // Get favorite category (most downloaded category)
      const categoryStats = await Download.aggregate([
        { $match: { user: user._id, status: 'completed' } },
        { $group: { _id: '$bookCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);

      return {
        ...user,
        recentDownloads: recentDownloads.map(d => ({
          bookTitle: d.book?.title || 'Unknown',
          date: d.downloadDate.toLocaleDateString()
        })),
        favoriteCategory: categoryStats[0]?._id || 'None'
      };
    })
  );

  res.status(200).json({
    status: 'success',
    count: users.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      users: enhancedUsers
    }
  });
});

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private (Admin or Own Profile)
 */
const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('downloadHistory.book', 'title author category')
    .select('-password')
    .lean();

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Get detailed download statistics
  const downloadStats = await Download.aggregate([
    { $match: { user: user._id, status: 'completed' } },
    {
      $group: {
        _id: null,
        totalDownloads: { $sum: 1 },
        totalSize: { $sum: '$downloadSize' },
        categoriesDownloaded: { $addToSet: '$bookCategory' },
        monthlyDownloads: {
          $sum: {
            $cond: [
              {
                $gte: [
                  '$downloadDate',
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  // Get category breakdown
  const categoryBreakdown = await Download.aggregate([
    { $match: { user: user._id, status: 'completed' } },
    { $group: { _id: '$bookCategory', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Get recent activity
  const recentActivity = await Download.find({
    user: user._id,
    status: 'completed'
  })
    .sort({ downloadDate: -1 })
    .limit(10)
    .populate('book', 'title author category')
    .lean();

  const stats = downloadStats[0] || {
    totalDownloads: 0,
    totalSize: 0,
    categoriesDownloaded: [],
    monthlyDownloads: 0
  };

  const enhancedUser = {
    ...user,
    statistics: {
      ...stats,
      categoriesCount: stats.categoriesDownloaded.length,
      averageDownloadsPerMonth: user.createdAt 
        ? stats.totalDownloads / Math.max(1, Math.ceil((new Date() - user.createdAt) / (1000 * 60 * 60 * 24 * 30)))
        : 0
    },
    categoryBreakdown,
    recentActivity: recentActivity.map(activity => ({
      book: activity.book,
      downloadDate: activity.downloadDate,
      formattedDate: activity.downloadDate.toLocaleDateString()
    }))
  };

  res.status(200).json({
    status: 'success',
    data: {
      user: enhancedUser
    }
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private (Admin only)
 */
const updateUser = catchAsync(async (req, res, next) => {
  const { name, email, role, status } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError('Email already in use', 400));
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, status },
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
    data: {
      user: updatedUser
    }
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Prevent deleting the last admin
  if (user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin', status: 'active' });
    if (adminCount <= 1) {
      return next(new ApiError('Cannot delete the last admin user', 400));
    }
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully'
  });
});

/**
 * @desc    Update user status (activate/deactivate)
 * @route   PUT /api/users/:id/status
 * @access  Private (Admin only)
 */
const updateUserStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!['active', 'inactive'].includes(status)) {
    return next(new ApiError('Status must be either active or inactive', 400));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Prevent deactivating the last admin
  if (user.role === 'admin' && status === 'inactive') {
    const activeAdminCount = await User.countDocuments({ 
      role: 'admin', 
      status: 'active',
      _id: { $ne: user._id }
    });
    
    if (activeAdminCount === 0) {
      return next(new ApiError('Cannot deactivate the last active admin', 400));
    }
  }

  user.status = status;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    }
  });
});

/**
 * @desc    Get user download history
 * @route   GET /api/users/:id/downloads
 * @access  Private (Admin or Own Profile)
 */
const getUserDownloads = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, sort = '-downloadDate' } = req.query;
  const skip = (page - 1) * limit;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  const downloads = await Download.find({
    user: req.params.id,
    status: 'completed'
  })
    .populate('book', 'title author category coverImage')
    .populate('scholar', 'name title')
    .sort(sort)
    .limit(limit * 1)
    .skip(skip)
    .lean();

  const total = await Download.countDocuments({
    user: req.params.id,
    status: 'completed'
  });

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
      downloads: downloads.map(download => ({
        id: download._id,
        book: download.book,
        scholar: download.scholar,
        downloadDate: download.downloadDate,
        formattedDate: download.downloadDate.toLocaleDateString(),
        downloadSize: download.downloadSize,
        formattedSize: download.formattedSize
      }))
    }
  });
});

/**
 * @desc    Get user statistics
 * @route   GET /api/users/:id/stats
 * @access  Private (Admin or Own Profile)
 */
const getUserStats = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // Overall stats
  const overallStats = await Download.aggregate([
    { $match: { user: user._id, status: 'completed' } },
    {
      $group: {
        _id: null,
        totalDownloads: { $sum: 1 },
        totalSize: { $sum: '$downloadSize' },
        uniqueBooks: { $addToSet: '$book' },
        uniqueCategories: { $addToSet: '$bookCategory' },
        firstDownload: { $min: '$downloadDate' },
        lastDownload: { $max: '$downloadDate' }
      }
    }
  ]);

  // Monthly stats for the last 12 months
  const monthlyStats = await Download.aggregate([
    {
      $match: {
        user: user._id,
        status: 'completed',
        downloadDate: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$downloadDate' },
          month: { $month: '$downloadDate' }
        },
        downloads: { $sum: 1 },
        size: { $sum: '$downloadSize' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Category preferences
  const categoryStats = await Download.aggregate([
    { $match: { user: user._id, status: 'completed' } },
    {
      $group: {
        _id: '$bookCategory',
        downloads: { $sum: 1 },
        size: { $sum: '$downloadSize' }
      }
    },
    { $sort: { downloads: -1 } },
    { $limit: 10 }
  ]);

  const stats = overallStats[0] || {
    totalDownloads: 0,
    totalSize: 0,
    uniqueBooks: [],
    uniqueCategories: [],
    firstDownload: null,
    lastDownload: null
  };

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        joinDate: user.createdAt
      },
      statistics: {
        overview: {
          totalDownloads: stats.totalDownloads,
          totalSize: stats.totalSize,
          uniqueBooks: stats.uniqueBooks.length,
          uniqueCategories: stats.uniqueCategories.length,
          firstDownload: stats.firstDownload,
          lastDownload: stats.lastDownload,
          daysSinceJoined: Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24)),
          averageDownloadsPerMonth: stats.totalDownloads / Math.max(1, Math.ceil((new Date() - user.createdAt) / (1000 * 60 * 60 * 24 * 30)))
        },
        monthly: monthlyStats,
        categories: categoryStats
      }
    }
  });
});

/**
 * @desc    Get user dashboard data
 * @route   GET /api/users/dashboard
 * @access  Private (User's own dashboard)
 */
const getDashboard = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Recent downloads
  const recentDownloads = await Download.find({
    user: userId,
    status: 'completed'
  })
    .populate('book', 'title author category coverImage')
    .sort({ downloadDate: -1 })
    .limit(5)
    .lean();

  // Download stats for current month
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const monthlyStats = await Download.aggregate([
    {
      $match: {
        user: userId,
        status: 'completed',
        downloadDate: { $gte: currentMonth }
      }
    },
    {
      $group: {
        _id: null,
        thisMonth: { $sum: 1 },
        totalSize: { $sum: '$downloadSize' }
      }
    }
  ]);

  // Favorite categories
  const favoriteCategories = await Download.aggregate([
    { $match: { user: userId, status: 'completed' } },
    { $group: { _id: '$bookCategory', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // Recommended books (based on user's favorite categories)
  const topCategories = favoriteCategories.slice(0, 2).map(cat => cat._id);
  const recommendedBooks = await Book.find({
    category: { $in: topCategories },
    isActive: true,
    _id: { $nin: recentDownloads.map(d => d.book._id) }
  })
    .sort({ downloads: -1 })
    .limit(10)
    .select('title author category coverImage downloads')
    .lean();

  const stats = monthlyStats[0] || { thisMonth: 0, totalSize: 0 };

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        name: req.user.name,
        totalDownloads: req.user.totalDownloads,
        monthlyDownloads: stats.thisMonth
      },
      recentDownloads: recentDownloads.map(download => ({
        book: download.book,
        downloadDate: download.downloadDate,
        formattedDate: download.downloadDate.toLocaleDateString()
      })),
      statistics: {
        thisMonth: stats.thisMonth,
        totalSize: stats.totalSize,
        allTime: req.user.totalDownloads
      },
      favoriteCategories: favoriteCategories.map(cat => ({
        category: cat._id,
        downloads: cat.count
      })),
      recommendedBooks
    }
  });
});

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  getUserDownloads,
  getUserStats,
  getDashboard
};