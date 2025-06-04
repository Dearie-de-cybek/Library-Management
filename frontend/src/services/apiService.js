const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

console.log('API_BASE_URL:', API_BASE_URL);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('Making API call to:', url);
    console.log('Headers:', this.getAuthHeaders());
    
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      console.log('Sending request with config:', {
        ...config,
        body: config.body ? `${config.body.substring(0, 100)}...` : 'No body'
      });

      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      let responseText = '';
      let data = null;
      
      try {
        responseText = await response.text();
        console.log('Raw response length:', responseText.length);
        console.log('Raw response preview:', responseText.substring(0, 500));
        
        if (responseText) {
          data = JSON.parse(responseText);
          console.log('Parsed data:', data);
        }
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        console.error('Response text:', responseText);
        throw new Error(`Server returned invalid response: ${responseText.substring(0, 200)}`);
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        if (data && data.message) {
          errorMessage = data.message;
        } else if (data && data.error) {
          errorMessage = data.error;
        } else if (responseText && !responseText.includes('{')) {
          // If response is not JSON (like HTML error page)
          errorMessage = `Server error: ${responseText.substring(0, 200)}`;
        }

        console.error('API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          method: options.method || 'GET',
          responsePreview: responseText.substring(0, 200)
        });

        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API Call Error:', error);
      console.error('URL:', url);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Cannot connect to server. Please check if the backend is running.');
      }
      
      // Handle timeout errors
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: The server took too long to respond.');
      }
      
      throw error;
    }
  }

  // Auth Methods
  async register(userData) {
    console.log('Registering user:', { ...userData, password: '[HIDDEN]' });
    const response = await this.apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response && response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async login(credentials) {
    console.log('Logging in user:', { ...credentials, password: '[HIDDEN]' });
    const response = await this.apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response && response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async logout() {
    try {
      await this.apiCall('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser() {
    return this.apiCall('/auth/me');
  }

  async updateProfile(userData) {
    return this.apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async changePassword(passwordData) {
    return this.apiCall('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }

  // Books Methods
  async getBooks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/books${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  }

  async getBook(id) {
    return this.apiCall(`/books/${id}`);
  }

  async getFeaturedBooks() {
    return this.apiCall('/books?featured=true&limit=10');
  }

  async getPopularBooks() {
    return this.apiCall('/books/popular');
  }

  async getRecentBooks() {
    return this.apiCall('/books/recent');
  }

  async searchBooks(query, filters = {}) {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return this.apiCall(`/books/search?${queryString}`);
  }

  async createBook(bookData) {
    console.log('Creating book with data length:', JSON.stringify(bookData).length);
    return this.apiCall('/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  }

  async updateBook(id, bookData) {
    return this.apiCall(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
  }

  async deleteBook(id) {
    return this.apiCall(`/books/${id}`, { method: 'DELETE' });
  }

  // Scholars Methods
  async getScholars(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/scholars${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  }

  async getScholar(id) {
    return this.apiCall(`/scholars/${id}`);
  }

  async getScholarBooks(scholarId) {
    return this.apiCall(`/scholars/${scholarId}/books`);
  }

  async createScholar(scholarData) {
    const payloadSize = JSON.stringify(scholarData).length;
    console.log('Creating scholar - payload size:', payloadSize, 'bytes');
    console.log('Auth token exists:', !!localStorage.getItem('authToken'));
    
    // Check payload size (limit to 10MB)
    if (payloadSize > 10 * 1024 * 1024) {
      throw new Error('Payload too large. Please reduce image size or remove image.');
    }
    
    return this.apiCall('/scholars', {
      method: 'POST',
      body: JSON.stringify(scholarData)
    });
  }

  async updateScholar(id, scholarData) {
    return this.apiCall(`/scholars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scholarData)
    });
  }

  async deleteScholar(id) {
    return this.apiCall(`/scholars/${id}`, { method: 'DELETE' });
  }

  // Users Methods (Admin only)
  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  }

  async getUser(id) {
    return this.apiCall(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async updateUserStatus(userId, status) {
    return this.apiCall(`/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async deleteUser(id) {
    return this.apiCall(`/users/${id}`, { method: 'DELETE' });
  }

  // Downloads Methods
  async downloadBook(bookId) {
    return this.apiCall(`/downloads/book/${bookId}`, { method: 'POST' });
  }

  async getDownloads(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/downloads${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  }

  async getUserDownloads(userId) {
    return this.apiCall(`/downloads/user/${userId}`);
  }

  async getMyDownloads() {
    return this.apiCall('/downloads/my-downloads');
  }

  async getMyDownloadStats() {
    return this.apiCall('/downloads/my-stats');
  }

  // Analytics Methods (Admin only)
  async getAdminStats() {
    return this.apiCall('/users/dashboard');
  }

  async getDownloadStats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/downloads/analytics${queryString ? `?${queryString}` : ''}`;
    return this.apiCall(endpoint);
  }

  // Categories Methods
  async getCategories() {
    return this.apiCall('/categories');
  }

  // Health Check
  async healthCheck() {
    return this.apiCall('/');
  }

  // Token Refresh
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.apiCall('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      });

      if (response && response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      return response;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  }

  // Helper Methods
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAdmin() {
    const user = this.getCurrentUserFromStorage();
    return user?.role === 'admin';
  }
}

const apiService = new ApiService();
export default apiService;