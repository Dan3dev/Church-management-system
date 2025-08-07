import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Mail, Smartphone, Globe } from 'lucide-react';

interface SettingsProps {
  currentUser: any;
  onUpdateSettings: (settings: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'Church',
      lastName: 'Admin',
      email: 'admin@church.com',
      phone: '(555) 123-4567',
      role: 'admin'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      birthdayReminders: true,
      attendanceAlerts: true,
      givingReminders: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    system: {
      churchName: 'ChurchHub Demo',
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      fiscalYearStart: 'January'
    },
    communication: {
      emailProvider: 'smtp',
      smsProvider: 'twilio',
      defaultSender: 'ChurchHub',
      autoResponders: true
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Database },
    { id: 'communication', label: 'Communication', icon: Mail }
  ];

  const handleSave = () => {
    onUpdateSettings(settings);
    // Show success message
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={settings.profile.firstName}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, firstName: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={settings.profile.lastName}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, lastName: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, email: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={settings.profile.phone}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, phone: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </span>
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, [key]: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
          <input
            type="checkbox"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, twoFactorAuth: e.target.checked }
            })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
          <input
            type="number"
            value={settings.security.passwordExpiry}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, passwordExpiry: parseInt(e.target.value) }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">System Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Church Name</label>
          <input
            type="text"
            value={settings.system.churchName}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, churchName: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.system.timezone}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, timezone: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.system.currency}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, currency: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD ($)</option>
            <option value="CAD">CAD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <select
            value={settings.system.dateFormat}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, dateFormat: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderCommunicationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Communication Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Provider</label>
          <select
            value={settings.communication.emailProvider}
            onChange={(e) => setSettings({
              ...settings,
              communication: { ...settings.communication, emailProvider: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="smtp">SMTP</option>
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMS Provider</label>
          <select
            value={settings.communication.smsProvider}
            onChange={(e) => setSettings({
              ...settings,
              communication: { ...settings.communication, smsProvider: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="twilio">Twilio</option>
            <option value="nexmo">Nexmo</option>
            <option value="aws-sns">AWS SNS</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Default Sender Name</label>
          <input
            type="text"
            value={settings.communication.defaultSender}
            onChange={(e) => setSettings({
              ...settings,
              communication: { ...settings.communication, defaultSender: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.communication.autoResponders}
              onChange={(e) => setSettings({
                ...settings,
                communication: { ...settings.communication, autoResponders: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Enable Auto-Responders</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && renderProfileSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'system' && renderSystemSettings()}
          {activeTab === 'communication' && renderCommunicationSettings()}
        </div>
      </div>
    </div>
  );
};

export default Settings;