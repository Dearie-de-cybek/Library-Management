/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-800 text-white"
    >
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 40l20-20v40l-20-20zm20 20l20-20v40l-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: '4px 4px'
        }}></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            {/* Islamic crescent and star icon */}
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="text-center">
              {/* Arabic title with English translation */}
              <h1 className="text-2xl font-bold text-white" dir="rtl">
                المكتبة الإسلامية
                <span className="block text-emerald-100 text-sm font-medium" dir="ltr">
                  Islamic Digital Library
                </span>
              </h1>
            </div>
          </motion.div>
        </div>
      </nav>
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-8"
        >
          {/* Arabic title with English translation */}
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-white" dir="rtl">
            اكتشف الحكمة من
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-200 mt-2">
              العلماء المعاصرين
            </span>
          </h2>
          
          {/* English translation */}
          <h3 className="text-xl md:text-3xl font-semibold text-emerald-100 mt-6" dir="ltr">
            Discover Wisdom from
            <span className="block text-white/90">Contemporary Scholars</span>
          </h3>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-emerald-50 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          Access authentic Islamic knowledge through curated works, research papers, and scholarly publications from distinguished Islamic scholars and researchers worldwide.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          {/* Arabic button with English translation */}
          <button className="group bg-gradient-to-r from-white to-emerald-50 text-emerald-800 px-8 py-4 rounded-2xl font-semibold hover:from-emerald-50 hover:to-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg hover:shadow-xl">
            <span className="flex flex-col items-center gap-1">
              <span className="flex items-center gap-2" dir="rtl">
                استكشف المجموعة
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-sm text-emerald-600" dir="ltr">Explore Collection</span>
            </span>
          </button>
          
          <button className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50">
            <span className="flex items-center gap-2">
              Browse Categories
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </span>
          </button>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.05, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-60 h-60 bg-white rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute top-32 -right-20 w-80 h-80 bg-emerald-300 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.03, 0.08]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 4 }}
          className="absolute -bottom-20 left-1/3 w-96 h-96 bg-green-200 rounded-full blur-3xl"
        ></motion.div>
      </div>
    </motion.header>
  );
};

export default Header;