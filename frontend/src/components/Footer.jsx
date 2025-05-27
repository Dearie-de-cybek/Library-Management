import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [language, setLanguage] = useState('ar'); // 'ar' for Arabic, 'en' for English

  const translations = {
    ar: {
      title: 'المكتبة الإسلامية',
      subtitle: 'Islamic Digital Library',
      description: 'تمكين التميز الأكاديمي من خلال الأعمال العلمية الإسلامية المنتقاة والبحوث من علماء مرموقين حول العالم.',
      quickLinks: 'روابط سريعة',
      resources: 'الموارد',
      copyright: `© ${currentYear} المكتبة الإسلامية. جميع الحقوق محفوظة.`,
      builtWith: 'مبني بإمكانية الوصول والقيم الإسلامية في الاعتبار.',
      poweredBy: 'مدعوم بالمعرفة الإسلامية',
      links: {
        browse: 'تصفح الكتب',
        scholars: 'العلماء',
        categories: 'التصنيفات',
        about: 'من نحن',
        contact: 'اتصل بنا',
        help: 'مركز المساعدة',
        terms: 'شروط الخدمة',
        privacy: 'سياسة الخصوصية',
        accessibility: 'إمكانية الوصول',
        api: 'واجهة برمجة التطبيقات'
      }
    },
    en: {
      title: 'Islamic Library',
      subtitle: 'المكتبة الإسلامية',
      description: 'Empowering academic excellence through curated Islamic scholarly works and research from distinguished scholars worldwide.',
      quickLinks: 'Quick Links',
      resources: 'Resources',
      copyright: `© ${currentYear} Islamic Library. All rights reserved.`,
      builtWith: 'Built with accessibility and Islamic values in mind.',
      poweredBy: 'Powered by Islamic Knowledge',
      links: {
        browse: 'Browse Books',
        scholars: 'Scholars',
        categories: 'Categories',
        about: 'About Us',
        contact: 'Contact',
        help: 'Help Center',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        accessibility: 'Accessibility',
        api: 'API Documentation'
      }
    }
  };

  const currentLang = translations[language];
  const isRTL = language === 'ar';

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  return (
    <footer className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 text-white overflow-hidden">
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm15 15l15-15v30l-15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: '4px 4px'
        }}></div>
      </div>

      {/* Language Toggle Button */}
      <div className="absolute top-4 right-4 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleLanguage}
          className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-sm text-white hover:bg-white/20 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span>{language === 'ar' ? 'EN' : 'ع'}</span>
        </motion.button>
      </div>

      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center md:items-start"
            >
              <div className={`flex items-center mb-6 ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{currentLang.title}</h3>
                  <p className="text-emerald-200 text-sm">{currentLang.subtitle}</p>
                </div>
              </div>
              
              <p className="text-emerald-100 mb-6 max-w-md leading-relaxed text-center md:text-left">
                {currentLang.description}
              </p>
              
              {/* Show both languages for broader understanding */}
              {language === 'en' && (
                <p className="text-emerald-200 mb-8 max-w-md leading-relaxed text-sm text-center md:text-left opacity-75">
                  {translations.ar.description}
                </p>
              )}
              
              <div className={`flex ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="text-emerald-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                  aria-label="Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </motion.a>
                
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="text-emerald-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>
                
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="text-emerald-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                  aria-label="Academia"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </motion.a>
                
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="text-emerald-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                  aria-label="YouTube"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-6 text-white">{currentLang.quickLinks}</h4>
            <ul className="space-y-3">
              {Object.entries(currentLang.links).slice(0, 5).map(([key, link], index) => (
                <li key={index}>
                  <motion.a
                    whileHover={{ x: isRTL ? -5 : 5 }}
                    href="#"
                    className={`group text-emerald-200 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-emerald-900 rounded-md p-1 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <svg className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm">{link}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-6 text-white">{currentLang.resources}</h4>
            <ul className="space-y-3">
              {Object.entries(currentLang.links).slice(5).map(([key, link], index) => (
                <li key={index}>
                  <motion.a
                    whileHover={{ x: isRTL ? -5 : 5 }}
                    href="#"
                    className={`group text-emerald-200 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-emerald-900 rounded-md p-1 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <svg className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm">{link}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-emerald-700/50 mt-16 pt-8"
        >
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className="text-center md:text-left">
              <p className="text-emerald-200 text-sm mb-1">
                {currentLang.copyright}
              </p>
              <p className="text-emerald-300 text-xs">
                {currentLang.builtWith}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center gap-2 text-emerald-200 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{currentLang.poweredBy}</span>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-950/50 to-transparent pointer-events-none"></div>
    </footer>
  );
};

export default Footer;