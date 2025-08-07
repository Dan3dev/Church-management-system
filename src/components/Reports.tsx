import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Users } from 'lucide-react';
import { Member, AttendanceRecord, FinancialTransaction, Event } from '../types';

interface ReportsProps {
  members: Member[];
  attendance: AttendanceRecord[];
  transactions: FinancialTransaction[];
  events: Event[];
}

const Reports: React.FC<ReportsProps> = ({ members, attendance, transactions, events }) => {
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportTypes = [
    { id: 'overview', label: 'Overview Report', icon: BarChart3 },
    { id: 'membership', label: 'Membership Report', icon: Users },
    { id: 'financial', label: 'Financial Report', icon: TrendingUp },
    { id: 'attendance', label: 'Attendance Report', icon: Calendar }
  ];

  // Calculate various statistics
  const membershipStats = {
    total: members.length,
    active: members.filter(m => m.membershipStatus === 'Active').length,
    inactive: members.filter(m => m.membershipStatus === 'Inactive').length,
    visitors: members.filter(m => m.membershipStatus === 'Visitor').length
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const financialStats = {
    totalIncome: transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0),
    yearlyIncome: transactions.filter(t => t.type === 'Income' && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0),
    yearlyExpenses: transactions.filter(t => t.type === 'Expense' && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0),
  };

  const attendanceStats = {
    totalRecords: attendance.length,
    averageAttendance: attendance.length > 0 ? Math.round((attendance.filter(a => a.present).length / attendance.length) * 100) : 0,
    recentAttendance: attendance.filter(a => {
      const date = new Date(a.date);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return date >= oneMonthAgo;
    })
  };

  const getMonthlyFinancials = () => {
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      
      const income = transactions
        .filter(t => t.type === 'Income' && t.date.startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type === 'Expense' && t.date.startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income,
        expenses,
        net: income - expenses
      });
    }
    return monthlyData;
  };

  const monthlyFinancials = getMonthlyFinancials();

  const getTopCategories = (type: 'Income' | 'Expense') => {
    const categories = transactions
      .filter(t => t.type === type)
      .reduce((acc: {[key: string]: number}, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Church Overview Report</h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Members</p>
              <p className="text-3xl font-bold">{membershipStats.total}</p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Net Income</p>
              <p className="text-3xl font-bold">${(financialStats.totalIncome - financialStats.totalExpenses).toLocaleString()}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Avg Attendance</p>
              <p className="text-3xl font-bold">{attendanceStats.averageAttendance}%</p>
            </div>
            <Calendar className="h-12 w-12 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Events</p>
              <p className="text-3xl font-bold">{events.length}</p>
            </div>
            <BarChart3 className="h-12 w-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Monthly Financial Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">12-Month Financial Trend</h4>
        <div className="space-y-3">
          {monthlyFinancials.map((month, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="font-medium text-gray-900">{month.month}</span>
              <div className="flex space-x-6 text-sm">
                <span className="text-green-600">Income: ${month.income.toLocaleString()}</span>
                <span className="text-red-600">Expenses: ${month.expenses.toLocaleString()}</span>
                <span className={`font-semibold ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Net: ${month.net.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMembershipReport = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Membership Report</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Membership Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Members</span>
              <span className="font-semibold text-green-600">{membershipStats.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Inactive Members</span>
              <span className="font-semibold text-red-600">{membershipStats.inactive}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Visitors</span>
              <span className="font-semibold text-yellow-600">{membershipStats.visitors}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-blue-600">{membershipStats.total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Member Ministries</h4>
          <div className="space-y-2">
            {Array.from(new Set(members.flatMap(m => m.ministry)))
              .filter(ministry => ministry)
              .map((ministry, index) => {
                const count = members.filter(m => m.ministry.includes(ministry)).length;
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{ministry}</span>
                    <span className="font-medium">{count} members</span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Additions</h4>
          <div className="space-y-2">
            {members
              .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
              .slice(0, 5)
              .map((member, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                  <p className="text-gray-500">Joined {new Date(member.joinDate).toLocaleDateString()}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Financial Report</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Income Categories</h4>
          <div className="space-y-3">
            {getTopCategories('Income').map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{item.category}</span>
                <span className="font-semibold text-green-600">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Expense Categories</h4>
          <div className="space-y-3">
            {getTopCategories('Expense').map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{item.category}</span>
                <span className="font-semibold text-red-600">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Annual Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${financialStats.yearlyIncome.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Income {currentYear}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">${financialStats.yearlyExpenses.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Expenses {currentYear}</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${(financialStats.yearlyIncome - financialStats.yearlyExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${(financialStats.yearlyIncome - financialStats.yearlyExpenses).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Net Income {currentYear}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
            <p className="text-sm text-gray-500">Total Transactions</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendanceReport = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Attendance Report</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Overall Statistics</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Records</span>
              <span className="font-semibold">{attendanceStats.totalRecords}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Attendance</span>
              <span className="font-semibold text-blue-600">{attendanceStats.averageAttendance}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Recent Month Records</span>
              <span className="font-semibold">{attendanceStats.recentAttendance.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Attendance</h4>
          <div className="space-y-2">
            {Array.from(new Set(attendance.map(a => a.service))).map((service, index) => {
              const serviceAttendance = attendance.filter(a => a.service === service);
              const presentCount = serviceAttendance.filter(a => a.present).length;
              const percentage = serviceAttendance.length > 0 ? Math.round((presentCount / serviceAttendance.length) * 100) : 0;
              
              return (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{service}</span>
                  <span className="font-medium">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Perfect Attendance</h4>
          <div className="space-y-2">
            {members
              .map(member => {
                const memberAttendance = attendance.filter(a => a.memberId === member.id);
                const presentCount = memberAttendance.filter(a => a.present).length;
                const percentage = memberAttendance.length > 0 ? Math.round((presentCount / memberAttendance.length) * 100) : 0;
                return { ...member, percentage, totalRecords: memberAttendance.length };
              })
              .filter(member => member.percentage === 100 && member.totalRecords > 0)
              .slice(0, 5)
              .map((member, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                  <p className="text-green-600">100% ({member.totalRecords} services)</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
                  selectedReport === report.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="font-medium">{report.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {selectedReport === 'overview' && renderOverviewReport()}
        {selectedReport === 'membership' && renderMembershipReport()}
        {selectedReport === 'financial' && renderFinancialReport()}
        {selectedReport === 'attendance' && renderAttendanceReport()}
      </div>
    </div>
  );
};

export default Reports;