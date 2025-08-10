import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, TrendingUp, TrendingDown, Globe, Plus, Edit, Trash2 } from 'lucide-react';
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [converterFrom, setConverterFrom] = useState('USD');
  const [converterTo, setConverterTo] = useState('KES');
  const [converterAmount, setConverterAmount] = useState(100);
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    symbol: '',
    exchangeRate: 1.0
  });

  const updateExchangeRates = async () => {
    setUpdating(true);
    
    try {
      // Simulate API call to get real exchange rates
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrencies(currencies.map(currency => ({
        ...currency,
        exchangeRate: currency.isBaseCurrency ? 1.0 : currency.exchangeRate * (0.98 + Math.random() * 0.04),
        lastUpdated: new Date().toISOString()
      })));
      
      alert('Exchange rates updated successfully!');
    } catch (error) {
      alert('Failed to update exchange rates. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const setBaseCurrency = (currencyCode: string) => {
    const oldBaseCurrency = currencies.find(c => c.isBaseCurrency);
    const newBaseCurrency = currencies.find(c => c.code === currencyCode);
    
    if (oldBaseCurrency && newBaseCurrency) {
      // Recalculate all exchange rates relative to new base
      const conversionFactor = oldBaseCurrency.exchangeRate / newBaseCurrency.exchangeRate;
      
      setCurrencies(currencies.map(currency => ({
        ...currency,
        isBaseCurrency: currency.code === currencyCode,
        exchangeRate: currency.code === currencyCode ? 1.0 : currency.exchangeRate * conversionFactor,
        lastUpdated: new Date().toISOString()
      })));
      
      onBaseCurrencyChange(currencyCode);
      alert(`Base currency changed to ${newBaseCurrency.name}`);
    }
  };

  const addCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currencies.find(c => c.code === newCurrency.code)) {
      alert('Currency already exists!');
      return;
    }
    
    const currency: Currency = {
      ...newCurrency,
      isBaseCurrency: false,
      lastUpdated: new Date().toISOString()
    };
    
    setCurrencies([...currencies, currency]);
    setNewCurrency({ code: '', name: '', symbol: '', exchangeRate: 1.0 });
    setShowAddForm(false);
    alert(`${currency.name} added successfully!`);
  };

  const removeCurrency = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    if (currency?.isBaseCurrency) {
      alert('Cannot remove base currency!');
      return;
    }
    
    if (confirm(`Are you sure you want to remove ${currency?.name}?`)) {
      setCurrencies(currencies.filter(c => c.code !== code));
      alert('Currency removed successfully!');
    }
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.exchangeRate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.exchangeRate || 1;
    return (amount / fromRate) * toRate;
  };

  const getExchangeRateTrend = (currency: Currency) => {
    // Simulate trend calculation based on historical data
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const change = (Math.random() * 5).toFixed(2);
    return { trend, change };
  };

  const convertedAmount = convertAmount(converterAmount, converterFrom, converterTo);

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
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Currency</span>
          </button>
          <button
            onClick={updateExchangeRates}
            disabled={updating}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
            <span>{updating ? 'Updating...' : 'Update Rates'}</span>
          </button>
        </div>
      </div>

      {/* Add Currency Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Currency</h3>
          <form onSubmit={addCurrency} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Currency Code (e.g., NGN)"
                value={newCurrency.code}
                onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value.toUpperCase()})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                maxLength={3}
                required
              />
              <input
                type="text"
                placeholder="Currency Name"
                value={newCurrency.name}
                onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Symbol (e.g., ₦)"
                value={newCurrency.symbol}
                onChange={(e) => setNewCurrency({...newCurrency, symbol: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                step="0.0001"
                placeholder="Exchange Rate"
                value={newCurrency.exchangeRate}
                onChange={(e) => setNewCurrency({...newCurrency, exchangeRate: parseFloat(e.target.value)})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add Currency
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Base Currency Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Base Currency</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => setBaseCurrency(currency.code)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                currency.isBaseCurrency
                  ? 'border-green-500 bg-green-50 text-green-700 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <p className="font-bold text-lg">{currency.symbol}</p>
                <p className="font-semibold">{currency.code}</p>
                <p className="text-xs text-gray-600">{currency.name}</p>
                {currency.isBaseCurrency && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mt-1 inline-block">
                    Base
                  </span>
                )}
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
              <div key={currency.code} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-600">{currency.symbol}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{currency.code}</h4>
                    <p className="text-sm text-gray-600">{currency.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
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
                  
                  <button
                    onClick={() => removeCurrency(currency.code)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Currency Converter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency Converter</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              value={converterAmount}
              onChange={(e) => setConverterAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select 
              value={converterFrom}
              onChange={(e) => setConverterFrom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <select 
              value={converterTo}
              onChange={(e) => setConverterTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
            <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg">
              <span className="font-bold text-lg">
                {currencies.find(c => c.code === converterTo)?.symbol}{convertedAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">{converterAmount} {converterFrom}</span> = 
            <span className="font-semibold"> {convertedAmount.toFixed(2)} {converterTo}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Rate: 1 {converterFrom} = {(convertedAmount / converterAmount).toFixed(4)} {converterTo}
          </p>
        </div>
      </div>

      {/* Currency Usage Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency Usage</h3>
        <div className="space-y-3">
          {currencies.map((currency) => {
            // Simulate usage statistics
            const usage = Math.floor(Math.random() * 100);
            return (
              <div key={currency.code} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-lg">{currency.symbol}</span>
                  <div>
                    <p className="font-medium text-gray-900">{currency.name}</p>
                    <p className="text-sm text-gray-500">{currency.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{usage}%</p>
                  <p className="text-xs text-gray-500">Usage</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CurrencyManager;