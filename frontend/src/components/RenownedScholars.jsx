/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const RenownedScholars = ({ scholars }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" }
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
          العلماء المرموقون
        </h2>
        
        {/* English heading */}
        <h3 className="text-2xl md:text-3xl font-semibold text-emerald-700 mb-6">
          Distinguished Scholars
        </h3>
        
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-green-600 mx-auto mb-8 rounded-full"></div>
        
        <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
          Meet the distinguished Islamic scholars whose profound knowledge, authentic interpretations, and scholarly contributions illuminate the path of understanding for Muslims worldwide.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {scholars.map((scholar) => (
          <motion.div
            key={scholar.id}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-emerald-50 hover:border-emerald-200"
          >
            {/* Paper texture overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: '4px 4px'
              }}></div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden">
                <img
                  src={scholar.image}
                  alt={`Portrait of ${scholar.name}`}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Works count badge with bilingual text */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <div className="flex flex-col items-center gap-1 text-emerald-800">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span className="text-sm font-semibold" dir="rtl">{scholar.worksCount} أعمال منشورة</span>
                    </div>
                    <span className="text-xs text-emerald-600">{scholar.worksCount} Published Works</span>
                  </div>
                </div>

                {/* Islamic decorative corner */}
                <div className="absolute top-4 right-4 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">
                  {scholar.name}
                </h3>
                
                <div className="mb-4">
                  <p className="text-emerald-700 font-semibold mb-1">{scholar.title}</p>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {scholar.institution}
                  </p>
                </div>
                
                <p className="text-gray-700 text-sm mb-6 leading-relaxed line-clamp-3">
                  {scholar.bio}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 px-4 py-2 rounded-full text-xs font-semibold border border-emerald-200">
                    {scholar.specialization}
                  </span>
                  
                  {/* Bilingual button */}
                  <motion.button
                    whileHover={{ x: 3 }}
                    className="group/btn text-emerald-700 hover:text-emerald-900 flex flex-col items-center gap-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg p-2 transition-colors duration-200"
                    aria-label={`View works by ${scholar.name}`}
                  >
                    <div className="flex items-center gap-2">
                      <span dir="rtl">عرض الأعمال</span>
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-emerald-600">View Works</span>
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

export default RenownedScholars;