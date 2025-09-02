export class CurrencyService {
  private static instance: CurrencyService;
  private apiKey = 'demo_api_key'; // In production, use real API key
  private baseUrl = 'https://api.exchangerate-api.com/v4/latest/';
  private eventListeners: Map<string, Function[]> = new Map();

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  // Event system for real-time updates
  addEventListener(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  async getExchangeRates(baseCurrency: string = 'USD'): Promise<{ [key: string]: number }> {
    try {
      // In production, use real API
      // const response = await fetch(`${this.baseUrl}${baseCurrency}`);
      // const data = await response.json();
      // return data.rates;

      // Simulate API response with realistic rates that fluctuate
      const mockRates: { [key: string]: number } = {
        // Major currencies
        'USD': 1.0,
        'EUR': 0.85 + (Math.random() - 0.5) * 0.02,
        'GBP': 0.73 + (Math.random() - 0.5) * 0.02,
        'CAD': 1.25 + (Math.random() - 0.5) * 0.05,
        'AUD': 1.35 + (Math.random() - 0.5) * 0.05,
        'JPY': 110.0 + (Math.random() - 0.5) * 5,
        'CHF': 0.92 + (Math.random() - 0.5) * 0.02,
        'CNY': 6.45 + (Math.random() - 0.5) * 0.2,
        
        // African currencies
        'KES': 150.25 + (Math.random() - 0.5) * 10,
        'NGN': 411.0 + (Math.random() - 0.5) * 20,
        'GHS': 6.1 + (Math.random() - 0.5) * 0.3,
        'UGX': 3550.0 + (Math.random() - 0.5) * 100,
        'TZS': 2310.0 + (Math.random() - 0.5) * 100,
        'ETB': 43.5 + (Math.random() - 0.5) * 2,
        'RWF': 1020.0 + (Math.random() - 0.5) * 50,
        'ZAR': 14.8 + (Math.random() - 0.5) * 0.8,
        'XOF': 585.0 + (Math.random() - 0.5) * 20,
        
        // Asian currencies
        'INR': 74.5 + (Math.random() - 0.5) * 2,
        'KRW': 1180.0 + (Math.random() - 0.5) * 50,
        'THB': 33.2 + (Math.random() - 0.5) * 1.5,
        'PHP': 50.8 + (Math.random() - 0.5) * 2,
        'IDR': 14250.0 + (Math.random() - 0.5) * 500,
        'MYR': 4.15 + (Math.random() - 0.5) * 0.2,
        'SGD': 1.35 + (Math.random() - 0.5) * 0.05,
        
        // Latin American currencies
        'BRL': 5.2 + (Math.random() - 0.5) * 0.3,
        'MXN': 20.1 + (Math.random() - 0.5) * 1,
        'ARS': 98.5 + (Math.random() - 0.5) * 5,
        'CLP': 780.0 + (Math.random() - 0.5) * 30,
        'COP': 3850.0 + (Math.random() - 0.5) * 150,
        'PEN': 3.65 + (Math.random() - 0.5) * 0.15,
        
        // Middle Eastern currencies
        'AED': 3.67 + (Math.random() - 0.5) * 0.1,
        'SAR': 3.75 + (Math.random() - 0.5) * 0.1,
        'EGP': 15.7 + (Math.random() - 0.5) * 0.5,
        
        // European currencies
        'NOK': 8.6 + (Math.random() - 0.5) * 0.3,
        'SEK': 8.9 + (Math.random() - 0.5) * 0.3,
        'DKK': 6.3 + (Math.random() - 0.5) * 0.2,
        'PLN': 3.9 + (Math.random() - 0.5) * 0.15,
        'CZK': 21.8 + (Math.random() - 0.5) * 1,
        'HUF': 295.0 + (Math.random() - 0.5) * 10,
        
        // Pacific currencies
        'NZD': 1.42 + (Math.random() - 0.5) * 0.05,
        'FJD': 2.1 + (Math.random() - 0.5) * 0.1
      };

      // Adjust rates based on base currency
      if (baseCurrency !== 'USD') {
        const baseRate = mockRates[baseCurrency];
        if (baseRate) {
          Object.keys(mockRates).forEach(currency => {
            mockRates[currency] = mockRates[currency] / baseRate;
          });
        }
      }

      this.emit('exchangeRatesUpdated', { baseCurrency, rates: mockRates });
      return mockRates;
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      this.emit('exchangeRatesError', { error });
      throw new Error('Failed to update exchange rates');
    }
  }

  formatCurrency(amount: number, currencyCode: string, locale: string = 'en-US'): string {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      // Fallback for unsupported currencies
      const symbols: { [key: string]: string } = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'CAD': 'C$', 'AUD': 'A$',
        'JPY': '¥', 'CHF': 'CHF', 'CNY': '¥', 'INR': '₹', 'BRL': 'R$',
        'MXN': '$', 'ZAR': 'R', 'KES': 'KSh', 'NGN': '₦', 'GHS': '₵',
        'UGX': 'USh', 'TZS': 'TSh', 'ETB': 'Br', 'RWF': 'RF', 'XOF': 'CFA',
        'KRW': '₩', 'THB': '฿', 'PHP': '₱', 'IDR': 'Rp', 'MYR': 'RM',
        'SGD': 'S$', 'ARS': '$', 'CLP': '$', 'COP': '$', 'PEN': 'S/',
        'AED': 'د.إ', 'SAR': '﷼', 'EGP': '£', 'NOK': 'kr', 'SEK': 'kr',
        'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft', 'NZD': 'NZ$',
        'FJD': 'FJ$'
      };
      
      const symbol = symbols[currencyCode] || currencyCode;
      return `${symbol} ${amount.toLocaleString(locale)}`;
    }
  }

  convertAmount(amount: number, fromCurrency: string, toCurrency: string, rates: { [key: string]: number }): number {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    
    const converted = (amount / fromRate) * toRate;
    this.emit('currencyConverted', { amount, fromCurrency, toCurrency, converted });
    
    return converted;
  }

  // Get currency trend (simulate historical data)
  getCurrencyTrend(currencyCode: string, days: number = 30): { date: string; rate: number }[] {
    const trend = [];
    const currentRate = 1; // Simplified for demo
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate rate fluctuation
      const fluctuation = (Math.random() - 0.5) * 0.1;
      const rate = currentRate * (1 + fluctuation);
      
      trend.push({
        date: date.toISOString().split('T')[0],
        rate
      });
    }
    
    return trend;
  }

  // Get supported currencies by region
  getCurrenciesByRegion(): { [region: string]: string[] } {
    return {
      'North America': ['USD', 'CAD', 'MXN'],
      'Europe': ['EUR', 'GBP', 'CHF', 'NOK', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF'],
      'Africa': ['KES', 'NGN', 'GHS', 'UGX', 'TZS', 'ETB', 'RWF', 'ZAR', 'XOF'],
      'Asia': ['JPY', 'CNY', 'INR', 'KRW', 'THB', 'PHP', 'IDR', 'MYR', 'SGD'],
      'South America': ['BRL', 'ARS', 'CLP', 'COP', 'PEN'],
      'Middle East': ['AED', 'SAR', 'EGP'],
      'Oceania': ['AUD', 'NZD', 'FJD']
    };
  }
}

export const currencyService = CurrencyService.getInstance();