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
    try {
      await LibraryService.createScholar(formData);
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
      setErrors({});
      onSuccess && onSuccess();
      alert('Scholar added successfully!');
    } catch (error) {
      console.error('Error creating scholar:', error);
      alert('Error occurred while adding scholar');
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
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Add New Islamic Scholar</h2>
          <p className="text-emerald-100">Register a new scholar in the Islamic library</p>
        </div>

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

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Scholar Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://example.com/scholar-image.jpg"
            />
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
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={loading}
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