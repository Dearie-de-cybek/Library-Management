/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Islamic Pattern Background */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-emerald-200 rounded-full"
          ></motion.div>
          
          {/* Middle ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-4 border-emerald-400 border-t-transparent border-r-transparent rounded-full"
          ></motion.div>
          
          {/* Inner ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 border-4 border-emerald-600 border-t-transparent rounded-full"
          ></motion.div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Loading text with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-emerald-800 mb-2" dir="rtl">
            المكتبة الإسلامية
          </h2>
          <p className="text-lg text-emerald-700 mb-4">Islamic Digital Library</p>
          
          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-emerald-600">Loading</span>
            <div className="flex gap-1">
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="w-1 h-1 bg-emerald-600 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-1 h-1 bg-emerald-600 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-1 h-1 bg-emerald-600 rounded-full"
              ></motion.div>
            </div>
          </div>
          
          <p className="text-emerald-600 text-sm mt-2" dir="rtl">جاري التحميل...</p>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-20 w-20 h-20 bg-emerald-200 rounded-full blur-xl"
        ></motion.div>
        
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.05, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 right-20 w-32 h-32 bg-green-200 rounded-full blur-xl"
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;