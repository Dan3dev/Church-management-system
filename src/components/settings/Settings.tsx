import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Smartphone, 
  Globe,
  DollarSign,
  MapPin,
  Clock,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SettingsProps {
  currentUser: any;
  onUpdateSettings: (settings: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const { 
    state, 
    changeLanguage, 
    changeCurrency, 
    connectIntegration, 
    disconnectIntegration,
    sendNotification,
    formatCurrency,
    t
  } = useApp();

  const [settings, setSettings] = useState({
    profile: {
      firstName: 'Church',
      lastName: 'Admin',
      email: 'admin@church.com',
      phone: '+254 700 000 000',
      idNumber: '12345678',
      county: 'Nairobi',
      constituency: 'Westlands',
      ward: 'Parklands',
      role: 'admin'
    },
    church: {
      name: 'Grace Community Church',
      address: 'Nairobi, Kenya',
      phone: '+254 700 000 001',
      email: 'info@gracechurch.co.ke',
      website: 'www.gracechurch.co.ke',
      registrationNumber: 'REG/2020/001',
      taxPin: 'P051234567A',
      mpesaBusinessNumber: '174379',
      mpesaPasskey: 'demo_passkey_123'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      birthdayReminders: true,
      attendanceAlerts: true,
      givingReminders: true,
      mpesaNotifications: true,
      systemAlerts: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      requireStrongPasswords: true,
      auditLogging: true,
      dataEncryption: true
    },
    system: {
      timezone: 'Africa/Nairobi',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      fiscalYearStart: 'January',
      backupFrequency: 'daily',
      dataRetention: 7, // years
      autoUpdates: true
    },
    communication: {
      emailProvider: 'smtp',
      smsProvider: 'africastalking',
      defaultSender: 'ChurchHub Kenya',
      autoResponders: true,
      bulkSmsEnabled: true,
      emailTemplates: true
    },
    integrations: {
      mpesaEnabled: true,
      mpesaEnvironment: 'sandbox',
      googleDriveEnabled: false,
      slackEnabled: false,
      calendarSyncEnabled: false,
      webhooksEnabled: false
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'church', label: 'Church Info', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Database },
    { id: 'communication', label: 'Communication', icon: Mail },
    { id: 'integrations', label: 'Integrations', icon: Globe }
  ];

  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale',
    'Garissa', 'Kakamega', 'Machakos', 'Meru', 'Nyeri', 'Kericho', 'Embu', 'Migori',
    'Bungoma', 'Kilifi', 'Turkana', 'Kajiado', 'Kiambu', 'Murang\'a', 'Kirinyaga',
    'Nyandarua', 'Laikipia', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet',
    'Nandi', 'Baringo', 'West Pokot', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka Nithi',
    'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
    'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia',
    'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru',
    'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
    'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'
  ];

  const smsProviders = [
    { id: 'africastalking', name: 'Africa\'s Talking', description: 'Leading SMS provider in Kenya' },
    { id: 'safaricom', name: 'Safaricom SMS', description: 'Direct Safaricom SMS gateway' },
    { id: 'airtel', name: 'Airtel SMS', description: 'Airtel Kenya SMS service' },
    { id: 'telkom', name: 'Telkom SMS', description: 'Telkom Kenya SMS gateway' }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onUpdateSettings(settings);
      
      sendNotification({
        type: 'success',
        title: 'Settings Updated',
        message: 'All settings have been saved successfully',
        userId: 'system',
        priority: 'medium',
        category: 'settings',
        read: false
      });
    } catch (error) {
      sendNotification({
        type: 'error',
        title: 'Settings Update Failed',
        message: 'Failed to save settings. Please try again.',
        userId: 'system',
        priority: 'high',
        category: 'settings',
        read: false
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      sendNotification({
        type: 'success',
        title: 'Language Changed',
        message: `Interface language changed to ${state.languages.find(l => l.code === languageCode)?.name}`,
        userId: 'system',
        priority: 'medium',
        category: 'settings',
        read: false
      });
    } catch (error) {
      sendNotification({
        type: 'error',
        title: 'Language Change Failed',
        message: 'Failed to change language. Please try again.',
        userId: 'system',
        priority: 'high',
        category: 'settings',
        read: false
      });
    }
  };

  const handleCurrencyChange = async (currencyCode: string) => {
    try {
      await changeCurrency(currencyCode);
      sendNotification({
        type: 'success',
        title: 'Currency Changed',
        message: `Base currency changed to ${state.currencies.find(c => c.code === currencyCode)?.name}`,
        userId: 'system',
        priority: 'medium',
        category: 'settings',
        read: false
      });
    } catch (error) {
      sendNotification({
        type: 'error',
        title: 'Currency Change Failed',
        message: 'Failed to change currency. Please try again.',
        userId: 'system',
        priority: 'high',
        category: 'settings',
        read: false
      });
    }
  };

  const testIntegration = async (service: string) => {
    setTestingIntegration(service);
    try {
      const success = await connectIntegration(service);
      if (success) {
        sendNotification({
          type: 'success',
          title: 'Integration Test Successful',
          message: `${service} integration is working properly`,
          userId: 'system',
          priority: 'medium',
          category: 'integrations',
          read: false
        });
      }
    } catch (error) {
      sendNotification({
        type: 'error',
        title: 'Integration Test Failed',
        message: `Failed to test ${service} integration`,
        userId: 'system',
        priority: 'high',
        category: 'integrations',
        read: false
      });
    } finally {
      setTestingIntegration(null);
    }
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            placeholder="+254 700 000 000"
            value={settings.profile.phone}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, phone: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">National ID Number</label>
          <input
            type="text"
            placeholder="12345678"
            value={settings.profile.idNumber}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, idNumber: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
          <select
            value={settings.profile.county}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, county: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {kenyanCounties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderChurchSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Church Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Church Name</label>
          <input
            type="text"
            value={settings.church.name}
            onChange={(e) => setSettings({
              ...settings,
              church: { ...settings.church, name: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
          <input
            type="text"
            placeholder="REG/2020/001"
            value={settings.church.registrationNumber}
            onChange={(e) => setSettings({
              ...settings,
              church: { ...settings.church, registrationNumber: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">KRA PIN</label>
          <input
            type="text"
            placeholder="P051234567A"
            value={settings.church.taxPin}
            onChange={(e) => setSettings({
              ...settings,
              church: { ...settings.church, taxPin: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Business Number</label>
          <input
            type="text"
            placeholder="174379"
            value={settings.church.mpesaBusinessNumber}
            onChange={(e) => setSettings({
              ...settings,
              church: { ...settings.church, mpesaBusinessNumber: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Church Phone</label>
          <input
            type="tel"
            placeholder="+254 700 000 001"
            value={settings.church.phone}
            onChange={(e) => setSettings({
              ...settings,
              church: { ...settings.church, phone: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Church Email</label>
          <input
            type="email"
            placeholder="info@church.co.ke"
            value={settings.church.email}
            onChange={(e) => setSettings({
              ...settings,
              church: { ...settings.church, email: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Church Address</label>
        <textarea
          placeholder="Full church address in Kenya"
          value={settings.church.address}
          onChange={(e) => setSettings({
            ...settings,
            church: { ...settings.church, address: e.target.value }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">System Configuration</h3>
      
      {/* Language and Currency Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3">Language Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">System Language</label>
              <select
                value={state.currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {state.languages.filter(l => l.isActive).map(language => (
                  <option key={language.code} value={language.code}>
                    {language.nativeName} ({language.name})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-blue-700">
              Current: {state.languages.find(l => l.code === state.currentLanguage)?.nativeName}
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3">Currency Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Currency</label>
              <select
                value={state.baseCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {state.currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-green-700">
              Current: {formatCurrency(1000)} (Sample amount)
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <option value="Africa/Nairobi">East Africa Time (Nairobi)</option>
            <option value="Africa/Kampala">East Africa Time (Kampala)</option>
            <option value="Africa/Dar_es_Salaam">East Africa Time (Dar es Salaam)</option>
            <option value="Africa/Kigali">Central Africa Time (Kigali)</option>
            <option value="Africa/Lagos">West Africa Time (Lagos)</option>
            <option value="Africa/Cairo">Egypt Time (Cairo)</option>
            <option value="Africa/Johannesburg">South Africa Time (Johannesburg)</option>
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
            <option value="DD/MM/YYYY">DD/MM/YYYY (Kenyan Standard)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
          <select
            value={settings.system.timeFormat}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, timeFormat: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">24 Hour (14:30)</option>
            <option value="12h">12 Hour (2:30 PM)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year Start</label>
          <select
            value={settings.system.fiscalYearStart}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, fiscalYearStart: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="January">January (Calendar Year)</option>
            <option value="July">July (Kenyan Government FY)</option>
            <option value="April">April (Alternative FY)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderCommunicationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Communication Settings</h3>
      
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-medium text-orange-900 mb-3">SMS Configuration (Kenya)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {smsProviders.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} - {provider.description}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Sender ID</label>
            <input
              type="text"
              placeholder="ChurchHub"
              value={settings.communication.defaultSender}
              onChange={(e) => setSettings({
                ...settings,
                communication: { ...settings.communication, defaultSender: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

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
            <option value="smtp">SMTP Server</option>
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
            <option value="ses">Amazon SES</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
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
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.communication.bulkSmsEnabled}
              onChange={(e) => setSettings({
                ...settings,
                communication: { ...settings.communication, bulkSmsEnabled: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Bulk SMS</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Integration Settings</h3>
      
      {/* M-Pesa Integration */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-3">🇰🇪 M-Pesa Integration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
            <select
              value={settings.integrations.mpesaEnvironment}
              onChange={(e) => setSettings({
                ...settings,
                integrations: { ...settings.integrations, mpesaEnvironment: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sandbox">Sandbox (Testing)</option>
              <option value="production">Production (Live)</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.integrations.mpesaEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  integrations: { ...settings.integrations, mpesaEnabled: e.target.checked }
                })}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Enable M-Pesa</span>
            </label>
            <button
              onClick={() => testIntegration('mpesa')}
              disabled={testingIntegration === 'mpesa'}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              {testingIntegration === 'mpesa' ? 'Testing...' : 'Test'}
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Storage */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Cloud Storage</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['googleDrive', 'dropbox', 'onedrive'].map(service => {
            const integration = state.integrations[service as keyof typeof state.integrations];
            return (
              <div key={service} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 capitalize">{service.replace(/([A-Z])/g, ' $1')}</span>
                  {integration.connected ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Status: {integration.connected ? 'Connected' : 'Not Connected'}
                  </div>
                  {integration.connected && integration.lastSync && (
                    <div className="text-xs text-gray-500">
                      Last sync: {new Date(integration.lastSync).toLocaleString('en-KE')}
                    </div>
                  )}
                  <button
                    onClick={() => integration.connected ? disconnectIntegration(service) : testIntegration(service)}
                    disabled={testingIntegration === service}
                    className={`w-full px-3 py-2 text-sm rounded transition-colors ${
                      integration.connected 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    } disabled:opacity-50`}
                  >
                    {testingIntegration === service ? 'Connecting...' : integration.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Other System Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
          <select
            value={settings.system.backupFrequency}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, backupFrequency: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (Years)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.system.dataRetention}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, dataRetention: parseInt(e.target.value) }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.system.autoUpdates}
            onChange={(e) => setSettings({
              ...settings,
              system: { ...settings.system, autoUpdates: e.target.checked }
            })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Automatic Updates</span>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">General Notifications</h4>
          {Object.entries(settings.notifications).slice(0, 4).map(([key, value]) => (
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
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Kenyan-Specific Notifications</h4>
          {Object.entries(settings.notifications).slice(4).map(([key, value]) => (
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
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Require Strong Passwords</span>
            <input
              type="checkbox"
              checked={settings.security.requireStrongPasswords}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, requireStrongPasswords: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Audit Logging</span>
            <input
              type="checkbox"
              checked={settings.security.auditLogging}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, auditLogging: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              min="5"
              max="480"
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
              min="30"
              max="365"
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
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600 mt-1">Configure your Kenyan church management system</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Current System Status */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">🇰🇪 ChurchHub Kenya</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-green-100">Language</p>
                <p className="font-semibold">{state.languages.find(l => l.code === state.currentLanguage)?.nativeName}</p>
              </div>
              <div>
                <p className="text-green-100">Currency</p>
                <p className="font-semibold">{state.baseCurrency}</p>
              </div>
              <div>
                <p className="text-green-100">Timezone</p>
                <p className="font-semibold">EAT (UTC+3)</p>
              </div>
              <div>
                <p className="text-green-100">Integrations</p>
                <p className="font-semibold">{Object.values(state.integrations).filter(i => i.connected).length} Active</p>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">🇰🇪</div>
        </div>
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
          {activeTab === 'church' && renderChurchSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'system' && renderSystemSettings()}
          {activeTab === 'communication' && renderCommunicationSettings()}
          {activeTab === 'integrations' && renderIntegrationsSettings()}
        </div>
      </div>
    </div>
  );
};

export default Settings;