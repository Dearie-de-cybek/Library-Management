const mongoose = require('mongoose');


const islamicCategories = [
  {
    name: 'Islam. General Study and teaching.',
    nameArabic: 'الإسلام. الدراسة العامة والتعليم',
    description: 'General Islamic studies, educational materials, and teaching resources'
  },
  {
    name: 'History & Biography.',
    nameArabic: 'التاريخ والسيرة',
    description: 'Islamic history, biographical works, and historical accounts'
  },
  {
    name: 'Prophet Muhammad (SAW).',
    nameArabic: 'النبي محمد صلى الله عليه وسلم',
    description: 'Works about Prophet Muhammad (Peace be upon him), his life, and teachings'
  },
  {
    name: 'Prophets (AS).',
    nameArabic: 'الأنبياء عليهم السلام',
    description: 'Stories and teachings of the Prophets mentioned in Islam'
  },
  {
    name: 'Islamic literature.',
    nameArabic: 'الأدب الإسلامي',
    description: 'Islamic literature, poetry, and literary works'
  },
  {
    name: 'Sacred books.',
    nameArabic: 'الكتب المقدسة',
    description: 'Works about sacred texts and divine scriptures'
  },
  {
    name: 'Qur\'an, Special parts and chapters, Works about the Qur\'an.',
    nameArabic: 'القرآن الكريم، أجزاء وسور خاصة، مؤلفات حول القرآن',
    description: 'Quranic studies, specific chapters, and works about the Quran'
  },
  {
    name: 'Hadith literature, Traditions, Sunnah.',
    nameArabic: 'أدبيات الحديث، التقاليد، السنة',
    description: 'Hadith collections, prophetic traditions, and Sunnah studies'
  },
  {
    name: 'General works on Islam.',
    nameArabic: 'أعمال عامة عن الإسلام',
    description: 'Comprehensive works covering various aspects of Islam'
  },
  {
    name: 'Dogma (\'Aqa\'id).',
    nameArabic: 'العقائد',
    description: 'Islamic beliefs, doctrines, and articles of faith'
  },
  {
    name: 'Theology (Kalaam).',
    nameArabic: 'علم الكلام',
    description: 'Islamic theology and philosophical discussions about faith'
  },
  {
    name: 'Works against Islam and the Qur\'an.',
    nameArabic: 'أعمال ضد الإسلام والقرآن',
    description: 'Critical works and opposing views (for academic study)'
  },
  {
    name: 'Works in defense of Islam.',
    nameArabic: 'أعمال في الدفاع عن الإسلام',
    description: 'Apologetic works defending Islamic teachings and principles'
  },
  {
    name: 'Islamic apologetics.',
    nameArabic: 'الجدل الإسلامي',
    description: 'Islamic apologetics and rational defense of faith'
  },
  {
    name: 'Benevolent work. Social work. Welfare works, etc.',
    nameArabic: 'العمل الخيري. العمل الاجتماعي. أعمال الرفاهية',
    description: 'Islamic charity, social work, and community welfare'
  },
  {
    name: 'Missionary works of Islam.',
    nameArabic: 'أعمال الدعوة الإسلامية',
    description: 'Islamic missionary work and propagation of faith'
  },
  {
    name: 'Relation of Islam to other religions.',
    nameArabic: 'علاقة الإسلام بالأديان الأخرى',
    description: 'Interfaith dialogue and Islamic perspective on other religions'
  },
  {
    name: 'Islamic sociology.',
    nameArabic: 'علم الاجتماع الإسلامي',
    description: 'Islamic social studies and community organization'
  },
  {
    name: 'The practice of Islam, the five duties of a Muslim. Pillars of Islam.',
    nameArabic: 'ممارسة الإسلام، الواجبات الخمسة للمسلم. أركان الإسلام',
    description: 'Five pillars of Islam and practical aspects of worship'
  },
  {
    name: 'Jihad (Holy War).',
    nameArabic: 'الجهاد (الحرب المقدسة)',
    description: 'Islamic concept of Jihad and its various interpretations'
  },
  {
    name: 'Religious ceremonies, rites, etc.',
    nameArabic: 'الطقوس الدينية، الشعائر، إلخ',
    description: 'Islamic rituals, ceremonies, and religious observances'
  },
  {
    name: 'Special days and seasons, fasts, feasts, festivals, etc.',
    nameArabic: 'الأيام والمواسم الخاصة، الصيام، الأعياد، المهرجانات',
    description: 'Islamic holidays, festivals, fasting, and special occasions'
  },
  {
    name: 'Relics Shrines, sacred places, etc.',
    nameArabic: 'الآثار، الأضرحة، الأماكن المقدسة',
    description: 'Islamic holy places, shrines, and sacred locations'
  },
  {
    name: 'Islamic religious life.',
    nameArabic: 'الحياة الدينية الإسلامية',
    description: 'Daily Islamic religious practices and spiritual life'
  },
  {
    name: 'Devotional literature.',
    nameArabic: 'أدبيات التعبد',
    description: 'Islamic devotional works, prayers, and spiritual guidance'
  },
  {
    name: 'Sufism. Mysticism. Dervishes.',
    nameArabic: 'التصوف. العرفان. الدراويش',
    description: 'Islamic mysticism, Sufi traditions, and spiritual practices'
  },
  {
    name: 'Monasticism Branches, sects, etc.',
    nameArabic: 'الرهبانية، الفروع، الطوائف',
    description: 'Islamic monastic traditions and various religious orders'
  },
  {
    name: 'Shiites.',
    nameArabic: 'الشيعة',
    description: 'Shia Islamic traditions, beliefs, and practices'
  },
  {
    name: 'Black Muslims.',
    nameArabic: 'المسلمون السود',
    description: 'African-American Islamic movements and communities'
  }
];

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    enum: islamicCategories.map(cat => cat.name)
  },
  
  nameArabic: {
    type: String,
    required: true,
    trim: true
  },
  
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  
  descriptionArabic: {
    type: String,
    trim: true,
    maxLength: [500, 'Arabic description cannot exceed 500 characters']
  },
  
  // Statistics
  booksCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  totalDownloads: {
    type: Number,
    default: 0,
    min: 0
  },
  
  monthlyDownloads: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Display properties
  color: {
    type: String,
    default: '#10B981', // Default emerald color
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  
  icon: {
    type: String,
    default: 'book',
    trim: true
  },
  
  // Ordering and visibility
  sortOrder: {
    type: Number,
    default: 0
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // SEO and search
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  searchKeywords: [{
    type: String,
    lowercase: true
  }],
  
  // Admin info
  lastUpdated: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ totalDownloads: -1 });
categorySchema.index({ sortOrder: 1 });

// Pre-save middleware to generate slug and search keywords
categorySchema.pre('save', function(next) {
  // Generate slug from name
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }
  
  // Generate search keywords
  if (this.isModified('name') || this.isModified('description')) {
    const keywords = new Set();
    
    // Add words from name
    this.name.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 2) keywords.add(word);
    });
    
    // Add words from description
    if (this.description) {
      this.description.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    this.searchKeywords = Array.from(keywords);
  }
  
  this.lastUpdated = new Date();
  next();
});

// Static method to initialize categories
categorySchema.statics.initializeCategories = async function() {
  try {
    const existingCount = await this.countDocuments();
    
    if (existingCount === 0) {
      const categoriesToInsert = islamicCategories.map((cat, index) => ({
        name: cat.name,
        nameArabic: cat.nameArabic,
        description: cat.description,
        sortOrder: index + 1,
        isActive: true
      }));
      
      await this.insertMany(categoriesToInsert);
      console.log('Categories initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};

// Static method to get category statistics
categorySchema.statics.getCategoryStats = async function() {
  return await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalCategories: { $sum: 1 },
        totalBooks: { $sum: '$booksCount' },
        totalDownloads: { $sum: '$totalDownloads' },
        avgBooksPerCategory: { $avg: '$booksCount' },
        avgDownloadsPerCategory: { $avg: '$totalDownloads' }
      }
    }
  ]);
};

// Static method to get popular categories
categorySchema.statics.getPopularCategories = async function(limit = 10) {
  return await this.find({ isActive: true })
    .sort({ totalDownloads: -1, booksCount: -1 })
    .limit(limit)
    .select('name nameArabic booksCount totalDownloads color icon');
};

// Static method to get categories with most books
categorySchema.statics.getCategoriesWithMostBooks = async function(limit = 10) {
  return await this.find({ isActive: true })
    .sort({ booksCount: -1 })
    .limit(limit)
    .select('name nameArabic booksCount totalDownloads color icon');
};

// Static method to update category statistics
categorySchema.statics.updateCategoryStats = async function(categoryName, bookCountChange = 0, downloadChange = 0) {
  return await this.findOneAndUpdate(
    { name: categoryName, isActive: true },
    {
      $inc: {
        booksCount: bookCountChange,
        totalDownloads: downloadChange,
        monthlyDownloads: downloadChange
      },
      lastUpdated: new Date()
    },
    { new: true }
  );
};

// Static method to reset monthly downloads (call this monthly)
categorySchema.statics.resetMonthlyDownloads = async function() {
  return await this.updateMany(
    { isActive: true },
    { 
      $set: { monthlyDownloads: 0 },
      lastUpdated: new Date()
    }
  );
};

// Instance method to increment downloads
categorySchema.methods.incrementDownloads = function(count = 1) {
  this.totalDownloads += count;
  this.monthlyDownloads += count;
  this.lastUpdated = new Date();
  return this.save();
};

// Instance method to increment book count
categorySchema.methods.incrementBookCount = function(count = 1) {
  this.booksCount += count;
  this.lastUpdated = new Date();
  return this.save();
};

// Virtual for category URL
categorySchema.virtual('url').get(function() {
  return `/categories/${this.slug}`;
});

// Virtual for download rate (downloads per book)
categorySchema.virtual('downloadRate').get(function() {
  return this.booksCount > 0 ? (this.totalDownloads / this.booksCount).toFixed(1) : 0;
});

// Virtual for formatted book count
categorySchema.virtual('formattedBookCount').get(function() {
  if (this.booksCount >= 1000) {
    return (this.booksCount / 1000).toFixed(1) + 'K';
  }
  return this.booksCount.toString();
});

// Virtual for formatted download count
categorySchema.virtual('formattedDownloadCount').get(function() {
  if (this.totalDownloads >= 1000000) {
    return (this.totalDownloads / 1000000).toFixed(1) + 'M';
  } else if (this.totalDownloads >= 1000) {
    return (this.totalDownloads / 1000).toFixed(1) + 'K';
  }
  return this.totalDownloads.toString();
});

// Ensure virtual fields are serialized
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema);