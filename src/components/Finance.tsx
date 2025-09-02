import React, { useState } from 'react';
import { DollarSign, Plus, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react';
import { FinancialTransaction } from '../types';
import { useApp } from '../context/AppContext';

interface FinanceProps {
  transactions: FinancialTransaction[];
  onAddTransaction: (transaction: Omit<FinancialTransaction, 'id'>) => void;
}

const Finance: React.FC<FinanceProps> = ({ transactions, onAddTransaction }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [filterMonth, setFilterMonth] = useState<string>('');
  const { formatCurrency, convertCurrency, state, t } = useApp();

  const [newTransaction, setNewTransaction] = useState<Omit<FinancialTransaction, 'id'>>({
    type: 'Income',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    memberName: '',
    paymentMethod: 'Cash'
  });

  const incomeCategories = ['Tithe', 'Offering', 'Special Offering', 'Fundraising', 'Donations', 'Other Income'];
  const expenseCategories = ['Utilities', 'Maintenance', 'Staff Salary', 'Ministry Expenses', 'Office Supplies', 'Insurance', 'Other Expense'];
  const paymentMethods = ['Cash', 'Check', 'Bank Transfer', 'Card', 'Online'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction(newTransaction);
    setNewTransaction({
      type: 'Income',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      memberName: '',
      paymentMethod: 'Cash'
    });
    setShowAddForm(false);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'All' || transaction.type === filterType;
    const matchesMonth = !filterMonth || transaction.date.startsWith(filterMonth);
    return matchesType && matchesMonth;
  });

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyIncome = transactions
    .filter(t => t.type === 'Income' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'Expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  // Enhanced financial analytics
  const monthlyTrend = () => {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      
      const income = transactions
        .filter(t => t.type === 'Income' && t.date.startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type === 'Expense' && t.date.startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);
      
      last6Months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        income,
        expenses,
        net: income - expenses
      });
    }
    return last6Months;
  };

  const trendData = monthlyTrend();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('finance')}</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{t('addTransaction')}</span>
        </button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">{t('thisMonth') || 'This Month'}</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">${monthlyIncome.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{t('monthlyIncome')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-sm text-red-600 font-medium">{t('thisMonth') || 'This Month'}</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">${monthlyExpenses.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{t('monthlyExpenses') || 'Monthly Expenses'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">{t('netIncome') || 'Net Income'}</span>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netIncome.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">{t('allTime') || 'All Time'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">{t('monthlyBalance') || 'Monthly Balance'}</span>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${(monthlyIncome - monthlyExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${(monthlyIncome - monthlyExpenses).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">{t('thisMonth') || 'This Month'}</p>
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('addTransaction')}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'Income' | 'Expense'})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Income">{t('income')}</option>
                <option value="Expense">{t('expense')}</option>
              </select>
              
              <select
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">{t('selectCategory') || 'Select Category'}</option>
                {(newTransaction.type === 'Income' ? incomeCategories : expenseCategories).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={newTransaction.amount}
                placeholder={t('description')}
                <option value="">{t('selectAccount') || 'Select Account'}</option>
                required
              />
              
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                placeholder={t('memberName') || 'Member Name (optional)'}
                required
              />
              
              <input
                type="text"
                placeholder="Description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                required
              />
              
              <input
                type="text"
                placeholder="Member Name (optional)"
                value={newTransaction.memberName}
                onChange={(e) => setNewTransaction({...newTransaction, memberName: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <select
                value={newTransaction.paymentMethod}
                onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                <span className="text-sm text-gray-700">{t('taxDeductible') || 'Tax Deductible'}</span>
                    {account.name} ({formatCurrency(account.balance, account.currency)})
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                <span className="text-sm text-gray-700">{t('receiptSent') || 'Receipt Sent'}</span>
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Transaction
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">{t('allTransactions') || 'All Transactions'}</option>
              <option value="Income">{t('incomeOnly') || 'Income Only'}</option>
              <option value="Expense">{t('expenseOnly') || 'Expense Only'}</option>
            </select>
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredTransactions.length} transactions
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{t('recentTransactions') || 'Recent Transactions'}</h3>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm">
              <span>{t('export')} CSV</span>
            </button>
          </div>
        </div>
        
        {/* Financial Trend Chart */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">{t('financialTrend') || '6-Month Financial Trend'}</h4>
          <div className="grid grid-cols-6 gap-2">
            {trendData.map((month, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-1">{month.month}</div>
                <div className="space-y-1">
                  <div className={`h-2 rounded ${month.income > 0 ? 'bg-green-500' : 'bg-gray-200'}`} 
                       style={{ width: `${Math.min((month.income / 5000) * 100, 100)}%` }}></div>
                  <div className={`h-2 rounded ${month.expenses > 0 ? 'bg-red-500' : 'bg-gray-200'}`} 
                       style={{ width: `${Math.min((month.expenses / 5000) * 100, 100)}%` }}></div>
                </div>
                <div className={`text-xs font-medium mt-1 ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(month.net).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 50)
            .map((transaction, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'Income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <DollarSign className={`h-4 w-4 ${
                        transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{transaction.category}</span>
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                            <span>{transaction.paymentMethod}</span>
                            {transaction.memberName && <span>by {transaction.memberName}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-semibold ${
                            transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">{transaction.type}</p>
                        </div>
                      </div>
                    </div>
                              <span className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded">{t('receipt') || 'Receipt'}</span>
                </div>
              </div>
                              <span className="text-xs bg-purple-100 text-purple-700 px-1 py-0.5 rounded">{t('reconciled') || 'Reconciled'}</span>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-500">
            <p className="text-lg mb-2">{t('noTransactionsFound') || 'No transactions found'}</p>
            <p className="text-sm">{t('addFirstTransaction') || 'Add your first transaction to get started.'}</p>
                              <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">{t('tax') || 'Tax'}</span>
        </div>
      )}
    </div>
  );
};

export default Finance;