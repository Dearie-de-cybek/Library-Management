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
      className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-800 to-purple-900 text-white"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">Scholar Library</h1>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Admin Login"
          >
            Admin Login
          </motion.button>
        </div>
      </nav>
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
        >
          Discover Knowledge from
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
            Renowned Scholars
          </span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Access a curated collection of academic works, research papers, and scholarly publications from distinguished professors and researchers worldwide.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-indigo-900">
            Explore Collection
          </button>
          
          <button className="border-2 border-white/50 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50">
            Browse Categories
          </button>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-20 -right-10 w-60 h-60 bg-purple-400/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 left-1/2 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>
    </motion.header>
  );
};

export default Header;