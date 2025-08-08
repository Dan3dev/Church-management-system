import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Building, 
  Smartphone, 
  Wallet, 
  TrendingUp,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
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
  const [viewingAccount, setViewingAccount] = useState<Account | null>(null);
  const [hoveredAccount, setHoveredAccount] = useState<string | null>(null);

  const [newAccount, setNewAccount] = useState<Omit<Account, 'id'>>({
    name: '',
    type: 'Bank',
    balance: 0,
    currency: 'USD',
    isActive: true,
    campus: 'Main Campus',
    openingBalance: 0,
    openingDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const accountTypes = [
    { id: 'Bank', label: 'Bank Account', icon: Building, description: 'Traditional bank accounts' },
    { id: 'Mobile Money', label: 'Mobile Money', icon: Smartphone, description: 'M-Pesa, Airtel Money, etc.' },
    { id: 'Cash', label: 'Cash Account', icon: Wallet, description: 'Physical cash management' },
    { id: 'Investment', label: 'Investment Account', icon: TrendingUp, description: 'Investment and savings' },
    { id: 'Petty Cash', label: 'Petty Cash', icon: Wallet, description: 'Small expense management' },
    { id: 'Credit Card', label: 'Credit Card', icon: CreditCard, description: 'Credit card accounts' },
    { id: 'Savings', label: 'Savings Account', icon: Building, description: 'Savings and reserves' }
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
  ];

  const mobileMoneyProviders = [
    'M-Pesa (Safaricom)',
    'M-Pesa (Vodacom)',
    'Airtel Money',
    'T-Kash',
    'Equitel',
    'MTN Mobile Money',
    'Orange Money'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const accountData = {
      ...newAccount,
      balance: newAccount.openingBalance,
      createdAt: editingAccount ? editingAccount.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingAccount) {
      onUpdateAccount(editingAccount.id, accountData);
      setEditingAccount(null);
    } else {
      onAddAccount(accountData);
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
      openingDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setShowAddForm(false);
  };

  const startEdit = (account: Account) => {
    setNewAccount(account);
    setEditingAccount(account);
    setShowAddForm(true);
  };

  const getAccountIcon = (type: string) => {
    const accountType = accountTypes.find(t => t.id === type);
    return accountType ? accountType.icon : CreditCard;
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'Bank': return 'blue';
      case 'Mobile Money': return 'green';
      case 'Cash': return 'yellow';
      case 'Investment': return 'purple';
      case 'Credit Card': return 'red';
      case 'Savings': return 'indigo';
      default: return 'gray';
    }
  };

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? currency.symbol : currencyCode;
  };

  const getAccountHealth = (account: Account) => {
    if (account.balance < (account.minimumBalance || 0)) return 'critical';
    if (account.balance < (account.minimumBalance || 0) * 2) return 'warning';
    return 'healthy';
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const totalBalance = accounts.reduce((sum, account) => {
    // Convert to USD for total (simplified conversion)
    const rate = account.currency === 'KES' ? 0.0067 : account.currency === 'UGX' ? 0.00027 : 1;
    return sum + (account.balance * rate);
  }, 0);

  const activeAccounts = accounts.filter(a => a.isActive);
  const accountsByType = accountTypes.map(type => ({
    ...type,
    accounts: accounts.filter(a => a.type === type.id),
    totalBalance: accounts.filter(a => a.type === type.id).reduce((sum, a) => sum + a.balance, 0)
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Account Management</h2>
          <p className="text-gray-600 mt-2">Manage bank accounts, mobile money, and financial accounts</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>Add Account</span>
        </button>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Balance</p>
              <p className="text-3xl font-bold">${totalBalance.toLocaleString()}</p>
              <p className="text-blue-200 text-sm">Across all accounts</p>
            </div>
            <DollarSign className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Accounts</p>
              <p className="text-3xl font-bold">{activeAccounts.length}</p>
              <p className="text-green-200 text-sm">of {accounts.length} total</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Bank Accounts</p>
              <p className="text-3xl font-bold">{accounts.filter(a => a.type === 'Bank').length}</p>
              <p className="text-purple-200 text-sm">Traditional banking</p>
            </div>
            <Building className="h-12 w-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Mobile Money</p>
              <p className="text-3xl font-bold">{accounts.filter(a => a.type === 'Mobile Money').length}</p>
              <p className="text-orange-200 text-sm">Digital payments</p>
            </div>
            <Smartphone className="h-12 w-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {editingAccount ? 'Edit Account' : 'Add New Account'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Account Name"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                
                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount({...newAccount, type: e.target.value as Account['type']})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {accountTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>

                <select
                  value={newAccount.currency}
                  onChange={(e) => setNewAccount({...newAccount, currency: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>

                <select
                  value={newAccount.campus}
                  onChange={(e) => setNewAccount({...newAccount, campus: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Main Campus">Main Campus</option>
                </select>
              </div>
            </div>

            {/* Account Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Account Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Account Number"
                  value={newAccount.accountNumber || ''}
                  onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />

                {newAccount.type === 'Bank' && (
                  <>
                    <input
                      type="text"
                      placeholder="Bank Name"
                      value={newAccount.bankName || ''}
                      onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Branch Code"
                      value={newAccount.branchCode || ''}
                      onChange={(e) => setNewAccount({...newAccount, branchCode: e.target.value})}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      placeholder="SWIFT Code"
                      value={newAccount.swiftCode || ''}
                      onChange={(e) => setNewAccount({...newAccount, swiftCode: e.target.value})}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </>
                )}

                {newAccount.type === 'Mobile Money' && (
                  <select
                    value={newAccount.bankName || ''}
                    onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Provider</option>
                    {mobileMoneyProviders.map(provider => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                )}

                <input
                  type="number"
                  step="0.01"
                  placeholder="Opening Balance"
                  value={newAccount.openingBalance}
                  onChange={(e) => setNewAccount({...newAccount, openingBalance: parseFloat(e.target.value) || 0})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />

                <input
                  type="date"
                  value={newAccount.openingDate}
                  onChange={(e) => setNewAccount({...newAccount, openingDate: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />

                <input
                  type="number"
                  step="0.01"
                  placeholder="Minimum Balance (optional)"
                  value={newAccount.minimumBalance || ''}
                  onChange={(e) => setNewAccount({...newAccount, minimumBalance: parseFloat(e.target.value) || undefined})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />

                <input
                  type="number"
                  step="0.01"
                  placeholder="Monthly Fee (optional)"
                  value={newAccount.monthlyFee || ''}
                  onChange={(e) => setNewAccount({...newAccount, monthlyFee: parseFloat(e.target.value) || undefined})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Additional Information</h4>
              <div className="space-y-4">
                <textarea
                  placeholder="Account Description"
                  value={newAccount.description || ''}
                  onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={3}
                />

                <input
                  type="text"
                  placeholder="Account Manager/Contact Person"
                  value={newAccount.accountManager || ''}
                  onChange={(e) => setNewAccount({...newAccount, accountManager: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newAccount.isActive}
                    onChange={(e) => setNewAccount({...newAccount, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Account is active</label>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
              >
                {editingAccount ? 'Update Account' : 'Add Account'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Accounts by Type */}
      <div className="space-y-8">
        {accountsByType.map(type => {
          if (type.accounts.length === 0) return null;

          const Icon = type.icon;
          const color = getAccountColor(type.id);

          return (
            <div key={type.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl bg-${color}-100`}>
                    <Icon className={`h-6 w-6 text-${color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{type.label}</h3>
                    <p className="text-gray-600 text-sm">{type.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${type.totalBalance.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{type.accounts.length} accounts</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {type.accounts.map((account) => {
                  const health = getAccountHealth(account);
                  const healthColor = getHealthColor(health);
                  
                  return (
                    <div 
                      key={account.id} 
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                      onMouseEnter={() => setHoveredAccount(account.id)}
                      onMouseLeave={() => setHoveredAccount(null)}
                      onClick={() => setViewingAccount(account)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{account.name}</h4>
                          {account.accountNumber && (
                            <p className="text-sm text-gray-500">#{account.accountNumber}</p>
                          )}
                          {account.bankName && (
                            <p className="text-sm text-gray-600 font-medium">{account.bankName}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingAccount(account);
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(account);
                            }}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Edit Account"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete ${account.name}?`)) {
                                onDeleteAccount(account.id);
                              }
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Delete Account"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Current Balance:</span>
                          <span className={`font-bold text-lg ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {getCurrencySymbol(account.currency)} {Math.abs(account.balance).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            account.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {account.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Health:</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${healthColor}`}>
                            {health.charAt(0).toUpperCase() + health.slice(1)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Campus:</span>
                          <span className="text-sm text-gray-900 font-medium">{account.campus}</span>
                        </div>

                        {account.lastReconciled && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Last Reconciled:</span>
                            <span className="text-sm text-gray-900">{new Date(account.lastReconciled).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Hover Details */}
                      {hoveredAccount === account.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Opening Balance:</span>
                              <p className="text-gray-600">{getCurrencySymbol(account.currency)} {account.openingBalance.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Opened:</span>
                              <p className="text-gray-600">{new Date(account.openingDate).toLocaleDateString()}</p>
                            </div>
                            {account.minimumBalance && (
                              <div>
                                <span className="font-medium text-gray-700">Min Balance:</span>
                                <p className="text-gray-600">{getCurrencySymbol(account.currency)} {account.minimumBalance.toLocaleString()}</p>
                              </div>
                            )}
                            {account.monthlyFee && (
                              <div>
                                <span className="font-medium text-gray-700">Monthly Fee:</span>
                                <p className="text-gray-600">{getCurrencySymbol(account.currency)} {account.monthlyFee.toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                          {account.description && (
                            <div className="mt-3">
                              <span className="font-medium text-gray-700">Description:</span>
                              <p className="text-gray-600 text-sm mt-1">{account.description}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Details Modal */}
      {viewingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Account Details</h3>
              <button
                onClick={() => setViewingAccount(null)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-xl bg-${getAccountColor(viewingAccount.type)}-100`}>
                  {React.createElement(getAccountIcon(viewingAccount.type), { 
                    className: `h-8 w-8 text-${getAccountColor(viewingAccount.type)}-600` 
                  })}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{viewingAccount.name}</h4>
                  <p className="text-gray-600">{viewingAccount.type} Account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Balance</label>
                    <p className={`text-2xl font-bold ${viewingAccount.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {getCurrencySymbol(viewingAccount.currency)} {Math.abs(viewingAccount.balance).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                    <p className="text-gray-900">{viewingAccount.accountNumber || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank/Provider</label>
                    <p className="text-gray-900">{viewingAccount.bankName || 'Not specified'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Campus</label>
                    <p className="text-gray-900">{viewingAccount.campus}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Opening Balance</label>
                    <p className="text-gray-900">{getCurrencySymbol(viewingAccount.currency)} {viewingAccount.openingBalance.toLocaleString()}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Opening Date</label>
                    <p className="text-gray-900">{new Date(viewingAccount.openingDate).toLocaleDateString()}</p>
                  </div>

                  {viewingAccount.minimumBalance && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Minimum Balance</label>
                      <p className="text-gray-900">{getCurrencySymbol(viewingAccount.currency)} {viewingAccount.minimumBalance.toLocaleString()}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                      viewingAccount.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {viewingAccount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {viewingAccount.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{viewingAccount.description}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setViewingAccount(null);
                    startEdit(viewingAccount);
                  }}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Account</span>
                </button>
                <button
                  onClick={() => setViewingAccount(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {accounts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No accounts configured</h3>
          <p className="text-gray-500 mb-6">Add your first account to start managing church finances</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Account
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;