const { Scholar, Book, Download } = require('../models');
const { catchAsync, ApiError } = require('../middleware/errorHandler');
const { getFileUrl, deleteFile } = require('../middleware/fileUpload');

/**
 * @desc    Get all scholars with pagination and filtering
 * @route   GET /api/scholars
 * @access  Public
 */
const getAllScholars = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    sort = '-totalBooksDownloads',
    specialization,
    isAlive,
    search,
    featured
  } = req.query;

  // Build filter object
  const filter = { isActive: true };

  // Specialization filter
  if (specialization) filter.specialization = specialization;

  // Living/deceased filter
  if (isAlive !== undefined) {
    filter.isAlive = isAlive === 'true';
  }

  // Featured scholars filter
  if (featured === 'true') {
    filter.isFeatured = true;
  }

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { institution: { $regex: search, $options: 'i' } },
      { bio: { $regex: search, $options: 'i' } },
      { searchKeywords: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const scholars = await Scholar.find(filter)
    .populate('addedBy', 'name email')
    .sort(sort)
    .limit(limit * 1)
    .skip(skip)
    .lean();

  // Get total count
  const total = await Scholar.countDocuments(filter);

  // Add image URLs to scholars
  const scholarsWithUrls = scholars.map(scholar => ({
    ...scholar,
    imageUrl: scholar.image && scholar.image.startsWith('http') 
      ? scholar.image 
      : scholar.image ? getFileUrl(req, scholar.image) : null,
    age: scholar.age,
    status: scholar.status
  }));

  res.status(200).json({
    status: 'success',
    count: scholars.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      scholars: scholarsWithUrls
    }
  });
});

/**
 * @desc    Get single scholar by ID
 * @route   GET /api/scholars/:id
 * @access  Public
 */
const getScholar = catchAsync(async (req, res, next) => {
  const scholar = await Scholar.findById(req.params.id)
    .populate('addedBy', 'name email')
    .lean();

  if (!scholar) {
    return next(new ApiError('Scholar not found', 404));
  }

  if (!scholar.isActive) {
    return next(new ApiError('Scholar is not available', 404));
  }

  // Increment profile views
  await Scholar.findByIdAndUpdate(req.params.id, { $inc: { profileViews: 1 } });

  // Get books by this scholar
  const books = await Book.find({
    scholarAuthor: req.params.id,
    isActive: true
  }).select('title category publishedYear downloads coverImage').lean();

  // Add URLs and enhance scholar data
  const scholarWithData = {
    ...scholar,
    imageUrl: scholar.image && scholar.image.startsWith('http') 
      ? scholar.image 
      : scholar.image ? getFileUrl(req, scholar.image) : null,
    age: scholar.age,
    status: scholar.status,
    books: books.map(book => ({
      ...book,
      coverImageUrl: book.coverImage && book.coverImage.startsWith('http') 
        ? book.coverImage 
        : book.coverImage ? getFileUrl(req, book.coverImage) : null
    }))
  };

  res.status(200).json({
    status: 'success',
    data: {
      scholar: scholarWithData
    }
  });
});

/**
 * @desc    Create new scholar
 * @route   POST /api/scholars
 * @access  Private (Admin only)
 */
const createScholar = catchAsync(async (req, res, next) => {
  // Add the user who created the scholar
  req.body.addedBy = req.user.id;

  // Validate works array
  if (req.body.works && req.body.works.length > 0) {
    req.body.works.forEach(work => {
      if (!work.title || !work.year) {
        return next(new ApiError('Each work must have a title and publication year', 400));
      }
    });
  }

  const scholar = await Scholar.create(req.body);

  // Populate the created scholar
  await scholar.populate('addedBy', 'name email');

  // Add image URL
  const scholarWithUrl = {
    ...scholar.toObject(),
    imageUrl: scholar.image && scholar.image.startsWith('http') 
      ? scholar.image 
      : scholar.image ? getFileUrl(req, scholar.image) : null
  };

  res.status(201).json({
    status: 'success',
    message: 'Scholar created successfully',
    data: {
      scholar: scholarWithUrl
    }
  });
});

/**
 * @desc    Update scholar
 * @route   PUT /api/scholars/:id
 * @access  Private (Admin only)
 */
const updateScholar = catchAsync(async (req, res, next) => {
  let scholar = await Scholar.findById(req.params.id);

  if (!scholar) {
    return next(new ApiError('Scholar not found', 404));
  }

  // Validate works array if provided
  if (req.body.works && req.body.works.length > 0) {
    req.body.works.forEach(work => {
      if (!work.title || !work.year) {
        return next(new ApiError('Each work must have a title and publication year', 400));
      }
    });
  }

  scholar = await Scholar.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('addedBy', 'name email');

  // Add image URL
  const scholarWithUrl = {
    ...scholar.toObject(),
    imageUrl: scholar.image && scholar.image.startsWith('http') 
      ? scholar.image 
      : scholar.image ? getFileUrl(req, scholar.image) : null
  };

  res.status(200).json({
    status: 'success',
    message: 'Scholar updated successfully',
    data: {
      scholar: scholarWithUrl
    }
  });
});

/**
 * @desc    Delete scholar
 * @route   DELETE /api/scholars/:id
 * @access  Private (Admin only)
 */
const deleteScholar = catchAsync(async (req, res, next) => {
  const scholar = await Scholar.findById(req.params.id);

  if (!scholar) {
    return next(new ApiError('Scholar not found', 404));
  }

  // Check if scholar has books associated
  const booksCount = await Book.countDocuments({ scholarAuthor: req.params.id });

  if (booksCount > 0) {
    return next(new ApiError('Cannot delete scholar with associated books. Please remove or reassign books first.', 400));
  }

  // Delete associated image file if it's a local file
  if (scholar.image && !scholar.image.startsWith('http')) {
    try {
      await deleteFile(scholar.image);
    } catch (error) {
      console.error('Error deleting scholar image:', error);
    }
  }

  // Delete the scholar
  await Scholar.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Scholar deleted successfully'
  });
});

/**
 * @desc    Upload scholar image
 * @route   POST /api/scholars/:id/upload-image
 * @access  Private (Admin only)
 */
const uploadScholarImage = catchAsync(async (req, res, next) => {
  const scholar = await Scholar.findById(req.params.id);

  if (!scholar) {
    return next(new ApiError('Scholar not found', 404));
  }

  if (!req.file) {
    return next(new ApiError('Please upload an image file', 400));
  }

  // Delete old image if it's a local file
  if (scholar.image && !scholar.image.startsWith('http')) {
    try {
      await deleteFile(scholar.image);
    } catch (error) {
      console.error('Error deleting old scholar image:', error);
    }
  }

  // Update scholar with new image
  scholar.image = req.file.path;
  await scholar.save();

  res.status(200).json({
    status: 'success',
    message: 'Scholar image uploaded successfully',
    data: {
      image: {
        path: scholar.image,
        url: getFileUrl(req, scholar.image)
      }
    }
  });
});

/**
 * @desc    Get scholars by specialization
 * @route   GET /api/scholars/specialization/:specialization
 * @access  Public
 */
const getScholarsBySpecialization = catchAsync(async (req, res, next) => {
  const { specialization } = req.params;
  const { page = 1, limit = 20, sort = '-totalBooksDownloads' } = req.query;

  const skip = (page - 1) * limit;

  const scholars = await Scholar.find({ 
    specialization, 
    isActive: true 
  })
    .sort(sort)
    .limit(limit * 1)
    .skip(skip)
    .lean();

  const total = await Scholar.countDocuments({ 
    specialization, 
    isActive: true 
  });

  // Add image URLs
  const scholarsWithUrls = scholars.map(scholar => ({
    ...scholar,
    imageUrl: scholar.image && scholar.image.startsWith('http') 
      ? scholar.image 
      : scholar.image ? getFileUrl(req, scholar.image) : null
  }));

  res.status(200).json({
    status: 'success',
    count: scholars.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      scholars: scholarsWithUrls,
      specialization
    }
  });
});

/**
 * @desc    Get popular scholars
 * @route   GET /api/scholars/popular
 * @access  Public
 */
const getPopularScholars = catchAsync(async (req, res, next) => {
  const { limit = 10 } = req.query;

  const scholars = await Scholar.getPopularScholars(parseInt(limit));

  // Add image URLs
  const scholarsWithUrls = scholars.map(scholar => ({
    ...scholar,
    imageUrl: scholar.image && scholar.image.startsWith('http') 
      ? scholar.image 
      : scholar.image ? getFileUrl(req, scholar.image) : null
  }));

  res.status(200).json({
    status: 'success',
    count: scholars.length,
    data: {
      scholars: scholarsWithUrls
    }
  });
});

/**
 * @desc    Get living scholars
 * @route   GET /api/scholars/living
 * @access  Public
 */
const getLivingScholars = catchAsync(async (req, res, next) => {
  const { limit = 20 } = req.query;

  const scholars = await Scholar.getLivingScholars(parseInt(limit));

  // Add image URLs
  const scholarsWithUrls = scholars.map(scholar => ({
    ...scholar,
    imageUrl: scholar.image && scholar.image.startsWith('http') 
      ? scholar.image 
      : scholar.image ? getFileUrl(req, scholar.image) : null
  }));

  res.status(200).json({
    status: 'success',
    count: scholars.length,
    data: {
      scholars: scholarsWithUrls
    }
  });
});

/**
 * @desc    Get classical scholars (deceased)
 * @route   GET /api/scholars/classical
 * @access  Public
 */
const getClassicalScholars = catchAsync(async (req, res, next) => {
  const { limit = 20 } = req.query;

  const scholars = await Scholar.getClassicalScholars(parseInt(limit));

  // Add image URLs
  const scholarsWithUrls = scholars.map(scholar => ({
    ...scholar,
    imageUrl: scholar.image && scholar.image.startsWith('http') 
      ? scholar.image 
      : scholar.image ? getFileUrl(req, scholar.image) : null
  }));

  res.status(200).json({
    status: 'success',
    count: scholars.length,
    data: {
      scholars: scholarsWithUrls
    }
  });
});

/**
 * @desc    Get books by scholar
 * @route   GET /api/scholars/:id/books
 * @access  Public
 */
const getScholarBooks = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, sort = '-downloads' } = req.query;
  
  const scholar = await Scholar.findById(req.params.id);
  
  if (!scholar) {
    return next(new ApiError('Scholar not found', 404));
  }

  if (!scholar.isActive) {
    return next(new ApiError('Scholar is not available', 404));
  }

  const skip = (page - 1) * limit;

  const books = await Book.find({
    scholarAuthor: req.params.id,
    isActive: true
  })
    .populate('addedBy', 'name email')
    .sort(sort)
    .limit(limit * 1)
    .skip(skip)
    .lean();

  const total = await Book.countDocuments({
    scholarAuthor: req.params.id,
    isActive: true
  });

  // Add file URLs
  const booksWithUrls = books.map(book => ({
    ...book,
    coverImageUrl: book.coverImage && book.coverImage.startsWith('http') 
      ? book.coverImage 
      : book.coverImage ? getFileUrl(req, book.coverImage) : null,
    bookFileUrl: book.bookFile ? getFileUrl(req, book.bookFile.path) : null
  }));

  res.status(200).json({
    status: 'success',
    count: books.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      scholar: {
        id: scholar._id,
        name: scholar.name,
        title: scholar.title,
        specialization: scholar.specialization
      },
      books: booksWithUrls
    }
  });
});

/**
 * @desc    Add work to scholar
 * @route   POST /api/scholars/:id/works
 * @access  Private (Admin only)
 */
const addScholarWork = catchAsync(async (req, res, next) => {
  const { title, year, description, bookId } = req.body;

  if (!title || !year) {
    return next(new ApiError('Work title and publication year are required', 400));
  }

  const scholar = await Scholar.findById(req.params.id);

  if (!scholar) {
    return next(new ApiError('Scholar not found', 404));
  }

  // If bookId is provided, verify it exists
  if (bookId) {
    const book = await Book.findById(bookId);
    if (!book) {
      return next(new ApiError('Book not found', 400));
    }
  }

  const work = {
    title,
    year: parseInt(year),
    description: description || '',
    bookId: bookId || null,
    downloads: 0
  };

  scholar.works.push(work);
  await scholar.save();

  res.status(201).json({
    status: 'success',
    message: 'Work added successfully',
    data: {
      work: scholar.works[scholar.works.length - 1]
    }
  });
});

/**
 * @desc    Update scholar work
 * @route   PUT /api/scholars/:id/works/:workId
 * @access  Private (Admin only)
 */
const updateScholarWork = catchAsync(async (req, res, next) => {
  const { title, year, description, bookId } = req.body;

  const scholar = await Scholar.findById(req.params.id);

  if (!scholar) {
    return next(new ApiError('Scholar not found', 404));
  }

  const work = scholar.works.id(req.params.workId);

  if (!work) {
    return next(new ApiError('Work not found', 404));
  }

  // If bookId is provided, verify it exists
  if (bookId) {
    const book = await Book.findById(bookId);
    if (!book) {
      return next(new ApiError('Book not found', 400));
    }
  }

  // Update work fields
  if (title) work.title = title;
  if (year) work.year = parseInt(year);
  if (description !== undefined) work.description = description;
  if (bookId !== undefined) work.bookId = bookId || null;

  await scholar.save();

  res.status(200).json({
    status: 'success',
    message: 'Work updated successfully',
    data: {
      work
    }
  });
});

/**
 * @desc    Delete scholar work
 * @route   DELETE /api/scholars/:id/works/:workId
 * @access  Private (Admin only)
 */
const deleteScholarWork = catchAsync(async (req, res, next) => {
  const scholar = await Scholar.findById(req.params.id);

  if (!scholar) {
    return next(new ApiError('Scholar not found', 404));
  }

  const work = scholar.works.id(req.params.workId);

  if (!work) {
    return next(new ApiError('Work not found', 404));
  }

  work.deleteOne();
  await scholar.save();

  res.status(200).json({
    status: 'success',
    message: 'Work deleted successfully'
  });
});

/**
 * @desc    Get scholar statistics
 * @route   GET /api/scholars/:id/stats
 * @access  Public
 */
const getScholarStats = catchAsync(async (req, res, next) => {
  const scholar = await Scholar.findById(req.params.id);

  if (!scholar) {
    return next(new ApiError('Scholar not found', 404));
  }

  // Get download statistics for this scholar's books
  const downloadStats = await Download.aggregate([
    { $match: { scholar: scholar._id, status: 'completed' } },
    {
      $group: {
        _id: null,
        totalDownloads: { $sum: 1 },
        uniqueUsers: { $addToSet: '$user' },
        totalSize: { $sum: '$downloadSize' },
        recentDownloads: {
          $sum: {
            $cond: [
              {
                $gte: [
                  '$downloadDate',
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
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

  // Get monthly download trends
  const monthlyTrends = await Download.aggregate([
    {
      $match: {
        scholar: scholar._id,
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
        downloads: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const stats = downloadStats[0] || {
    totalDownloads: 0,
    uniqueUsers: [],
    totalSize: 0,
    recentDownloads: 0
  };

  res.status(200).json({
    status: 'success',
    data: {
      scholar: {
        id: scholar._id,
        name: scholar.name,
        title: scholar.title,
        specialization: scholar.specialization,
        isAlive: scholar.isAlive,
        booksCount: scholar.booksCount,
        profileViews: scholar.profileViews
      },
      statistics: {
        totalDownloads: stats.totalDownloads,
        uniqueReaders: stats.uniqueUsers.length,
        totalSize: stats.totalSize,
        recentDownloads: stats.recentDownloads,
        monthlyTrends
      }
    }
  });
});

module.exports = {
  getAllScholars,
  getScholar,
  createScholar,
  updateScholar,
  deleteScholar,
  uploadScholarImage,
  getScholarsBySpecialization,
  getPopularScholars,
  getLivingScholars,
  getClassicalScholars,
  getScholarBooks,
  addScholarWork,
  updateScholarWork,
  deleteScholarWork,
  getScholarStats
};