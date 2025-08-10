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
  Shield,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  Copy
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
    { id: '2', provider: 'teams', isConnected: false, autoNotifications: false, notificationTypes: [] },
    { id: '3', provider: 'discord', isConnected: false, autoNotifications: false, notificationTypes: [] }
  ]);

  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);

  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [showAPIKeyForm, setShowAPIKeyForm] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

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
    { id: 'google-drive', name: 'Google Drive', icon: '📁', color: 'blue', description: 'Store documents in Google Drive' },
    { id: 'dropbox', name: 'Dropbox', icon: '📦', color: 'blue', description: 'Sync files with Dropbox' },
    { id: 'onedrive', name: 'OneDrive', icon: '☁️', color: 'blue', description: 'Microsoft OneDrive integration' }
  ];

  const calendarProviders = [
    { id: 'google', name: 'Google Calendar', icon: '📅', color: 'red', description: 'Sync events with Google Calendar' },
    { id: 'outlook', name: 'Outlook Calendar', icon: '📆', color: 'blue', description: 'Microsoft Outlook calendar sync' }
  ];

  const communicationProviders = [
    { id: 'slack', name: 'Slack', icon: '💬', color: 'purple', description: 'Send notifications to Slack channels' },
    { id: 'teams', name: 'Microsoft Teams', icon: '👥', color: 'blue', description: 'Integrate with Microsoft Teams' },
    { id: 'discord', name: 'Discord', icon: '🎮', color: 'indigo', description: 'Connect with Discord servers' }
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

  // Cloud Storage Functions
  const connectStorage = async (providerId: string) => {
    setSyncing(providerId);
    
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCloudStorages(storages => 
      storages.map(storage => 
        storage.provider === providerId 
          ? { 
              ...storage, 
              isConnected: true, 
              lastSync: new Date().toISOString(),
              folderPath: '/ChurchHub',
              autoSync: true
            }
          : storage
      )
    );
    
    setSyncing(null);
    onConnect({ type: 'storage', provider: providerId, status: 'connected' });
  };

  const disconnectStorage = (providerId: string) => {
    setCloudStorages(storages => 
      storages.map(storage => 
        storage.provider === providerId 
          ? { ...storage, isConnected: false, autoSync: false }
          : storage
      )
    );
  };

  const syncStorage = async (providerId: string) => {
    setSyncing(providerId);
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCloudStorages(storages => 
      storages.map(storage => 
        storage.provider === providerId 
          ? { ...storage, lastSync: new Date().toISOString() }
          : storage
      )
    );
    
    setSyncing(null);
  };

  // Calendar Functions
  const connectCalendar = async (providerId: string) => {
    setSyncing(providerId);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCalendarIntegrations(calendars => 
      calendars.map(calendar => 
        calendar.provider === providerId 
          ? { 
              ...calendar, 
              isConnected: true, 
              lastSync: new Date().toISOString(),
              syncEvents: true,
              calendarId: `church-${providerId}-calendar`
            }
          : calendar
      )
    );
    
    setSyncing(null);
    onConnect({ type: 'calendar', provider: providerId, status: 'connected' });
  };

  const toggleCalendarSync = (providerId: string, syncEvents: boolean) => {
    setCalendarIntegrations(calendars => 
      calendars.map(calendar => 
        calendar.provider === providerId 
          ? { ...calendar, syncEvents }
          : calendar
      )
    );
  };

  // Communication Functions
  const connectCommunication = async (providerId: string) => {
    setSyncing(providerId);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCommunicationIntegrations(comms => 
      comms.map(comm => 
        comm.provider === providerId 
          ? { 
              ...comm, 
              isConnected: true, 
              lastUsed: new Date().toISOString(),
              autoNotifications: true,
              notificationTypes: ['member.created', 'event.created', 'system.alert']
            }
          : comm
      )
    );
    
    setSyncing(null);
    onConnect({ type: 'communication', provider: providerId, status: 'connected' });
  };

  const toggleNotifications = (providerId: string, autoNotifications: boolean) => {
    setCommunicationIntegrations(comms => 
      comms.map(comm => 
        comm.provider === providerId 
          ? { ...comm, autoNotifications }
          : comm
      )
    );
  };

  // Webhook Functions
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
    onConnect({ type: 'webhook', webhook, status: 'created' });
  };

  const toggleWebhook = (id: string, isActive: boolean) => {
    setWebhooks(webhooks.map(w => 
      w.id === id ? { ...w, isActive } : w
    ));
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
  };

  const testWebhook = async (webhook: WebhookEndpoint) => {
    try {
      // Simulate webhook test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWebhooks(webhooks.map(w => 
        w.id === webhook.id 
          ? { ...w, successCount: w.successCount + 1, lastTriggered: new Date().toISOString() }
          : w
      ));
      
      alert('Webhook test successful!');
    } catch (error) {
      setWebhooks(webhooks.map(w => 
        w.id === webhook.id 
          ? { ...w, failureCount: w.failureCount + 1 }
          : w
      ));
      
      alert('Webhook test failed!');
    }
  };

  // API Key Functions
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
    onConnect({ type: 'api', apiKey, status: 'created' });
  };

  const toggleAPIKey = (id: string, isActive: boolean) => {
    setApiKeys(apiKeys.map(k => 
      k.id === id ? { ...k, isActive } : k
    ));
  };

  const deleteAPIKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const copyAPIKey = (key: string) => {
    navigator.clipboard.writeText(key);
    alert('API key copied to clipboard!');
  };

  const renderStorageTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storageProviders.map((provider) => {
          const storage = cloudStorages.find(s => s.provider === provider.id);
          const isConnecting = syncing === provider.id;
          
          return (
            <div key={provider.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-xs text-gray-500">{provider.description}</p>
                  </div>
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
                
                {storage?.isConnected && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Folder:</span>
                      <span className="text-gray-900 font-mono text-xs">{storage.folderPath}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Auto Sync:</span>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={storage.autoSync}
                          onChange={(e) => {
                            setCloudStorages(storages => 
                              storages.map(s => 
                                s.id === storage.id ? { ...s, autoSync: e.target.checked } : s
                              )
                            );
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                    {storage.lastSync && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last Sync:</span>
                        <span className="text-gray-900">{new Date(storage.lastSync).toLocaleString()}</span>
                      </div>
                    )}
                  </>
                )}
                
                <div className="flex space-x-2">
                  {storage?.isConnected ? (
                    <>
                      <button
                        onClick={() => syncStorage(provider.id)}
                        disabled={isConnecting}
                        className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
                        <span>{isConnecting ? 'Syncing...' : 'Sync Now'}</span>
                      </button>
                      <button
                        onClick={() => disconnectStorage(provider.id)}
                        className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => connectStorage(provider.id)}
                      disabled={isConnecting}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4" />
                          <span>Connect</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
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
          const isConnecting = syncing === provider.id;
          
          return (
            <div key={provider.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-xs text-gray-500">{provider.description}</p>
                  </div>
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
                      <span className="text-gray-600">Sync Events:</span>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={calendar.syncEvents}
                          onChange={(e) => toggleCalendarSync(provider.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sync Direction:</span>
                      <select
                        value={calendar.syncDirection}
                        onChange={(e) => {
                          setCalendarIntegrations(calendars => 
                            calendars.map(c => 
                              c.id === calendar.id 
                                ? { ...c, syncDirection: e.target.value as 'one-way' | 'two-way' }
                                : c
                            )
                          );
                        }}
                        className="text-xs px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="one-way">One-way</option>
                        <option value="two-way">Two-way</option>
                      </select>
                    </div>
                    {calendar.lastSync && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last Sync:</span>
                        <span className="text-gray-900">{new Date(calendar.lastSync).toLocaleString()}</span>
                      </div>
                    )}
                  </>
                )}
                
                <button
                  onClick={() => calendar?.isConnected ? null : connectCalendar(provider.id)}
                  disabled={calendar?.isConnected || isConnecting}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    calendar?.isConnected 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isConnecting ? 'Connecting...' : calendar?.isConnected ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCommunicationTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {communicationProviders.map((provider) => {
          const comm = communicationIntegrations.find(c => c.provider === provider.id);
          const isConnecting = syncing === provider.id;
          
          return (
            <div key={provider.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-xs text-gray-500">{provider.description}</p>
                  </div>
                </div>
                {comm?.isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${comm?.isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                    {comm?.isConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                
                {comm?.isConnected && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Auto Notifications:</span>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={comm.autoNotifications}
                          onChange={(e) => toggleNotifications(provider.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Events:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {comm.notificationTypes.map((type, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                <button
                  onClick={() => comm?.isConnected ? null : connectCommunication(provider.id)}
                  disabled={comm?.isConnected || isConnecting}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    comm?.isConnected 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isConnecting ? 'Connecting...' : comm?.isConnected ? 'Connected' : 'Connect'}
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
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Webhook</span>
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
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
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{webhook.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    webhook.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {webhook.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-mono mb-2">{webhook.url}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{webhook.events.length} events</span>
                  <span className="text-green-600">{webhook.successCount} success</span>
                  <span className="text-red-600">{webhook.failureCount} failures</span>
                  {webhook.lastTriggered && (
                    <span>Last: {new Date(webhook.lastTriggered).toLocaleString()}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => testWebhook(webhook)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Test
                </button>
                <button
                  onClick={() => toggleWebhook(webhook.id, !webhook.isActive)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    webhook.isActive 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {webhook.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => deleteWebhook(webhook.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
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
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Generate API Key</span>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
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
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{apiKey.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    apiKey.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {apiKey.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                    {apiKey.key}
                  </p>
                  <button
                    onClick={() => copyAPIKey(apiKey.key)}
                    className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{apiKey.permissions.length} permissions</span>
                  <span>{apiKey.usageCount} requests</span>
                  <span>Created {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAPIKey(apiKey.id, !apiKey.isActive)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    apiKey.isActive 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {apiKey.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => deleteAPIKey(apiKey.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
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
            {cloudStorages.filter(s => s.isConnected).length + calendarIntegrations.filter(c => c.isConnected).length + communicationIntegrations.filter(c => c.isConnected).length} integrations active
          </span>
        </div>
      </div>

      {/* Integration Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Cloud className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {cloudStorages.filter(s => s.isConnected).length}
            </p>
            <p className="text-sm text-gray-500">Cloud Storage</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {calendarIntegrations.filter(c => c.isConnected).length}
            </p>
            <p className="text-sm text-gray-500">Calendar Sync</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {communicationIntegrations.filter(c => c.isConnected).length}
            </p>
            <p className="text-sm text-gray-500">Communication</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <Webhook className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{webhooks.length + apiKeys.length}</p>
            <p className="text-sm text-gray-500">API & Webhooks</p>
          </div>
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
          {activeTab === 'communication' && renderCommunicationTab()}
          {activeTab === 'webhooks' && renderWebhooksTab()}
          {activeTab === 'api' && renderAPITab()}
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;