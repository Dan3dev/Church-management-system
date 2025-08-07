import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Edit, Lock } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfilePageProps {
  currentUser: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(currentUser);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(currentUser);
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Handle password change logic here
    console.log('Password change requested');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedProfile({ ...editedProfile, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {editedProfile.avatar ? (
                    <img 
                      src={editedProfile.avatar} 
                      alt={`${editedProfile.firstName} ${editedProfile.lastName}`}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-blue-600" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </h3>
              <p className="text-gray-600 mb-2">{currentUser.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                currentUser.role === 'admin' ? 'bg-red-100 text-red-700' :
                currentUser.role === 'pastor' ? 'bg-purple-100 text-purple-700' :
                currentUser.role === 'leader' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </span>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{currentUser.campus.join(', ')}</span>
                  </div>
                  {currentUser.department && (
                    <div className="flex items-center justify-center space-x-2">
                      <span>{currentUser.department}</span>
                    </div>
                  )}
                  {currentUser.lastLogin && (
                    <div className="flex items-center justify-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Last login: {new Date(currentUser.lastLogin).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Lock className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Change Password</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.firstName}
                    onChange={(e) => setEditedProfile({...editedProfile, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentUser.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.lastName}
                    onChange={(e) => setEditedProfile({...editedProfile, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentUser.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentUser.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentUser.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.department || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentUser.department || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.position || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, position: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentUser.position || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                {isEditing ? (
                  <select
                    value={editedProfile.preferences.theme}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      preferences: {...editedProfile.preferences, theme: e.target.value as 'light' | 'dark' | 'system'}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{currentUser.preferences.theme}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                {isEditing ? (
                  <select
                    value={editedProfile.preferences.language}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      preferences: {...editedProfile.preferences, language: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{currentUser.preferences.language}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                {isEditing ? (
                  <select
                    value={editedProfile.preferences.timezone}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      preferences: {...editedProfile.preferences, timezone: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{currentUser.preferences.timezone}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Notification Preferences</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isEditing ? editedProfile.preferences.notifications.email : currentUser.preferences.notifications.email}
                    onChange={(e) => isEditing && setEditedProfile({
                      ...editedProfile,
                      preferences: {
                        ...editedProfile.preferences,
                        notifications: {...editedProfile.preferences.notifications, email: e.target.checked}
                      }
                    })}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Email notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isEditing ? editedProfile.preferences.notifications.sms : currentUser.preferences.notifications.sms}
                    onChange={(e) => isEditing && setEditedProfile({
                      ...editedProfile,
                      preferences: {
                        ...editedProfile.preferences,
                        notifications: {...editedProfile.preferences.notifications, sms: e.target.checked}
                      }
                    })}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">SMS notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isEditing ? editedProfile.preferences.notifications.push : currentUser.preferences.notifications.push}
                    onChange={(e) => isEditing && setEditedProfile({
                      ...editedProfile,
                      preferences: {
                        ...editedProfile.preferences,
                        notifications: {...editedProfile.preferences.notifications, push: e.target.checked}
                      }
                    })}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Push notifications</span>
                </label>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currentUser.permissions.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 capitalize">{permission}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;