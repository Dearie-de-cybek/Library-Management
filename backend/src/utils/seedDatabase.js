require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const { User, Book, Scholar, Download, Category } = require('../models');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@islamiclibrary.com',
    password: 'admin123456',
    role: 'admin'
  },
  {
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    password: 'user123456',
    role: 'user',
    totalDownloads: 15,
    monthlyDownloads: 5,
    favoriteCategory: 'Qur\'an, Special parts and chapters, Works about the Qur\'an.'
  },
  {
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    password: 'user123456',
    role: 'user',
    totalDownloads: 8,
    monthlyDownloads: 3,
    favoriteCategory: 'Hadith literature, Traditions, Sunnah.'
  },
  {
    name: 'محمد الغزالي',
    email: 'ghazali@example.com',
    password: 'user123456',
    role: 'user',
    totalDownloads: 25,
    monthlyDownloads: 7,
    favoriteCategory: 'Sufism. Mysticism. Dervishes.'
  }
];

const sampleScholars = [
  {
    name: 'Ibn Sina (Avicenna)',
    title: 'Philosopher and Physician',
    institution: 'Medieval Islamic Golden Age',
    specialization: 'Islamic Philosophy',
    bio: 'Abu Ali al-Husayn ibn Sina, known in the West as Avicenna, was a Persian polymath who is regarded as one of the most significant physicians, astronomers, thinkers and writers of the Islamic Golden Age, and the father of early modern medicine.',
    dateOfBirth: new Date('980-08-01'),
    dateOfDeath: new Date('1037-06-01'),
    isAlive: false,
    image: 'https://example.com/avicenna.jpg',
    works: [
      {
        title: 'The Canon of Medicine',
        year: 1025,
        downloads: 450,
        description: 'A medical encyclopedia and one of the most famous books in the history of medicine'
      },
      {
        title: 'The Book of Healing',
        year: 1027,
        downloads: 320,
        description: 'A scientific and philosophical encyclopedia'
      }
    ],
    totalBooksDownloads: 770,
    booksCount: 2,
    profileViews: 1250,
    nationality: 'Persian',
    languages: ['Arabic', 'Persian'],
    isVerified: true
  },
  {
    name: 'Al-Ghazali',
    title: 'Islamic Theologian and Philosopher',
    institution: 'Nizamiyya Academy',
    specialization: 'Islamic Mysticism (Sufism)',
    bio: 'Abu Hamid Muhammad ibn Muhammad al-Ghazali, known as Algazel in the medieval West, was a Persian Sunni Muslim theologian, jurist, philosopher, and mystic.',
    dateOfBirth: new Date('1058-01-01'),
    dateOfDeath: new Date('1111-12-19'),
    isAlive: false,
    image: 'https://example.com/ghazali.jpg',
    works: [
      {
        title: 'The Revival of the Religious Sciences',
        year: 1095,
        downloads: 680,
        description: 'A comprehensive guide to Islamic spirituality and practice'
      },
      {
        title: 'The Incoherence of the Philosophers',
        year: 1095,
        downloads: 430,
        description: 'A critique of Aristotelian philosophy'
      },
      {
        title: 'The Alchemy of Happiness',
        year: 1105,
        downloads: 520,
        description: 'A work on Islamic ethics and Sufism'
      }
    ],
    totalBooksDownloads: 1630,
    booksCount: 3,
    profileViews: 2100,
    nationality: 'Persian',
    languages: ['Arabic', 'Persian'],
    isVerified: true
  },
  {
    name: 'Dr. Yusuf al-Qaradawi',
    title: 'Contemporary Islamic Scholar',
    institution: 'University of Qatar',
    specialization: 'Islamic Jurisprudence (Fiqh)',
    bio: 'Yusuf al-Qaradawi is an Egyptian Islamic theologian based in Doha, Qatar, and chairman of the International Union of Muslim Scholars.',
    dateOfBirth: new Date('1926-09-09'),
    isAlive: true,
    image: 'https://example.com/qaradawi.jpg',
    works: [
      {
        title: 'The Lawful and the Prohibited in Islam',
        year: 1960,
        downloads: 850,
        description: 'A comprehensive guide to Islamic jurisprudence for daily life'
      },
      {
        title: 'Fiqh of Zakat',
        year: 1973,
        downloads: 420,
        description: 'Detailed study of Islamic charity and wealth distribution'
      }
    ],
    totalBooksDownloads: 1270,
    booksCount: 2,
    profileViews: 1800,
    nationality: 'Egyptian',
    languages: ['Arabic', 'English'],
    isVerified: true
  }
];

const sampleBooks = [
  {
    title: 'فهم القرآن الكريم في عصر التكنولوجيا',
    author: 'د. أحمد الزهراني',
    category: 'Qur\'an, Special parts and chapters, Works about the Qur\'an.',
    description: 'دراسة معاصرة لكيفية فهم وتطبيق تعاليم القرآن الكريم في العصر الحديث، مع التركيز على التحديات التكنولوجية والاجتماعية المعاصرة.',
    coverImage: 'https://example.com/quran-tech.jpg',
    publishedYear: 2023,
    pages: 450,
    language: 'العربية',
    isbn: '978-9960-123-456-7',
    publisher: 'دار الفكر العربي',
    tags: ['القرآن', 'التكنولوجيا', 'العصر الحديث', 'التفسير'],
    downloads: 320,
    bookFile: {
      filename: 'quran-tech-2023.pdf',
      originalName: 'فهم_القرآن_الكريم_في_عصر_التكنولوجيا.pdf',
      size: 15728640, // 15MB
      mimetype: 'application/pdf',
      path: 'uploads/books/quran-tech-2023.pdf'
    },
    searchKeywords: ['quran', 'technology', 'modern', 'interpretation', 'قرآن', 'تكنولوجيا'],
    isActive: true,
    views: 850
  },
  {
    title: 'The Science of Hadith Authentication',
    author: 'Dr. Muhammad Al-Bukhari',
    category: 'Hadith literature, Traditions, Sunnah.',
    description: 'A comprehensive study of the methodologies used in authenticating prophetic traditions, including chain of narration analysis and textual criticism.',
    coverImage: 'https://example.com/hadith-science.jpg',
    publishedYear: 2022,
    pages: 680,
    language: 'English',
    isbn: '978-1-234-56789-0',
    publisher: 'Islamic Academic Press',
    tags: ['Hadith', 'Authentication', 'Methodology', 'Scholarship'],
    downloads: 280,
    bookFile: {
      filename: 'hadith-auth-2022.pdf',
      originalName: 'Science_of_Hadith_Authentication.pdf',
      size: 25165824, // 24MB
      mimetype: 'application/pdf',
      path: 'uploads/books/hadith-auth-2022.pdf'
    },
    searchKeywords: ['hadith', 'authentication', 'methodology', 'scholarship', 'bukhari'],
    isActive: true,
    views: 650
  },
  {
    title: 'السيرة النبوية للأطفال',
    author: 'د. فاطمة الزهراء',
    category: 'Prophet Muhammad (SAW).',
    description: 'سيرة مبسطة ومصورة للنبي محمد صلى الله عليه وسلم، مكتوبة خصيصاً للأطفال مع قصص ملهمة وأخلاق نبوية.',
    coverImage: 'https://example.com/seerah-kids.jpg',
    publishedYear: 2024,
    pages: 180,
    language: 'العربية',
    isbn: '978-9960-789-123-4',
    publisher: 'دار الطفل المسلم',
    tags: ['السيرة النبوية', 'الأطفال', 'القصص', 'الأخلاق'],
    downloads: 520,
    bookFile: {
      filename: 'seerah-kids-2024.pdf',
      originalName: 'السيرة_النبوية_للأطفال.pdf',
      size: 12582912, // 12MB
      mimetype: 'application/pdf',
      path: 'uploads/books/seerah-kids-2024.pdf'
    },
    searchKeywords: ['seerah', 'children', 'prophet', 'muhammad', 'stories', 'سيرة', 'أطفال'],
    isActive: true,
    views: 920,
    isFeatured: true
  },
  {
    title: 'Introduction to Islamic Philosophy',
    author: 'Prof. Hassan Al-Farabi',
    category: 'Islamic literature.',
    description: 'An accessible introduction to the major themes, figures, and developments in Islamic philosophical thought from the classical period to the present.',
    coverImage: 'https://example.com/islamic-philosophy.jpg',
    publishedYear: 2023,
    pages: 350,
    language: 'English',
    isbn: '978-0-987-65432-1',
    publisher: 'University of Islamic Studies Press',
    tags: ['Philosophy', 'Islamic Thought', 'Classical Period', 'Contemporary'],
    downloads: 195,
    bookFile: {
      filename: 'islamic-philosophy-2023.pdf',
      originalName: 'Introduction_to_Islamic_Philosophy.pdf',
      size: 18874368, // 18MB
      mimetype: 'application/pdf',
      path: 'uploads/books/islamic-philosophy-2023.pdf'
    },
    searchKeywords: ['philosophy', 'islamic', 'thought', 'classical', 'contemporary', 'farabi'],
    isActive: true,
    views: 420
  },
  {
    title: 'مقاصد الشريعة الإسلامية',
    author: 'د. عبد الرحمن الشاطبي',
    category: 'Islamic jurisprudence (Fiqh)',
    description: 'دراسة شاملة لمقاصد الشريعة الإسلامية وأثرها في الاجتهاد الفقهي المعاصر، مع تطبيقات عملية في القضايا المعاصرة.',
    coverImage: 'https://example.com/maqasid.jpg',
    publishedYear: 2023,
    pages: 520,
    language: 'العربية',
    isbn: '978-9960-456-789-1',
    publisher: 'دار المقاصد',
    tags: ['مقاصد الشريعة', 'الفقه', 'الاجتهاد', 'القضايا المعاصرة'],
    downloads: 380,
    bookFile: {
      filename: 'maqasid-2023.pdf',
      originalName: 'مقاصد_الشريعة_الإسلامية.pdf',
      size: 22020096, // 21MB
      mimetype: 'application/pdf',
      path: 'uploads/books/maqasid-2023.pdf'
    },
    searchKeywords: ['maqasid', 'sharia', 'jurisprudence', 'fiqh', 'contemporary', 'شريعة', 'فقه'],
    isActive: true,
    views: 720
  }
];

// Seed functions
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Hash passwords and create users
    for (let userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      userData.password = hashedPassword;
      
      // Add some download history for non-admin users
      if (userData.role === 'user') {
        userData.downloadHistory = [
          {
            bookTitle: 'Sample Book 1',
            downloadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          },
          {
            bookTitle: 'Sample Book 2',
            downloadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          }
        ];
        
        userData.recentDownloads = [
          {
            bookTitle: 'Recent Book 1',
            date: new Date().toLocaleDateString()
          }
        ];
      }
    }

    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

const seedScholars = async (adminUser) => {
  try {
    // Clear existing scholars
    await Scholar.deleteMany({});
    console.log('🗑️  Cleared existing scholars');

    // Add addedBy field to scholars
    const scholarsWithAdmin = sampleScholars.map(scholar => ({
      ...scholar,
      addedBy: adminUser._id
    }));

    const scholars = await Scholar.insertMany(scholarsWithAdmin);
    console.log(`✅ Created ${scholars.length} scholars`);
    return scholars;
  } catch (error) {
    console.error('❌ Error seeding scholars:', error);
    throw error;
  }
};

const seedBooks = async (adminUser, scholars) => {
  try {
    // Clear existing books
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing books');

    // Add addedBy field and randomly assign some books to scholars
    const booksWithAdmin = sampleBooks.map((book, index) => ({
      ...book,
      addedBy: adminUser._id,
      // Assign first two books to scholars
      scholarAuthor: index < 2 ? scholars[index % scholars.length]._id : null
    }));

    const books = await Book.insertMany(booksWithAdmin);
    console.log(`✅ Created ${books.length} books`);
    return books;
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    throw error;
  }
};

const seedDownloads = async (users, books, scholars) => {
  try {
    // Clear existing downloads
    await Download.deleteMany({});
    console.log('🗑️  Cleared existing downloads');

    const downloads = [];
    const regularUsers = users.filter(user => user.role === 'user');

    // Create sample downloads
    for (let i = 0; i < 50; i++) {
      const user = regularUsers[Math.floor(Math.random() * regularUsers.length)];
      const book = books[Math.floor(Math.random() * books.length)];
      const scholar = book.scholarAuthor ? scholars.find(s => s._id.equals(book.scholarAuthor)) : null;

      const download = {
        user: user._id,
        book: book._id,
        scholar: scholar ? scholar._id : null,
        downloadDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        downloadSize: book.bookFile ? book.bookFile.size : Math.floor(Math.random() * 20000000) + 5000000,
        status: 'completed',
        source: ['web', 'mobile', 'api'][Math.floor(Math.random() * 3)],
        bookTitle: book.title,
        bookCategory: book.category,
        bookLanguage: book.language,
        userEmail: user.email,
        scholarName: scholar ? scholar.name : null,
        downloadDuration: Math.floor(Math.random() * 30000) + 5000 // 5-35 seconds
      };

      downloads.push(download);
    }

    const createdDownloads = await Download.insertMany(downloads);
    console.log(`✅ Created ${createdDownloads.length} download records`);
    return createdDownloads;
  } catch (error) {
    console.error('❌ Error seeding downloads:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    // Initialize categories first
    await Category.initializeCategories();
    console.log('✅ Categories initialized');
    
    // Seed in order (due to dependencies)
    const users = await seedUsers();
    const adminUser = users.find(user => user.role === 'admin');
    
    const scholars = await seedScholars(adminUser);
    const books = await seedBooks(adminUser, scholars);
    const downloads = await seedDownloads(users, books, scholars);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📚 Books: ${books.length}`);
    console.log(`   👨‍🏫 Scholars: ${scholars.length}`);
    console.log(`   📥 Downloads: ${downloads.length}`);
    console.log(`   📂 Categories: ${await Category.countDocuments()}`);
    
    console.log('\n🔐 Admin Login Credentials:');
    console.log('   Email: admin@islamiclibrary.com');
    console.log('   Password: admin123456');
    
    console.log('\n📋 Test User Credentials:');
    console.log('   Email: ahmed@example.com');
    console.log('   Password: user123456');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Clear database function
const clearDatabase = async () => {
  try {
    console.log('🗑️  Clearing database...');
    
    await connectDB();
    
    await User.deleteMany({});
    await Book.deleteMany({});
    await Scholar.deleteMany({});
    await Download.deleteMany({});
    await Category.deleteMany({});
    
    console.log('✅ Database cleared successfully!');
    
  } catch (error) {
    console.error('❌ Database clearing failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Check command line arguments
const command = process.argv[2];

if (command === 'clear') {
  clearDatabase();
} else {
  seedDatabase();
}

module.exports = { seedDatabase, clearDatabase };