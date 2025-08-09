import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Sync, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { OfflineAction } from '../../types';

interface OfflineManagerProps {
  isOnline: boolean;
  onSync: (actions: OfflineAction[]) => void;
}

const OfflineManager: React.FC<OfflineManagerProps> = ({ isOnline, onSync }) => {
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    // Load offline actions from localStorage
    const stored = localStorage.getItem('offlineActions');
    if (stored) {
      setOfflineActions(JSON.parse(stored));
    }

    // Auto-sync when coming back online
    if (isOnline && offlineActions.length > 0) {
      handleSync();
    }
  }, [isOnline]);

  const addOfflineAction = (action: Omit<OfflineAction, 'id' | 'timestamp' | 'synced'>) => {
    const newAction: OfflineAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      synced: false
    };

    const updatedActions = [...offlineActions, newAction];
    setOfflineActions(updatedActions);
    localStorage.setItem('offlineActions', JSON.stringify(updatedActions));
  };

  const handleSync = async () => {
    if (!isOnline || offlineActions.length === 0) return;

    setSyncing(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const syncedActions = offlineActions.map(action => ({
        ...action,
        synced: true
      }));

      setOfflineActions([]);
      localStorage.removeItem('offlineActions');
      setLastSync(new Date().toISOString());
      
      onSync(syncedActions);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const pendingActions = offlineActions.filter(a => !a.synced);
  const failedActions = offlineActions.filter(a => a.error);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Connection Status */}
      <div className={`mb-4 p-3 rounded-lg shadow-lg ${
        isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        <div className="flex items-center space-x-2">
          {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          <span className="text-sm font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </span>
          {pendingActions.length > 0 && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              {pendingActions.length}
            </span>
          )}
        </div>
      </div>

      {/* Offline Actions Panel */}
      {(pendingActions.length > 0 || failedActions.length > 0) && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Pending Sync</h3>
            {isOnline && (
              <button
                onClick={handleSync}
                disabled={syncing}
                className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Sync className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {pendingActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-gray-700">
                    {action.type} {action.entity}
                  </span>
                </div>
                <span className="text-xs text-yellow-600">Pending</span>
              </div>
            ))}

            {failedActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-700">
                    {action.type} {action.entity}
                  </span>
                </div>
                <span className="text-xs text-red-600">Failed</span>
              </div>
            ))}
          </div>

          {lastSync && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <CheckCircle className="h-3 w-3" />
                <span>Last sync: {new Date(lastSync).toLocaleTimeString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineManager;