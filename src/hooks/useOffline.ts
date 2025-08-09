import { useState, useEffect } from 'react';
import { OfflineAction } from '../types';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline actions from localStorage
    const stored = localStorage.getItem('offlineActions');
    if (stored) {
      setOfflineActions(JSON.parse(stored));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  const syncOfflineActions = async () => {
    if (!isOnline || offlineActions.length === 0) return;

    try {
      // In a real app, this would sync with the server
      console.log('Syncing offline actions:', offlineActions);
      
      // Clear offline actions after successful sync
      setOfflineActions([]);
      localStorage.removeItem('offlineActions');
      
      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    }
  };

  return {
    isOnline,
    offlineActions,
    addOfflineAction,
    syncOfflineActions
  };
};