/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import LibraryService from '../services/dataService';

const ScholarsPage = () => {
  const [scholars, setScholars] = useState([]);
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [scholarWorks, setScholarWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingWorks, setLoadingWorks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadScholars();
  }, []);

  const loadScholars = async () => {
    try {
      setLoading(true);
      const data = await LibraryService.getScholars();
      setScholars(data);
    } catch (error) {
      console.error('Error loading scholars:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadScholarWorks = async (scholarId) => {
    try {
      setLoadingWorks(true);
      const works = await LibraryService.getScholarWorks(scholarId);
      setScholarWorks(works);
    } catch (error) {
      console.error('Error loading scholar works:', error);
    } finally {
      setLoadingWorks(false);
    }
  };

  const handleScholarClick = async (scholar) => {
    setSelectedScholar(scholar);
    await loadScholarWorks(scholar.id);
  };

  const closeModal = () => {
    setSelectedScholar(null);
    setScholarWorks([]);
  };

  // Filter and sort scholars
  const filteredScholars = scholars
    .filter(scholar => {
      const matchesSearch = scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scholar.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scholar.institution.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialization = selectedSpecialization === 'all' || 
                                   scholar.specialization === selectedSpecialization;
      return matchesSearch && matchesSpecialization;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'works') return b.worksCount - a.worksCount;
      if (sortBy === 'institution') return a.institution.localeCompare(b.institution);
      return 0;
    });

  const specializations = [...new Set(scholars.map(s => s.specialization))];

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
            All Scholars
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-emerald-700 mb-6">
            Islamic Scholars Directory
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-600 to-green-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Discover our distinguished scholars and their influential works in contemporary Islamic thought
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-12 shadow-lg border border-emerald-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for a scholar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/90"
              />
            </div>

            {/* Specialization Filter */}
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="py-3 px-4 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/90"
            >
              <option value="all">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-3 px-4 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/90"
            >
              <option value="name">Sort by Name</option>
              <option value="works">Sort by Number of Works</option>
              <option value="institution">Sort by Institution</option>
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <p className="text-emerald-700 font-medium">
            Found {filteredScholars.length} scholars out of {scholars.length}
          </p>
        </motion.div>

        {/* Scholars Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredScholars.map((scholar, index) => (
            <motion.div
              key={scholar.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-emerald-50 hover:border-emerald-200 cursor-pointer"
              onClick={() => handleScholarClick(scholar)}
            >
              <div className="relative">
                <img
                  src={scholar.image}
                  alt={scholar.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Works count badge */}
                <div className="absolute top-4 right-4 bg-emerald-600 text-white rounded-xl px-3 py-2">
                  <span className="text-sm font-bold">{scholar.worksCount} works</span>
                </div>

                {/* View works button */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <button className="w-full bg-white/95 backdrop-blur-sm text-emerald-800 py-2 px-4 rounded-xl font-semibold hover:bg-white transition-colors duration-200">
                    View Works
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">
                  {scholar.name}
                </h3>
                
                <p className="text-emerald-700 font-semibold mb-1">{scholar.title}</p>
                <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {scholar.institution}
                </p>
                
                <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
                  {scholar.bio}
                </p>
                
                <span className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 px-4 py-2 rounded-full text-xs font-semibold border border-emerald-200">
                  {scholar.specialization}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredScholars.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <svg className="w-16 h-16 text-emerald-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.64-4.75-3.835M6 20.341V9.5a3.5 3.5 0 117 0v1.341m4 0V9.5a3.5 3.5 0 117 0v10.841" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>

      {/* Scholar Works Modal */}
      <AnimatePresence>
        {selectedScholar && (
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
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedScholar.image}
                      alt={selectedScholar.name}
                      className="w-16 h-16 rounded-full border-4 border-white/20"
                    />
                    <div>
                      <h3 className="text-2xl font-bold">{selectedScholar.name}</h3>
                      <p className="text-emerald-100">{selectedScholar.title}</p>
                    </div>
                  </div>
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
                <h4 className="text-xl font-bold text-emerald-800 mb-6">
                  Works by {selectedScholar.name}
                </h4>

                {loadingWorks ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    <span className="ml-3 text-emerald-700">Loading works...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scholarWorks.map((work) => (
                      <motion.div
                        key={work.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-colors duration-200"
                      >
                        <h5 className="font-bold text-gray-900 mb-2">{work.title}</h5>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            {work.downloads.toLocaleString()} downloads
                          </span>
                          <span>{work.year}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {!loadingWorks && scholarWorks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No works available currently</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScholarsPage;