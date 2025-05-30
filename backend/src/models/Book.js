const mongoose = require('mongoose');

// Define the fixed Islamic categories
const islamicCategories = [
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

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxLength: [100, 'Author name cannot exceed 100 characters']
  },
  
  // Optional reference to Scholar model
  scholarAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholar',
    default: null
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: islamicCategories
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Cover image - can be URL or file path
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  
  publishedYear: {
    type: Number,
    required: [true, 'Published year is required'],
    min: [1400, 'Published year must be after 1400'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future']
  },
  
  pages: {
    type: Number,
    required: [true, 'Number of pages is required'],
    min: [1, 'Number of pages must be at least 1']
  },
  
  language: {
    type: String,
    required: true,
    enum: ['العربية', 'English', 'Français', 'Deutsch', 'اردو', 'فارسی', 'Türkçe'],
    default: 'English'
  },
  
  isbn: {
    type: String,
    trim: true,
    sparse: true,
    validate: {
      validator: function(isbn) {
        if (!isbn) return true; // Allow empty ISBN

        const isbnRegex = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
        return isbnRegex.test(isbn.replace(/[- ]/g, ''));
      },
      message: 'Please enter a valid ISBN'
    }
  },
  
  publisher: {
    type: String,
    trim: true,
    maxLength: [100, 'Publisher name cannot exceed 100 characters']
  },
  
  tags: [{
    type: String,
    trim: true,
    maxLength: [50, 'Tag cannot exceed 50 characters']
  }],
  
  // Download statistics
  downloads: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // File storage for the actual book (PDF)
  bookFile: {
    filename: String,        
    originalName: String,    
    size: Number,           
    mimetype: String,       
    path: String,           
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  
  // SEO and search optimization
  searchKeywords: [{
    type: String,
    lowercase: true
  }],
  
  // Admin information
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Featured book flag
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // View count (for analytics)
  views: {
    type: Number,
    default: 0
  },
  
  // Rating system (future feature)
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }

}, {
  timestamps: true
});

// Indexes for better query performance
bookSchema.index({ title: 'text', author: 'text', description: 'text', tags: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ language: 1 });
bookSchema.index({ downloads: -1 });
bookSchema.index({ isActive: 1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ publishedYear: -1 });
bookSchema.index({ scholarAuthor: 1 });

// Compound indexes
bookSchema.index({ category: 1, language: 1 });
bookSchema.index({ isActive: 1, downloads: -1 });

// Pre-save middleware to generate search keywords
bookSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('author') || this.isModified('tags') || this.isModified('description')) {
    // Generate search keywords from title, author, and tags
    const keywords = new Set();
    
    // Add words from title
    if (this.title) {
      this.title.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    // Add words from author
    if (this.author) {
      this.author.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    // Add tags
    if (this.tags) {
      this.tags.forEach(tag => {
        if (tag.length > 1) keywords.add(tag.toLowerCase());
      });
    }
    
    // Add category keywords
    if (this.category) {
      this.category.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    this.searchKeywords = Array.from(keywords);
  }
  next();
});

// Static method to get popular books
bookSchema.statics.getPopularBooks = async function(limit = 10) {
  return await this.find({ isActive: true })
    .sort({ downloads: -1 })
    .limit(limit)
    .populate('scholarAuthor', 'name title')
    .select('title author category downloads coverImage publishedYear language');
};

// Static method to get recent books
bookSchema.statics.getRecentBooks = async function(limit = 10) {
  return await this.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('scholarAuthor', 'name title')
    .select('title author category downloads coverImage publishedYear language');
};

// Static method to get books by category
bookSchema.statics.getBooksByCategory = async function(category, limit = 20, skip = 0) {
  return await this.find({ category, isActive: true })
    .sort({ downloads: -1 })
    .limit(limit)
    .skip(skip)
    .populate('scholarAuthor', 'name title')
    .select('title author category downloads coverImage publishedYear language');
};

// Static method to get category statistics
bookSchema.statics.getCategoryStats = async function() {
  return await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalDownloads: { $sum: '$downloads' },
        avgDownloads: { $avg: '$downloads' }
      }
    },
    { $sort: { totalDownloads: -1 } }
  ]);
};

// Instance method to increment downloads
bookSchema.methods.incrementDownloads = async function() {
  this.downloads += 1;
  return await this.save();
};

// Instance method to increment views
bookSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// Virtual for formatted file size
bookSchema.virtual('fileSizeFormatted').get(function() {
  if (!this.bookFile || !this.bookFile.size) return 'Unknown';
  
  const size = this.bookFile.size;
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let fileSize = size;
  
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }
  
  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
});

// Virtual for book age
bookSchema.virtual('bookAge').get(function() {
  return new Date().getFullYear() - this.publishedYear;
});

// Ensure virtual fields are serialized
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);