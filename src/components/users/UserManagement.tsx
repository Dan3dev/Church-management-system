import React, { useState } from 'react';
import { Shield, Plus, Edit, Trash2, User, Lock, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../../types';

interface UserManagementProps {
  users: UserProfile[];
  onAddUser: (user: Omit<UserProfile, 'id'>) => void;
  onUpdateUser: (id: string, user: Partial<UserProfile>) => void;
  onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [newUser, setNewUser] = useState<Omit<UserProfile, 'id'>>({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'member',
    permissions: [],
    campus: ['Main Campus'],
    isActive: true,
    preferences: {
      theme: 'light',
      language: 'English',
      timezone: 'America/New_York',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  });

  const roles = [
    { id: 'admin', label: 'Administrator', permissions: ['all'] },
    { id: 'pastor', label: 'Pastor', permissions: ['members', 'finance', 'reports', 'communication'] },
    { id: 'leader', label: 'Leader', permissions: ['members', 'events', 'volunteers'] },
    { id: 'member', label: 'Member', permissions: ['profile'] },
    { id: 'volunteer', label: 'Volunteer', permissions: ['profile', 'schedule'] }
  ];

  const allPermissions = [
    'members', 'finance', 'reports', 'communication', 'events', 
    'volunteers', 'children', 'sermons', 'documents', 'settings'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rolePermissions = roles.find(r => r.id === newUser.role)?.permissions || [];
    const userWithPermissions = {
      ...newUser,
      permissions: rolePermissions.includes('all') ? allPermissions : rolePermissions
    };

    if (editingUser) {
      onUpdateUser(editingUser.id, userWithPermissions);
      setEditingUser(null);
    } else {
      onAddUser(userWithPermissions);
    }
    resetForm();
  };

  const resetForm = () => {
    setNewUser({
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      role: 'member',
      permissions: [],
      campus: ['Main Campus'],
      isActive: true,
      preferences: {
        theme: 'light',
        language: 'English',
        timezone: 'America/New_York',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      }
    });
    setShowAddForm(false);
  };

  const startEdit = (user: UserProfile) => {
    setNewUser(user);
    setEditingUser(user);
    setShowAddForm(true);
  };

  const toggleUserStatus = (userId: string, isActive: boolean) => {
    onUpdateUser(userId, { isActive });
  };

  const activeUsers = users.filter(u => u.isActive);
  const adminUsers = users.filter(u => u.role === 'admin');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{activeUsers.length}</p>
            <p className="text-sm text-gray-500">Active Users</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{adminUsers.length}</p>
            <p className="text-sm text-gray-500">Administrators</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <User className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === 'pastor').length}
            </p>
            <p className="text-sm text-gray-500">Pastors</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <User className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === 'leader').length}
            </p>
            <p className="text-sm text-gray-500">Leaders</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={newUser.firstName}
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              
              <input
                type="text"
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <input
                type="tel"
                placeholder="Phone Number (optional)"
                value={newUser.phone || ''}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as UserProfile['role']})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.label}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Department (optional)"
                value={newUser.department || ''}
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="text"
                placeholder="Position (optional)"
                value={newUser.position || ''}
                onChange={(e) => setNewUser({...newUser, position: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="date"
                placeholder="Hire Date (optional)"
                value={newUser.hireDate || ''}
                onChange={(e) => setNewUser({...newUser, hireDate: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={newUser.isActive}
                onChange={(e) => setNewUser({...newUser, isActive: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">User is active</label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{user.email}</span>
                      <span>{user.phone}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                        user.role === 'pastor' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'leader' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                    {user.department && (
                      <p className="text-sm text-gray-500">{user.department} - {user.position}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right text-sm text-gray-500">
                    <p>Campus: {user.campus.join(', ')}</p>
                    {user.lastLogin && (
                      <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleUserStatus(user.id, !user.isActive)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      } transition-colors`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                    
                    <button
                      onClick={() => startEdit(user)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Permissions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{role.label}</h4>
              <div className="space-y-1">
                {role.permissions.includes('all') ? (
                  <span className="text-sm text-green-600">All Permissions</span>
                ) : (
                  role.permissions.map((permission) => (
                    <div key={permission} className="text-sm text-gray-600">
                      • {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;