export class CurrencyService {
  private static instance: CurrencyService;
  private apiKey = 'demo_api_key'; // In production, use real API key
  private baseUrl = 'https://api.exchangerate-api.com/v4/latest/';

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  async getExchangeRates(baseCurrency: string = 'USD'): Promise<{ [key: string]: number }> {
    try {
      // In production, use real API
      // const response = await fetch(`${this.baseUrl}${baseCurrency}`);
      // const data = await response.json();
      // return data.rates;

      // Simulate API response with realistic rates
      const mockRates: { [key: string]: number } = {
        'USD': 1.0,
        'EUR': 0.85 + (Math.random() - 0.5) * 0.02,
        'GBP': 0.73 + (Math.random() - 0.5) * 0.02,
        'CAD': 1.25 + (Math.random() - 0.5) * 0.05,
        'AUD': 1.35 + (Math.random() - 0.5) * 0.05,
        'JPY': 110.0 + (Math.random() - 0.5) * 5,
        'CHF': 0.92 + (Math.random() - 0.5) * 0.02,
        'CNY': 6.45 + (Math.random() - 0.5) * 0.2,
        'INR': 74.5 + (Math.random() - 0.5) * 2,
        'BRL': 5.2 + (Math.random() - 0.5) * 0.3,
        'MXN': 20.1 + (Math.random() - 0.5) * 1,
        'ZAR': 14.8 + (Math.random() - 0.5) * 0.8,
        'KES': 110.5 + (Math.random() - 0.5) * 5,
        'NGN': 411.0 + (Math.random() - 0.5) * 20,
        'GHS': 6.1 + (Math.random() - 0.5) * 0.3,
        'UGX': 3550.0 + (Math.random() - 0.5) * 100,
        'TZS': 2310.0 + (Math.random() - 0.5) * 100,
        'ETB': 43.5 + (Math.random() - 0.5) * 2,
        'RWF': 1020.0 + (Math.random() - 0.5) * 50,
        'XOF': 585.0 + (Math.random() - 0.5) * 20
      };

      // Adjust rates based on base currency
      if (baseCurrency !== 'USD') {
        const baseRate = mockRates[baseCurrency];
        Object.keys(mockRates).forEach(currency => {
          mockRates[currency] = mockRates[currency] / baseRate;
        });
      }

      return mockRates;
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
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
        'UGX': 'USh', 'TZS': 'TSh', 'ETB': 'Br', 'RWF': 'RF', 'XOF': 'CFA'
      };
      
      const symbol = symbols[currencyCode] || currencyCode;
      return `${symbol} ${amount.toLocaleString()}`;
    }
  }

  convertAmount(amount: number, fromCurrency: string, toCurrency: string, rates: { [key: string]: number }): number {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    
    return (amount / fromRate) * toRate;
  }
}

export const currencyService = CurrencyService.getInstance();