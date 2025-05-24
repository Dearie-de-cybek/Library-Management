export const mockScholars = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Professor of Ancient Literature",
    institution: "Oxford University",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba6fe65?w=300&h=300&fit=crop&crop=face",
    specialization: "Classical Studies",
    worksCount: 45,
    bio: "Renowned expert in ancient Greek and Roman literature with over 20 years of research experience.",
    works: [
      { id: 101, title: "Ancient Narratives Revisited", downloads: 1250, year: 2023 },
      { id: 102, title: "Classical Mythology in Modern Context", downloads: 890, year: 2022 }
    ]
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    title: "Distinguished Professor of Philosophy",
    institution: "Harvard University",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    specialization: "Ethics & Moral Philosophy",
    worksCount: 38,
    bio: "Leading voice in contemporary ethics and moral philosophy, bridging ancient wisdom with modern challenges.",
    works: [
      { id: 201, title: "Ethics in the Digital Age", downloads: 2100, year: 2024 },
      { id: 202, title: "Virtue Ethics Reconsidered", downloads: 1450, year: 2023 }
    ]
  },
  {
    id: 3,
    name: "Dr. Amara Okafor",
    title: "Chair of African Studies",
    institution: "Cambridge University",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    specialization: "African Literature & History",
    worksCount: 52,
    bio: "Pioneering researcher in African literary traditions and their global influence on modern scholarship.",
    works: [
      { id: 301, title: "Voices from the Continent", downloads: 1800, year: 2024 },
      { id: 302, title: "Colonial Narratives Deconstructed", downloads: 1200, year: 2023 }
    ]
  }
];

export const mockFeaturedBooks = [
  {
    id: 1,
    title: "The Digital Revolution in Academia",
    author: "Dr. Elena Rodriguez",
    category: "Technology",
    downloads: 3420,
    publishedYear: 2024,
    pages: 284,
    language: "English",
    isbn: "978-0-123456-78-9",
    description: "An comprehensive analysis of how digital transformation is reshaping academic institutions and research methodologies in the 21st century.",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    rating: 4.8,
    tags: ["Technology", "Education", "Digital Transformation"]
  },
  {
    id: 2,
    title: "Sustainable Development Goals: A Global Perspective",
    author: "Prof. James Mitchell",
    category: "Environmental Studies",
    downloads: 2890,
    publishedYear: 2023,
    pages: 356,
    language: "English",
    isbn: "978-0-987654-32-1",
    description: "A detailed examination of the UN Sustainable Development Goals and their implementation across different regions and cultures.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    rating: 4.6,
    tags: ["Environment", "Policy", "Global Development"]
  },
  {
    id: 3,
    title: "Cognitive Sciences and Human Behavior",
    author: "Dr. Lisa Park",
    category: "Psychology",
    downloads: 2156,
    publishedYear: 2024,
    pages: 298,
    language: "English",
    isbn: "978-0-456789-01-2",
    description: "Exploring the latest research in cognitive science and its applications in understanding human behavior and decision-making processes.",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    rating: 4.7,
    tags: ["Psychology", "Cognitive Science", "Research"]
  },
  {
    id: 4,
    title: "Quantum Computing: Theory and Practice",
    author: "Prof. David Kim",
    category: "Computer Science",
    downloads: 1987,
    publishedYear: 2024,
    pages: 445,
    language: "English",
    isbn: "978-0-246810-13-5",
    description: "A comprehensive guide to quantum computing principles, algorithms, and real-world applications in modern technology.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    rating: 4.9,
    tags: ["Quantum Computing", "Technology", "Computer Science"]
  },
  {
    id: 5,
    title: "Global Economic Trends in the Post-Pandemic Era",
    author: "Dr. Sarah Thompson",
    category: "Economics",
    downloads: 1765,
    publishedYear: 2023,
    pages: 312,
    language: "English",
    isbn: "978-0-135791-24-6",
    description: "An analysis of economic patterns and recovery strategies following the global pandemic, with insights for future economic policy.",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
    rating: 4.5,
    tags: ["Economics", "Global Trends", "Policy Analysis"]
  },
  {
    id: 6,
    title: "Artificial Intelligence Ethics",
    author: "Prof. Alex Johnson",
    category: "Technology",
    downloads: 1543,
    publishedYear: 2024,
    pages: 267,
    language: "English",
    isbn: "978-0-864209-75-3",
    description: "Examining the ethical implications of AI development and deployment, with frameworks for responsible AI implementation.",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=600&fit=crop",
    rating: 4.8,
    tags: ["AI Ethics", "Technology", "Philosophy"]
  }
];

// API service functions - these will replace the mock data
class LibraryService {
  // When building the backend, replace these with actual API calls
  
  static async getScholars() {
    // TODO: Replace with actual API call
    // return await fetch('/api/scholars').then(res => res.json());
    return new Promise(resolve => {
      setTimeout(() => resolve(mockScholars), 500);
    });
  }

  static async getScholarById(id) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/scholars/${id}`).then(res => res.json());
    return new Promise(resolve => {
      const scholar = mockScholars.find(s => s.id === id);
      setTimeout(() => resolve(scholar), 300);
    });
  }

  static async getScholarWorks(scholarId) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/scholars/${scholarId}/works`).then(res => res.json());
    return new Promise(resolve => {
      const scholar = mockScholars.find(s => s.id === scholarId);
      setTimeout(() => resolve(scholar?.works || []), 300);
    });
  }

  static async getFeaturedBooks() {
    // TODO: Replace with actual API call
    // return await fetch('/api/books/featured').then(res => res.json());
    return new Promise(resolve => {
      setTimeout(() => resolve(mockFeaturedBooks), 500);
    });
  }

  static async getBookById(id) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/books/${id}`).then(res => res.json());
    return new Promise(resolve => {
      const book = mockFeaturedBooks.find(b => b.id === id);
      setTimeout(() => resolve(book), 300);
    });
  }

  static async getBooksByCategory(category) {
    // TODO: Replace with actual API call
    // return await fetch(`/api/books/category/${category}`).then(res => res.json());
    return new Promise(resolve => {
      const books = mockFeaturedBooks.filter(b => b.category === category);
      setTimeout(() => resolve(books), 300);
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
      setTimeout(() => resolve(results), 400);
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
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }
}

export default LibraryService;

// Utility functions for data processing
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

  sortBooksByRating: (books) => {
    return [...books].sort((a, b) => b.rating - a.rating);
  },

  sortBooksByYear: (books) => {
    return [...books].sort((a, b) => b.publishedYear - a.publishedYear);
  }
};