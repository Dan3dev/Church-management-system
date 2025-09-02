import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Currency, Language, Notification } from '../types';
import { currencyService } from '../services/currencyService';
import { languageService } from '../services/languageService';
import { integrationService } from '../services/integrationService';

interface AppState {
  currentLanguage: string;
  baseCurrency: string;
  currencies: Currency[];
  languages: Language[];
  notifications: Notification[];
  integrations: {
    googleDrive: { connected: boolean; accessToken?: string; lastSync?: string; folderPath?: string };
    dropbox: { connected: boolean; accessToken?: string; lastSync?: string; folderPath?: string };
    onedrive: { connected: boolean; accessToken?: string; lastSync?: string; folderPath?: string };
    googleCalendar: { connected: boolean; accessToken?: string; calendarId?: string; lastSync?: string };
    outlook: { connected: boolean; accessToken?: string; calendarId?: string; lastSync?: string };
    slack: { connected: boolean; webhookUrl?: string; channelId?: string; lastUsed?: string };
    teams: { connected: boolean; webhookUrl?: string; channelId?: string; lastUsed?: string };
    discord: { connected: boolean; webhookUrl?: string; channelId?: string; lastUsed?: string };
  };
  exchangeRates: { [key: string]: number };
  translations: { [language: string]: { [key: string]: string } };
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  lastSync: string | null;
}

type AppAction = 
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_CURRENCY'; payload: string }
  | { type: 'UPDATE_EXCHANGE_RATES'; payload: { [key: string]: number } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'CONNECT_INTEGRATION'; payload: { service: string; data: any } }
  | { type: 'DISCONNECT_INTEGRATION'; payload: string }
  | { type: 'UPDATE_TRANSLATIONS'; payload: { language: string; translations: { [key: string]: string } } }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'UPDATE_LAST_SYNC'; payload: string };

const initialState: AppState = {
  currentLanguage: localStorage.getItem('churchhub_language') || 'en',
  baseCurrency: localStorage.getItem('churchhub_currency') || 'USD',
  currencies: [
    // Major World Currencies
    { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, isBaseCurrency: true, lastUpdated: new Date().toISOString() },
    { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.85, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.73, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', exchangeRate: 1.25, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', exchangeRate: 1.35, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 110.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', exchangeRate: 0.92, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', exchangeRate: 6.45, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    
    // African Currencies
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', exchangeRate: 150.25, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', exchangeRate: 411.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', exchangeRate: 6.1, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', exchangeRate: 3550.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', exchangeRate: 2310.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', exchangeRate: 43.5, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', exchangeRate: 1020.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', exchangeRate: 14.8, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', exchangeRate: 585.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    
    // Asian Currencies
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', exchangeRate: 74.5, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', exchangeRate: 1180.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', exchangeRate: 33.2, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱', exchangeRate: 50.8, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', exchangeRate: 14250.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', exchangeRate: 4.15, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', exchangeRate: 1.35, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    
    // Latin American Currencies
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', exchangeRate: 5.2, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', exchangeRate: 20.1, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$', exchangeRate: 98.5, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$', exchangeRate: 780.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'COP', name: 'Colombian Peso', symbol: '$', exchangeRate: 3850.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', exchangeRate: 3.65, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    
    // Middle Eastern Currencies
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', exchangeRate: 3.67, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', exchangeRate: 3.75, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'EGP', name: 'Egyptian Pound', symbol: '£', exchangeRate: 15.7, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    
    // European Currencies
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', exchangeRate: 8.6, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', exchangeRate: 8.9, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', exchangeRate: 6.3, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', exchangeRate: 3.9, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', exchangeRate: 21.8, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', exchangeRate: 295.0, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    
    // Pacific Currencies
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', exchangeRate: 1.42, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$', exchangeRate: 2.1, isBaseCurrency: false, lastUpdated: new Date().toISOString() }
  ],
  languages: [
    // Major World Languages
    { code: 'en', name: 'English', nativeName: 'English', isRTL: false, isActive: true, completeness: 100 },
    { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false, isActive: true, completeness: 95 },
    { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false, isActive: true, completeness: 90 },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', isRTL: false, isActive: true, completeness: 88 },
    { code: 'de', name: 'German', nativeName: 'Deutsch', isRTL: false, isActive: true, completeness: 85 },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', isRTL: false, isActive: true, completeness: 82 },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', isRTL: false, isActive: true, completeness: 80 },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true, isActive: true, completeness: 78 },
    { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', isRTL: false, isActive: true, completeness: 75 },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', isRTL: false, isActive: true, completeness: 70 },
    { code: 'ko', name: 'Korean', nativeName: '한국어', isRTL: false, isActive: true, completeness: 68 },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isRTL: false, isActive: true, completeness: 65 },
    
    // African Languages
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', isRTL: false, isActive: true, completeness: 85 },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', isRTL: false, isActive: true, completeness: 60 },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', isRTL: false, isActive: true, completeness: 55 },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo', isRTL: false, isActive: true, completeness: 50 },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa', isRTL: false, isActive: true, completeness: 48 },
    { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', isRTL: false, isActive: true, completeness: 45 },
    { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', isRTL: false, isActive: true, completeness: 70 },
    { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', isRTL: false, isActive: true, completeness: 40 },
    { code: 'lg', name: 'Luganda', nativeName: 'Luganda', isRTL: false, isActive: true, completeness: 35 },
    { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', isRTL: false, isActive: true, completeness: 30 },
    
    // Asian Languages
    { code: 'th', name: 'Thai', nativeName: 'ไทย', isRTL: false, isActive: true, completeness: 60 },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', isRTL: false, isActive: true, completeness: 58 },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', isRTL: false, isActive: true, completeness: 65 },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', isRTL: false, isActive: true, completeness: 55 },
    { code: 'tl', name: 'Filipino', nativeName: 'Filipino', isRTL: false, isActive: true, completeness: 50 },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isRTL: false, isActive: true, completeness: 45 },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', isRTL: true, isActive: true, completeness: 40 },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی', isRTL: true, isActive: true, completeness: 38 },
    
    // European Languages
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', isRTL: false, isActive: true, completeness: 75 },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', isRTL: false, isActive: true, completeness: 72 },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk', isRTL: false, isActive: true, completeness: 70 },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', isRTL: false, isActive: true, completeness: 68 },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', isRTL: false, isActive: true, completeness: 65 },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', isRTL: false, isActive: true, completeness: 62 },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština', isRTL: false, isActive: true, completeness: 60 },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', isRTL: false, isActive: true, completeness: 58 },
    { code: 'ro', name: 'Romanian', nativeName: 'Română', isRTL: false, isActive: true, completeness: 55 },
    { code: 'bg', name: 'Bulgarian', nativeName: 'Български', isRTL: false, isActive: true, completeness: 52 },
    { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', isRTL: false, isActive: true, completeness: 50 },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', isRTL: false, isActive: true, completeness: 48 },
    { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', isRTL: false, isActive: true, completeness: 45 },
    { code: 'et', name: 'Estonian', nativeName: 'Eesti', isRTL: false, isActive: true, completeness: 42 },
    { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', isRTL: false, isActive: true, completeness: 40 },
    { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', isRTL: false, isActive: true, completeness: 38 },
    
    // Pacific Languages
    { code: 'mi', name: 'Māori', nativeName: 'Te Reo Māori', isRTL: false, isActive: true, completeness: 35 },
    { code: 'fj', name: 'Fijian', nativeName: 'Na Vosa Vakaviti', isRTL: false, isActive: true, completeness: 30 },
    { code: 'to', name: 'Tongan', nativeName: 'Lea Fakatonga', isRTL: false, isActive: true, completeness: 25 },
    { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa', isRTL: false, isActive: true, completeness: 25 }
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
  translations: {},
  theme: (localStorage.getItem('churchhub_theme') as 'light' | 'dark' | 'system') || 'light',
  isOnline: navigator.onLine,
  lastSync: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      localStorage.setItem('churchhub_language', action.payload);
      return {
        ...state,
        currentLanguage: action.payload
      };
    case 'SET_CURRENCY':
      localStorage.setItem('churchhub_currency', action.payload);
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
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
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
    case 'SET_THEME':
      localStorage.setItem('churchhub_theme', action.payload);
      return {
        ...state,
        theme: action.payload
      };
    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload
      };
    case 'UPDATE_LAST_SYNC':
      return {
        ...state,
        lastSync: action.payload
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
  updateExchangeRates: () => Promise<void>;
  changeLanguage: (language: string) => Promise<void>;
  changeCurrency: (currency: string) => Promise<void>;
  connectIntegration: (service: string, config?: any) => Promise<boolean>;
  disconnectIntegration: (service: string) => Promise<void>;
  sendNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize services and load translations
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load translations for current language
        const translations = await languageService.loadTranslations(state.currentLanguage);
        dispatch({ 
          type: 'UPDATE_TRANSLATIONS', 
          payload: { language: state.currentLanguage, translations } 
        });

        // Update exchange rates
        await updateExchangeRates();

        // Apply theme
        applyTheme(state.theme);

        // Apply language settings
        applyLanguageSettings(state.currentLanguage);

        // Set up online/offline listeners
        const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
        const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  // Translation function
  const t = (key: string): string => {
    return state.translations[state.currentLanguage]?.[key] || key;
  };

  // Currency formatting function
  const formatCurrency = (amount: number, currency?: string): string => {
    const currencyCode = currency || state.baseCurrency;
    return currencyService.formatCurrency(amount, currencyCode, languageService.getLanguageLocale(state.currentLanguage));
  };

  // Currency conversion function
  const convertCurrency = (amount: number, from: string, to: string): number => {
    return currencyService.convertAmount(amount, from, to, state.exchangeRates);
  };

  // Update exchange rates
  const updateExchangeRates = async (): Promise<void> => {
    try {
      const rates = await currencyService.getExchangeRates(state.baseCurrency);
      dispatch({ type: 'UPDATE_EXCHANGE_RATES', payload: rates });
      
      // Notify about successful update
      sendNotification({
        type: 'success',
        title: 'Exchange Rates Updated',
        message: 'Currency exchange rates have been updated successfully',
        userId: 'system',
        priority: 'low',
        category: 'system',
        read: false
      });
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
      sendNotification({
        type: 'error',
        title: 'Exchange Rate Update Failed',
        message: 'Failed to update currency exchange rates. Please try again.',
        userId: 'system',
        priority: 'medium',
        category: 'system',
        read: false
      });
    }
  };

  // Change language globally
  const changeLanguage = async (language: string): Promise<void> => {
    try {
      // Load translations for new language
      const translations = await languageService.loadTranslations(language);
      
      // Update state
      dispatch({ type: 'SET_LANGUAGE', payload: language });
      dispatch({ 
        type: 'UPDATE_TRANSLATIONS', 
        payload: { language, translations } 
      });

      // Apply language settings globally
      applyLanguageSettings(language);

      // Notify about language change
      sendNotification({
        type: 'success',
        title: 'Language Changed',
        message: `Interface language changed to ${state.languages.find(l => l.code === language)?.name || language}`,
        userId: 'system',
        priority: 'low',
        category: 'settings',
        read: false
      });

      // Trigger re-render of all components
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
    } catch (error) {
      console.error('Failed to change language:', error);
      sendNotification({
        type: 'error',
        title: 'Language Change Failed',
        message: 'Failed to change language. Please try again.',
        userId: 'system',
        priority: 'medium',
        category: 'settings',
        read: false
      });
    }
  };

  // Change currency globally
  const changeCurrency = async (currency: string): Promise<void> => {
    try {
      // Update exchange rates with new base currency
      const rates = await currencyService.getExchangeRates(currency);
      
      // Update state
      dispatch({ type: 'SET_CURRENCY', payload: currency });
      dispatch({ type: 'UPDATE_EXCHANGE_RATES', payload: rates });

      // Notify about currency change
      const currencyInfo = state.currencies.find(c => c.code === currency);
      sendNotification({
        type: 'success',
        title: 'Base Currency Changed',
        message: `Base currency changed to ${currencyInfo?.name || currency}. All amounts will now display in ${currency}.`,
        userId: 'system',
        priority: 'medium',
        category: 'settings',
        read: false
      });

      // Trigger re-render of all financial components
      window.dispatchEvent(new CustomEvent('currencyChanged', { detail: currency }));
    } catch (error) {
      console.error('Failed to change currency:', error);
      sendNotification({
        type: 'error',
        title: 'Currency Change Failed',
        message: 'Failed to change base currency. Please try again.',
        userId: 'system',
        priority: 'medium',
        category: 'settings',
        read: false
      });
    }
  };

  // Connect integration
  const connectIntegration = async (service: string, config?: any): Promise<boolean> => {
    try {
      let result;
      
      switch (service) {
        case 'googleDrive':
          result = await integrationService.connectGoogleDrive();
          break;
        case 'dropbox':
          result = await integrationService.connectDropbox();
          break;
        case 'googleCalendar':
          result = await integrationService.connectGoogleCalendar();
          break;
        case 'slack':
          result = await integrationService.connectSlack(config?.webhookUrl || '');
          break;
        case 'teams':
          result = await integrationService.connectTeams(config?.webhookUrl || '');
          break;
        default:
          throw new Error(`Unknown integration service: ${service}`);
      }

      if (result.success) {
        dispatch({ 
          type: 'CONNECT_INTEGRATION', 
          payload: { service, data: result.data } 
        });

        sendNotification({
          type: 'success',
          title: 'Integration Connected',
          message: `${service} has been connected successfully`,
          userId: 'system',
          priority: 'medium',
          category: 'integrations',
          read: false
        });

        // Send test notification to connected service
        if (service === 'slack' || service === 'teams') {
          await integrationService.sendNotification(
            `ChurchHub integration with ${service} is now active!`,
            'Integration Success',
            'success'
          );
        }

        return true;
      } else {
        throw new Error(result.error || 'Connection failed');
      }
    } catch (error) {
      console.error(`Failed to connect ${service}:`, error);
      sendNotification({
        type: 'error',
        title: 'Integration Failed',
        message: `Failed to connect ${service}: ${error}`,
        userId: 'system',
        priority: 'high',
        category: 'integrations',
        read: false
      });
      return false;
    }
  };

  // Disconnect integration
  const disconnectIntegration = async (service: string): Promise<void> => {
    try {
      integrationService.disconnect(service);
      dispatch({ type: 'DISCONNECT_INTEGRATION', payload: service });

      sendNotification({
        type: 'info',
        title: 'Integration Disconnected',
        message: `${service} has been disconnected`,
        userId: 'system',
        priority: 'low',
        category: 'integrations',
        read: false
      });
    } catch (error) {
      console.error(`Failed to disconnect ${service}:`, error);
    }
  };

  // Send notification
  const sendNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Send to connected communication platforms
    if (state.integrations.slack.connected || state.integrations.teams.connected) {
      integrationService.sendNotification(
        notification.message,
        notification.title,
        notification.type
      ).catch(console.error);
    }

    // Auto-remove non-persistent notifications
    if (notification.type !== 'reminder') {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: newNotification.id });
      }, 5000);
    }
  };

  // Apply theme globally
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  };

  // Apply language settings globally
  const applyLanguageSettings = (language: string) => {
    const languageInfo = state.languages.find(l => l.code === language);
    if (languageInfo) {
      document.documentElement.lang = language;
      document.documentElement.dir = languageInfo.isRTL ? 'rtl' : 'ltr';
      
      // Update page title
      document.title = `${t('dashboard')} - ChurchHub`;
      
      // Apply RTL styles if needed
      if (languageInfo.isRTL) {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    }
  };

  // Auto-update exchange rates every 5 minutes
  useEffect(() => {
    const interval = setInterval(updateExchangeRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [state.baseCurrency]);

  // Apply theme changes
  useEffect(() => {
    applyTheme(state.theme);
  }, [state.theme]);

  // Apply language changes
  useEffect(() => {
    applyLanguageSettings(state.currentLanguage);
  }, [state.currentLanguage, state.translations]);

  // Listen for system events
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      changeLanguage(event.detail);
    };

    const handleCurrencyChange = (event: CustomEvent) => {
      changeCurrency(event.detail);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, []);

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      t, 
      formatCurrency, 
      convertCurrency,
      updateExchangeRates,
      changeLanguage,
      changeCurrency,
      connectIntegration,
      disconnectIntegration,
      sendNotification
    }}>
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