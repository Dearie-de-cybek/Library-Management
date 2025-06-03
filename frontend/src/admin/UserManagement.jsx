/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LibraryService from '../services/dataService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await LibraryService.getAllUsers();
      console.log('Users loaded:', data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      if (action === 'activate' || action === 'deactivate') {
        const status = action === 'activate' ? 'active' : 'inactive';
        await LibraryService.updateUserStatus(userId, status);
        await loadUsers(); // Reload users after action
      } else {
        console.log('Action not implemented:', action);
        alert('This action is not yet implemented in the backend.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user: ' + error.message);
    }
  };

  // Filter and sort users with safety checks
  const filteredUsers = (Array.isArray(users) ? users : [])
    .filter(user => {
      const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'active' && user.status === 'active') ||
                           (filterBy === 'inactive' && user.status === 'inactive') ||
                           (filterBy === 'admin' && user.role === 'admin');
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'totalDownloads') return (b.totalDownloads || 0) - (a.totalDownloads || 0);
      if (sortBy === 'createdAt') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'lastActive') return new Date(b.lastActive || 0) - new Date(a.lastActive || 0);
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
            <div>
              <h3 className="text-2xl font-bold">User Details</h3>
              <p className="text-emerald-100 text-sm" dir="rtl">تفاصيل المستخدم</p>
            </div>
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
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{user.name || 'Unknown User'}</h4>
                  <p className="text-gray-600">{user.email || 'No email'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-gray-900 font-semibold">Join Date</span>
                  <span className="text-gray-500 text-sm ml-2" dir="rtl">تاريخ الانضمام</span>
                  <p className="font-semibold text-gray-700">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-900 font-semibold">Last Active</span>
                  <span className="text-gray-500 text-sm ml-2" dir="rtl">آخر نشاط</span>
                  <p className="font-semibold text-gray-700">
                    {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-900 font-semibold">Status</span>
                  <span className="text-gray-500 text-sm ml-2" dir="rtl">الحالة</span>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-900 font-semibold">Role</span>
                  <span className="text-gray-500 text-sm ml-2" dir="rtl">الدور</span>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : 'User'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h5 className="font-bold text-gray-900">User Statistics</h5>
                <span className="text-gray-500 text-sm" dir="rtl">إحصائيات المستخدم</span>
              </div>
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">{user.totalDownloads || 0}</p>
                    <p className="text-emerald-700 text-sm font-semibold">Total Downloads</p>
                    <p className="text-emerald-600 text-xs" dir="rtl">إجمالي التحميلات</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{user.monthlyDownloads || 0}</p>
                    <p className="text-blue-700 text-sm font-semibold">This Month</p>
                    <p className="text-blue-600 text-xs" dir="rtl">هذا الشهر</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-2">Account ID</p>
                    <p className="text-sm font-mono text-gray-800 break-all">{user._id || user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => handleUserAction(user._id || user.id, user.status === 'active' ? 'deactivate' : 'activate')}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${
                user.status === 'active'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              disabled={user.role === 'admin'} // Prevent admin self-deactivation
            >
              {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 bg-gray-600 text-white hover:bg-gray-700"
            >
              Close
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
        <span className="ml-3 text-emerald-700">Loading users...</span>
        <span className="mr-3 text-emerald-600 text-sm" dir="rtl">جاري تحميل المستخدمين</span>
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
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <span className="text-gray-500" dir="rtl">إدارة المستخدمين</span>
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="py-3 px-4 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="inactive">Inactive Users</option>
            <option value="admin">Administrators</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-3 px-4 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="createdAt">Sort by Join Date</option>
            <option value="name">Sort by Name</option>
            <option value="totalDownloads">Sort by Downloads</option>
            <option value="lastActive">Sort by Last Active</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-500 mb-2">No users found</p>
            <p className="text-gray-400 text-sm" dir="rtl">لم يتم العثور على مستخدمين</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-50 border-b border-emerald-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">
                    <div className="flex flex-col">
                      <span>User</span>
                      <span className="text-xs text-emerald-600" dir="rtl">المستخدم</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">
                    <div className="flex flex-col">
                      <span>Role</span>
                      <span className="text-xs text-emerald-600" dir="rtl">الدور</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">
                    <div className="flex flex-col">
                      <span>Join Date</span>
                      <span className="text-xs text-emerald-600" dir="rtl">تاريخ الانضمام</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">
                    <div className="flex flex-col">
                      <span>Downloads</span>
                      <span className="text-xs text-emerald-600" dir="rtl">التحميلات</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">
                    <div className="flex flex-col">
                      <span>Status</span>
                      <span className="text-xs text-emerald-600" dir="rtl">الحالة</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">
                    <div className="flex flex-col">
                      <span>Actions</span>
                      <span className="text-xs text-emerald-600" dir="rtl">الإجراءات</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id || user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-emerald-25 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-emerald-600">
                            {(user.name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name || 'Unknown User'}</div>
                          <div className="text-sm text-gray-600">{user.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-emerald-600">{user.totalDownloads || 0}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-emerald-600 hover:text-emerald-800 font-semibold text-sm hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-center text-gray-600">
        <span>Showing {filteredUsers.length} of {users.length} users</span>
        <span className="text-gray-500 text-sm ml-3" dir="rtl">عرض {filteredUsers.length} من أصل {users.length} مستخدم</span>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserManagement;