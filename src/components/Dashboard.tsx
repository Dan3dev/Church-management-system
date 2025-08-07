import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';
import { Member, AttendanceRecord, FinancialTransaction, Event } from '../types';

interface DashboardProps {
  members: Member[];
  attendance: AttendanceRecord[];
  transactions: FinancialTransaction[];
  events: Event[];
  onQuickAction: (action: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ members, attendance, transactions, events, onQuickAction }) => {
  const activeMembers = members.filter(m => m.membershipStatus === 'Active').length;
  const totalMembers = members.length;
  
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  
  const monthlyIncome = transactions
    .filter(t => t.type === 'Income' && new Date(t.date).getMonth() === thisMonth && new Date(t.date).getFullYear() === thisYear)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = transactions
    .filter(t => t.type === 'Expense' && new Date(t.date).getMonth() === thisMonth && new Date(t.date).getFullYear() === thisYear)
    .reduce((sum, t) => sum + t.amount, 0);

  const recentAttendance = attendance.filter(a => {
    const date = new Date(a.date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return date >= oneWeekAgo;
  });

  const averageAttendance = recentAttendance.length > 0 
    ? Math.round((recentAttendance.filter(a => a.present).length / recentAttendance.length) * 100)
    : 0;

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).slice(0, 3);

  const stats = [
    {
      label: 'Total Members',
      value: totalMembers,
      subValue: `${activeMembers} Active`,
      icon: Users,
      color: 'blue',
      trend: '+12%'
    },
    {
      label: 'Monthly Income',
      value: `$${monthlyIncome.toLocaleString()}`,
      subValue: `Expenses: $${monthlyExpenses.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      trend: monthlyIncome > monthlyExpenses ? '+' + Math.round(((monthlyIncome - monthlyExpenses) / monthlyExpenses) * 100) + '%' : '-' + Math.round(((monthlyExpenses - monthlyIncome) / monthlyIncome) * 100) + '%'
    },
    {
      label: 'Weekly Attendance',
      value: `${averageAttendance}%`,
      subValue: `${recentAttendance.filter(a => a.present).length} Present`,
      icon: UserCheck,
      color: 'purple',
      trend: '+5%'
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents.length,
      subValue: 'This Month',
      icon: Calendar,
      color: 'orange',
      trend: 'New'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-green-600' : stat.trend.startsWith('-') ? 'text-red-600' : 'text-blue-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.subValue}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onQuickAction('add-member')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Add New Member</span>
              </div>
            </button>
            <button 
              onClick={() => onQuickAction('record-attendance')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <UserCheck className="h-5 w-5 text-green-600" />
                <span className="font-medium">Record Attendance</span>
              </div>
            </button>
            <button 
              onClick={() => onQuickAction('add-transaction')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Add Financial Transaction</span>
              </div>
            </button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                      <p className="text-xs text-gray-400">{event.location}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.type === 'Service' ? 'bg-blue-100 text-blue-700' :
                      event.type === 'Meeting' ? 'bg-gray-100 text-gray-700' :
                      event.type === 'Fellowship' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No upcoming events scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'Income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <DollarSign className={`h-4 w-4 ${
                    transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-semibold ${
                transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;