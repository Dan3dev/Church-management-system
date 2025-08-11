import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Currency, Language, Notification } from '../types';

interface AppState {
  currentLanguage: string;
  baseCurrency: string;
  currencies: Currency[];
  languages: Language[];
  notifications: Notification[];
  integrations: {
    googleDrive: { connected: boolean; accessToken?: string; lastSync?: string };
    dropbox: { connected: boolean; accessToken?: string; lastSync?: string };
    onedrive: { connected: boolean; accessToken?: string; lastSync?: string };
    googleCalendar: { connected: boolean; accessToken?: string; calendarId?: string };
    outlook: { connected: boolean; accessToken?: string; calendarId?: string };
    slack: { connected: boolean; webhookUrl?: string; channelId?: string };
    teams: { connected: boolean; webhookUrl?: string; channelId?: string };
    discord: { connected: boolean; webhookUrl?: string; channelId?: string };
  };
  exchangeRates: { [key: string]: number };
  translations: { [language: string]: { [key: string]: string } };
}

type AppAction = 
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_CURRENCY'; payload: string }
  | { type: 'UPDATE_EXCHANGE_RATES'; payload: { [key: string]: number } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CONNECT_INTEGRATION'; payload: { service: string; data: any } }
  | { type: 'DISCONNECT_INTEGRATION'; payload: string }
  | { type: 'UPDATE_TRANSLATIONS'; payload: { language: string; translations: { [key: string]: string } } };

const initialState: AppState = {
  currentLanguage: 'en',
  baseCurrency: 'USD',
  currencies: [
    { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, isBaseCurrency: true, lastUpdated: new Date().toISOString() },
    { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.85, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.73, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', exchangeRate: 1.25, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', exchangeRate: 1.35, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 110.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', exchangeRate: 0.92, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', exchangeRate: 6.45, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', exchangeRate: 74.5, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', exchangeRate: 5.2, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', exchangeRate: 20.1, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', exchangeRate: 14.8, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', exchangeRate: 110.5, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', exchangeRate: 411.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', exchangeRate: 6.1, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', exchangeRate: 3550.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', exchangeRate: 2310.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', exchangeRate: 43.5, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', exchangeRate: 1020.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', exchangeRate: 585.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() }
  ],
  languages: [
    { code: 'en', name: 'English', nativeName: 'English', isRTL: false, isActive: true, completeness: 100 },
    { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false, isActive: true, completeness: 95 },
    { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false, isActive: true, completeness: 90 },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', isRTL: false, isActive: true, completeness: 88 },
    { code: 'de', name: 'German', nativeName: 'Deutsch', isRTL: false, isActive: false, completeness: 85 },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', isRTL: false, isActive: false, completeness: 82 },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', isRTL: false, isActive: false, completeness: 80 },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true, isActive: true, completeness: 78 },
    { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', isRTL: false, isActive: false, completeness: 75 },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', isRTL: false, isActive: false, completeness: 70 },
    { code: 'ko', name: 'Korean', nativeName: '한국어', isRTL: false, isActive: false, completeness: 68 },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isRTL: false, isActive: false, completeness: 65 },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', isRTL: false, isActive: true, completeness: 85 },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', isRTL: false, isActive: false, completeness: 60 },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', isRTL: false, isActive: false, completeness: 55 },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo', isRTL: false, isActive: false, completeness: 50 },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa', isRTL: false, isActive: false, completeness: 48 },
    { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', isRTL: false, isActive: false, completeness: 45 },
    { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', isRTL: false, isActive: false, completeness: 70 },
    { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', isRTL: false, isActive: false, completeness: 40 }
  ],
  notifications: [],
  integrations: {
    googleDrive: { connected: false },
    dropbox: { connected: false },
    onedrive: { connected: false },
    googleCalendar: { connected: false },
    outlook: { connected: false },
    slack: { connected: false },
    teams: { connected: false },
    discord: { connected: false }
  },
  exchangeRates: {},
  translations: {
    en: {
      'dashboard': 'Dashboard',
      'members': 'Members',
      'finance': 'Finance',
      'events': 'Events',
      'reports': 'Reports',
      'settings': 'Settings',
      'save': 'Save',
      'cancel': 'Cancel',
      'delete': 'Delete',
      'edit': 'Edit',
      'add': 'Add',
      'export': 'Export',
      'import': 'Import',
      'search': 'Search',
      'filter': 'Filter',
      'total': 'Total',
      'active': 'Active',
      'inactive': 'Inactive',
      'name': 'Name',
      'email': 'Email',
      'phone': 'Phone',
      'address': 'Address',
      'date': 'Date',
      'amount': 'Amount',
      'description': 'Description',
      'status': 'Status',
      'type': 'Type',
      'category': 'Category'
    },
    es: {
      'dashboard': 'Panel de Control',
      'members': 'Miembros',
      'finance': 'Finanzas',
      'events': 'Eventos',
      'reports': 'Informes',
      'settings': 'Configuración',
      'save': 'Guardar',
      'cancel': 'Cancelar',
      'delete': 'Eliminar',
      'edit': 'Editar',
      'add': 'Agregar',
      'export': 'Exportar',
      'import': 'Importar',
      'search': 'Buscar',
      'filter': 'Filtrar',
      'total': 'Total',
      'active': 'Activo',
      'inactive': 'Inactivo',
      'name': 'Nombre',
      'email': 'Correo',
      'phone': 'Teléfono',
      'address': 'Dirección',
      'date': 'Fecha',
      'amount': 'Cantidad',
      'description': 'Descripción',
      'status': 'Estado',
      'type': 'Tipo',
      'category': 'Categoría'
    },
    fr: {
      'dashboard': 'Tableau de Bord',
      'members': 'Membres',
      'finance': 'Finance',
      'events': 'Événements',
      'reports': 'Rapports',
      'settings': 'Paramètres',
      'save': 'Enregistrer',
      'cancel': 'Annuler',
      'delete': 'Supprimer',
      'edit': 'Modifier',
      'add': 'Ajouter',
      'export': 'Exporter',
      'import': 'Importer',
      'search': 'Rechercher',
      'filter': 'Filtrer',
      'total': 'Total',
      'active': 'Actif',
      'inactive': 'Inactif',
      'name': 'Nom',
      'email': 'Email',
      'phone': 'Téléphone',
      'address': 'Adresse',
      'date': 'Date',
      'amount': 'Montant',
      'description': 'Description',
      'status': 'Statut',
      'type': 'Type',
      'category': 'Catégorie'
    },
    sw: {
      'dashboard': 'Dashibodi',
      'members': 'Wanachama',
      'finance': 'Fedha',
      'events': 'Matukio',
      'reports': 'Ripoti',
      'settings': 'Mipangilio',
      'save': 'Hifadhi',
      'cancel': 'Ghairi',
      'delete': 'Futa',
      'edit': 'Hariri',
      'add': 'Ongeza',
      'export': 'Hamisha',
      'import': 'Leta',
      'search': 'Tafuta',
      'filter': 'Chuja',
      'total': 'Jumla',
      'active': 'Hai',
      'inactive': 'Haifanyi',
      'name': 'Jina',
      'email': 'Barua Pepe',
      'phone': 'Simu',
      'address': 'Anwani',
      'date': 'Tarehe',
      'amount': 'Kiasi',
      'description': 'Maelezo',
      'status': 'Hali',
      'type': 'Aina',
      'category': 'Jamii'
    }
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        currentLanguage: action.payload
      };
    case 'SET_CURRENCY':
      return {
        ...state,
        baseCurrency: action.payload,
        currencies: state.currencies.map(c => ({
          ...c,
          isBaseCurrency: c.code === action.payload
        }))
      };
    case 'UPDATE_EXCHANGE_RATES':
      return {
        ...state,
        exchangeRates: action.payload,
        currencies: state.currencies.map(c => ({
          ...c,
          exchangeRate: action.payload[c.code] || c.exchangeRate,
          lastUpdated: new Date().toISOString()
        }))
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    case 'CONNECT_INTEGRATION':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          [action.payload.service]: {
            ...state.integrations[action.payload.service as keyof typeof state.integrations],
            connected: true,
            ...action.payload.data
          }
        }
      };
    case 'DISCONNECT_INTEGRATION':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          [action.payload]: {
            connected: false
          }
        }
      };
    case 'UPDATE_TRANSLATIONS':
      return {
        ...state,
        translations: {
          ...state.translations,
          [action.payload.language]: {
            ...state.translations[action.payload.language],
            ...action.payload.translations
          }
        }
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  t: (key: string) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  convertCurrency: (amount: number, from: string, to: string) => number;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Translation function
  const t = (key: string): string => {
    return state.translations[state.currentLanguage]?.[key] || key;
  };

  // Currency formatting function
  const formatCurrency = (amount: number, currency?: string): string => {
    const currencyCode = currency || state.baseCurrency;
    const currencyInfo = state.currencies.find(c => c.code === currencyCode);
    const symbol = currencyInfo?.symbol || currencyCode;
    
    return `${symbol} ${amount.toLocaleString()}`;
  };

  // Currency conversion function
  const convertCurrency = (amount: number, from: string, to: string): number => {
    const fromRate = state.currencies.find(c => c.code === from)?.exchangeRate || 1;
    const toRate = state.currencies.find(c => c.code === to)?.exchangeRate || 1;
    return (amount / fromRate) * toRate;
  };

  // Auto-update exchange rates every hour
  useEffect(() => {
    const updateRates = async () => {
      try {
        // Simulate API call to get real exchange rates
        const mockRates: { [key: string]: number } = {};
        state.currencies.forEach(currency => {
          if (!currency.isBaseCurrency) {
            // Simulate rate fluctuation
            const currentRate = currency.exchangeRate;
            const fluctuation = (Math.random() - 0.5) * 0.1; // ±5% fluctuation
            mockRates[currency.code] = currentRate * (1 + fluctuation);
          } else {
            mockRates[currency.code] = 1.0;
          }
        });
        
        dispatch({ type: 'UPDATE_EXCHANGE_RATES', payload: mockRates });
      } catch (error) {
        console.error('Failed to update exchange rates:', error);
      }
    };

    // Update rates immediately and then every hour
    updateRates();
    const interval = setInterval(updateRates, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Apply language changes to document
  useEffect(() => {
    const language = state.languages.find(l => l.code === state.currentLanguage);
    if (language) {
      document.documentElement.lang = language.code;
      document.documentElement.dir = language.isRTL ? 'rtl' : 'ltr';
      document.title = t('dashboard') + ' - ChurchHub';
    }
  }, [state.currentLanguage]);

  return (
    <AppContext.Provider value={{ state, dispatch, t, formatCurrency, convertCurrency }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};