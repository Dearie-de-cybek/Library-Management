/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LibraryService from '../services/dataService';

const ScholarForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    institution: '',
    specialization: '',
    bio: '',
    dateOfBirth: '',
    dateOfDeath: '',
    isAlive: true,
    image: '',
    works: [{ title: '', year: '', downloads: 0 }]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const specializations = [
    'Islamic Jurisprudence (Fiqh)',
    'Quranic Sciences',
    'Hadith Studies',
    'Islamic Theology (Aqeedah)',
    'Prophet\'s Biography (Seerah)',
    'Islamic History',
    'Quranic Exegesis (Tafsir)',
    'Principles of Jurisprudence (Usul al-Fiqh)',
    'Islamic Da\'wah',
    'Islamic Ethics',
    'Islamic Education',
    'Islamic Economics',
    'Islamic Philosophy',
    'Islamic Mysticism (Sufism)',
    'Objectives of Sharia (Maqasid)'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resizeImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
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
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }

    setUploadingImage(true);
    setImageFile(file);

    try {
      // Resize and compress the image
      const compressedBase64 = await resizeImage(file, 400, 400, 0.7);
      
      // Check compressed size
      const compressedSize = compressedBase64.length * 0.75; // Approximate size
      console.log('Original file size:', file.size, 'Compressed size:', compressedSize);
      
      if (compressedSize > 500 * 1024) { // If still larger than 500KB, compress more
        const smallerBase64 = await resizeImage(file, 200, 200, 0.5);
        setImagePreview(smallerBase64);
        setFormData(prev => ({ ...prev, image: smallerBase64 }));
      } else {
        setImagePreview(compressedBase64);
        setFormData(prev => ({ ...prev, image: compressedBase64 }));
      }
      
      setUploadingImage(false);
      
      // Clear any previous image errors
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setUploadingImage(false);
      setErrors(prev => ({ ...prev, image: 'Error processing image. Please try a different image.' }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
    // Reset the file input
    const fileInput = document.getElementById('scholar-image');
    if (fileInput) fileInput.value = '';
  };

  const handleWorkChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      works: prev.works.map((work, i) => 
        i === index ? { ...work, [field]: value } : work
      )
    }));
  };

  const addWork = () => {
    setFormData(prev => ({
      ...prev,
      works: [...prev.works, { title: '', year: '', downloads: 0 }]
    }));
  };

  const removeWork = (index) => {
    setFormData(prev => ({
      ...prev,
      works: prev.works.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Scholar name is required';
    if (!formData.title.trim()) newErrors.title = 'Scholar title is required';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.bio.trim()) newErrors.bio = 'Scholar biography is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.isAlive && !formData.dateOfDeath) {
      newErrors.dateOfDeath = 'Date of death is required for deceased scholars';
    }

    // Validate works
    formData.works.forEach((work, index) => {
      if (!work.title.trim()) {
        newErrors[`work_title_${index}`] = `Work title ${index + 1} is required`;
      }
      if (!work.year) {
        newErrors[`work_year_${index}`] = `Publication year for work ${index + 1} is required`;
      }
    });

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
        throw new Error('You must be logged in to create a scholar');
      }

      // Prepare scholar data to match backend expectations exactly
      const scholarData = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        specialization: formData.specialization,
        bio: formData.bio.trim(),
        dateOfBirth: formData.dateOfBirth,
        isAlive: formData.isAlive,
        works: formData.works.map(work => ({
          title: work.title.trim(),
          year: parseInt(work.year, 10)
        }))
      };

      // Add optional fields only if they have values
      if (formData.institution && formData.institution.trim()) {
        scholarData.institution = formData.institution.trim();
      }

      if (!formData.isAlive && formData.dateOfDeath) {
        scholarData.dateOfDeath = formData.dateOfDeath;
      }

      if (formData.image) {
        scholarData.image = formData.image;
      }

      // Check payload size
      const payloadSize = JSON.stringify(scholarData).length;
      console.log('Payload size:', payloadSize, 'bytes');

      // Log the exact payload being sent
      console.log('=== SCHOLAR DATA BEING SENT ===');
      console.log(JSON.stringify({
        ...scholarData,
        image: scholarData.image ? `[IMAGE_DATA_${scholarData.image.length}_CHARS]` : 'NO_IMAGE'
      }, null, 2));
      console.log('=== END PAYLOAD ===');

      const response = await LibraryService.createScholar(scholarData);
      console.log('Scholar created successfully:', response);
      
      // Reset form
      setFormData({
        name: '',
        title: '',
        institution: '',
        specialization: '',
        bio: '',
        dateOfBirth: '',
        dateOfDeath: '',
        isAlive: true,
        image: '',
        works: [{ title: '', year: '', downloads: 0 }]
      });
      removeImage();
      setErrors({});
      setSuccessMessage('Scholar added successfully!');
      
      if (onSuccess) onSuccess();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error creating scholar:', error);
      console.error('Full error object:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Try to parse validation errors from backend
      let errorMessage = 'Error occurred while adding scholar';
      
      if (error.message.includes('You must be logged in')) {
        errorMessage = 'Authentication error: Please log in again';
      } else if (error.message.includes('Validation failed')) {
        errorMessage = 'Validation failed: Please check all fields and try again. Make sure you are logged in as an admin.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication error: Please log in as an admin';
      } else if (error.message.includes('403')) {
        errorMessage = 'Permission denied: Admin access required';
      } else if (error.message.includes('Payload too large')) {
        errorMessage = 'Image is too large. Try removing the image or uploading a smaller one.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. The image might be too large. Try without image.';
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
    const originalImage = formData.image;
    setFormData(prev => ({ ...prev, image: '' }));
    
    try {
      await handleSubmit();
    } finally {
      // Restore image if submission failed
      if (originalImage) {
        setFormData(prev => ({ ...prev, image: originalImage }));
      }
    }
  };

  // Debug function to test API connection
  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...');
      const token = localStorage.getItem('authToken');
      console.log('Token exists:', !!token);
      
      // Test current user endpoint
      const user = await LibraryService.getCurrentUser();
      console.log('Current user:', user);
      
      alert('API connection successful! Check console for details.');
    } catch (error) {
      console.error('API test failed:', error);
      alert('API connection failed: ' + error.message);
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
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Add New Islamic Scholar</h2>
              <p className="text-emerald-100">Register a new scholar in the Islamic library</p>
            </div>
            {/* Debug button - remove in production */}
            <button
              type="button"
              onClick={testApiConnection}
              className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
            >
              Test API
            </button>
          </div>
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
            {/* Scholar Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Scholar Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.name ? 'border-red-500' : 'border-emerald-200'
                }`}
                placeholder="e.g., Dr. Yusuf al-Qaradawi"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Academic Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.title ? 'border-red-500' : 'border-emerald-200'
                }`}
                placeholder="e.g., Contemporary Islamic Scholar and Jurist"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Institution / University
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., Al-Azhar University"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialization *
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.specialization ? 'border-red-500' : 'border-emerald-200'
                }`}
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
            </div>
          </div>

          {/* Biography */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Biography *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.bio ? 'border-red-500' : 'border-emerald-200'
              }`}
              placeholder="Write a comprehensive biography about the scholar and their contributions to Islamic sciences..."
            />
            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-emerald-200'
                }`}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
            </div>

            {/* Is Alive */}
            <div className="flex items-center justify-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAlive"
                  checked={formData.isAlive}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold text-gray-700">Still alive</span>
              </label>
            </div>

            {/* Date of Death */}
            {!formData.isAlive && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Death *
                </label>
                <input
                  type="date"
                  name="dateOfDeath"
                  value={formData.dateOfDeath}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.dateOfDeath ? 'border-red-500' : 'border-emerald-200'
                  }`}
                />
                {errors.dateOfDeath && <p className="text-red-500 text-sm mt-1">{errors.dateOfDeath}</p>}
              </div>
            )}
          </div>

          {/* Scholar Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Scholar Image
            </label>
            
            {/* Upload Area */}
            <div className="space-y-4">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-emerald-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors duration-200">
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-emerald-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <label htmlFor="scholar-image" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-emerald-600 hover:text-emerald-500">
                          Click to upload an image
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                          Images will be automatically resized and compressed
                        </span>
                        <span className="block text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </label>
                      <input
                        id="scholar-image"
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
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <img 
                      src={imagePreview} 
                      alt="Scholar preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-emerald-300"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-emerald-800">
                        {imageFile?.name || 'Scholar image uploaded'}
                      </p>
                      <p className="text-xs text-emerald-600">
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                  <span className="ml-2 text-sm text-emerald-600">Processing image...</span>
                </div>
              )}

              {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            </div>
          </div>

          {/* Works Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Scholar's Works</h3>
              <button
                type="button"
                onClick={addWork}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Work
              </button>
            </div>

            <div className="space-y-4">
              {formData.works.map((work, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Work Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Work Title *
                      </label>
                      <input
                        type="text"
                        value={work.title}
                        onChange={(e) => handleWorkChange(index, 'title', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white ${
                          errors[`work_title_${index}`] ? 'border-red-500' : 'border-emerald-200'
                        }`}
                        placeholder="e.g., The Jurisprudence of Zakat"
                      />
                      {errors[`work_title_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`work_title_${index}`]}</p>
                      )}
                    </div>

                    {/* Publication Year */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Publication Year *
                      </label>
                      <input
                        type="number"
                        min="1300"
                        max={new Date().getFullYear()}
                        value={work.year}
                        onChange={(e) => handleWorkChange(index, 'year', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white ${
                          errors[`work_year_${index}`] ? 'border-red-500' : 'border-emerald-200'
                        }`}
                        placeholder="2023"
                      />
                      {errors[`work_year_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`work_year_${index}`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Remove Work Button */}
                  {formData.works.length > 1 && (
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeWork(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-semibold flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove Work
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            {/* Try without image button - shown when there's an image and there was an error */}
            {formData.image && errors.submit && (
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
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Scholar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScholarForm;