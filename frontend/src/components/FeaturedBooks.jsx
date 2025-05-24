/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const FeaturedBooks = ({ books }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        {/* Arabic heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-3" dir="rtl">
          الكتب المميزة
        </h2>
        
        {/* English heading */}
        <h3 className="text-2xl md:text-3xl font-semibold text-emerald-700 mb-6">
          Featured Islamic Books
        </h3>
        
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-green-600 mx-auto mb-8 rounded-full"></div>
        
        <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
          Discover our most downloaded and valuable Islamic publications, covering Quran studies, Hadith, Fiqh, and contemporary Islamic thought from respected scholars.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {books.map((book) => (
          <motion.div
            key={book.id}
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-emerald-50 hover:border-emerald-200"
          >
            {/* Paper texture overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: '4px 4px'
              }}></div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden">
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Downloads count badge - prominent as requested */}
                <div className="absolute top-4 right-4 bg-emerald-600 text-white rounded-xl px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{book.downloads.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Islamic geometric decoration */}
                <div className="absolute top-4 left-4 w-8 h-8 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                
                {/* Year badge */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-emerald-800 text-sm font-semibold">{book.publishedYear}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 px-4 py-2 rounded-full text-xs font-bold border border-emerald-200">
                    {book.category}
                  </span>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    <span>{book.pages} صفحة</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300 leading-tight">
                  {book.title}
                </h3>
                
                <p className="text-emerald-700 text-sm font-semibold mb-3 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {book.author}
                </p>
                
                <p className="text-gray-700 text-sm mb-6 leading-relaxed line-clamp-3">
                  {book.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {book.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ x: 3 }}
                    className="group/btn text-emerald-700 hover:text-emerald-900 flex items-center gap-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg p-2 transition-colors duration-200"
                    aria-label={`View details for ${book.title}`}
                  >
                    <span>عرض التفاصيل</span>
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Subtle hover effect border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-emerald-200 transition-colors duration-500 pointer-events-none"></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedBooks;