const { Book, Scholar, Category } = require("../models");
const { catchAsync, ApiError } = require("../middleware/errorHandler");
const { getFileUrl, deleteFile } = require("../middleware/fileUpload");

/**
 * @desc    Get all books with pagination and filtering
 * @route   GET /api/books
 * @access  Public
 */
const getAllBooks = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    category,
    language,
    author,
    year,
    sort = "-createdAt",
    q,
  } = req.query;

  // Build filter object
  const filter = { isActive: true };

  // Text search
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { author: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { tags: { $in: [new RegExp(q, "i")] } },
      { searchKeywords: { $in: [new RegExp(q, "i")] } },
    ];
  }

  // Category filter
  if (category) filter.category = category;

  // Language filter
  if (language) filter.language = language;

  // Author filter
  if (author) filter.author = { $regex: author, $options: "i" };

  // Year filter
  if (year) filter.publishedYear = parseInt(year);

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const books = await Book.find(filter)
    .populate("scholarAuthor", "name title specialization")
    .populate("addedBy", "name email")
    .sort(sort)
    .limit(limit * 1)
    .skip(skip)
    .lean();

  // Get total count
  const total = await Book.countDocuments(filter);

  // Add file URLs to books
  const booksWithUrls = books.map((book) => ({
    ...book,
    coverImageUrl: book.coverImage.startsWith("http")
      ? book.coverImage
      : getFileUrl(req, book.coverImage),
    bookFileUrl: book.bookFile ? getFileUrl(req, book.bookFile.path) : null,
  }));

  res.status(200).json({
    status: "success",
    count: books.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
    data: {
      books: booksWithUrls,
    },
  });
});

/**
 * @desc    Get single book by ID
 * @route   GET /api/books/:id
 * @access  Public
 */
const getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id)
    .populate("scholarAuthor", "name title specialization bio image")
    .populate("addedBy", "name email")
    .lean();

  if (!book) {
    return next(new ApiError("Book not found", 404));
  }

  if (!book.isActive) {
    return next(new ApiError("Book is not available", 404));
  }

  // Increment view count
  await Book.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  // Add file URLs
  const bookWithUrls = {
    ...book,
    coverImageUrl: book.coverImage.startsWith("http")
      ? book.coverImage
      : getFileUrl(req, book.coverImage),
    bookFileUrl: book.bookFile ? getFileUrl(req, book.bookFile.path) : null,
  };

  res.status(200).json({
    status: "success",
    data: {
      book: bookWithUrls,
    },
  });
});

/**
 * @desc    Create new book
 * @route   POST /api/books
 * @access  Private (Admin only)
 */
const createBook = catchAsync(async (req, res, next) => {
  // Add the user who created the book
  req.body.addedBy = req.user.id;

  // If scholarAuthor is provided, verify it exists
  if (req.body.scholarAuthor) {
    const scholar = await Scholar.findById(req.body.scholarAuthor);
    if (!scholar) {
      return next(new ApiError("Scholar not found", 404));
    }
  }

  const book = await Book.create(req.body);

  // Update category count
  await Category.updateCategoryStats(book.category, 1, 0);

  // Populate the created book
  await book.populate("scholarAuthor", "name title");
  await book.populate("addedBy", "name email");

  // Add file URLs
  const bookWithUrls = {
    ...book.toObject(),
    coverImageUrl: book.coverImage.startsWith("http")
      ? book.coverImage
      : getFileUrl(req, book.coverImage),
    bookFileUrl: book.bookFile ? getFileUrl(req, book.bookFile.path) : null,
  };

  res.status(201).json({
    status: "success",
    message: "Book created successfully",
    data: {
      book: bookWithUrls,
    },
  });
});

/**
 * @desc    Update book
 * @route   PUT /api/books/:id
 * @access  Private (Admin only)
 */
const updateBook = catchAsync(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ApiError("Book not found", 404));
  }

  // Check if category is being changed
  const oldCategory = book.category;
  const newCategory = req.body.category;

  // If scholarAuthor is being updated, verify it exists
  if (
    req.body.scholarAuthor &&
    req.body.scholarAuthor !== book.scholarAuthor?.toString()
  ) {
    const scholar = await Scholar.findById(req.body.scholarAuthor);
    if (!scholar) {
      return next(new ApiError("Scholar not found", 404));
    }
  }

  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("scholarAuthor", "name title")
    .populate("addedBy", "name email");

  // Update category counts if category changed
  if (oldCategory !== newCategory && newCategory) {
    await Category.updateCategoryStats(oldCategory, -1, 0);
    await Category.updateCategoryStats(newCategory, 1, 0);
  }

  // Add file URLs
  const bookWithUrls = {
    ...book.toObject(),
    coverImageUrl: book.coverImage.startsWith("http")
      ? book.coverImage
      : getFileUrl(req, book.coverImage),
    bookFileUrl: book.bookFile ? getFileUrl(req, book.bookFile.path) : null,
  };

  res.status(200).json({
    status: "success",
    message: "Book updated successfully",
    data: {
      book: bookWithUrls,
    },
  });
});

/**
 * @desc    Delete book
 * @route   DELETE /api/books/:id
 * @access  Private (Admin only)
 */
const deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ApiError("Book not found", 404));
  }

  // Delete associated files
  if (book.bookFile && book.bookFile.path) {
    try {
      await deleteFile(book.bookFile.path);
    } catch (error) {
      console.error("Error deleting book file:", error);
    }
  }

  // If cover image is a local file (not URL), delete it
  if (book.coverImage && !book.coverImage.startsWith("http")) {
    try {
      await deleteFile(book.coverImage);
    } catch (error) {
      console.error("Error deleting cover image:", error);
    }
  }

  // Update category count
  await Category.updateCategoryStats(book.category, -1, -book.downloads);

  // Delete the book
  await Book.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Book deleted successfully",
  });
});

/**
 * @desc    Upload book file (PDF)
 * @route   POST /api/books/:id/upload-book
 * @access  Private (Admin only)
 */
const uploadBookFile = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ApiError("Book not found", 404));
  }

  if (!req.file) {
    return next(new ApiError("Please upload a PDF file", 400));
  }

  // Delete old book file if it exists
  if (book.bookFile && book.bookFile.path) {
    try {
      await deleteFile(book.bookFile.path);
    } catch (error) {
      console.error("Error deleting old book file:", error);
    }
  }

  // Update book with new file info
  book.bookFile = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    path: req.file.path,
    uploadDate: new Date(),
  };

  await book.save();

  res.status(200).json({
    status: "success",
    message: "Book file uploaded successfully",
    data: {
      bookFile: {
        ...book.bookFile,
        url: getFileUrl(req, book.bookFile.path),
        formattedSize: book.fileSizeFormatted,
      },
    },
  });
});

/**
 * @desc    Upload cover image
 * @route   POST /api/books/:id/upload-cover
 * @access  Private (Admin only)
 */
const uploadCoverImage = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ApiError("Book not found", 404));
  }

  if (!req.file) {
    return next(new ApiError("Please upload an image file", 400));
  }

  // Delete old cover image if it's a local file
  if (book.coverImage && !book.coverImage.startsWith("http")) {
    try {
      await deleteFile(book.coverImage);
    } catch (error) {
      console.error("Error deleting old cover image:", error);
    }
  }

  // Update book with new cover image
  book.coverImage = req.file.path;
  await book.save();

  res.status(200).json({
    status: "success",
    message: "Cover image uploaded successfully",
    data: {
      coverImage: {
        path: book.coverImage,
        url: getFileUrl(req, book.coverImage),
      },
    },
  });
});

/**
 * @desc    Get books by category
 * @route   GET /api/books/category/:category
 * @access  Public
 */
const getBooksByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const { page = 1, limit = 20, sort = "-downloads" } = req.query;

  const skip = (page - 1) * limit;

  const books = await Book.find({ category, isActive: true })
    .populate("scholarAuthor", "name title")
    .sort(sort)
    .limit(limit * 1)
    .skip(skip)
    .lean();

  const total = await Book.countDocuments({ category, isActive: true });

  // Add file URLs
  const booksWithUrls = books.map((book) => ({
    ...book,
    coverImageUrl: book.coverImage.startsWith("http")
      ? book.coverImage
      : getFileUrl(req, book.coverImage),
    bookFileUrl: book.bookFile ? getFileUrl(req, book.bookFile.path) : null,
  }));

  res.status(200).json({
    status: "success",
    count: books.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
    data: {
      books: booksWithUrls,
      category,
    },
  });
});

/**
 * @desc    Get popular books
 * @route   GET /api/books/popular
 * @access  Public
 */
const getPopularBooks = catchAsync(async (req, res, next) => {
  const { limit = 10 } = req.query;

  const books = await Book.getPopularBooks(parseInt(limit));

  // Add file URLs
  const booksWithUrls = books.map((book) => ({
    ...book,
    coverImageUrl: book.coverImage.startsWith("http")
      ? book.coverImage
      : getFileUrl(req, book.coverImage),
  }));

  res.status(200).json({
    status: "success",
    count: books.length,
    data: {
      books: booksWithUrls,
    },
  });
});

/**
 * @desc    Get recent books
 * @route   GET /api/books/recent
 * @access  Public
 */
const getRecentBooks = catchAsync(async (req, res, next) => {
  const { limit = 10 } = req.query;

  const books = await Book.getRecentBooks(parseInt(limit));

  // Add file URLs
  const booksWithUrls = books.map((book) => ({
    ...book,
    coverImageUrl: book.coverImage.startsWith("http")
      ? book.coverImage
      : getFileUrl(req, book.coverImage),
  }));

  res.status(200).json({
    status: "success",
    count: books.length,
    data: {
      books: booksWithUrls,
    },
  });
});

/**
 * @desc    Search books with advanced filters
 * @route   GET /api/books/search
 * @access  Public
 */
const searchBooks = catchAsync(async (req, res, next) => {
  const {
    q,
    category,
    language,
    author,
    year,
    page = 1,
    limit = 20,
    sort = "-createdAt",
  } = req.query;

  if (!q && !category && !language && !author && !year) {
    return next(new ApiError("At least one search parameter is required", 400));
  }

  const filter = { isActive: true };

  // Text search
  if (q) {
    filter.$text = { $search: q };
  }

  // Additional filters
  if (category) filter.category = category;
  if (language) filter.language = language;
  if (author) filter.author = { $regex: author, $options: "i" };
  if (year) filter.publishedYear = parseInt(year);

  const skip = (page - 1) * limit;

  const books = await Book.find(filter)
    .populate("scholarAuthor", "name title")
    .sort(sort)
    .limit(limit * 1)
    .skip(skip)
    .lean();

  const total = await Book.countDocuments(filter);

  // Add file URLs and text search score
  const booksWithUrls = books.map((book) => ({
    ...book,
    coverImageUrl: book.coverImage.startsWith("http")
      ? book.coverImage
      : getFileUrl(req, book.coverImage),
    searchScore: book.score, // Text search score
  }));

  res.status(200).json({
    status: "success",
    count: books.length,
    searchQuery: { q, category, language, author, year },
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
    data: {
      books: booksWithUrls,
    },
  });
});

module.exports = {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  uploadBookFile,
  uploadCoverImage,
  getBooksByCategory,
  getPopularBooks,
  getRecentBooks,
  searchBooks,
};
