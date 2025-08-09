import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, TrendingUp, TrendingDown, Globe } from 'lucide-react';
import { Currency } from '../../types';

interface CurrencyManagerProps {
  baseCurrency: string;
  onBaseCurrencyChange: (currency: string) => void;
}

const CurrencyManager: React.FC<CurrencyManagerProps> = ({ baseCurrency, onBaseCurrencyChange }) => {
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, isBaseCurrency: true, lastUpdated: new Date().toISOString() },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', exchangeRate: 150.25, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', exchangeRate: 3750.50, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', exchangeRate: 2450.75, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.85, isBaseCurrency: false, lastUpdated: new Date().toISOString() },
    { code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.73, isBaseCurrency: false, lastUpdated: new Date().toISOString() }
  ]);

  const [updating, setUpdating] = useState(false);

  const updateExchangeRates = async () => {
    setUpdating(true);
    // Simulate API call to get exchange rates
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCurrencies(currencies.map(currency => ({
      ...currency,
      exchangeRate: currency.isBaseCurrency ? 1.0 : currency.exchangeRate * (0.98 + Math.random() * 0.04),
      lastUpdated: new Date().toISOString()
    })));
    
    setUpdating(false);
  };

  const setBaseCurrency = (currencyCode: string) => {
    setCurrencies(currencies.map(currency => ({
      ...currency,
      isBaseCurrency: currency.code === currencyCode,
      exchangeRate: currency.code === currencyCode ? 1.0 : currency.exchangeRate
    })));
    onBaseCurrencyChange(currencyCode);
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.exchangeRate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.exchangeRate || 1;
    return (amount / fromRate) * toRate;
  };

  const getExchangeRateTrend = (currency: Currency) => {
    // Simulate trend calculation
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const change = (Math.random() * 5).toFixed(2);
    return { trend, change };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Currency Management</h2>
            <p className="text-gray-600">Manage multi-currency support and exchange rates</p>
          </div>
        </div>
        <button
          onClick={updateExchangeRates}
          disabled={updating}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
          <span>{updating ? 'Updating...' : 'Update Rates'}</span>
        </button>
      </div>

      {/* Base Currency Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Base Currency</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => setBaseCurrency(currency.code)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                currency.isBaseCurrency
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <p className="font-bold text-lg">{currency.symbol}</p>
                <p className="font-semibold">{currency.code}</p>
                <p className="text-xs text-gray-600">{currency.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Exchange Rates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Exchange Rates</h3>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(currencies[0]?.lastUpdated).toLocaleString()}
          </div>
        </div>
        
        <div className="grid gap-4">
          {currencies.filter(c => !c.isBaseCurrency).map((currency) => {
            const trend = getExchangeRateTrend(currency);
            return (
              <div key={currency.code} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-600">{currency.symbol}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{currency.code}</h4>
                    <p className="text-sm text-gray-600">{currency.name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {currency.exchangeRate.toFixed(4)}
                    </span>
                    <div className={`flex items-center space-x-1 ${
                      trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="text-sm">{trend.change}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    1 {baseCurrency} = {currency.exchangeRate.toFixed(2)} {currency.code}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Currency Converter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency Converter</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyManager;