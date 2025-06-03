const mongoose = require('mongoose');

// Define scholar specializations
const specializations = [
  'Islamic Jurisprudence (Fiqh)',
  'Quranic Sciences',
  'Hadith Studies',
  'Islamic Theology (Aqeedah)',
  'Prophet\'s Biography (Seerah)',
  'Islamic History',
  'Quranic Exegesis (Tafsir)',
  'Principles of Jurisprudence (Usul al-Fiqh)',
  'Islamic Da\'wah',
  'Islamic Ethics',
  'Islamic Education',
  'Islamic Economics',
  'Islamic Philosophy',
  'Islamic Mysticism (Sufism)',
  'Objectives of Sharia (Maqasid)'
];

const scholarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Scholar name is required'],
    trim: true,
    maxLength: [100, 'Scholar name cannot exceed 100 characters'],
    index: true
  },
  
  title: {
    type: String,
    required: [true, 'Academic title is required'],
    trim: true,
    maxLength: [150, 'Title cannot exceed 150 characters']
  },
  
  institution: {
    type: String,
    trim: true,
    maxLength: [150, 'Institution name cannot exceed 150 characters']
  },
  
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: specializations
  },
  
  bio: {
    type: String,
    required: [true, 'Biography is required'],
    trim: true,
    maxLength: [5000, 'Biography cannot exceed 5000 characters']
  },
  
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  
  dateOfDeath: {
    type: Date,
    validate: {
      validator: function(date) {
        // Only validate if scholar is not alive and date is provided
        if (!this.isAlive && date) {
          return date <= new Date() && date >= this.dateOfBirth;
        }
        return true;
      },
      message: 'Date of death must be after birth date and not in the future'
    }
  },
  
  isAlive: {
    type: Boolean,
    default: true
  },
  
  // Scholar image - can be URL or file path
  image: {
    type: String,
    default: ''
  },
  
  // Scholar's works/books
  works: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: [200, 'Work title cannot exceed 200 characters']
    },
    year: {
      type: Number,
      required: true,
      min: [600, 'Publication year must be after 1300'],
      max: [new Date().getFullYear(), 'Publication year cannot be in the future']
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0
    },
    // Reference to actual book if uploaded to the library
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      default: null
    },
    description: {
      type: String,
      maxLength: [500, 'Work description cannot exceed 500 characters']
    }
  }],
  
  // Statistics
  totalBooksDownloads: {
    type: Number,
    default: 0,
    min: 0
  },
  
  booksCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Views and popularity
  profileViews: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Social media and external links
  externalLinks: {
    website: String,
    wikipedia: String,
    socialMedia: [{
      platform: String,
      url: String
    }]
  },
  
  // Additional information
  nationality: String,
  
  languages: [{
    type: String,
    enum: ['Arabic', 'English', 'French', 'German', 'Urdu', 'Persian', 'Turkish', 'Malay', 'Other']
  }],
  
  // Search optimization
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
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Verification status (for famous scholars)
  isVerified: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

// Indexes for better performance
scholarSchema.index({ name: 'text', title: 'text', bio: 'text' });
scholarSchema.index({ specialization: 1 });
scholarSchema.index({ isAlive: 1 });
scholarSchema.index({ isActive: 1 });
scholarSchema.index({ totalBooksDownloads: -1 });
scholarSchema.index({ profileViews: -1 });
scholarSchema.index({ createdAt: -1 });

// Compound indexes
scholarSchema.index({ isActive: 1, totalBooksDownloads: -1 });
scholarSchema.index({ specialization: 1, isAlive: 1 });

// Pre-save middleware
scholarSchema.pre('save', function(next) {
  // Update booksCount based on works array
  this.booksCount = this.works.length;
  
  // Generate search keywords
  if (this.isModified('name') || this.isModified('title') || this.isModified('specialization') || this.isModified('bio')) {
    const keywords = new Set();
    
    // Add words from name
    if (this.name) {
      this.name.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    // Add words from title
    if (this.title) {
      this.title.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    // Add specialization keywords
    if (this.specialization) {
      this.specialization.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    // Add nationality if present
    if (this.nationality) {
      keywords.add(this.nationality.toLowerCase());
    }
    
    this.searchKeywords = Array.from(keywords);
  }
  
  // Validate date of death if scholar is not alive
  if (!this.isAlive && !this.dateOfDeath) {
    return next(new Error('Date of death is required for deceased scholars'));
  }
  
  // Clear date of death if scholar is alive
  if (this.isAlive) {
    this.dateOfDeath = undefined;
  }
  
  next();
});

// Static method to get popular scholars
scholarSchema.statics.getPopularScholars = async function(limit = 10) {
  return await this.find({ isActive: true })
    .sort({ totalBooksDownloads: -1, profileViews: -1 })
    .limit(limit)
    .select('name title specialization image totalBooksDownloads booksCount isAlive');
};

// Static method to get scholars by specialization
scholarSchema.statics.getScholarsBySpecialization = async function(specialization, limit = 20) {
  return await this.find({ specialization, isActive: true })
    .sort({ totalBooksDownloads: -1 })
    .limit(limit)
    .select('name title institution image totalBooksDownloads booksCount isAlive');
};

// Static method to get living scholars
scholarSchema.statics.getLivingScholars = async function(limit = 20) {
  return await this.find({ isAlive: true, isActive: true })
    .sort({ totalBooksDownloads: -1 })
    .limit(limit)
    .select('name title specialization institution image totalBooksDownloads');
};

// Static method to get classical scholars (deceased)
scholarSchema.statics.getClassicalScholars = async function(limit = 20) {
  return await this.find({ isAlive: false, isActive: true })
    .sort({ totalBooksDownloads: -1 })
    .limit(limit)
    .select('name title specialization dateOfBirth dateOfDeath image totalBooksDownloads');
};

// Static method to get specialization statistics
scholarSchema.statics.getSpecializationStats = async function() {
  return await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$specialization',
        scholarsCount: { $sum: 1 },
        totalBooks: { $sum: '$booksCount' },
        totalDownloads: { $sum: '$totalBooksDownloads' },
        livingScholars: {
          $sum: { $cond: ['$isAlive', 1, 0] }
        }
      }
    },
    { $sort: { totalDownloads: -1 } }
  ]);
};

// Instance method to add a work
scholarSchema.methods.addWork = function(workData) {
  this.works.push(workData);
  this.booksCount = this.works.length;
  return this.save();
};

// Instance method to remove a work
scholarSchema.methods.removeWork = function(workId) {
  this.works.id(workId).remove();
  this.booksCount = this.works.length;
  return this.save();
};

// Instance method to increment profile views
scholarSchema.methods.incrementViews = async function() {
  this.profileViews += 1;
  return await this.save();
};

// Instance method to update download statistics
scholarSchema.methods.updateDownloadStats = async function() {
  const totalDownloads = this.works.reduce((sum, work) => sum + (work.downloads || 0), 0);
  this.totalBooksDownloads = totalDownloads;
  return await this.save();
};

// Virtual for scholar's age
scholarSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  
  const endDate = this.isAlive ? new Date() : this.dateOfDeath;
  if (!endDate) return null;
  
  const age = endDate.getFullYear() - this.dateOfBirth.getFullYear();
  const monthDiff = endDate.getMonth() - this.dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < this.dateOfBirth.getDate())) {
    return age - 1;
  }
  
  return age;
});

// Virtual for formatted birth year
scholarSchema.virtual('birthYear').get(function() {
  return this.dateOfBirth ? this.dateOfBirth.getFullYear() : null;
});

// Virtual for formatted death year
scholarSchema.virtual('deathYear').get(function() {
  return this.dateOfDeath ? this.dateOfDeath.getFullYear() : null;
});

// Virtual for scholar status
scholarSchema.virtual('status').get(function() {
  if (this.isAlive) return 'Living Scholar';
  return 'Classical Scholar';
});

// Virtual for most popular work
scholarSchema.virtual('mostPopularWork').get(function() {
  if (!this.works || this.works.length === 0) return null;
  
  return this.works.reduce((prev, current) => 
    (prev.downloads > current.downloads) ? prev : current
  );
});

// Ensure virtual fields are serialized
scholarSchema.set('toJSON', { virtuals: true });
scholarSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Scholar', scholarSchema);