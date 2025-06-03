/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Navbar from '../components/Navbar';
import Header from '../components/Header';
import RenownedScholars from '../components/RenownedScholars';
import FeaturedBooks from '../components/FeaturedBooks';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';

import LibraryService from '../services/dataService';

const Home = () => {
  const [scholars, setScholars] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load scholars and books concurrently using the data service
      const [scholarsData, booksData] = await Promise.all([
        LibraryService.getScholars(),
        LibraryService.getFeaturedBooks()
      ]);

      // Ensure we always set arrays, even if API returns something else
      setScholars(Array.isArray(scholarsData) ? scholarsData : []);
      setBooks(Array.isArray(booksData) ? booksData : []);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error('Error loading home data:', err);
      // Set empty arrays on error
      setScholars([]);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Content</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadHomeData}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    >
      {/* Navbar */}
      <Navbar />
      
      {/* Header Section */}
      <Header />
      
      {/* Main Content */}
      <main className="relative">
        {/* Renowned Scholars Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <RenownedScholars scholars={scholars} />
        </section>
        
        {/* Featured Books Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
          <FeaturedBooks books={books} />
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default Home;