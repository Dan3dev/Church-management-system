import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  DollarSign,
  FileText,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Member, AttendanceRecord, FinancialTransaction, Event, Giving, Account } from '../../types';

interface DetailedReportsProps {
  members: Member[];
  attendance: AttendanceRecord[];
  transactions: FinancialTransaction[];
  events: Event[];
  giving: Giving[];
  accounts: Account[];
}

const DetailedReports: React.FC<DetailedReportsProps> = ({ 
  members, 
  attendance, 
  transactions, 
  events, 
  giving, 
  accounts 
}) => {
  const [selectedReport, setSelectedReport] = useState('financial');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');

  const reportTypes = [
    { id: 'financial', label: 'Financial Reports', icon: DollarSign },
    { id: 'accounting', label: 'Accounting Reports', icon: FileText },
    { id: 'membership', label: 'Membership Reports', icon: Users },
    { id: 'attendance', label: 'Attendance Reports', icon: Calendar },
    { id: 'giving', label: 'Giving Reports', icon: TrendingUp },
    { id: 'ministry', label: 'Ministry Reports', icon: BarChart3 }
  ];

  // Financial calculations
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const accountMatch = selectedAccount === 'all' || t.accountId === selectedAccount;
    const campusMatch = selectedCampus === 'all' || t.campus === selectedCampus;
    
    return transactionDate >= startDate && transactionDate <= endDate && accountMatch && campusMatch;
  });

  const totalIncome = filteredTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalIncome - totalExpenses;

  // Account balances
  const accountBalances = accounts.map(account => {
    const accountTransactions = filteredTransactions.filter(t => t.accountId === account.id);
    const income = accountTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = accountTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = account.openingBalance + income - expenses;
    
    return { ...account, currentBalance: balance, income, expenses };
  });

  // Income by category
  const incomeByCategory = filteredTransactions
    .filter(t => t.type === 'Income')
    .reduce((acc: {[key: string]: number}, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  // Expenses by category
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'Expense')
    .reduce((acc: {[key: string]: number}, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  // Monthly trends
  const monthlyTrends = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toISOString().slice(0, 7);
    
    const monthTransactions = transactions.filter(t => t.date.startsWith(monthStr));
    const income = monthTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    
    monthlyTrends.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      income,
      expenses,
      net: income - expenses
    });
  }

  const downloadReport = (reportType: string) => {
    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'financial':
        csvContent = generateFinancialCSV();
        filename = `financial-report-${dateRange.start}-to-${dateRange.end}.csv`;
        break;
      case 'accounting':
        csvContent = generateAccountingCSV();
        filename = `accounting-report-${dateRange.start}-to-${dateRange.end}.csv`;
        break;
      case 'membership':
        csvContent = generateMembershipCSV();
        filename = `membership-report-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'attendance':
        csvContent = generateAttendanceCSV();
        filename = `attendance-report-${dateRange.start}-to-${dateRange.end}.csv`;
        break;
      case 'giving':
        csvContent = generateGivingCSV();
        filename = `giving-report-${dateRange.start}-to-${dateRange.end}.csv`;
        break;
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateFinancialCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Account', 'Campus'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.description,
      t.amount.toString(),
      accounts.find(a => a.id === t.accountId)?.name || 'Unknown',
      t.campus
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateAccountingCSV = () => {
    const headers = ['Account', 'Type', 'Opening Balance', 'Income', 'Expenses', 'Current Balance'];
    const rows = accountBalances.map(a => [
      a.name,
      a.type,
      a.openingBalance.toString(),
      a.income.toString(),
      a.expenses.toString(),
      a.currentBalance.toString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateMembershipCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Join Date', 'Campus', 'Ministry'];
    const rows = members.map(m => [
      `${m.firstName} ${m.lastName}`,
      m.email,
      m.phone,
      m.membershipStatus,
      m.joinDate,
      m.campus,
      m.ministry.join('; ')
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateAttendanceCSV = () => {
    const headers = ['Date', 'Service', 'Member', 'Present', 'Campus'];
    const rows = attendance
      .filter(a => {
        const attendanceDate = new Date(a.date);
        return attendanceDate >= new Date(dateRange.start) && attendanceDate <= new Date(dateRange.end);
      })
      .map(a => [
        a.date,
        a.service,
        a.memberName,
        a.present ? 'Yes' : 'No',
        a.campus
      ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateGivingCSV = () => {
    const filteredGiving = giving.filter(g => {
      const givingDate = new Date(g.date);
      return givingDate >= new Date(dateRange.start) && givingDate <= new Date(dateRange.end);
    });
    
    const headers = ['Date', 'Member', 'Amount', 'Type', 'Fund', 'Payment Method', 'Campus'];
    const rows = filteredGiving.map(g => [
      g.date,
      g.memberName,
      g.amount.toString(),
      g.type,
      g.fund,
      g.paymentMethod,
      g.campus
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Financial Summary</h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-700">${totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">${totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-600 transform rotate-180" />
          </div>
        </div>
        
        <div className={`${netIncome >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} rounded-xl p-6 border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'} text-sm font-medium`}>Net Income</p>
              <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                ${netIncome.toLocaleString()}
              </p>
            </div>
            <DollarSign className={`h-8 w-8 ${netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">12-Month Financial Trend</h4>
        <div className="space-y-3">
          {monthlyTrends.map((month, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="font-medium text-gray-900">{month.month}</span>
              <div className="flex space-x-6 text-sm">
                <span className="text-green-600">Income: ${month.income.toLocaleString()}</span>
                <span className="text-red-600">Expenses: ${month.expenses.toLocaleString()}</span>
                <span className={`font-semibold ${month.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  Net: ${month.net.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Income by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Income by Category</h4>
          <div className="space-y-3">
            {Object.entries(incomeByCategory)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-600">{category}</span>
                <span className="font-semibold text-green-600">${amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h4>
          <div className="space-y-3">
            {Object.entries(expensesByCategory)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-600">{category}</span>
                <span className="font-semibold text-red-600">${amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountingReport = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Accounting Reports</h3>
      
      {/* Account Balances */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Account Balances</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accountBalances.map((account) => (
                <tr key={account.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${account.openingBalance.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">${account.income.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">${account.expenses.toLocaleString()}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                    account.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${account.currentBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trial Balance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Trial Balance Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Assets</h5>
            <div className="space-y-2">
              {accountBalances
                .filter(a => ['Bank', 'Cash', 'Investment'].includes(a.type))
                .map(account => (
                <div key={account.id} className="flex justify-between">
                  <span className="text-gray-600">{account.name}</span>
                  <span className="font-medium">${account.currentBalance.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Mobile Money</h5>
            <div className="space-y-2">
              {accountBalances
                .filter(a => a.type === 'Mobile Money')
                .map(account => (
                <div key={account.id} className="flex justify-between">
                  <span className="text-gray-600">{account.name}</span>
                  <span className="font-medium">${account.currentBalance.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Detailed Reports</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => downloadReport(selectedReport)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Campuses</option>
              <option value="Main Campus">Main Campus</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-colors ${
                  selectedReport === report.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium text-center">{report.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {selectedReport === 'financial' && renderFinancialReport()}
        {selectedReport === 'accounting' && renderAccountingReport()}
        {selectedReport === 'membership' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Membership Report</h3>
            <p className="text-gray-600">Detailed membership analytics and demographics will be displayed here.</p>
          </div>
        )}
        {selectedReport === 'attendance' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Attendance Report</h3>
            <p className="text-gray-600">Comprehensive attendance tracking and trends will be displayed here.</p>
          </div>
        )}
        {selectedReport === 'giving' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Giving Report</h3>
            <p className="text-gray-600">Detailed giving analysis and donor insights will be displayed here.</p>
          </div>
        )}
        {selectedReport === 'ministry' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ministry Report</h3>
            <p className="text-gray-600">Ministry performance and volunteer engagement metrics will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedReports;