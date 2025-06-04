/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import LibraryService from '../services/dataService';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('downloads');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const { user } = useAuth();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await LibraryService.getFeaturedBooks();
      // Ensure we always set an array, even if API returns something else
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading books:', error);
      // Set empty array on error
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  // FIXED: Updated download function with proper ID handling and user authentication check
  const handleDownloadBook = async (book) => {
    if (!book) {
      alert('Book information not available');
      return;
    }

    // Check if user is logged in
    if (!user) {
      alert('Please log in to download books');
      return;
    }
    
    // Get the correct book ID (try both _id and id)
    const bookId = book._id || book.id;
    if (!bookId) {
      alert('Book ID not found');
      return;
    }
    
    try {
      setDownloadLoading(true);
      
      console.log('Downloading book:', bookId);
      
      // Call the download API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/downloads/book/${bookId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Download response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download failed:', errorText);
        throw new Error(`Failed to download book: ${response.status} ${response.statusText}`);
      }

      // Get filename from response headers or use book title
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${book.title || 'Islamic_Book'}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          filename = decodeURIComponent(filename);
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Update book download count in local state
      setBooks(prevBooks => 
        prevBooks.map(b => 
          (b._id || b.id) === bookId 
            ? { ...b, downloads: (b.downloads || 0) + 1 }
            : b
        )
      );

      // Update selected book if it's the one being downloaded
      if (selectedBook && (selectedBook._id || selectedBook.id) === bookId) {
        setSelectedBook(prev => ({
          ...prev,
          downloads: (prev.downloads || 0) + 1
        }));
      }

      // Show success message
      alert(`"${book.title}" downloaded successfully!`);

    } catch (error) {
      console.error('Download error:', error);
      
      // More specific error messages
      if (error.message.includes('401')) {
        alert('You need to log in again to download this book');
      } else if (error.message.includes('403')) {
        alert('You do not have permission to download this book');
      } else if (error.message.includes('404')) {
        alert('Book file not found on server');
      } else if (error.message.includes('Network')) {
        alert('Network error. Please check your connection and try again');
      } else {
        alert(`Failed to download book: ${error.message}`);
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  // Filter and sort books with safety check
  const filteredBooks = (Array.isArray(books) ? books : [])
    .filter(book => {
      const matchesSearch = book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'author') return (a.author || '').localeCompare(b.author || '');
      if (sortBy === 'year') return (b.publishedYear || 0) - (a.publishedYear || 0);
      return 0;
    });

  // Local utility function for formatting download counts
  const formatDownloadCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Get categories from actual book data with safety check
  const categories = [...new Set((Array.isArray(books) ? books : []).map(book => book.category).filter(Boolean))].sort();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative">
      {/* Navbar */}
      <Navbar />
      
      {/* Paper texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: '4px 4px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
            Islamic Books Library
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-emerald-700 mb-6">
            Digital Book Collection
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-600 to-green-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            Discover our comprehensive collection of diverse Islamic books covering all aspects of Islamic sciences and religious knowledge
          </p>
          {user ? (
            <p className="text-sm text-emerald-600 mt-4">
              Welcome back, {user.name}! You can now download books.
            </p>
          ) : (
            <p className="text-sm text-amber-600 mt-4">
              Please log in to download books from our library.
            </p>
          )}
        </motion.div>

        {/* Advanced Search & Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-12 shadow-lg border border-emerald-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by title, author, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 text-emerald-700 focus:ring-emerald-500 focus:border-emerald-500 bg-white/90"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-3 px-4 border border-emerald-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/90"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-3 px-4 border border-emerald-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/90"
            >
              <option value="downloads">Most Downloaded</option>
              <option value="title">Alphabetical</option>
              <option value="author">By Author</option>
              <option value="year">Newest</option>
            </select>
          </div>

          {/* View Mode & Results */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-emerald-700 font-medium">
                {filteredBooks.length} books out of {Array.isArray(books) ? books.length : 0}
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-emerald-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-emerald-600 hover:bg-emerald-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-emerald-600 hover:bg-emerald-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Books Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book._id || book.id || index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-emerald-50 hover:border-emerald-200 cursor-pointer"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="relative">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Downloads badge - prominent */}
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white rounded-xl px-3 py-2 shadow-lg">
                      <div className="flex items-center gap-1 text-sm font-bold">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>{formatDownloadCount(book.downloads)}</span>
                      </div>
                    </div>

                    {/* View details overlay */}
                    <div className="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <button className="bg-white text-emerald-800 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                        {book.category}
                      </span>
                      <span className="text-xs text-gray-500">{book.publishedYear}</span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300">
                      {book.title}
                    </h3>
                    
                    <p className="text-emerald-700 text-sm font-semibold mb-2">{book.author}</p>
                    <p className="text-gray-600 text-xs line-clamp-2">{book.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-6">
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book._id || book.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-emerald-50 hover:border-emerald-200 cursor-pointer"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="flex p-6">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-24 h-32 object-cover rounded-xl mr-6 group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">
                            {book.title}
                          </h3>
                          <p className="text-emerald-700 font-semibold mb-1">{book.author}</p>
                          <span className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold">
                            {book.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-right">
                          <div className="text-center">
                            <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl">
                              <span className="font-bold">{formatDownloadCount(book.downloads)}</span>
                            </div>
                            <span className="text-xs text-gray-500 mt-1 block">downloads</span>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600 font-semibold">{book.pages}</div>
                            <span className="text-xs text-gray-500">pages</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-4">
                        {book.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {book.tags && book.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm">{book.publishedYear}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* No Results */}
        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <svg className="w-16 h-16 text-emerald-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Book Details</h3>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-96">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Book Cover */}
                  <div className="md:col-span-1">
                    <img
                      src={selectedBook.coverImage}
                      alt={selectedBook.title}
                      className="w-full rounded-2xl shadow-lg"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="md:col-span-2">
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">
                      {selectedBook.title}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <span className="text-gray-600 text-sm">Author:</span>
                        <p className="font-semibold text-emerald-700">{selectedBook.author}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Category:</span>
                        <p className="font-semibold text-emerald-700">{selectedBook.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Pages:</span>
                        <p className="font-semibold text-emerald-700">{selectedBook.pages} pages</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Published:</span>
                        <p className="font-semibold text-emerald-700">{selectedBook.publishedYear}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">ISBN:</span>
                        <p className="font-semibold text-sm text-emerald-700">{selectedBook.isbn || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Language:</span>
                        <p className="font-semibold text-emerald-700">{selectedBook.language}</p>
                      </div>
                    </div>

                    {/* Downloads Stats */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-2xl mb-6 border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-emerald-800">{selectedBook.downloads?.toLocaleString() || '0'}</p>
                          <p className="text-emerald-600 text-sm">Total Downloads</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h5 className="font-bold text-gray-900 mb-3">Description:</h5>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedBook.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {selectedBook.tags && selectedBook.tags.length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-bold text-gray-900 mb-3">Keywords:</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedBook.tags.map(tag => (
                            <span key={tag} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      {user ? (
                        <button 
                          onClick={() => handleDownloadBook(selectedBook)}
                          disabled={downloadLoading}
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 px-6 rounded-xl font-bold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {downloadLoading ? (
                            <>
                              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                              </svg>
                              Downloading...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Download Book
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex-1 bg-gray-300 text-gray-600 py-3 px-6 rounded-xl font-bold text-center">
                          Login Required to Download
                        </div>
                      )}
                      <button className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all duration-200">
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BooksPage;