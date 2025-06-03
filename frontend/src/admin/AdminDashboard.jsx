/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserManagement from './UserManagement';
import ScholarForm from './ScholarForm';
import BookForm from './BookForm';
import LibraryService from '../services/dataService';

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalScholars: 0,
    totalDownloads: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      loadDashboardStats();
    }
  }, [isAuthenticated]);

  const checkAuthentication = async () => {
    try {
      if (!isAuthenticated) {
        navigate('/admin-login');
        return;
      }

      if (!isAdmin()) {
        navigate('/');
        return;
      }
      
      setAuthLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/admin-login');
    }
  };

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Try to get actual stats from backend
      const [booksData, scholarsData, usersData] = await Promise.all([
        LibraryService.getAllBooks(),
        LibraryService.getScholars(),
        LibraryService.getAllUsers()
      ]);

      setStats({
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalBooks: Array.isArray(booksData) ? booksData.length : 0,
        totalScholars: Array.isArray(scholarsData) ? scholarsData.length : 0,
        totalDownloads: 0, // This would need to come from downloads endpoint
        recentActivity: []
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Keep default stats
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊', arabicLabel: 'لوحة التحكم' },
    { id: 'users', label: 'User Management', icon: '👥', arabicLabel: 'إدارة المستخدمين' },
    { id: 'scholars', label: 'Add Scholar', icon: '👨‍🎓', arabicLabel: 'إضافة عالم' },
    { id: 'books', label: 'Add Book', icon: '📚', arabicLabel: 'إضافة كتاب' }
  ];

  const StatCard = ({ title, value, icon, color, subtext, arabicTitle }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-white rounded-3xl p-6 shadow-lg border border-emerald-100 hover:shadow-2xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-900 font-semibold mb-1">{title}</p>
          {arabicTitle && <p className="text-gray-500 text-sm mb-2" dir="rtl">{arabicTitle}</p>}
          <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
          {subtext && <p className="text-gray-500 text-xs">{subtext}</p>}
        </div>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color === 'text-emerald-600' ? 'from-emerald-100 to-green-100' : color === 'text-blue-600' ? 'from-blue-100 to-indigo-100' : color === 'text-purple-600' ? 'from-purple-100 to-pink-100' : 'from-amber-100 to-orange-100'} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-emerald-200 rounded-full"
            ></motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-4 border-emerald-600 border-t-transparent rounded-full"
            ></motion.div>
          </div>
          <p className="text-xl text-emerald-800 font-medium">Checking Authentication...</p>
          <p className="text-emerald-600 text-sm mt-1" dir="rtl">جاري التحقق من الصلاحيات</p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-emerald-200 rounded-full"
            ></motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-4 border-emerald-600 border-t-transparent rounded-full"
            ></motion.div>
          </div>
          <p className="text-xl text-emerald-800 font-medium">Loading Admin Dashboard...</p>
          <p className="text-emerald-600 text-sm mt-1" dir="rtl">جاري تحميل لوحة التحكم</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-emerald-100 mb-1">Islamic Digital Library Management</p>
              <p className="text-emerald-200 text-sm" dir="rtl">لوحة تحكم الإدارة - المكتبة الإسلامية الرقمية</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">Welcome, {user?.name || 'Admin'}</p>
                <p className="text-sm text-emerald-200" dir="rtl">مرحباً، المدير</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-emerald-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-emerald-600 hover:border-emerald-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs text-gray-400" dir="rtl">{tab.arabicLabel}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                arabicTitle="إجمالي المستخدمين"
                value={stats.totalUsers.toLocaleString()}
                icon="👥"
                color="text-emerald-600"
                subtext="Registered members"
              />
              <StatCard
                title="Total Books"
                arabicTitle="إجمالي الكتب"
                value={stats.totalBooks.toLocaleString()}
                icon="📚"
                color="text-blue-600"
                subtext="Available in library"
              />
              <StatCard
                title="Total Scholars"
                arabicTitle="إجمالي العلماء"
                value={stats.totalScholars.toLocaleString()}
                icon="👨‍🎓"
                color="text-purple-600"
                subtext="Featured authors"
              />
              <StatCard
                title="Total Downloads"
                arabicTitle="إجمالي التحميلات"
                value={stats.totalDownloads.toLocaleString()}
                icon="📥"
                color="text-amber-600"
                subtext="All-time downloads"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <span className="text-gray-500" dir="rtl">النشاط الأخير</span>
              </div>
              <div className="space-y-4">
                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100"
                    >
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {activity.type === 'download' ? '📥' : activity.type === 'user' ? '👤' : '📚'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-gray-600 text-sm">{activity.description}</p>
                      </div>
                      <span className="text-gray-500 text-sm">{activity.time}</span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-500 mb-2">No recent activity to display</p>
                    <p className="text-gray-400 text-sm" dir="rtl">لا يوجد نشاط حديث للعرض</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                <span className="text-gray-500" dir="rtl">إجراءات سريعة</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('scholars')}
                  className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">👨‍🎓</div>
                    <h4 className="text-lg font-bold mb-2">Add New Scholar</h4>
                    <p className="text-emerald-100 text-sm" dir="rtl">إضافة عالم جديد</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('books')}
                  className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">📚</div>
                    <h4 className="text-lg font-bold mb-2">Add New Book</h4>
                    <p className="text-blue-100 text-sm" dir="rtl">إضافة كتاب جديد</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('users')}
                  className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">👥</div>
                    <h4 className="text-lg font-bold mb-2">Manage Users</h4>
                    <p className="text-purple-100 text-sm" dir="rtl">إدارة المستخدمين</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'scholars' && <ScholarForm onSuccess={() => {
          setActiveTab('overview');
          loadDashboardStats(); // Refresh stats after adding scholar
        }} />}
        {activeTab === 'books' && <BookForm onSuccess={() => {
          setActiveTab('overview');
          loadDashboardStats(); // Refresh stats after adding book
        }} />}
      </div>
    </div>
  );
};

export default AdminDashboard;