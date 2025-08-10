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
  RefreshCw,
  Eye,
  Mail,
  Printer,
  Share2
} from 'lucide-react';
import { Member, AttendanceRecord, FinancialTransaction, Event, Giving, Account } from '../../types';
import { useExport } from '../../hooks/useExport';

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
  const { exportToCSV, exportToPDF, exporting } = useExport();
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv'>('csv');

  const reportTypes = [
    { id: 'financial', label: 'Financial Reports', icon: DollarSign, description: 'Income, expenses, and financial analysis' },
    { id: 'accounting', label: 'Accounting Reports', icon: FileText, description: 'Balance sheets, trial balance, and accounting records' },
    { id: 'membership', label: 'Membership Reports', icon: Users, description: 'Member demographics and statistics' },
    { id: 'attendance', label: 'Attendance Reports', icon: Calendar, description: 'Service attendance and trends' },
    { id: 'giving', label: 'Giving Reports', icon: TrendingUp, description: 'Donation analysis and donor insights' },
    { id: 'ministry', label: 'Ministry Reports', icon: BarChart3, description: 'Ministry performance and volunteer metrics' },
    { id: 'comprehensive', label: 'Comprehensive Report', icon: FileText, description: 'Complete church overview report' }
  ];

  // Export functions for each report type
  const exportCurrentReport = () => {
    switch (selectedReport) {
      case 'membership':
        exportMembershipReport();
        break;
      case 'financial':
        exportFinancialReport();
        break;
      case 'attendance':
        exportAttendanceReport();
        break;
      case 'giving':
        exportGivingReport();
        break;
      case 'accounting':
        exportAccountingReport();
        break;
      default:
        exportOverviewReport();
    }
  };

  const exportMembershipReport = () => {
    const reportData = members.map(member => ({
      'Name': `${member.firstName} ${member.lastName}`,
      'Email': member.email,
      'Phone': member.phone,
      'Status': member.membershipStatus,
      'Join Date': member.joinDate,
      'Campus': member.campus,
      'Ministry': member.ministry.join(', '),
      'Role': member.role,
      'Age': Math.floor((new Date().getTime() - new Date(member.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    }));
    exportToCSV(reportData, 'membership_report');
  };

  const exportFinancialReport = () => {
    const reportData = transactions.map(transaction => ({
      'Date': transaction.date,
      'Type': transaction.type,
      'Category': transaction.category,
      'Amount': transaction.amount,
      'Description': transaction.description,
      'Payment Method': transaction.paymentMethod,
      'Member': transaction.memberName || '',
      'Campus': transaction.campus,
      'Account': accounts.find(a => a.id === transaction.accountId)?.name || '',
      'Tax Deductible': transaction.taxDeductible ? 'Yes' : 'No'
    }));
    exportToCSV(reportData, 'financial_report');
  };

  const exportAttendanceReport = () => {
    const reportData = attendance.map(record => ({
      'Date': record.date,
      'Member': record.memberName,
      'Service': record.service,
      'Present': record.present ? 'Yes' : 'No',
      'Campus': record.campus,
      'Check-in Time': record.checkInTime || '',
      'Late Arrival': record.lateArrival ? 'Yes' : 'No'
    }));
    exportToCSV(reportData, 'attendance_report');
  };

  const exportGivingReport = () => {
    const reportData = giving.map(gift => ({
      'Date': gift.date,
      'Member': gift.memberName,
      'Amount': gift.amount,
      'Type': gift.type,
      'Fund': gift.fund,
      'Payment Method': gift.paymentMethod,
      'Recurring': gift.recurring ? 'Yes' : 'No',
      'Tax Deductible': gift.taxDeductible ? 'Yes' : 'No',
      'Receipt Sent': gift.receiptSent ? 'Yes' : 'No'
    }));
    exportToCSV(reportData, 'giving_report');
  };

  const exportAccountingReport = () => {
    const reportData = accounts.map(account => ({
      'Account Name': account.name,
      'Type': account.type,
      'Current Balance': account.balance,
      'Currency': account.currency,
      'Opening Balance': account.openingBalance,
      'Opening Date': account.openingDate,
      'Bank': account.bankName || '',
      'Status': account.isActive ? 'Active' : 'Inactive',
      'Campus': account.campus
    }));
    exportToCSV(reportData, 'accounting_report');
  };

  const exportOverviewReport = () => {
    const reportData = [
      { 'Metric': 'Total Members', 'Value': members.length },
      { 'Metric': 'Active Members', 'Value': members.filter(m => m.membershipStatus === 'Active').length },
      { 'Metric': 'Total Income', 'Value': transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0) },
      { 'Metric': 'Total Expenses', 'Value': transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0) },
      { 'Metric': 'Total Giving', 'Value': giving.reduce((sum, g) => sum + g.amount, 0) },
      { 'Metric': 'Average Attendance', 'Value': attendance.length > 0 ? Math.round((attendance.filter(a => a.present).length / attendance.length) * 100) : 0 }
    ];
    exportToCSV(reportData, 'overview_report');
  };
  // Enhanced financial calculations
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

  // Enhanced account balances with reconciliation
  const accountBalances = accounts.map(account => {
    const accountTransactions = filteredTransactions.filter(t => t.accountId === account.id);
    const income = accountTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = accountTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = account.openingBalance + income - expenses;
    const reconciledTransactions = accountTransactions.filter(t => t.reconciled);
    const unreconciledAmount = accountTransactions.filter(t => !t.reconciled).reduce((sum, t) => sum + (t.type === 'Income' ? t.amount : -t.amount), 0);
    
    return { 
      ...account, 
      currentBalance: balance, 
      income, 
      expenses,
      reconciledCount: reconciledTransactions.length,
      unreconciledAmount,
      lastReconciled: account.lastReconciled || 'Never'
    };
  });

  // Enhanced categorization
  const incomeByCategory = filteredTransactions
    .filter(t => t.type === 'Income')
    .reduce((acc: {[key: string]: {amount: number, count: number}}, t) => {
      if (!acc[t.category]) acc[t.category] = { amount: 0, count: 0 };
      acc[t.category].amount += t.amount;
      acc[t.category].count += 1;
      return acc;
    }, {});

  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'Expense')
    .reduce((acc: {[key: string]: {amount: number, count: number}}, t) => {
      if (!acc[t.category]) acc[t.category] = { amount: 0, count: 0 };
      acc[t.category].amount += t.amount;
      acc[t.category].count += 1;
      return acc;
    }, {});

  // Monthly trends with variance analysis
  const monthlyTrends = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toISOString().slice(0, 7);
    
    const monthTransactions = transactions.filter(t => t.date.startsWith(monthStr));
    const income = monthTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const memberCount = members.filter(m => new Date(m.joinDate) <= date).length;
    const avgGivingPerMember = memberCount > 0 ? income / memberCount : 0;
    
    monthlyTrends.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      income,
      expenses,
      net: income - expenses,
      memberCount,
      avgGivingPerMember,
      transactionCount: monthTransactions.length
    });
  }

  // Advanced giving analysis
  const givingAnalysis = {
    totalGivers: new Set(giving.map(g => g.memberId)).size,
    averageGift: giving.length > 0 ? giving.reduce((sum, g) => sum + g.amount, 0) / giving.length : 0,
    recurringGivers: new Set(giving.filter(g => g.recurring).map(g => g.memberId)).size,
    largestGift: Math.max(...giving.map(g => g.amount), 0),
    givingFrequency: giving.reduce((acc: {[key: string]: number}, g) => {
      const month = g.date.slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {})
  };

  // Membership analytics
  const membershipAnalytics = {
    growthRate: calculateGrowthRate(),
    retentionRate: calculateRetentionRate(),
    ageDistribution: calculateAgeDistribution(),
    ministryParticipation: calculateMinistryParticipation(),
    attendanceCorrelation: calculateAttendanceCorrelation()
  };

  function calculateGrowthRate() {
    const thisYear = new Date().getFullYear();
    const lastYear = thisYear - 1;
    const thisYearMembers = members.filter(m => new Date(m.joinDate).getFullYear() === thisYear).length;
    const lastYearMembers = members.filter(m => new Date(m.joinDate).getFullYear() === lastYear).length;
    return lastYearMembers > 0 ? ((thisYearMembers - lastYearMembers) / lastYearMembers) * 100 : 0;
  }

  function calculateRetentionRate() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const membersOneYearAgo = members.filter(m => new Date(m.joinDate) <= oneYearAgo);
    const stillActive = membersOneYearAgo.filter(m => m.membershipStatus === 'Active');
    return membersOneYearAgo.length > 0 ? (stillActive.length / membersOneYearAgo.length) * 100 : 0;
  }

  function calculateAgeDistribution() {
    const ageGroups = { '0-17': 0, '18-35': 0, '36-55': 0, '56-75': 0, '75+': 0 };
    members.forEach(member => {
      const age = Math.floor((new Date().getTime() - new Date(member.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age <= 17) ageGroups['0-17']++;
      else if (age <= 35) ageGroups['18-35']++;
      else if (age <= 55) ageGroups['36-55']++;
      else if (age <= 75) ageGroups['56-75']++;
      else ageGroups['75+']++;
    });
    return ageGroups;
  }

  function calculateMinistryParticipation() {
    const totalMembers = members.filter(m => m.membershipStatus === 'Active').length;
    const membersInMinistry = members.filter(m => m.ministry.length > 0).length;
    return totalMembers > 0 ? (membersInMinistry / totalMembers) * 100 : 0;
  }

  function calculateAttendanceCorrelation() {
    const memberAttendance = members.map(member => {
      const memberRecords = attendance.filter(a => a.memberId === member.id);
      const attendanceRate = memberRecords.length > 0 ? (memberRecords.filter(a => a.present).length / memberRecords.length) * 100 : 0;
      const givingAmount = giving.filter(g => g.memberId === member.id).reduce((sum, g) => sum + g.amount, 0);
      return { attendanceRate, givingAmount, ministryCount: member.ministry.length };
    });
    
    return memberAttendance;
  }

  const downloadReport = (reportType: string, format: string = 'csv') => {
    let content = '';
    let filename = '';
    let mimeType = 'text/csv;charset=utf-8;';

    switch (reportType) {
      case 'financial':
        content = generateFinancialReport(format);
        filename = `financial-report-${dateRange.start}-to-${dateRange.end}.${format}`;
        break;
      case 'accounting':
        content = generateAccountingReport(format);
        filename = `accounting-report-${dateRange.start}-to-${dateRange.end}.${format}`;
        break;
      case 'membership':
        content = generateMembershipReport(format);
        filename = `membership-report-${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      case 'attendance':
        content = generateAttendanceReport(format);
        filename = `attendance-report-${dateRange.start}-to-${dateRange.end}.${format}`;
        break;
      case 'giving':
        content = generateGivingReport(format);
        filename = `giving-report-${dateRange.start}-to-${dateRange.end}.${format}`;
        break;
      case 'comprehensive':
        content = generateComprehensiveReport(format);
        filename = `comprehensive-report-${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      default:
        return;
    }

    if (format === 'pdf') {
      mimeType = 'application/pdf';
      // In a real app, you would generate PDF using a library like jsPDF
      content = `PDF Report: ${reportType}\nGenerated: ${new Date().toLocaleString()}\n\n${content}`;
    } else if (format === 'excel') {
      mimeType = 'application/vnd.ms-excel';
      // In a real app, you would generate Excel using a library like xlsx
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateFinancialReport = (format: string) => {
    if (format === 'csv') {
      const headers = ['Date', 'Type', 'Category', 'Subcategory', 'Description', 'Amount', 'Account', 'Campus', 'Payment Method', 'Reference', 'Reconciled'];
      const rows = filteredTransactions.map(t => [
        t.date,
        t.type,
        t.category,
        t.subcategory || '',
        t.description,
        t.amount.toString(),
        accounts.find(a => a.id === t.accountId)?.name || 'Unknown',
        t.campus,
        t.paymentMethod,
        t.referenceNumber || '',
        t.reconciled ? 'Yes' : 'No'
      ]);
      
      return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }
    return 'Financial report content';
  };

  const generateAccountingReport = (format: string) => {
    if (format === 'csv') {
      const headers = ['Account', 'Type', 'Currency', 'Opening Balance', 'Income', 'Expenses', 'Current Balance', 'Reconciled Transactions', 'Unreconciled Amount', 'Last Reconciled'];
      const rows = accountBalances.map(a => [
        a.name,
        a.type,
        a.currency,
        a.openingBalance.toString(),
        a.income.toString(),
        a.expenses.toString(),
        a.currentBalance.toString(),
        a.reconciledCount.toString(),
        a.unreconciledAmount.toString(),
        a.lastReconciled
      ]);
      
      return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }
    return 'Accounting report content';
  };

  const generateMembershipReport = (format: string) => {
    if (format === 'csv') {
      const headers = ['Name', 'Email', 'Phone', 'Address', 'Date of Birth', 'Age', 'Status', 'Join Date', 'Campus', 'Ministry', 'Role', 'Marital Status', 'Occupation', 'Emergency Contact', 'Last Attended'];
      const rows = members.map(m => {
        const age = Math.floor((new Date().getTime() - new Date(m.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        return [
          `${m.firstName} ${m.lastName}`,
          m.email,
          m.phone,
          m.address,
          m.dateOfBirth,
          age.toString(),
          m.membershipStatus,
          m.joinDate,
          m.campus,
          m.ministry.join('; '),
          m.role,
          m.maritalStatus || '',
          m.occupation || '',
          `${m.emergencyContact.name} (${m.emergencyContact.phone})`,
          m.lastAttended || ''
        ];
      });
      
      return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }
    return 'Membership report content';
  };

  const generateAttendanceReport = (format: string) => {
    const filteredAttendance = attendance.filter(a => {
      const attendanceDate = new Date(a.date);
      return attendanceDate >= new Date(dateRange.start) && attendanceDate <= new Date(dateRange.end);
    });

    if (format === 'csv') {
      const headers = ['Date', 'Service', 'Member', 'Present', 'Campus', 'Check-in Time', 'Late Arrival', 'Guest Count'];
      const rows = filteredAttendance.map(a => [
        a.date,
        a.service,
        a.memberName,
        a.present ? 'Yes' : 'No',
        a.campus,
        a.checkInTime || '',
        a.lateArrival ? 'Yes' : 'No',
        a.guestCount?.toString() || '0'
      ]);
      
      return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }
    return 'Attendance report content';
  };

  const generateGivingReport = (format: string) => {
    const filteredGiving = giving.filter(g => {
      const givingDate = new Date(g.date);
      return givingDate >= new Date(dateRange.start) && givingDate <= new Date(dateRange.end);
    });
    
    if (format === 'csv') {
      const headers = ['Date', 'Member', 'Amount', 'Net Amount', 'Type', 'Fund', 'Payment Method', 'Campus', 'Recurring', 'Tax Deductible', 'Receipt Sent', 'Thank You Sent', 'Anonymous'];
      const rows = filteredGiving.map(g => [
        g.date,
        g.memberName,
        g.amount.toString(),
        g.netAmount.toString(),
        g.type,
        g.fund,
        g.paymentMethod,
        g.campus,
        g.recurring ? 'Yes' : 'No',
        g.taxDeductible ? 'Yes' : 'No',
        g.receiptSent ? 'Yes' : 'No',
        g.thankYouSent ? 'Yes' : 'No',
        g.anonymous ? 'Yes' : 'No'
      ]);
      
      return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }
    return 'Giving report content';
  };

  const generateComprehensiveReport = (format: string) => {
    const report = `
COMPREHENSIVE CHURCH REPORT
Generated: ${new Date().toLocaleString()}
Period: ${dateRange.start} to ${dateRange.end}

=== MEMBERSHIP SUMMARY ===
Total Members: ${members.length}
Active Members: ${members.filter(m => m.membershipStatus === 'Active').length}
New Members (This Year): ${members.filter(m => new Date(m.joinDate).getFullYear() === new Date().getFullYear()).length}
Growth Rate: ${membershipAnalytics.growthRate.toFixed(1)}%
Retention Rate: ${membershipAnalytics.retentionRate.toFixed(1)}%

=== FINANCIAL SUMMARY ===
Total Income: $${totalIncome.toLocaleString()}
Total Expenses: $${totalExpenses.toLocaleString()}
Net Income: $${netIncome.toLocaleString()}
Number of Transactions: ${filteredTransactions.length}

=== ATTENDANCE SUMMARY ===
Average Attendance Rate: ${membershipAnalytics.attendanceCorrelation.length > 0 ? 
  (membershipAnalytics.attendanceCorrelation.reduce((sum, m) => sum + m.attendanceRate, 0) / membershipAnalytics.attendanceCorrelation.length).toFixed(1) : 0}%
Total Attendance Records: ${attendance.length}

=== GIVING SUMMARY ===
Total Giving: $${giving.reduce((sum, g) => sum + g.amount, 0).toLocaleString()}
Number of Givers: ${givingAnalysis.totalGivers}
Average Gift: $${givingAnalysis.averageGift.toFixed(2)}
Recurring Givers: ${givingAnalysis.recurringGivers}

=== MINISTRY PARTICIPATION ===
Ministry Participation Rate: ${membershipAnalytics.ministryParticipation.toFixed(1)}%
Active Ministries: ${Array.from(new Set(members.flatMap(m => m.ministry))).length}
`;

    return report;
  };

  const renderFinancialReport = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Financial Analysis Report</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => downloadReport('financial', 'pdf')}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => downloadReport('financial', 'excel')}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
  // Account Balance Summary for Accounting Report
  const getAccountBalances = () => {
    return accounts.map(account => ({
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
      status: account.isActive ? 'Active' : 'Inactive'
    }));
  };

  // Trial Balance Calculation
  const getTrialBalance = () => {
    const assetAccounts = accounts.filter(a => ['Bank', 'Cash', 'Investment'].includes(a.type));
    const totalAssets = assetAccounts.reduce((sum, a) => sum + a.balance, 0);
    
    const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      assets: totalAssets,
      income,
      expenses,
      netIncome: income - expenses
    };
  };
            <span>Excel</span>
          </button>
          <button
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Church Overview Report</h3>
        <button
          onClick={exportOverviewReport}
          disabled={exporting}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
      </div>
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>CSV</span>
          </button>
        </div>
      </div>
      
              <p className="text-blue-200 text-sm">+{membershipStats.newThisMonth} this month</p>
      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold">${totalIncome.toLocaleString()}</p>
              <p className="text-green-200 text-sm">
                {filteredTransactions.filter(t => t.type === 'Income').length} transactions
              </p>
              <p className="text-green-200 text-sm">All time</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold">${totalExpenses.toLocaleString()}</p>
              <p className="text-red-200 text-sm">
                {filteredTransactions.filter(t => t.type === 'Expense').length} transactions
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-red-200 transform rotate-180" />
          </div>
        </div>
        
        <div className={`${netIncome >= 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'} rounded-xl p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${netIncome >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-medium`}>Net Income</p>
              <p className="text-3xl font-bold">${netIncome.toLocaleString()}</p>
              <p className={`${netIncome >= 0 ? 'text-blue-200' : 'text-orange-200'} text-sm`}>
                {((netIncome / totalIncome) * 100).toFixed(1)}% margin
              </p>
            </div>
            <DollarSign className={`h-12 w-12 ${netIncome >= 0 ? 'text-blue-200' : 'text-orange-200'}`} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Monthly</p>
              <p className="text-3xl font-bold">
                ${monthlyTrends.length > 0 ? Math.round(monthlyTrends.reduce((sum, m) => sum + m.net, 0) / monthlyTrends.length).toLocaleString() : '0'}
              </p>
              <p className="text-purple-200 text-sm">12-month average</p>
            </div>
            <BarChart3 className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">12-Month Financial Trend</h4>
        <div className="space-y-4">
          {monthlyTrends.map((month, index) => {
            const maxAmount = Math.max(...monthlyTrends.map(m => Math.max(m.income, m.expenses)));
            const incomeWidth = (month.income / maxAmount) * 100;
            const expenseWidth = (month.expenses / maxAmount) * 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 w-20">{month.month}</span>
                  <div className="flex space-x-6 text-sm">
                    <span className="text-green-600">Income: ${month.income.toLocaleString()}</span>
                    <span className="text-red-600">Expenses: ${month.expenses.toLocaleString()}</span>
                    <span className={`font-semibold ${month.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      Net: ${month.net.toLocaleString()}
                    </span>
                    <span className="text-gray-500">{month.memberCount} members</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${incomeWidth}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${expenseWidth}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Income by Category</h4>
          <div className="space-y-4">
            {Object.entries(incomeByCategory)
              .sort(([,a], [,b]) => b.amount - a.amount)
              .map(([category, data]) => {
                const percentage = (data.amount / totalIncome) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">{category}</span>
                      <div className="text-right">
                        <span className="font-bold text-green-600">${data.amount.toLocaleString()}</span>
                        <p className="text-xs text-gray-500">{data.count} transactions</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total income</p>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Expenses by Category</h4>
          <div className="space-y-4">
            {Object.entries(expensesByCategory)
              .sort(([,a], [,b]) => b.amount - a.amount)
              .map(([category, data]) => {
                const percentage = (data.amount / totalExpenses) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">{category}</span>
                      <div className="text-right">
                        <span className="font-bold text-red-600">${data.amount.toLocaleString()}</span>
                        <p className="text-xs text-gray-500">{data.count} transactions</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total expenses</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Indicators</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              ${(totalIncome / members.filter(m => m.membershipStatus === 'Active').length).toFixed(0)}
            </p>
            <p className="text-sm text-blue-700 font-medium">Income per Active Member</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-green-700 font-medium">Profit Margin</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {(filteredTransactions.length / ((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24 * 30))).toFixed(1)}
            </p>
            <p className="text-sm text-purple-700 font-medium">Transactions per Month</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountingReport = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Accounting Reports</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => downloadReport('accounting', 'pdf')}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => downloadReport('accounting', 'excel')}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Excel</span>
          </button>
        </div>
      </div>
      
      {/* Account Balances */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h4 className="text-lg font-semibold text-gray-900">Account Balances & Reconciliation</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reconciliation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accountBalances.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="font-medium text-gray-900">{account.name}</div>
                      {account.accountNumber && (
                        <div className="text-sm text-gray-500 ml-2">({account.accountNumber})</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {account.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.currency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${account.openingBalance.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">${account.income.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">${account.expenses.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${
                      account.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${account.currentBalance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className={`font-medium ${account.unreconciledAmount === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {account.reconciledCount} reconciled
                      </div>
                      {account.unreconciledAmount !== 0 && (
                        <div className="text-yellow-600">${Math.abs(account.unreconciledAmount).toLocaleString()} pending</div>
                      )}
                      <div className="text-gray-500 text-xs">Last: {account.lastReconciled}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Flow Statement */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Cash Flow Statement</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-4">Operating Activities</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tithes & Offerings</span>
                <span className="font-medium text-green-600">
                  ${filteredTransactions.filter(t => t.type === 'Income' && ['Tithe', 'Offering'].includes(t.category)).reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Operating Expenses</span>
                <span className="font-medium text-red-600">
                  -${filteredTransactions.filter(t => t.type === 'Expense' && ['Utilities', 'Staff Salary', 'Office Supplies'].includes(t.category)).reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Net Operating Cash Flow</span>
                  <span className="text-blue-600">
                    ${(filteredTransactions.filter(t => t.type === 'Income' && ['Tithe', 'Offering'].includes(t.category)).reduce((sum, t) => sum + t.amount, 0) - 
                       filteredTransactions.filter(t => t.type === 'Expense' && ['Utilities', 'Staff Salary', 'Office Supplies'].includes(t.category)).reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-4">Investing Activities</h5>
            <div className="space-y-3">
              <p className="text-purple-200 text-sm">{attendanceStats.weeklyAverage}/week avg</p>
              <div className="flex justify-between">
                <span className="text-gray-600">Equipment Purchases</span>
                <span className="font-medium text-red-600">
                  -${filteredTransactions.filter(t => t.type === 'Expense' && t.category === 'Equipment').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Building Improvements</span>
                <span className="font-medium text-red-600">
                  -${filteredTransactions.filter(t => t.type === 'Expense' && t.category === 'Maintenance').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              <p className="text-orange-200 text-sm">${Math.round(givingStats.averageGift).toLocaleString()} avg</p>
                </span>
            <DollarSign className="h-12 w-12 text-orange-200" />
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-4">Financing Activities</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Special Offerings</span>
                <span className="font-medium text-green-600">
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donations</span>
                <span className="font-medium text-green-600">
                  ${filteredTransactions.filter(t => t.type === 'Income' && t.category === 'Donations').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">This Month</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Income:</span>
              <span className="font-semibold text-green-600">${financialStats.monthlyIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expenses:</span>
              <span className="font-semibold text-red-600">${financialStats.monthlyExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium text-gray-900">Net:</span>
              <span className={`font-bold ${(financialStats.monthlyIncome - financialStats.monthlyExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(financialStats.monthlyIncome - financialStats.monthlyExpenses).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h4>
          <div className="space-y-2">
            {accounts.slice(0, 3).map(account => (
              <div key={account.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{account.name}:</span>
                <span className="font-medium">{account.currency} {account.balance.toLocaleString()}</span>
              </div>
            ))}
            {accounts.length > 3 && (
              <p className="text-xs text-gray-500">+{accounts.length - 3} more accounts</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">New Members:</span>
              <span className="font-medium">{membershipStats.newThisMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Events This Month:</span>
              <span className="font-medium">{events.filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7))).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Communications:</span>
              <span className="font-medium">{communications.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMembershipReport = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Membership Analytics Report</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => downloadReport('membership', 'pdf')}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => downloadReport('membership', 'csv')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Membership Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{members.length}</p>
            <p className="text-sm text-gray-600 font-medium">Total Members</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{membershipAnalytics.growthRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 font-medium">Growth Rate</p>
            <p className="text-xs text-gray-500 mt-1">Year over year</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{membershipAnalytics.retentionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 font-medium">Retention Rate</p>
            <p className="text-xs text-gray-500 mt-1">12 months</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{membershipAnalytics.ministryParticipation.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 font-medium">Ministry Participation</p>
            <p className="text-xs text-gray-500 mt-1">Active members</p>
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Age Distribution</h4>
        <div className="space-y-4">
          {Object.entries(membershipAnalytics.ageDistribution).map(([ageGroup, count]) => {
            const percentage = (count / members.length) * 100;
            return (
              <div key={ageGroup} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{ageGroup} years</span>
                  <div className="text-right">
                    <span className="font-bold text-blue-600">{count} members</span>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Membership Report</h3>
        <button
          onClick={exportMembershipReport}
          disabled={exporting}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
      </div>
      {/* Membership Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Membership Status</h4>
          <div className="space-y-4">
            {['Active', 'Inactive', 'Visitor', 'New Member'].map(status => {
              const count = members.filter(m => m.membershipStatus === status).length;
              const percentage = (count / members.length) * 100;
              const color = status === 'Active' ? 'green' : status === 'Inactive' ? 'red' : status === 'Visitor' ? 'yellow' : 'blue';
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full bg-${color}-500`}></div>
                    <span className="text-gray-700 font-medium">{status}</span>
                  </div>
                  <div className="text-right">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">New This Month</span>
              <span className="font-semibold text-blue-600">{membershipStats.newThisMonth}</span>
            </div>
                    <span className="font-bold text-gray-900">{count}</span>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Ministry Involvement</h4>
          <div className="space-y-4">
            {Array.from(new Set(members.flatMap(m => m.ministry)))
              .filter(ministry => ministry)
              .map((ministry) => {
                const count = members.filter(m => m.ministry.includes(ministry)).length;
                const percentage = (count / members.length) * 100;
                
                return (
                  <div key={ministry} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{ministry}</span>
                    <div className="text-right">
                      <span className="font-bold text-purple-600">{count}</span>
                      <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
                <div key={index} className="text-sm hover:bg-gray-50 p-2 rounded transition-colors cursor-pointer">
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Detailed Reports & Analytics</h2>
          <p className="text-gray-600 mt-2">Comprehensive insights and downloadable reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value as 'pdf' | 'excel' | 'csv')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="csv">CSV Format</option>
            <option value="excel">Excel Format</option>
            <option value="pdf">PDF Format</option>
          </select>
          <button 
            onClick={() => downloadReport(selectedReport, reportFormat)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <div key={index} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors">
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
              <div key={index} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors">
            >
              <option value="all">All Campuses</option>
              <option value="Main Campus">Main Campus</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: '0-17', min: 0, max: 17 },
            { label: '18-30', min: 18, max: 30 },
            { label: '31-50', min: 31, max: 50 },
            { label: '51-70', min: 51, max: 70 },
            { label: '70+', min: 71, max: 150 }
          ].map(ageGroup => {
            const count = members.filter(m => {
              const age = Math.floor((new Date().getTime() - new Date(m.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
              return age >= ageGroup.min && age <= ageGroup.max;
            }).length;
            
            return (
              <div key={ageGroup.label} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-sm text-gray-600">{ageGroup.label} years</p>
              </div>
            );
          })}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Attendance Report</h3>
        <button
          onClick={exportAttendanceReport}
          disabled={exporting}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
      </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Report Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`group p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-1 ${
                  selectedReport === report.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Weekly Average</span>
              <span className="font-semibold text-purple-600">{attendanceStats.weeklyAverage}</span>
            </div>
              >
                <div className={`p-3 rounded-lg w-fit mb-4 transition-all duration-300 ${
                  selectedReport === report.id ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-100'
                }`}>
                  <Icon className={`h-6 w-6 transition-colors ${
                    selectedReport === report.id ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
                  }`} />
                </div>
                <h4 className={`font-semibold mb-2 transition-colors ${
                  selectedReport === report.id ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-700'
                }`}>
                  {report.label}
                <div key={index} className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                <p className="text-sm text-gray-600">{report.description}</p>
                  <div className="text-right">
                    <span className="font-medium">{percentage}%</span>
                    <p className="text-xs text-gray-500">{presentCount}/{serviceAttendance.length}</p>
                  </div>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {selectedReport === 'financial' && renderFinancialReport()}
        {selectedReport === 'accounting' && renderAccountingReport()}
        {selectedReport === 'membership' && renderMembershipReport()}
        {selectedReport === 'attendance' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Attendance Analysis Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-2xl font-bold text-blue-600">{attendance.length}</p>
                <p className="text-blue-700 font-medium">Total Records</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div key={index} className="text-sm hover:bg-gray-50 p-2 rounded transition-colors cursor-pointer">
                  {attendance.length > 0 ? ((attendance.filter(a => a.present).length / attendance.length) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-green-700 font-medium">Average Attendance</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-2xl font-bold text-purple-600">
                  {Array.from(new Set(attendance.map(a => a.service))).length}

      {/* Attendance Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends (Last 8 Weeks)</h4>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {Array.from({ length: 8 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7));
            const weekAttendance = attendance.filter(a => {
              const attendanceDate = new Date(a.date);
              const weekStart = new Date(date);
              weekStart.setDate(weekStart.getDate() - weekStart.getDay());
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekEnd.getDate() + 6);
              return attendanceDate >= weekStart && attendanceDate <= weekEnd;
            });
            const presentCount = weekAttendance.filter(a => a.present).length;
            const percentage = weekAttendance.length > 0 ? (presentCount / weekAttendance.length) * 100 : 0;
            
            return (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="h-16 bg-gray-200 rounded relative">
                  <div 
                    className="bg-blue-500 rounded absolute bottom-0 w-full transition-all duration-500"
                    style={{ height: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs font-medium mt-1">{Math.round(percentage)}%</div>
              </div>
            );
          }).reverse()}
        </div>
      </div>
                </p>
                <p className="text-purple-700 font-medium">Service Types</p>
              </div>
  const renderAccountingReport = () => {
    const trialBalance = getTrialBalance();
    const accountBalances = getAccountBalances();
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Accounting Report</h3>
          <button
            onClick={exportAccountingReport}
            disabled={exporting}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>

        {/* Trial Balance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Trial Balance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Assets</h5>
              <div className="space-y-2">
                {accounts.filter(a => ['Bank', 'Cash', 'Investment'].includes(a.type)).map(account => (
                  <div key={account.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{account.name}</span>
                    <span className="font-medium">${account.balance.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Assets</span>
                  <span className="text-blue-600">${trialBalance.assets.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Income & Expenses</h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Income</span>
                  <span className="font-medium text-green-600">${trialBalance.income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Expenses</span>
                  <span className="font-medium text-red-600">${trialBalance.expenses.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Net Income</span>
                  <span className={trialBalance.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${trialBalance.netIncome.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Balances */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Balances</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Account Name</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-700">Balance</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {accountBalances.map((account, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-sm text-gray-900">{account.name}</td>
                    <td className="py-3 text-sm text-gray-600">{account.type}</td>
                    <td className="py-3 text-sm text-right font-medium">
                      {account.currency} {account.balance.toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        account.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {account.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Health Indicators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Health Indicators</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {financialStats.totalIncome > 0 ? ((financialStats.totalIncome - financialStats.totalExpenses) / financialStats.totalIncome * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-gray-600">Profit Margin</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(trialBalance.assets / (financialStats.monthlyExpenses || 1))}
              </p>
              <p className="text-sm text-gray-600">Months of Reserves</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {givingStats.totalGiving > 0 ? (givingStats.totalGiving / financialStats.totalIncome * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-gray-600">Giving Ratio</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGivingReport = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Giving Report</h3>
        <button
          onClick={exportGivingReport}
          disabled={exporting}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${givingStats.totalGiving.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Giving</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">${Math.round(givingStats.averageGift).toLocaleString()}</p>
            <p className="text-sm text-gray-500">Average Gift</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{givingStats.recurringGivers}</p>
            <p className="text-sm text-gray-500">Recurring Givers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">${givingStats.monthlyGiving.toLocaleString()}</p>
            <p className="text-sm text-gray-500">This Month</p>
          </div>
        </div>
      </div>

      {/* Top Givers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Givers</h4>
        <div className="space-y-3">
          {members.map(member => {
            const memberGiving = giving.filter(g => g.memberId === member.id);
            const total = memberGiving.reduce((sum, g) => sum + g.amount, 0);
            return { ...member, totalGiving: total };
          })
          .filter(m => m.totalGiving > 0)
          .sort((a, b) => b.totalGiving - a.totalGiving)
          .slice(0, 10)
          .map((member, index) => (
            <div key={member.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium text-sm">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                  <p className="text-sm text-gray-500">{giving.filter(g => g.memberId === member.id).length} gifts</p>
                </div>
              </div>
              <span className="font-semibold text-green-600">${member.totalGiving.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
            </div>
          </div>
        )}
        {selectedReport === 'giving' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Giving Analysis Report</h3>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button 
            onClick={exportCurrentReport}
            disabled={exporting}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
              <div className="bg-green-50 rounded-lg p-6">
            <span>{exporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
        </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-2xl font-bold text-blue-600">{givingAnalysis.totalGivers}</p>
                <p className="text-blue-700 font-medium">Total Givers</p>
              </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <p className="text-2xl font-bold text-purple-600">${givingAnalysis.averageGift.toFixed(0)}</p>
                <p className="text-purple-700 font-medium">Average Gift</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-6">
                <p className="text-2xl font-bold text-orange-600">{givingAnalysis.recurringGivers}</p>
                <p className="text-orange-700 font-medium">Recurring Givers</p>
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
            </div>
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
        )}
        {selectedReport === 'ministry' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Ministry Performance Report</h3>
                <div className="text-center">
                  <p className="font-medium text-sm">{report.label}</p>
                  <p className="text-xs text-gray-500">{report.description}</p>
                </div>
          </div>
        )}
        {selectedReport === 'comprehensive' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Comprehensive Church Report</h3>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-6 rounded-lg">
                {generateComprehensiveReport('text')}
              </pre>
            </div>
          </div>
        )}
        {selectedReport === 'giving' && renderGivingReport()}
        {selectedReport === 'accounting' && renderAccountingReport()}
      </div>
    </div>
  );
};

export default DetailedReports;
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Financial Report</h3>
        <button
          onClick={exportFinancialReport}
          disabled={exporting}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
      </div>