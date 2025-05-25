import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LibraryService from '../services/dataService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('joinDate');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await LibraryService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      await LibraryService.updateUserStatus(userId, action);
      await loadUsers(); // Reload users after action
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'active' && user.status === 'active') ||
                           (filterBy === 'inactive' && user.status === 'inactive') ||
                           (filterBy === 'premium' && user.isPremium);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'downloads') return b.totalDownloads - a.totalDownloads;
      if (sortBy === 'joinDate') return new Date(b.joinDate) - new Date(a.joinDate);
      if (sortBy === 'lastActive') return new Date(b.lastActive) - new Date(a.lastActive);
      return 0;
    });

  const UserDetailModal = ({ user, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">تفاصيل المستخدم</h3>
            <button
              onClick={onClose}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{user.name}</h4>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-gray-600 text-sm">تاريخ الانضمام:</span>
                  <p className="font-semibold">{new Date(user.joinDate).toLocaleDateString('ar-SA')}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">آخر نشاط:</span>
                  <p className="font-semibold">{new Date(user.lastActive).toLocaleDateString('ar-SA')}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">الحالة:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">النوع:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isPremium ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isPremium ? 'مميز' : 'عادي'}
                  </span>
                </div>
              </div>
            </div>

            {/* Download Stats */}
            <div>
              <h5 className="font-bold text-gray-900 mb-4">إحصائيات التحميل</h5>
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">{user.totalDownloads}</p>
                    <p className="text-emerald-700 text-sm">إجمالي التحميلات</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{user.monthlyDownloads}</p>
                    <p className="text-blue-700 text-sm">تحميلات هذا الشهر</p>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{user.favoriteCategory}</p>
                    <p className="text-purple-700 text-sm">التصنيف المفضل</p>
                  </div>
                </div>
              </div>

              {/* Recent Downloads */}
              <div className="mt-6">
                <h6 className="font-semibold text-gray-900 mb-3">آخر التحميلات</h6>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {user.recentDownloads.map((download, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{download.bookTitle}</span>
                      <span className="text-xs text-gray-500">{download.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => handleUserAction(user.id, user.status === 'active' ? 'deactivate' : 'activate')}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${
                user.status === 'active'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {user.status === 'active' ? 'إلغاء التفعيل' : 'تفعيل الحساب'}
            </button>
            <button
              onClick={() => handleUserAction(user.id, user.isPremium ? 'removePremium' : 'makePremium')}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${
                user.isPremium
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {user.isPremium ? 'إزالة المميز' : 'جعل مميز'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <span className="mr-3 text-emerald-700">جاري تحميل المستخدمين...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-emerald-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" dir="rtl">إدارة المستخدمين</h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="ابحث عن مستخدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              dir="rtl"
            />
          </div>

          {/* Filter */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="py-3 px-4 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">جميع المستخدمين</option>
            <option value="active">المستخدمون النشطون</option>
            <option value="inactive">المستخدمون غير النشطين</option>
            <option value="premium">المستخدمون المميزون</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-3 px-4 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="joinDate">ترتيب حسب تاريخ الانضمام</option>
            <option value="name">ترتيب حسب الاسم</option>
            <option value="downloads">ترتيب حسب التحميلات</option>
            <option value="lastActive">ترتيب حسب آخر نشاط</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-50 border-b border-emerald-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">المستخدم</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">تاريخ الانضمام</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">إجمالي التحميلات</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">هذا الشهر</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">النوع</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-emerald-25 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-emerald-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(user.joinDate).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-emerald-600">{user.totalDownloads}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-blue-600">{user.monthlyDownloads}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isPremium ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isPremium ? 'مميز' : 'عادي'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-emerald-600 hover:text-emerald-800 font-semibold text-sm hover:underline"
                    >
                      عرض التفاصيل
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center text-gray-600">
        عرض {filteredUsers.length} من أصل {users.length} مستخدم
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </motion.div>
  );
};

export default UserManagement;