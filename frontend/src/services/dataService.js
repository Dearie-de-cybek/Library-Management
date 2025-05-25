export const mockScholars = [
  {
    id: 1,
    name: "د. يوسف القرضاوي",
    title: "عالم وفقيه معاصر",
    institution: "الاتحاد العالمي لعلماء المسلمين",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    specialization: "الفقه الإسلامي المعاصر",
    worksCount: 120,
    bio: "عالم مسلم مؤثر، معروف بفتاواه المعاصرة وإسهاماته في الفقه الإسلامي الحديث. له دور بارز في تطبيق الشريعة الإسلامية على القضايا المعاصرة.",
    works: [
      { id: 101, title: "الحلال والحرام في الإسلام", downloads: 45000, year: 2020 },
      { id: 102, title: "فقه الزكاة", downloads: 32000, year: 2019 }
    ]
  },
  {
    id: 2,
    name: "د. طارق السويدان",
    title: "داعية ومؤرخ إسلامي",
    institution: "مؤسسة الإبداع الفكري",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    specialization: "التاريخ الإسلامي والدعوة",
    worksCount: 85,
    bio: "مؤرخ وداعية كويتي، متخصص في التاريخ الإسلامي والحضارة الإسلامية. له إسهامات كبيرة في نشر الوعي بالتاريخ الإسلامي.",
    works: [
      { id: 201, title: "صناع التاريخ", downloads: 28000, year: 2021 },
      { id: 202, title: "الأندلس المفقود", downloads: 22000, year: 2020 }
    ]
  },
  {
    id: 3,
    name: "د. راغب السرجاني",
    title: "مؤرخ وكاتب إسلامي",
    institution: "موقع قصة الإسلام",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba6fe65?w=300&h=300&fit=crop&crop=face",
    specialization: "التاريخ والحضارة الإسلامية",
    worksCount: 95,
    bio: "مؤرخ مصري متخصص في التاريخ الإسلامي، معروف بأسلوبه المبسط في عرض التاريخ الإسلامي والحضارة الإسلامية.",
    works: [
      { id: 301, title: "قصة الأندلس", downloads: 38000, year: 2022 },
      { id: 302, title: "ماذا قدم المسلمون للعالم", downloads: 31000, year: 2021 }
    ]
  }
];

export const mockFeaturedBooks = [
  {
    id: 1,
    title: "فهم القرآن الكريم في عصر التكنولوجيا",
    author: "د. أحمد الزهراني",
    category: "علوم القرآن",
    downloads: 52000,
    publishedYear: 2023,
    pages: 420,
    language: "العربية",
    isbn: "978-0-123456-78-9",
    description: "دراسة معاصرة لفهم القرآن الكريم وتطبيق تعاليمه في عصر التكنولوجيا الحديثة، مع التركيز على التحديات المعاصرة والحلول الإسلامية.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    tags: ["القرآن الكريم", "التكنولوجيا", "الفقه المعاصر"]
  },
  {
    id: 2,
    title: "الاقتصاد الإسلامي: النظرية والتطبيق",
    author: "د. محمد عبد المنعم",
    category: "الاقتصاد الإسلامي",
    downloads: 34000,
    publishedYear: 2022,
    pages: 380,
    language: "العربية",
    isbn: "978-0-987654-32-1",
    description: "نظرة شاملة على الاقتصاد الإسلامي ومبادئه وتطبيقاته في العالم المعاصر، مع دراسات حالة من دول مختلفة.",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
    tags: ["الاقتصاد الإسلامي", "البنوك الإسلامية", "التمويل"]
  },
  {
    id: 3,
    title: "منهج التربية الإسلامية للأطفال",
    author: "د. فاطمة العلوي",
    category: "التربية الإسلامية",
    downloads: 28000,
    publishedYear: 2023,
    pages: 320,
    language: "العربية",
    isbn: "978-0-456789-01-2",
    description: "دليل شامل للتربية الإسلامية للأطفال في العصر الحديث، يجمع بين الأصالة والمعاصرة في أساليب التربية.",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    tags: ["التربية الإسلامية", "تربية الأطفال", "القيم الإسلامية"]
  },
  {
    id: 4,
    title: "فقه المعاملات في الإسلام",
    author: "د. عبد الله الغامدي",
    category: "الفقه الإسلامي",
    downloads: 41000,
    publishedYear: 2022,
    pages: 500,
    language: "العربية",
    isbn: "978-0-246810-13-5",
    description: "دراسة مفصلة لفقه المعاملات في الإسلام مع التطبيقات المعاصرة والحلول للمسائل الحديثة في التجارة والأعمال.",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    tags: ["الفقه الإسلامي", "المعاملات", "التجارة الإسلامية"]
  },
  {
    id: 5,
    title: "السيرة النبوية: دروس ومواعظ",
    author: "د. محمد الأشقر",
    category: "السيرة النبوية",
    downloads: 47000,
    publishedYear: 2023,
    pages: 450,
    language: "العربية",
    isbn: "978-0-135791-24-6",
    description: "عرض شامل للسيرة النبوية مع استخلاص الدروس والعبر للمسلم المعاصر، وتطبيق النموذج النبوي في الحياة الحديثة.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    tags: ["السيرة النبوية", "القدوة النبوية", "التاريخ الإسلامي"]
  },
  {
    id: 6,
    title: "مقاصد الشريعة الإسلامية",
    author: "د. أحمد الريسوني",
    category: "أصول الفقه",
    downloads: 39000,
    publishedYear: 2022,
    pages: 380,
    language: "العربية",
    isbn: "978-0-864209-75-3",
    description: "دراسة معاصرة لمقاصد الشريعة الإسلامية وتطبيقاتها في الفقه المعاصر، مع التركيز على المرونة والثبات في الشريعة.",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=600&fit=crop",
    tags: ["مقاصد الشريعة", "أصول الفقه", "الفقه المعاصر"]
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
          reject(new Error('بيانات الدخول غير صحيحة'));
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
            title: 'تحميل كتاب جديد',
            description: 'قام أحمد محمد بتحميل كتاب "فقه الزكاة"',
            time: 'منذ 5 دقائق'
          },
          {
            type: 'user',
            title: 'مستخدم جديد',
            description: 'انضم فاطمة علي إلى المنصة',
            time: 'منذ 15 دقيقة'
          },
          {
            type: 'book',
            title: 'إضافة كتاب',
            description: 'تم إضافة كتاب "السيرة النبوية المعاصرة"',
            time: 'منذ ساعة'
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
          name: 'أحمد محمد علي',
          email: 'ahmed.mohamed@example.com',
          joinDate: '2024-01-15',
          lastActive: '2024-05-20',
          status: 'active',
          isPremium: true,
          totalDownloads: 45,
          monthlyDownloads: 12,
          favoriteCategory: 'علوم القرآن',
          recentDownloads: [
            { bookTitle: 'فقه الزكاة', date: '2024-05-19' },
            { bookTitle: 'السيرة النبوية', date: '2024-05-18' },
            { bookTitle: 'أصول الفقه', date: '2024-05-17' }
          ]
        },
        {
          id: 2,
          name: 'فاطمة عبد الرحمن',
          email: 'fatima.abdelrahman@example.com',
          joinDate: '2024-02-20',
          lastActive: '2024-05-21',
          status: 'active',
          isPremium: false,
          totalDownloads: 23,
          monthlyDownloads: 8,
          favoriteCategory: 'الحديث الشريف',
          recentDownloads: [
            { bookTitle: 'صحيح البخاري', date: '2024-05-20' },
            { bookTitle: 'رياض الصالحين', date: '2024-05-19' }
          ]
        },
        {
          id: 3,
          name: 'يوسف الأحمد',
          email: 'yusuf.ahmad@example.com',
          joinDate: '2024-03-10',
          lastActive: '2024-05-15',
          status: 'inactive',
          isPremium: false,
          totalDownloads: 8,
          monthlyDownloads: 2,
          favoriteCategory: 'التفسير',
          recentDownloads: [
            { bookTitle: 'تفسير ابن كثير', date: '2024-05-10' }
          ]
        },
        {
          id: 4,
          name: 'عائشة السالم',
          email: 'aisha.salem@example.com',
          joinDate: '2024-04-05',
          lastActive: '2024-05-22',
          status: 'active',
          isPremium: true,
          totalDownloads: 67,
          monthlyDownloads: 25,
          favoriteCategory: 'الفقه الإسلامي',
          recentDownloads: [
            { bookTitle: 'المغني لابن قدامة', date: '2024-05-22' },
            { bookTitle: 'الموطأ للإمام مالك', date: '2024-05-21' },
            { bookTitle: 'فتح الباري', date: '2024-05-20' }
          ]
        },
        {
          id: 5,
          name: 'محمد الشريف',
          email: 'mohammed.sharif@example.com',
          joinDate: '2024-01-30',
          lastActive: '2024-05-23',
          status: 'active',
          isPremium: false,
          totalDownloads: 34,
          monthlyDownloads: 15,
          favoriteCategory: 'السيرة النبوية',
          recentDownloads: [
            { bookTitle: 'الرحيق المختوم', date: '2024-05-23' },
            { bookTitle: 'زاد المعاد', date: '2024-05-22' }
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
        message: 'تم إضافة العالم بنجاح'
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
        message: 'تم إضافة الكتاب بنجاح'
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
      return `${(count / 1000000).toFixed(1)}م`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}ك`;
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
      "علوم القرآن",
      "الحديث الشريف", 
      "الفقه الإسلامي",
      "العقيدة الإسلامية",
      "السيرة النبوية",
      "التاريخ الإسلامي",
      "الاقتصاد الإسلامي",
      "التربية الإسلامية",
      "الأخلاق الإسلامية",
      "الدعوة الإسلامية"
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