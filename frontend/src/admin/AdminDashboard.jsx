/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UserManagement from './UserManagement';
import ScholarForm from './ScholarForm';
import BookForm from './BookForm';
import LibraryService from '../services/dataService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalScholars: 0,
    totalDownloads: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await LibraryService.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'لوحة التحكم', icon: '📊', engLabel: 'Overview' },
    { id: 'users', label: 'إدارة المستخدمين', icon: '👥', engLabel: 'Users' },
    { id: 'scholars', label: 'إضافة عالم', icon: '👨‍🎓', engLabel: 'Add Scholar' },
    { id: 'books', label: 'إضافة كتاب', icon: '📚', engLabel: 'Add Book' }
  ];

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-white rounded-3xl p-6 shadow-lg border border-emerald-100 hover:shadow-2xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
          {subtext && <p className="text-gray-500 text-xs">{subtext}</p>}
        </div>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color === 'text-emerald-600' ? 'from-emerald-100 to-green-100' : color === 'text-blue-600' ? 'from-blue-100 to-indigo-100' : color === 'text-purple-600' ? 'from-purple-100 to-pink-100' : 'from-amber-100 to-orange-100'} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

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
          <p className="text-xl text-emerald-800 font-medium">جاري تحميل لوحة التحكم...</p>
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
              <h1 className="text-3xl font-bold mb-2" dir="rtl">لوحة تحكم الإدارة</h1>
              <p className="text-emerald-100">Admin Dashboard - Islamic Digital Library</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-emerald-200">مرحباً، المدير</p>
                <p className="font-semibold">Welcome, Admin</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
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
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-emerald-600 hover:border-emerald-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="text-right">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs text-gray-400">{tab.engLabel}</div>
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
                title="إجمالي المستخدمين"
                value={stats.totalUsers.toLocaleString()}
                icon="👥"
                color="text-emerald-600"
                subtext="Total Users"
              />
              <StatCard
                title="إجمالي الكتب"
                value={stats.totalBooks.toLocaleString()}
                icon="📚"
                color="text-blue-600"
                subtext="Total Books"
              />
              <StatCard
                title="إجمالي العلماء"
                value={stats.totalScholars.toLocaleString()}
                icon="👨‍🎓"
                color="text-purple-600"
                subtext="Total Scholars"
              />
              <StatCard
                title="إجمالي التحميلات"
                value={stats.totalDownloads.toLocaleString()}
                icon="📥"
                color="text-amber-600"
                subtext="Total Downloads"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6" dir="rtl">النشاط الأخير</h3>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
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
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('scholars')}
                className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">👨‍🎓</div>
                  <h4 className="text-lg font-bold mb-2">إضافة عالم جديد</h4>
                  <p className="text-emerald-100 text-sm">Add New Scholar</p>
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
                  <h4 className="text-lg font-bold mb-2">إضافة كتاب جديد</h4>
                  <p className="text-blue-100 text-sm">Add New Book</p>
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
                  <h4 className="text-lg font-bold mb-2">إدارة المستخدمين</h4>
                  <p className="text-purple-100 text-sm">Manage Users</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'scholars' && <ScholarForm onSuccess={() => setActiveTab('overview')} />}
        {activeTab === 'books' && <BookForm onSuccess={() => setActiveTab('overview')} />}
      </div>
    </div>
  );
};

export default AdminDashboard;