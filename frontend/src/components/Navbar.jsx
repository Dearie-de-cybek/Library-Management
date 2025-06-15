/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: '/', label: 'Home', arabicLabel: 'الرئيسية' },
    { path: '/books', label: 'Books', arabicLabel: 'الكتب' },
    { path: '/scholars', label: 'Scholars', arabicLabel: 'العلماء' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-emerald-800" dir="rtl">مكتبة يحيى باوا الإسلامية</h1>
              <p className="text-xs text-emerald-600">Yahaya Bawa Islamic Library</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-emerald-700 bg-emerald-50 font-semibold'
                    : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <div className="text-center">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-emerald-600" dir="rtl">{item.arabicLabel}</div>
                </div>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-emerald-100 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-emerald-600">
                      {isAdmin() ? 'Administrator' : 'Member'}
                    </p>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-emerald-100 py-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                      
                      {isAdmin() && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <div>Admin Dashboard</div>
                            <div className="text-xs text-emerald-600" dir="rtl">لوحة التحكم</div>
                          </div>
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <div>
                          <div>Sign Out</div>
                          <div className="text-xs" dir="rtl">تسجيل الخروج</div>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-emerald-700 hover:text-emerald-900 font-semibold hover:bg-emerald-50 rounded-lg transition-all duration-200"
                >
                  <div className="text-center">
                    <div>Sign In</div>
                    <div className="text-xs" dir="rtl">تسجيل الدخول</div>
                  </div>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <div className="text-center">
                    <div>Join Now</div>
                    <div className="text-xs text-emerald-100" dir="rtl">انضم الآن</div>
                  </div>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-emerald-50 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-emerald-100 py-4"
            >
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-emerald-700 bg-emerald-50 font-semibold'
                        : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-emerald-600" dir="rtl">{item.arabicLabel}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;