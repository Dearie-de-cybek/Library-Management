const { Book, Scholar, User } = require('../models');

/**
 * Advanced book search with filters and sorting
 * @param {object} searchParams - Search parameters
 * @returns {object} Search results
 */
const searchBooks = async (searchParams) => {
  const {
    query,
    category,
    language,
    author,
    scholar,
    yearFrom,
    yearTo,
    page = 1,
    limit = 20,
    sort = '-downloads'
  } = searchParams;

  // Build search filter
  const filter = { isActive: true };

  // Text search across multiple fields
  if (query) {
    const searchRegex = new RegExp(query, 'i');
    filter.$or = [
      { title: searchRegex },
      { author: searchRegex },
      { description: searchRegex },
      { tags: { $in: [searchRegex] } },
      { searchKeywords: { $in: [searchRegex] } }
    ];
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Language filter
  if (language) {
    filter.language = language;
  }

  // Author filter
  if (author) {
    filter.author = new RegExp(author, 'i');
  }

  // Scholar filter
  if (scholar) {
    filter.scholarAuthor = scholar;
  }

  // Year range filter
  if (yearFrom || yearTo) {
    filter.publishedYear = {};
    if (yearFrom) filter.publishedYear.$gte = parseInt(yearFrom);
    if (yearTo) filter.publishedYear.$lte = parseInt(yearTo);
  }

  // Execute search
  const skip = (page - 1) * limit;
  
  const [books, total] = await Promise.all([
    Book.find(filter)
      .populate('scholarAuthor', 'name title specialization')
      .populate('addedBy', 'name')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean(),
    Book.countDocuments(filter)
  ]);

  return {
    books,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    searchParams: {
      query,
      category,
      language,
      author,
      scholar,
      yearFrom,
      yearTo
    }
  };
};

/**
 * Search scholars with filters
 * @param {object} searchParams - Search parameters
 * @returns {object} Search results
 */
const searchScholars = async (searchParams) => {
  const {
    query,
    specialization,
    isAlive,
    page = 1,
    limit = 20,
    sort = '-totalBooksDownloads'
  } = searchParams;

  // Build search filter
  const filter = { isActive: true };

  // Text search
  if (query) {
    const searchRegex = new RegExp(query, 'i');
    filter.$or = [
      { name: searchRegex },
      { title: searchRegex },
      { institution: searchRegex },
      { bio: searchRegex },
      { searchKeywords: { $in: [searchRegex] } }
    ];
  }

  // Specialization filter
  if (specialization) {
    filter.specialization = specialization;
  }

  // Living/deceased filter
  if (isAlive !== undefined) {
    filter.isAlive = isAlive === 'true' || isAlive === true;
  }

  // Execute search
  const skip = (page - 1) * limit;
  
  const [scholars, total] = await Promise.all([
    Scholar.find(filter)
      .populate('addedBy', 'name')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean(),
    Scholar.countDocuments(filter)
  ]);

  return {
    scholars,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    searchParams: {
      query,
      specialization,
      isAlive
    }
  };
};

/**
 * Global search across books and scholars
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {object} Combined search results
 */
const globalSearch = async (query, options = {}) => {
  const { limit = 10 } = options;

  if (!query || query.trim().length < 2) {
    return {
      books: [],
      scholars: [],
      total: 0
    };
  }

  const searchRegex = new RegExp(query.trim(), 'i');

  // Search books
  const booksPromise = Book.find({
    isActive: true,
    $or: [
      { title: searchRegex },
      { author: searchRegex },
      { description: searchRegex },
      { tags: { $in: [searchRegex] } }
    ]
  })
    .populate('scholarAuthor', 'name')
    .sort({ downloads: -1 })
    .limit(limit)
    .select('title author category downloads coverImage')
    .lean();

  // Search scholars
  const scholarsPromise = Scholar.find({
    isActive: true,
    $or: [
      { name: searchRegex },
      { title: searchRegex },
      { specialization: searchRegex },
      { bio: searchRegex }
    ]
  })
    .sort({ totalBooksDownloads: -1 })
    .limit(limit)
    .select('name title specialization totalBooksDownloads image')
    .lean();

  const [books, scholars] = await Promise.all([booksPromise, scholarsPromise]);

  return {
    books,
    scholars,
    total: books.length + scholars.length,
    query: query.trim()
  };
};

/**
 * Get search suggestions based on partial query
 * @param {string} query - Partial search query
 * @param {number} limit - Maximum suggestions
 * @returns {Array} Search suggestions
 */
const getSearchSuggestions = async (query, limit = 10) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchRegex = new RegExp(`^${query.trim()}`, 'i');
  const suggestions = new Set();

  // Get book titles and authors
  const books = await Book.find({
    isActive: true,
    $or: [
      { title: searchRegex },
      { author: searchRegex }
    ]
  })
    .select('title author')
    .limit(limit * 2)
    .lean();

  books.forEach(book => {
    if (book.title.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(book.title);
    }
    if (book.author.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(book.author);
    }
  });

  // Get scholar names
  const scholars = await Scholar.find({
    isActive: true,
    name: searchRegex
  })
    .select('name')
    .limit(limit)
    .lean();

  scholars.forEach(scholar => {
    suggestions.add(scholar.name);
  });

  return Array.from(suggestions).slice(0, limit);
};

/**
 * Get popular search terms based on download activity
 * @param {number} limit - Maximum terms to return
 * @returns {Array} Popular search terms
 */
const getPopularSearchTerms = async (limit = 10) => {
  // Get most downloaded books to derive popular terms
  const popularBooks = await Book.find({ isActive: true })
    .sort({ downloads: -1 })
    .limit(limit * 2)
    .select('title author category tags')
    .lean();

  const terms = new Set();

  popularBooks.forEach(book => {
    // Add book title words
    book.title.split(' ').forEach(word => {
      if (word.length > 3) {
        terms.add(word.toLowerCase());
      }
    });

    // Add author name
    if (book.author) {
      terms.add(book.author);
    }

    // Add tags
    if (book.tags) {
      book.tags.forEach(tag => terms.add(tag));
    }
  });

  return Array.from(terms).slice(0, limit);
};

/**
 * Search books by category with recommendations
 * @param {string} category - Book category
 * @param {object} options - Search options
 * @returns {object} Category books and recommendations
 */
const searchByCategory = async (category, options = {}) => {
  const { page = 1, limit = 20, sort = '-downloads' } = options;

  const skip = (page - 1) * limit;

  // Get books in category
  const [books, total] = await Promise.all([
    Book.find({ category, isActive: true })
      .populate('scholarAuthor', 'name title')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean(),
    Book.countDocuments({ category, isActive: true })
  ]);

  // Get related categories (categories with similar keywords)
  const relatedCategories = await getRelatedCategories(category);

  return {
    books,
    category,
    relatedCategories,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get categories related to a given category
 * @param {string} category - Base category
 * @returns {Array} Related categories
 */
const getRelatedCategories = async (category) => {
  // Simple keyword-based relationship
  const categoryKeywords = category.toLowerCase().split(/[\s,.()]+/);
  
  const allCategories = [
    'Islam. General Study and teaching.',
    'History & Biography.',
    'Prophet Muhammad (SAW).',
    'Prophets (AS).',
    'Islamic literature.',
    'Sacred books.',
    'Qur\'an, Special parts and chapters, Works about the Qur\'an.',
    'Hadith literature, Traditions, Sunnah.',
    'General works on Islam.',
    'Dogma (\'Aqa\'id).',
    'Theology (Kalaam).',
    'Works against Islam and the Qur\'an.',
    'Works in defense of Islam.',
    'Islamic apologetics.',
    'Benevolent work. Social work. Welfare works, etc.',
    'Missionary works of Islam.',
    'Relation of Islam to other religions.',
    'Islamic sociology.',
    'The practice of Islam, the five duties of a Muslim. Pillars of Islam.',
    'Jihad (Holy War).',
    'Religious ceremonies, rites, etc.',
    'Special days and seasons, fasts, feasts, festivals, etc.',
    'Relics Shrines, sacred places, etc.',
    'Islamic religious life.',
    'Devotional literature.',
    'Sufism. Mysticism. Dervishes.',
    'Monasticism Branches, sects, etc.',
    'Shiites.',
    'Black Muslims.'
  ];

  return allCategories
    .filter(cat => cat !== category)
    .filter(cat => {
      const catKeywords = cat.toLowerCase().split(/[\s,.()]+/);
      return categoryKeywords.some(keyword => 
        keyword.length > 3 && catKeywords.some(catKeyword => 
          catKeyword.includes(keyword) || keyword.includes(catKeyword)
        )
      );
    })
    .slice(0, 5);
};

/**
 * Get recommended books based on user's download history
 * @param {string} userId - User ID
 * @param {number} limit - Maximum recommendations
 * @returns {Array} Recommended books
 */
const getPersonalizedRecommendations = async (userId, limit = 10) => {
  try {
    // Get user's download history
    const user = await User.findById(userId)
      .populate('downloadHistory.book', 'category')
      .lean();

    if (!user || !user.downloadHistory || user.downloadHistory.length === 0) {
      // Return popular books for new users
      return await Book.find({ isActive: true })
        .sort({ downloads: -1 })
        .limit(limit)
        .populate('scholarAuthor', 'name')
        .select('title author category downloads coverImage')
        .lean();
    }

    // Get user's preferred categories
    const categoryCount = {};
    user.downloadHistory.forEach(download => {
      if (download.book && download.book.category) {
        categoryCount[download.book.category] = (categoryCount[download.book.category] || 0) + 1;
      }
    });

    // Sort categories by preference
    const preferredCategories = Object.keys(categoryCount)
      .sort((a, b) => categoryCount[b] - categoryCount[a])
      .slice(0, 3);

    if (preferredCategories.length === 0) {
      return [];
    }

    // Get books from preferred categories that user hasn't downloaded
    const downloadedBookIds = user.downloadHistory.map(d => d.book?._id).filter(Boolean);

    const recommendations = await Book.find({
      isActive: true,
      category: { $in: preferredCategories },
      _id: { $nin: downloadedBookIds }
    })
      .sort({ downloads: -1 })
      .limit(limit)
      .populate('scholarAuthor', 'name')
      .select('title author category downloads coverImage')
      .lean();

    return recommendations;
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
};

/**
 * Full-text search with ranking
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {object} Ranked search results
 */
const fullTextSearch = async (query, options = {}) => {
  const { page = 1, limit = 20 } = options;

  if (!query || query.trim().length < 2) {
    return { books: [], total: 0 };
  }

  const searchTerms = query.trim().toLowerCase().split(/\s+/);
  const skip = (page - 1) * limit;

  // Create a complex aggregation for ranking
  const pipeline = [
    {
      $match: {
        isActive: true,
        $or: searchTerms.map(term => ({
          $or: [
            { title: { $regex: term, $options: 'i' } },
            { author: { $regex: term, $options: 'i' } },
            { description: { $regex: term, $options: 'i' } },
            { tags: { $regex: term, $options: 'i' } }
          ]
        }))
      }
    },
    {
      $addFields: {
        relevanceScore: {
          $add: [
            // Title match gets highest score
            {
              $cond: [
                { $regexMatch: { input: { $toLower: "$title" }, regex: query, options: "i" } },
                10, 0
              ]
            },
            // Author match gets medium score
            {
              $cond: [
                { $regexMatch: { input: { $toLower: "$author" }, regex: query, options: "i" } },
                7, 0
              ]
            },
            // Download popularity adds to score
            { $divide: ["$downloads", 100] },
            // Recent books get small boost
            {
              $cond: [
                { $gte: ["$createdAt", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)] },
                2, 0
              ]
            }
          ]
        }
      }
    },
    { $sort: { relevanceScore: -1, downloads: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: 'scholars',
        localField: 'scholarAuthor',
        foreignField: '_id',
        as: 'scholarAuthor'
      }
    },
    {
      $unwind: {
        path: '$scholarAuthor',
        preserveNullAndEmptyArrays: true
      }
    }
  ];

  const [results, totalCount] = await Promise.all([
    Book.aggregate(pipeline),
    Book.countDocuments({
      isActive: true,
      $or: searchTerms.map(term => ({
        $or: [
          { title: { $regex: term, $options: 'i' } },
          { author: { $regex: term, $options: 'i' } },
          { description: { $regex: term, $options: 'i' } },
          { tags: { $regex: term, $options: 'i' } }
        ]
      }))
    })
  ]);

  return {
    books: results,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalCount,
      pages: Math.ceil(totalCount / limit)
    },
    query: query.trim()
  };
};

module.exports = {
  searchBooks,
  searchScholars,
  globalSearch,
  getSearchSuggestions,
  getPopularSearchTerms,
  searchByCategory,
  getRelatedCategories,
  getPersonalizedRecommendations,
  fullTextSearch
};