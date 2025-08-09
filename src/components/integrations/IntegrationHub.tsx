import React, { useState } from 'react';
import { 
  Cloud, 
  Calendar, 
  MessageSquare, 
  Database, 
  Webhook,
  Key,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Zap,
  Globe,
  Shield
} from 'lucide-react';
import { CloudStorage, CalendarIntegration, CommunicationIntegration, WebhookEndpoint, APIKey } from '../../types';

interface IntegrationHubProps {
  onConnect: (integration: any) => void;
}

const IntegrationHub: React.FC<IntegrationHubProps> = ({ onConnect }) => {
  const [activeTab, setActiveTab] = useState('storage');
  const [cloudStorages, setCloudStorages] = useState<CloudStorage[]>([
    { id: '1', provider: 'google-drive', isConnected: false, autoSync: false },
    { id: '2', provider: 'dropbox', isConnected: false, autoSync: false },
    { id: '3', provider: 'onedrive', isConnected: false, autoSync: false }
  ]);

  const [calendarIntegrations, setCalendarIntegrations] = useState<CalendarIntegration[]>([
    { id: '1', provider: 'google', isConnected: false, syncEvents: false, syncDirection: 'two-way' },
    { id: '2', provider: 'outlook', isConnected: false, syncEvents: false, syncDirection: 'two-way' }
  ]);

  const [communicationIntegrations, setCommunicationIntegrations] = useState<CommunicationIntegration[]>([
    { id: '1', provider: 'slack', isConnected: false, autoNotifications: false, notificationTypes: [] },
    { id: '2', provider: 'teams', isConnected: false, autoNotifications: false, notificationTypes: [] }
  ]);

  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);

  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [showAPIKeyForm, setShowAPIKeyForm] = useState(false);

  const [newWebhook, setNewWebhook] = useState<Omit<WebhookEndpoint, 'id' | 'successCount' | 'failureCount' | 'createdAt'>>({
    name: '',
    url: '',
    events: [],
    isActive: true,
    retryAttempts: 3
  });

  const [newAPIKey, setNewAPIKey] = useState<Omit<APIKey, 'id' | 'key' | 'usageCount' | 'createdAt'>>({
    name: '',
    permissions: [],
    isActive: true,
    createdBy: 'Admin'
  });

  const tabs = [
    { id: 'storage', label: 'Cloud Storage', icon: Cloud },
    { id: 'calendar', label: 'Calendar Sync', icon: Calendar },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'api', label: 'API Keys', icon: Key }
  ];

  const storageProviders = [
    { id: 'google-drive', name: 'Google Drive', icon: '📁', color: 'blue' },
    { id: 'dropbox', name: 'Dropbox', icon: '📦', color: 'blue' },
    { id: 'onedrive', name: 'OneDrive', icon: '☁️', color: 'blue' }
  ];

  const calendarProviders = [
    { id: 'google', name: 'Google Calendar', icon: '📅', color: 'red' },
    { id: 'outlook', name: 'Outlook Calendar', icon: '📆', color: 'blue' }
  ];

  const communicationProviders = [
    { id: 'slack', name: 'Slack', icon: '💬', color: 'purple' },
    { id: 'teams', name: 'Microsoft Teams', icon: '👥', color: 'blue' }
  ];

  const webhookEvents = [
    'member.created', 'member.updated', 'member.deleted',
    'attendance.recorded', 'giving.received', 'event.created',
    'communication.sent', 'user.login', 'system.backup'
  ];

  const apiPermissions = [
    'members.read', 'members.write', 'finance.read', 'finance.write',
    'events.read', 'events.write', 'reports.read', 'system.admin'
  ];

  const connectStorage = (providerId: string) => {
    setCloudStorages(storages => 
      storages.map(storage => 
        storage.provider === providerId 
          ? { ...storage, isConnected: true, lastSync: new Date().toISOString() }
          : storage
      )
    );
  };

  const connectCalendar = (providerId: string) => {
    setCalendarIntegrations(calendars => 
      calendars.map(calendar => 
        calendar.provider === providerId 
          ? { ...calendar, isConnected: true, lastSync: new Date().toISOString() }
          : calendar
      )
    );
  };

  const connectCommunication = (providerId: string) => {
    setCommunicationIntegrations(comms => 
      comms.map(comm => 
        comm.provider === providerId 
          ? { ...comm, isConnected: true, lastUsed: new Date().toISOString() }
          : comm
      )
    );
  };

  const addWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    const webhook: WebhookEndpoint = {
      ...newWebhook,
      id: Date.now().toString(),
      successCount: 0,
      failureCount: 0,
      createdAt: new Date().toISOString()
    };
    setWebhooks([...webhooks, webhook]);
    setNewWebhook({
      name: '',
      url: '',
      events: [],
      isActive: true,
      retryAttempts: 3
    });
    setShowWebhookForm(false);
  };

  const addAPIKey = (e: React.FormEvent) => {
    e.preventDefault();
    const apiKey: APIKey = {
      ...newAPIKey,
      id: Date.now().toString(),
      key: 'ck_' + Math.random().toString(36).substr(2, 32),
      usageCount: 0,
      createdAt: new Date().toISOString()
    };
    setApiKeys([...apiKeys, apiKey]);
    setNewAPIKey({
      name: '',
      permissions: [],
      isActive: true,
      createdBy: 'Admin'
    });
    setShowAPIKeyForm(false);
  };

  const renderStorageTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storageProviders.map((provider) => {
          const storage = cloudStorages.find(s => s.provider === provider.id);
          return (
            <div key={provider.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                </div>
                {storage?.isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${storage?.isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                    {storage?.isConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                
                {storage?.isConnected && storage.lastSync && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Sync:</span>
                    <span className="text-gray-900">{new Date(storage.lastSync).toLocaleString()}</span>
                  </div>
                )}
                
                <button
                  onClick={() => storage?.isConnected ? null : connectStorage(provider.id)}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    storage?.isConnected 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={storage?.isConnected}
                >
                  {storage?.isConnected ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCalendarTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calendarProviders.map((provider) => {
          const calendar = calendarIntegrations.find(c => c.provider === provider.id);
          return (
            <div key={provider.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                </div>
                {calendar?.isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${calendar?.isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                    {calendar?.isConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                
                {calendar?.isConnected && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sync Direction:</span>
                      <span className="text-gray-900">{calendar.syncDirection}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Events Sync:</span>
                      <span className={`font-medium ${calendar.syncEvents ? 'text-green-600' : 'text-gray-500'}`}>
                        {calendar.syncEvents ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </>
                )}
                
                <button
                  onClick={() => calendar?.isConnected ? null : connectCalendar(provider.id)}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    calendar?.isConnected 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={calendar?.isConnected}
                >
                  {calendar?.isConnected ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderWebhooksTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Webhook Endpoints</h3>
        <button
          onClick={() => setShowWebhookForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Webhook
        </button>
      </div>

      {showWebhookForm && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Add New Webhook</h4>
          <form onSubmit={addWebhook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Webhook Name"
                value={newWebhook.name}
                onChange={(e) => setNewWebhook({...newWebhook, name: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="url"
                placeholder="Webhook URL"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Events to Subscribe</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {webhookEvents.map(event => (
                  <label key={event} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newWebhook.events.includes(event)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewWebhook({...newWebhook, events: [...newWebhook.events, event]});
                        } else {
                          setNewWebhook({...newWebhook, events: newWebhook.events.filter(e => e !== event)});
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{event}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add Webhook
              </button>
              <button 
                type="button" 
                onClick={() => setShowWebhookForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{webhook.name}</h4>
                <p className="text-sm text-gray-600">{webhook.url}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{webhook.events.length} events</span>
                  <span>{webhook.successCount} success</span>
                  <span>{webhook.failureCount} failures</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  webhook.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {webhook.isActive ? 'Active' : 'Inactive'}
                </span>
                <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAPITab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
        <button
          onClick={() => setShowAPIKeyForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate API Key
        </button>
      </div>

      {showAPIKeyForm && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Generate New API Key</h4>
          <form onSubmit={addAPIKey} className="space-y-4">
            <input
              type="text"
              placeholder="API Key Name"
              value={newAPIKey.name}
              onChange={(e) => setNewAPIKey({...newAPIKey, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {apiPermissions.map(permission => (
                  <label key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newAPIKey.permissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewAPIKey({...newAPIKey, permissions: [...newAPIKey.permissions, permission]});
                        } else {
                          setNewAPIKey({...newAPIKey, permissions: newAPIKey.permissions.filter(p => p !== permission)});
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Generate Key
              </button>
              <button 
                type="button" 
                onClick={() => setShowAPIKeyForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{apiKey.name}</h4>
                <p className="text-sm text-gray-600 font-mono">{apiKey.key}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{apiKey.permissions.length} permissions</span>
                  <span>{apiKey.usageCount} requests</span>
                  <span>Created {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  apiKey.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {apiKey.isActive ? 'Active' : 'Inactive'}
                </span>
                <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integration Hub</h2>
          <p className="text-gray-600">Connect with third-party services and APIs</p>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-gray-600">
            {cloudStorages.filter(s => s.isConnected).length + calendarIntegrations.filter(c => c.isConnected).length} integrations active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'storage' && renderStorageTab()}
          {activeTab === 'calendar' && renderCalendarTab()}
          {activeTab === 'communication' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communicationProviders.map((provider) => {
                const comm = communicationIntegrations.find(c => c.provider === provider.id);
                return (
                  <div key={provider.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                      </div>
                      {comm?.isConnected ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    <button
                      onClick={() => comm?.isConnected ? null : connectCommunication(provider.id)}
                      className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        comm?.isConnected 
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      disabled={comm?.isConnected}
                    >
                      {comm?.isConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {activeTab === 'webhooks' && renderWebhooksTab()}
          {activeTab === 'api' && renderAPITab()}
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;