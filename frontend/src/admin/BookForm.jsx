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
    language: 'العربية',
    isbn: '',
    publisher: '',
    tags: [],
    customTag: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

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

  const languages = ['العربية', 'English', 'Français', 'Deutsch', 'اردو', 'فارسی', 'Türkçe'];

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

    if (!formData.title.trim()) newErrors.title = 'عنوان الكتاب مطلوب';
    if (!formData.author.trim()) newErrors.author = 'اسم المؤلف مطلوب';
    if (!formData.category) newErrors.category = 'تصنيف الكتاب مطلوب';
    if (!formData.description.trim()) newErrors.description = 'وصف الكتاب مطلوب';
    if (!formData.publishedYear) newErrors.publishedYear = 'سنة النشر مطلوبة';
    if (!formData.pages || formData.pages < 1) newErrors.pages = 'عدد الصفحات مطلوب';
    if (!formData.coverImage.trim()) newErrors.coverImage = 'رابط صورة الغلاف مطلوب';

    // Validate URL
    if (formData.coverImage && !isValidUrl(formData.coverImage)) {
      newErrors.coverImage = 'رابط صورة الغلاف غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage('');
    setErrors({});
    
    try {
      const bookData = {
        ...formData,
        publishedYear: parseInt(formData.publishedYear),
        pages: parseInt(formData.pages),
        tags: formData.tags,
        searchKeywords: formData.tags // Add for backend search functionality
      };

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
        language: 'العربية',
        isbn: '',
        publisher: '',
        tags: [],
        customTag: ''
      });
      setErrors({});
      setSuccessMessage('تم إضافة الكتاب بنجاح! / Book added successfully!');
      
      if (onSuccess) onSuccess();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error creating book:', error);
      setErrors({ submit: error.message || 'حدث خطأ في إضافة الكتاب / Error occurred while adding book' });
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold mb-2" dir="rtl">إضافة كتاب جديد</h2>
          <p className="text-blue-100">Add New Islamic Book</p>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2" dir="rtl">
                عنوان الكتاب *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-emerald-200'
                }`}
                placeholder="مثال: فهم القرآن الكريم في عصر التكنولوجيا"
                dir="rtl"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" dir="rtl">
                اسم المؤلف *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.author ? 'border-red-500' : 'border-emerald-200'
                }`}
                placeholder="مثال: د. أحمد الزهراني"
                dir="rtl"
              />
              {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
            </div>

            {/* Publisher */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" dir="rtl">
                دار النشر
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: دار الفكر العربي"
                dir="rtl"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" dir="rtl">
              تصنيف الكتاب *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? 'border-red-500' : 'border-emerald-200'
              }`}
            >
              <option value="">اختر التصنيف</option>
              {islamicCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" dir="rtl">
              وصف الكتاب *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-emerald-200'
              }`}
              placeholder="اكتب وصفاً شاملاً عن محتوى الكتاب وأهدافه..."
              dir="rtl"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" dir="rtl">
              رابط صورة الغلاف *
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.coverImage ? 'border-red-500' : 'border-emerald-200'
              }`}
              placeholder="https://example.com/book-cover.jpg"
            />
            {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>}
            
            {/* Image Preview */}
            {formData.coverImage && isValidUrl(formData.coverImage) && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">معاينة الغلاف:</p>
                <img
                  src={formData.coverImage}
                  alt="Book cover preview"
                  className="w-32 h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Publication Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Publication Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" dir="rtl">
                سنة النشر *
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
              <label className="block text-sm font-semibold text-gray-700 mb-2" dir="rtl">
                عدد الصفحات *
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
              <label className="block text-sm font-semibold text-gray-700 mb-2" dir="rtl">
                لغة الكتاب
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
              <label className="block text-sm font-semibold text-gray-700 mb-2" dir="rtl">
                رقم ISBN
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
            <label className="block text-sm font-semibold text-gray-700 mb-2" dir="rtl">
              الكلمات المفتاحية
            </label>
            
            {/* Add Tag Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                name="customTag"
                value={formData.customTag}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أضف كلمة مفتاحية..."
                dir="rtl"
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
                إضافة
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
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  إضافة الكتاب
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