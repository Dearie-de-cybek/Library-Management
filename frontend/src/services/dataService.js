export const mockScholars = [
  {
    id: 1,
    name: "Dr. Yusuf Al-Qaradawi",
    title: "Contemporary Scholar and Jurist",
    institution: "International Union of Muslim Scholars",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    specialization: "Contemporary Islamic Jurisprudence",
    worksCount: 120,
    bio: "Influential Muslim scholar, known for his contemporary fatwas and contributions to modern Islamic jurisprudence. He plays a prominent role in applying Islamic law to contemporary issues.",
    works: [
      { id: 101, title: "The Lawful and Prohibited in Islam", downloads: 45000, year: 2020 },
      { id: 102, title: "Fiqh of Zakat", downloads: 32000, year: 2019 }
    ]
  },
  {
    id: 2,
    name: "Dr. Tariq Al-Suwaidan",
    title: "Islamic Preacher and Historian",
    institution: "Intellectual Creativity Foundation",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    specialization: "Islamic History and Da'wah",
    worksCount: 85,
    bio: "Kuwaiti historian and preacher, specialized in Islamic history and Islamic civilization. He has made significant contributions to spreading awareness of Islamic history.",
    works: [
      { id: 201, title: "Makers of History", downloads: 28000, year: 2021 },
      { id: 202, title: "Lost Andalusia", downloads: 22000, year: 2020 }
    ]
  },
  {
    id: 3,
    name: "Dr. Ragheb Al-Sirjani",
    title: "Islamic Historian and Writer",
    institution: "Story of Islam Website",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba6fe65?w=300&h=300&fit=crop&crop=face",
    specialization: "History and Islamic Civilization",
    worksCount: 95,
    bio: "Egyptian historian specialized in Islamic history, known for his simplified approach to presenting Islamic history and Islamic civilization.",
    works: [
      { id: 301, title: "Story of Andalusia", downloads: 38000, year: 2022 },
      { id: 302, title: "What Muslims Gave to the World", downloads: 31000, year: 2021 }
    ]
  }
];

export const mockFeaturedBooks = [
  {
    id: 1,
    title: "Understanding the Holy Quran in the Technology Age",
    author: "Dr. Ahmad Al-Zahrani",
    category: "Quranic Sciences",
    downloads: 52000,
    publishedYear: 2023,
    pages: 420,
    language: "Arabic",
    isbn: "978-0-123456-78-9",
    description: "A contemporary study on understanding the Holy Quran and applying its teachings in the age of modern technology, focusing on contemporary challenges and Islamic solutions.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    tags: ["Holy Quran", "Technology", "Contemporary Jurisprudence"]
  },
  {
    id: 2,
    title: "Islamic Economics: Theory and Application",
    author: "Dr. Muhammad Abdul Mun'im",
    category: "Islamic Economics",
    downloads: 34000,
    publishedYear: 2022,
    pages: 380,
    language: "Arabic",
    isbn: "978-0-987654-32-1",
    description: "A comprehensive look at Islamic economics, its principles and applications in the contemporary world, with case studies from different countries.",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
    tags: ["Islamic Economics", "Islamic Banking", "Finance"]
  },
  {
    id: 3,
    title: "Islamic Education Methods for Children",
    author: "Dr. Fatima Al-Alawi",
    category: "Islamic Education",
    downloads: 28000,
    publishedYear: 2023,
    pages: 320,
    language: "Arabic",
    isbn: "978-0-456789-01-2",
    description: "A comprehensive guide to Islamic education for children in the modern age, combining authenticity and modernity in educational methods.",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    tags: ["Islamic Education", "Child Rearing", "Islamic Values"]
  },
  {
    id: 4,
    title: "Islamic Commercial Law (Fiqh al-Mu'amalat)",
    author: "Dr. Abdullah Al-Ghamdi",
    category: "Islamic Jurisprudence",
    downloads: 41000,
    publishedYear: 2022,
    pages: 500,
    language: "Arabic",
    isbn: "978-0-246810-13-5",
    description: "A detailed study of Islamic commercial law with contemporary applications and solutions for modern issues in trade and business.",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    tags: ["Islamic Jurisprudence", "Commercial Law", "Islamic Trade"]
  },
  {
    id: 5,
    title: "Prophetic Biography: Lessons and Teachings",
    author: "Dr. Muhammad Al-Ashqar",
    category: "Prophetic Biography",
    downloads: 47000,
    publishedYear: 2023,
    pages: 450,
    language: "Arabic",
    isbn: "978-0-135791-24-6",
    description: "A comprehensive presentation of the Prophetic biography with extracted lessons and morals for the contemporary Muslim, and applying the Prophetic model in modern life.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    tags: ["Prophetic Biography", "Prophetic Example", "Islamic History"]
  },
  {
    id: 6,
    title: "Objectives of Islamic Sharia (Maqasid al-Sharia)",
    author: "Dr. Ahmad Al-Raysuni",
    category: "Principles of Jurisprudence",
    downloads: 39000,
    publishedYear: 2022,
    pages: 380,
    language: "Arabic",
    isbn: "978-0-864209-75-3",
    description: "A contemporary study of the objectives of Islamic Sharia and their applications in contemporary jurisprudence, focusing on flexibility and constancy in Sharia.",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=600&fit=crop",
    tags: ["Sharia Objectives", "Principles of Jurisprudence", "Contemporary Jurisprudence"]
  }
];

// API service functions - these will replace the mock data
class LibraryService {
  // When building the backend, replace these with actual API calls
  
  static async getScholars() {
    // TODO: Replace with actual API call
    // return await fetch('/api/scholars').then(res => res.json());
    return new Promise(resolve => {
      setTimeout(() => resolve(mockScholars), 800);
    });
  }

  static async getScholarById(id) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/scholars/${id}`).then(res => res.json());
    return new Promise(resolve => {
      const scholar = mockScholars.find(s => s.id === id);
      setTimeout(() => resolve(scholar), 500);
    });
  }

  static async getScholarWorks(scholarId) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/scholars/${scholarId}/works`).then(res => res.json());
    return new Promise(resolve => {
      const scholar = mockScholars.find(s => s.id === scholarId);
      setTimeout(() => resolve(scholar?.works || []), 400);
    });
  }

  static async getFeaturedBooks() {
    // TODO: Replace with actual API call
    // return await fetch('/api/books/featured').then(res => res.json());
    return new Promise(resolve => {
      setTimeout(() => resolve(mockFeaturedBooks), 800);
    });
  }

  static async getBookById(id) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/books/${id}`).then(res => res.json());
    return new Promise(resolve => {
      const book = mockFeaturedBooks.find(b => b.id === id);
      setTimeout(() => resolve(book), 400);
    });
  }

  static async getBooksByCategory(category) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/books/category/${category}`).then(res => res.json());
    return new Promise(resolve => {
      const books = mockFeaturedBooks.filter(b => b.category === category);
      setTimeout(() => resolve(books), 500);
    });
  }

  static async searchBooks(query) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/books/search?q=${query}`).then(res => res.json());
    return new Promise(resolve => {
      const results = mockFeaturedBooks.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.description.toLowerCase().includes(query.toLowerCase())
      );
      setTimeout(() => resolve(results), 600);
    });
  }

  static async adminLogin(credentials) {
    // TODO: Replace with actual authentication API call
    // return await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // }).then(res => res.json());
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          resolve({ 
            success: true, 
            token: 'mock-jwt-token',
            user: { id: 1, username: 'admin', role: 'administrator' }
          });
        } else {
          reject(new Error('Invalid login credentials'));
        }
      }, 1200);
    });
  }

  // Admin Dashboard Functions
  static async getAdminStats() {
    // TODO: Replace with actual API call
    // return await fetch('/api/admin/stats').then(res => res.json());
    return new Promise(resolve => {
      setTimeout(() => resolve({
        totalUsers: 2847,
        totalBooks: 156,
        totalScholars: 23,
        totalDownloads: 125430,
        recentActivity: [
          {
            type: 'download',
            title: 'New book download',
            description: 'Ahmad Muhammad downloaded "Fiqh of Zakat"',
            time: '5 minutes ago'
          },
          {
            type: 'user',
            title: 'New user',
            description: 'Fatima Ali joined the platform',
            time: '15 minutes ago'
          },
          {
            type: 'book',
            title: 'Book added',
            description: 'Added book "Contemporary Prophetic Biography"',
            time: '1 hour ago'
          }
        ]
      }), 800);
    });
  }

  static async getAllUsers() {
    // TODO: Replace with actual API call
    // return await fetch('/api/admin/users').then(res => res.json());
    return new Promise(resolve => {
      setTimeout(() => resolve([
        {
          id: 1,
          name: 'Ahmad Muhammad Ali',
          email: 'ahmed.mohamed@example.com',
          joinDate: '2024-01-15',
          lastActive: '2024-05-20',
          status: 'active',
          isPremium: true,
          totalDownloads: 45,
          monthlyDownloads: 12,
          favoriteCategory: 'Quranic Sciences',
          recentDownloads: [
            { bookTitle: 'Fiqh of Zakat', date: '2024-05-19' },
            { bookTitle: 'Prophetic Biography', date: '2024-05-18' },
            { bookTitle: 'Principles of Jurisprudence', date: '2024-05-17' }
          ]
        },
        {
          id: 2,
          name: 'Fatima Abdul Rahman',
          email: 'fatima.abdelrahman@example.com',
          joinDate: '2024-02-20',
          lastActive: '2024-05-21',
          status: 'active',
          isPremium: false,
          totalDownloads: 23,
          monthlyDownloads: 8,
          favoriteCategory: 'Prophetic Traditions',
          recentDownloads: [
            { bookTitle: 'Sahih Bukhari', date: '2024-05-20' },
            { bookTitle: 'Riyadh as-Salihin', date: '2024-05-19' }
          ]
        },
        {
          id: 3,
          name: 'Yusuf Al-Ahmad',
          email: 'yusuf.ahmad@example.com',
          joinDate: '2024-03-10',
          lastActive: '2024-05-15',
          status: 'inactive',
          isPremium: false,
          totalDownloads: 8,
          monthlyDownloads: 2,
          favoriteCategory: 'Quranic Exegesis',
          recentDownloads: [
            { bookTitle: 'Tafsir Ibn Kathir', date: '2024-05-10' }
          ]
        },
        {
          id: 4,
          name: 'Aisha Al-Salem',
          email: 'aisha.salem@example.com',
          joinDate: '2024-04-05',
          lastActive: '2024-05-22',
          status: 'active',
          isPremium: true,
          totalDownloads: 67,
          monthlyDownloads: 25,
          favoriteCategory: 'Islamic Jurisprudence',
          recentDownloads: [
            { bookTitle: 'Al-Mughni by Ibn Qudamah', date: '2024-05-22' },
            { bookTitle: 'Al-Muwatta by Imam Malik', date: '2024-05-21' },
            { bookTitle: 'Fath al-Bari', date: '2024-05-20' }
          ]
        },
        {
          id: 5,
          name: 'Muhammad Al-Sharif',
          email: 'mohammed.sharif@example.com',
          joinDate: '2024-01-30',
          lastActive: '2024-05-23',
          status: 'active',
          isPremium: false,
          totalDownloads: 34,
          monthlyDownloads: 15,
          favoriteCategory: 'Prophetic Biography',
          recentDownloads: [
            { bookTitle: 'Ar-Raheeq Al-Makhtum', date: '2024-05-23' },
            { bookTitle: 'Zad al-Ma\'ad', date: '2024-05-22' }
          ]
        }
      ]), 600);
    });
  }

  static async updateUserStatus(userId, action) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/admin/users/${userId}/${action}`, {
    //   method: 'PATCH'
    // }).then(res => res.json());
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  }

  static async createScholar(scholarData) {
    // TODO: Replace with actual API call
    // return await fetch('/api/admin/scholars', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(scholarData)
    // }).then(res => res.json());
    return new Promise(resolve => {
      setTimeout(() => resolve({ 
        success: true, 
        id: Date.now(),
        message: 'Scholar added successfully'
      }), 1000);
    });
  }

  static async createBook(bookData) {
    // TODO: Replace with actual API call
    // return await fetch('/api/admin/books', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(bookData)
    // }).then(res => res.json());
    return new Promise(resolve => {
      setTimeout(() => resolve({ 
        success: true, 
        id: Date.now(),
        message: 'Book added successfully'
      }), 1000);
    });
  }
}

export default LibraryService;

// Export DataUtils separately
// export { DataUtils };

// Utility functions for Islamic library data processing
export const DataUtils = {
  formatDownloadCount: (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  },

  getBookCategories: () => {
    const categories = [...new Set(mockFeaturedBooks.map(book => book.category))];
    return categories.sort();
  },

  getScholarSpecializations: () => {
    const specializations = [...new Set(mockScholars.map(scholar => scholar.specialization))];
    return specializations.sort();
  },

  sortBooksByDownloads: (books) => {
    return [...books].sort((a, b) => b.downloads - a.downloads);
  },

  sortBooksByYear: (books) => {
    return [...books].sort((a, b) => b.publishedYear - a.publishedYear);
  },

  getIslamicCategories: () => {
    return [
      "Quranic Sciences",
      "Prophetic Traditions", 
      "Islamic Jurisprudence",
      "Islamic Creed",
      "Prophetic Biography",
      "Islamic History",
      "Islamic Economics",
      "Islamic Education",
      "Islamic Ethics",
      "Islamic Da'wah"
    ];
  },

  searchByArabicAndEnglish: (items, query) => {
    const searchQuery = query.toLowerCase();
    return items.filter(item => 
      (item.title && item.title.toLowerCase().includes(searchQuery)) ||
      (item.author && item.author.toLowerCase().includes(searchQuery)) ||
      (item.description && item.description.toLowerCase().includes(searchQuery)) ||
      (item.name && item.name.toLowerCase().includes(searchQuery)) ||
      (item.specialization && item.specialization.toLowerCase().includes(searchQuery))
    );
  }
};