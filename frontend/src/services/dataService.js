import apiService from './apiService';

class LibraryService {
  // Books Methods
  async getFeaturedBooks() {
    try {
      const response = await apiService.getFeaturedBooks();
      return response.data || response;
    } catch (error) {
      console.error('Error fetching featured books:', error);
      // Return empty array as fallback
      return [];
    }
  }

  async getAllBooks(params = {}) {
    try {
      const response = await apiService.getBooks(params);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }

  async getBook(id) {
    try {
      const response = await apiService.getBook(id);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }

  async searchBooks(query, filters = {}) {
    try {
      const response = await apiService.searchBooks(query, filters);
      return response.data || response;
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  async downloadBook(bookId) {
    try {
      const response = await apiService.downloadBook(bookId);
      return response.data || response;
    } catch (error) {
      console.error('Error downloading book:', error);
      throw error;
    }
  }

  async createBook(bookData) {
    try {
      const response = await apiService.createBook(bookData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }

  async updateBook(id, bookData) {
    try {
      const response = await apiService.updateBook(id, bookData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }

  async deleteBook(id) {
    try {
      const response = await apiService.deleteBook(id);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }

  // Scholars Methods
  async getScholars(params = {}) {
    try {
      const response = await apiService.getScholars(params);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching scholars:', error);
      return [];
    }
  }

  async getScholar(id) {
    try {
      const response = await apiService.getScholar(id);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching scholar:', error);
      throw error;
    }
  }

  async getScholarWorks(scholarId) {
    try {
      const response = await apiService.getScholarWorks(scholarId);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching scholar works:', error);
      return [];
    }
  }

  async createScholar(scholarData) {
    try {
      const response = await apiService.createScholar(scholarData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating scholar:', error);
      throw error;
    }
  }

  async updateScholar(id, scholarData) {
    try {
      const response = await apiService.updateScholar(id, scholarData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating scholar:', error);
      throw error;
    }
  }

  async deleteScholar(id) {
    try {
      const response = await apiService.deleteScholar(id);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting scholar:', error);
      throw error;
    }
  }

  // Users Methods (Admin only)
  async getAllUsers(params = {}) {
    try {
      const response = await apiService.getAllUsers(params);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async getUser(id) {
    try {
      const response = await apiService.getUser(id);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUserStatus(userId, action) {
    try {
      const response = await apiService.updateUserStatus(userId, action);
      return response.data || response;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const response = await apiService.deleteUser(id);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Analytics Methods
  async getAdminStats() {
    try {
      const response = await apiService.getAdminStats();
      return response.data || response;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // Return default stats as fallback
      return {
        totalUsers: 0,
        totalBooks: 0,
        totalScholars: 0,
        totalDownloads: 0,
        recentActivity: []
      };
    }
  }

  async getDownloadStats(params = {}) {
    try {
      const response = await apiService.getDownloadStats(params);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching download stats:', error);
      return {};
    }
  }

  async getUserStats() {
    try {
      const response = await apiService.getUserStats();
      return response.data || response;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {};
    }
  }

  // Downloads Methods
  async getDownloads(params = {}) {
    try {
      const response = await apiService.getDownloads(params);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching downloads:', error);
      return [];
    }
  }

  async getUserDownloads(userId) {
    try {
      const response = await apiService.getUserDownloads(userId);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching user downloads:', error);
      return [];
    }
  }

  // Categories Methods
  async getCategories() {
    try {
      const response = await apiService.getCategories();
      return response.data || response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Auth Methods (exposed for convenience)
  async login(credentials) {
    try {
      const response = await apiService.login(credentials);
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await apiService.register(userData);
      return response;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await apiService.logout();
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      // Still return true since local storage is cleared regardless
      return true;
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiService.getCurrentUser();
      return response.data || response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  async updateProfile(userData) {
    try {
      const response = await apiService.updateProfile(userData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await apiService.changePassword(passwordData);
      return response.data || response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Utility Methods
  isAuthenticated() {
    return apiService.isAuthenticated();
  }

  getCurrentUserFromStorage() {
    return apiService.getCurrentUserFromStorage();
  }

  isAdmin() {
    return apiService.isAdmin();
  }

  async healthCheck() {
    try {
      const response = await apiService.healthCheck();
      return response;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const libraryService = new LibraryService();
export default libraryService;