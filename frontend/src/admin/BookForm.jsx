/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LibraryService from '../services/dataService';

const BookForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    coverImage: '',
    publishedYear: '',
    pages: '',
    language: 'English', // Fixed: Changed from Arabic to English
    isbn: '',
    publisher: '',
    tags: [],
    customTag: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fixed Islamic categories as specified
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

  // Fixed: Only English as per backend model
  const languages = ['English'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resizeImage = (file, maxWidth = 400, maxHeight = 600, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, coverImage: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, coverImage: 'Image size should be less than 5MB' }));
      return;
    }

    setUploadingImage(true);
    setImageFile(file);

    try {
      // Resize and compress the image (book covers are typically taller)
      const compressedBase64 = await resizeImage(file, 400, 600, 0.8);
      
      // Check compressed size
      const compressedSize = compressedBase64.length * 0.75; // Approximate size
      console.log('Original file size:', file.size, 'Compressed size:', compressedSize);
      
      if (compressedSize > 500 * 1024) { // If still larger than 500KB, compress more
        const smallerBase64 = await resizeImage(file, 300, 450, 0.6);
        setImagePreview(smallerBase64);
        setFormData(prev => ({ ...prev, coverImage: smallerBase64 }));
      } else {
        setImagePreview(compressedBase64);
        setFormData(prev => ({ ...prev, coverImage: compressedBase64 }));
      }
      
      setUploadingImage(false);
      
      // Clear any previous image errors
      if (errors.coverImage) {
        setErrors(prev => ({ ...prev, coverImage: '' }));
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setUploadingImage(false);
      setErrors(prev => ({ ...prev, coverImage: 'Error processing image. Please try a different image.' }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, coverImage: '' }));
    // Reset the file input
    const fileInput = document.getElementById('book-cover-image');
    if (fileInput) fileInput.value = '';
  };

  const addTag = () => {
    if (formData.customTag.trim() && !formData.tags.includes(formData.customTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.customTag.trim()],
        customTag: ''
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Book title is required';
    if (!formData.author.trim()) newErrors.author = 'Author name is required';
    if (!formData.category) newErrors.category = 'Book category is required';
    if (!formData.description.trim()) newErrors.description = 'Book description is required';
    if (!formData.publishedYear) newErrors.publishedYear = 'Publication year is required';
    if (!formData.pages || formData.pages < 1) newErrors.pages = 'Number of pages is required';
    if (!formData.coverImage.trim()) newErrors.coverImage = 'Book cover image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage('');
    setErrors({});
    
    try {
      // Check authentication first
      const authToken = localStorage.getItem('authToken');
      console.log('Auth token exists:', !!authToken);
      
      if (!authToken) {
        throw new Error('You must be logged in to create a book');
      }

      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        description: formData.description.trim(),
        coverImage: formData.coverImage,
        publishedYear: parseInt(formData.publishedYear, 10),
        pages: parseInt(formData.pages, 10),
        language: formData.language, // This should be 'English'
        tags: formData.tags,
        searchKeywords: formData.tags
      };

      // Add optional fields only if they have values
      if (formData.isbn && formData.isbn.trim()) {
        bookData.isbn = formData.isbn.trim();
      }

      if (formData.publisher && formData.publisher.trim()) {
        bookData.publisher = formData.publisher.trim();
      }

      // Check payload size
      const payloadSize = JSON.stringify(bookData).length;
      console.log('Payload size:', payloadSize, 'bytes');

      // Log the exact payload being sent
      console.log('=== BOOK DATA BEING SENT ===');
      console.log(JSON.stringify({
        ...bookData,
        coverImage: bookData.coverImage ? `[IMAGE_DATA_${bookData.coverImage.length}_CHARS]` : 'NO_IMAGE'
      }, null, 2));
      console.log('=== END PAYLOAD ===');

      const response = await LibraryService.createBook(bookData);
      console.log('Book created successfully:', response);
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        category: '',
        description: '',
        coverImage: '',
        publishedYear: '',
        pages: '',
        language: 'English',
        isbn: '',
        publisher: '',
        tags: [],
        customTag: ''
      });
      removeImage();
      setErrors({});
      setSuccessMessage('Book added successfully!');
      
      if (onSuccess) onSuccess();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error creating book:', error);
      
      let errorMessage = 'Error occurred while adding book';
      
      if (error.message.includes('You must be logged in')) {
        errorMessage = 'Authentication error: Please log in again';
      } else if (error.message.includes('Validation failed')) {
        errorMessage = 'Validation failed: Please check all fields and try again. Make sure you are logged in as an admin.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication error: Please log in as an admin';
      } else if (error.message.includes('403')) {
        errorMessage = 'Permission denied: Admin access required';
      } else if (error.message.includes('Payload too large')) {
        errorMessage = 'Image is too large. Try uploading a smaller image.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. The image might be too large. Try a smaller image.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWithoutImage = async () => {
    // Temporarily remove image and submit
    const originalImage = formData.coverImage;
    setFormData(prev => ({ ...prev, coverImage: '' }));
    
    try {
      await handleSubmit();
    } finally {
      // Restore image if submission failed
      if (originalImage) {
        setFormData(prev => ({ ...prev, coverImage: originalImage }));
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Add New Islamic Book</h2>
          <p className="text-blue-100">Register a new book in the Islamic library</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.submit}
            </div>
          </motion.div>
        )}

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-emerald-200'
                }`}
                placeholder="e.g., Understanding the Quran in the Digital Age"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Author Name *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.author ? 'border-red-500' : 'border-emerald-200'
                }`}
                placeholder="e.g., Dr. Ahmad Al-Zahra"
              />
              {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
            </div>

            {/* Publisher */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Publisher
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Dar Al-Fikr Publishing"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Book Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? 'border-red-500' : 'border-emerald-200'
              }`}
            >
              <option value="">Select Category</option>
              {islamicCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Book Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-emerald-200'
              }`}
              placeholder="Write a comprehensive description about the book's content and objectives..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Book Cover Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Book Cover Image *
            </label>
            
            {/* Upload Area */}
            <div className="space-y-4">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <label htmlFor="book-cover-image" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                          Click to upload book cover
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                          Images will be automatically resized and optimized
                        </span>
                        <span className="block text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </label>
                      <input
                        id="book-cover-image"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <img 
                      src={imagePreview} 
                      alt="Book cover preview" 
                      className="w-16 h-24 object-cover rounded-lg border border-blue-300"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800">
                        {imageFile?.name || 'Book cover uploaded'}
                      </p>
                      <p className="text-xs text-blue-600">
                        {imageFile?.size ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : 'Image ready'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {uploadingImage && (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-blue-600">Processing image...</span>
                </div>
              )}

              {errors.coverImage && <p className="text-red-500 text-sm">{errors.coverImage}</p>}
            </div>
          </div>

          {/* Publication Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Publication Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Publication Year *
              </label>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleInputChange}
                min="1400"
                max={new Date().getFullYear()}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.publishedYear ? 'border-red-500' : 'border-emerald-200'
                }`}
                placeholder="2024"
              />
              {errors.publishedYear && <p className="text-red-500 text-sm mt-1">{errors.publishedYear}</p>}
            </div>

            {/* Pages */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Pages *
              </label>
              <input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.pages ? 'border-red-500' : 'border-emerald-200'
                }`}
                placeholder="300"
              />
              {errors.pages && <p className="text-red-500 text-sm mt-1">{errors.pages}</p>}
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ISBN Number
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="978-0-123456-78-9"
              />
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Keywords & Tags
            </label>
            
            {/* Add Tag Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                name="customTag"
                value={formData.customTag}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a keyword or tag..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                Add
              </button>
            </div>

            {/* Display Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            {/* Try without image button - shown when there's an image and there was an error */}
            {formData.coverImage && errors.submit && (
              <button
                onClick={handleSubmitWithoutImage}
                disabled={loading || uploadingImage}
                className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Try Without Image
              </button>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={loading || uploadingImage}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Book
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookForm;