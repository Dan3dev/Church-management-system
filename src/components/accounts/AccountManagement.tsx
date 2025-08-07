import React, { useState } from 'react';
import { CreditCard, Plus, Edit, Trash2, Building, Smartphone, Wallet, TrendingUp } from 'lucide-react';
import { Account } from '../../types';

interface AccountManagementProps {
  accounts: Account[];
  onAddAccount: (account: Omit<Account, 'id'>) => void;
  onUpdateAccount: (id: string, account: Partial<Account>) => void;
  onDeleteAccount: (id: string) => void;
}

const AccountManagement: React.FC<AccountManagementProps> = ({
  accounts,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [newAccount, setNewAccount] = useState<Omit<Account, 'id'>>({
    name: '',
    type: 'Bank',
    balance: 0,
    currency: 'USD',
    isActive: true,
    campus: 'Main Campus',
    openingBalance: 0,
    openingDate: new Date().toISOString().split('T')[0]
  });

  const accountTypes = ['Bank', 'Mobile Money', 'Cash', 'Investment', 'Petty Cash'];
  const currencies = ['USD', 'KES', 'UGX', 'TZS', 'EUR', 'GBP'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccount) {
      onUpdateAccount(editingAccount.id, newAccount);
      setEditingAccount(null);
    } else {
      onAddAccount(newAccount);
    }
    resetForm();
  };

  const resetForm = () => {
    setNewAccount({
      name: '',
      type: 'Bank',
      balance: 0,
      currency: 'USD',
      isActive: true,
      campus: 'Main Campus',
      openingBalance: 0,
      openingDate: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const startEdit = (account: Account) => {
    setNewAccount(account);
    setEditingAccount(account);
    setShowAddForm(true);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'Bank': return Building;
      case 'Mobile Money': return Smartphone;
      case 'Cash': return Wallet;
      case 'Investment': return TrendingUp;
      default: return CreditCard;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'Bank': return 'bg-blue-100 text-blue-600';
      case 'Mobile Money': return 'bg-green-100 text-green-600';
      case 'Cash': return 'bg-yellow-100 text-yellow-600';
      case 'Investment': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const activeAccounts = accounts.filter(a => a.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Account Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Account</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{activeAccounts.length}</p>
            <p className="text-sm text-gray-500">Active Accounts</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">${totalBalance.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Balance</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Building className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {accounts.filter(a => a.type === 'Bank').length}
            </p>
            <p className="text-sm text-gray-500">Bank Accounts</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <Smartphone className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {accounts.filter(a => a.type === 'Mobile Money').length}
            </p>
            <p className="text-sm text-gray-500">Mobile Money</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingAccount ? 'Edit Account' : 'Add New Account'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Account Name"
                value={newAccount.name}
                onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              
              <select
                value={newAccount.type}
                onChange={(e) => setNewAccount({...newAccount, type: e.target.value as Account['type']})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {accountTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Account Number (optional)"
                value={newAccount.accountNumber || ''}
                onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="text"
                placeholder="Bank/Provider Name (optional)"
                value={newAccount.bankName || ''}
                onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="number"
                step="0.01"
                placeholder="Opening Balance"
                value={newAccount.openingBalance}
                onChange={(e) => setNewAccount({...newAccount, openingBalance: parseFloat(e.target.value)})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <input
                type="date"
                value={newAccount.openingDate}
                onChange={(e) => setNewAccount({...newAccount, openingDate: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <select
                value={newAccount.currency}
                onChange={(e) => setNewAccount({...newAccount, currency: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>

              <select
                value={newAccount.campus}
                onChange={(e) => setNewAccount({...newAccount, campus: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Main Campus">Main Campus</option>
              </select>
            </div>

            <textarea
              placeholder="Description (optional)"
              value={newAccount.description || ''}
              onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={newAccount.isActive}
                onChange={(e) => setNewAccount({...newAccount, isActive: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">Account is active</label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingAccount ? 'Update Account' : 'Add Account'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Accounts List */}
      <div className="grid gap-6">
        {accountTypes.map(type => {
          const typeAccounts = accounts.filter(a => a.type === type);
          if (typeAccounts.length === 0) return null;

          const Icon = getAccountIcon(type);
          const colorClass = getAccountColor(type);

          return (
            <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{type} Accounts</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeAccounts.map((account) => (
                  <div key={account.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{account.name}</h4>
                        {account.accountNumber && (
                          <p className="text-sm text-gray-500">#{account.accountNumber}</p>
                        )}
                        {account.bankName && (
                          <p className="text-sm text-gray-500">{account.bankName}</p>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEdit(account)}
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteAccount(account.id)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Balance:</span>
                        <span className={`font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {account.currency} {account.balance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Campus:</span>
                        <span className="text-sm text-gray-900">{account.campus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          account.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {account.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {account.description && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{account.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountManagement;