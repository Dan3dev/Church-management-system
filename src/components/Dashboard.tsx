import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  AlertCircle, 
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  Activity,
  Bell,
  ChevronRight,
  Plus,
  Download,
  FileText,
  Send,
  Settings
} from 'lucide-react';
import { Member, AttendanceRecord, FinancialTransaction, Event } from '../types';
import { useExport } from '../hooks/useExport';
import { useApp } from '../context/AppContext';

interface DashboardProps {
  members: Member[];
  attendance: AttendanceRecord[];
  transactions: FinancialTransaction[];
  events: Event[];
  onQuickAction: (action: string) => void;
  onViewMember?: (member: Member) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ members, attendance, transactions, events, onQuickAction, onViewMember }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const { exportToCSV, exportToPDF, exporting } = useExport();
  const { formatCurrency, t, state, sendNotification } = useApp();
  
  const activeMembers = members.filter(m => m.membershipStatus === 'Active').length;
  const totalMembers = members.length;
  const visitors = members.filter(m => m.membershipStatus === 'Visitor').length;
  const newMembers = members.filter(m => {
    const joinDate = new Date(m.joinDate);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return joinDate >= oneMonthAgo;
  }).length;
  
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

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const birthdaysThisWeek = members.filter(member => {
    const birthday = new Date(member.dateOfBirth);
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
    
    const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    return thisYearBirthday >= today && thisYearBirthday <= oneWeekFromNow;
  });

  const followUpNeeded = members.filter(m => m.followUpNeeded || m.membershipStatus === 'Visitor').length;

  // Export functions
  const handleExportMembers = () => {
    sendNotification({
      type: 'info',
      title: t('exportStarted') || 'Export Started',
      message: t('exportingMembers') || 'Exporting member data...',
      userId: 'system',
      priority: 'low',
      category: 'export',
      read: false
    });

    const exportData = members.map(member => ({
      [t('firstName')]: member.firstName,
      [t('lastName')]: member.lastName,
      [t('email')]: member.email,
      [t('phone')]: member.phone,
      [t('status')]: member.membershipStatus,
      [t('joinDate')]: member.joinDate,
      [t('campus')]: member.campus,
      [t('ministry')]: member.ministry.join(', ')
    }));
    
    const success = exportToCSV(exportData, 'church_members');
    if (success) {
      sendNotification({
        type: 'success',
        title: t('exportSuccess'),
        message: t('membersExported') || 'Member data exported successfully',
        userId: 'system',
        priority: 'low',
        category: 'export',
        read: false
      });
    }
  };

  const handleExportFinancials = () => {
    sendNotification({
      type: 'info',
      title: t('exportStarted') || 'Export Started',
      message: t('exportingFinancials') || 'Exporting financial data...',
      userId: 'system',
      priority: 'low',
      category: 'export',
      read: false
    });

    const exportData = transactions.map(transaction => ({
      [t('date')]: transaction.date,
      [t('type')]: transaction.type,
      [t('category')]: transaction.category,
      [t('amount')]: formatCurrency(transaction.amount),
      [t('description')]: transaction.description,
      [t('paymentMethod') || 'Payment Method']: transaction.paymentMethod,
      [t('member') || 'Member']: transaction.memberName || '',
      [t('campus')]: transaction.campus
    }));
    
    const success = exportToCSV(exportData, 'financial_transactions');
    if (success) {
      sendNotification({
        type: 'success',
        title: t('exportSuccess'),
        message: t('financialsExported') || 'Financial data exported successfully',
        userId: 'system',
        priority: 'low',
        category: 'export',
        read: false
      });
    }
  };

  const handleExportAttendance = () => {
    sendNotification({
      type: 'info',
      title: t('exportStarted') || 'Export Started',
      message: t('exportingAttendance') || 'Exporting attendance data...',
      userId: 'system',
      priority: 'low',
      category: 'export',
      read: false
    });

    const exportData = attendance.map(record => ({
      [t('date')]: record.date,
      [t('member') || 'Member']: record.memberName,
      [t('service') || 'Service']: record.service,
      [t('present') || 'Present']: record.present ? t('yes') || 'Yes' : t('no') || 'No',
      [t('campus')]: record.campus
    }));
    
    const success = exportToCSV(exportData, 'attendance_records');
    if (success) {
      sendNotification({
        type: 'success',
        title: t('exportSuccess'),
        message: t('attendanceExported') || 'Attendance data exported successfully',
        userId: 'system',
        priority: 'low',
        category: 'export',
        read: false
      });
    }
  };
  const stats = [
    {
      label: t('totalMembers'),
      value: totalMembers,
      subValue: `${activeMembers} ${t('active')}`,
      icon: Users,
      color: 'blue',
      trend: `+${newMembers} ${t('thisMonth') || 'this month'}`,
      trendPositive: true,
      action: () => onQuickAction('members')
    },
    {
      label: t('monthlyIncome'),
      value: formatCurrency(monthlyIncome),
      subValue: `${t('net') || 'Net'}: ${formatCurrency(monthlyIncome - monthlyExpenses)}`,
      icon: DollarSign,
      color: 'green',
      trend: monthlyIncome > monthlyExpenses ? `+${Math.round(((monthlyIncome - monthlyExpenses) / monthlyExpenses) * 100)}%` : `-${Math.round(((monthlyExpenses - monthlyIncome) / monthlyIncome) * 100)}%`,
      trendPositive: monthlyIncome > monthlyExpenses,
      action: () => onQuickAction('finance')
    },
    {
      label: t('weeklyAttendance'),
      value: `${averageAttendance}%`,
      subValue: `${recentAttendance.filter(a => a.present).length} ${t('present') || 'Present'}`,
      icon: UserCheck,
      color: 'purple',
      trend: `+5% ${t('fromLastWeek') || 'from last week'}`,
      trendPositive: true,
      action: () => onQuickAction('attendance')
    },
    {
      label: t('upcomingEvents'),
      value: upcomingEvents.length,
      subValue: t('next30Days') || 'Next 30 days',
      icon: Calendar,
      color: 'orange',
      trend: t('viewAllEvents') || 'View all events',
      trendPositive: true,
      action: () => onQuickAction('events')
    }
  ];

  const quickActions = [
    {
      title: t('addNewMember'),
      description: t('registerNewMember') || 'Register a new church member',
      icon: Users,
      color: 'blue',
      action: () => onQuickAction('members')
    },
    {
      title: t('recordAttendance'),
      description: t('markAttendanceServices') || 'Mark attendance for services',
      icon: UserCheck,
      color: 'green',
      action: () => onQuickAction('attendance')
    },
    {
      title: t('addTransaction'),
      description: t('recordIncomeExpense') || 'Record income or expense',
      icon: DollarSign,
      color: 'yellow',
      action: () => onQuickAction('finance')
    },
    {
      title: t('scheduleEvent'),
      description: t('createNewEvent') || 'Create a new church event',
      icon: Calendar,
      color: 'purple',
      action: () => onQuickAction('events')
    },
    {
      title: t('sendCommunication'),
      description: t('sendEmailSMS') || 'Send email or SMS to members',
      icon: Send,
      color: 'indigo',
      action: () => onQuickAction('communication')
    },
    {
      title: t('generateReport'),
      description: t('createDetailedReports') || 'Create detailed reports',
      icon: FileText,
      color: 'gray',
      action: () => onQuickAction('reports')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
            <p className="text-blue-100 text-lg">
              {t('todayIs') || 'Today is'} {new Date().toLocaleDateString(languageService.getLanguageLocale(state.currentLanguage), { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
            <p className="text-blue-100">{t('lastUpdated') || 'Last updated'}</p>
            <p className="text-xl font-semibold">{new Date().toLocaleTimeString(languageService.getLanguageLocale(state.currentLanguage))}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleExportMembers}
                disabled={exporting}
                className="flex items-center space-x-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>{t('exportMembers') || 'Export Members'}</span>
              </button>
              <button
                onClick={handleExportFinancials}
                disabled={exporting}
                className="flex items-center space-x-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>{t('exportFinancials') || 'Export Financials'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={stat.action}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100 shadow-sm`}>
                  <Icon className={`h-7 w-7 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trendPositive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.subValue}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts & Notifications */}
      {(birthdaysThisWeek.length > 0 || followUpNeeded > 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">{t('alertsReminders') || 'Alerts & Reminders'}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {birthdaysThisWeek.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">🎂 {t('birthdaysThisWeek') || 'Birthdays This Week'}</h4>
                <div className="space-y-2">
                  {birthdaysThisWeek.slice(0, 3).map(member => (
                    <div 
                      key={member.id} 
                      className="flex items-center justify-between cursor-pointer hover:bg-yellow-100 p-2 rounded transition-colors"
                      onClick={() => onViewMember && onViewMember(member)}
                    >
                      <span className="text-yellow-700">{member.firstName} {member.lastName}</span>
                      <span className="text-yellow-600 text-sm">
                        {new Date(member.dateOfBirth).toLocaleDateString(languageService.getLanguageLocale(state.currentLanguage), { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                  {birthdaysThisWeek.length > 3 && (
                    <p className="text-yellow-600 text-sm">+{birthdaysThisWeek.length - 3} {t('more') || 'more'}</p>
                  )}
                </div>
              </div>
            )}
            
            {followUpNeeded > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">📞 {t('followUpNeeded') || 'Follow-up Needed'}</h4>
                <p className="text-red-700">{followUpNeeded} {t('membersNeedFollowUp') || 'members need follow-up'}</p>
                <button 
                  onClick={() => onQuickAction('members')}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  {t('viewDetails') || 'View Details'} →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('quickActions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`group p-6 rounded-xl border-2 border-gray-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-1`}
              >
                <div className={`p-3 rounded-lg bg-${action.color}-100 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 text-${action.color}-600`} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{action.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  <span>{t('getStarted') || 'Get started'}</span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('upcomingEvents')}</h3>
              <button 
                onClick={() => onQuickAction('events')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {t('viewAll') || 'View All'}
              </button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                    onClick={() => onQuickAction('events')}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {event.title}
                        </h4>
                        <div className="space-y-1 mt-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString(languageService.getLanguageLocale(state.currentLanguage))}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        event.type === 'Service' ? 'bg-blue-100 text-blue-700' :
                        event.type === 'Meeting' ? 'bg-gray-100 text-gray-700' :
                        event.type === 'Fellowship' ? 'bg-green-100 text-green-700' :
                        event.type === 'Outreach' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">{t('noUpcomingEvents') || 'No upcoming events'}</p>
                  <p className="text-sm">{t('scheduleFirstEvent') || 'Schedule your first event'}</p>
                  <button 
                    onClick={() => onQuickAction('events')}
                    className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {t('createEvent') || 'Create Event'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity & Financial Overview */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Financial Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('recentFinancialActivity') || 'Recent Financial Activity'}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleExportFinancials}
                  disabled={exporting}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>{t('export')}</span>
                </button>
                <button 
                onClick={() => onQuickAction('finance')}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                {t('viewAll') || 'View All'}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer group"
                  onClick={() => onQuickAction('finance')}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${
                      transaction.type === 'Income' ? 'bg-green-100 group-hover:bg-green-200' : 'bg-red-100 group-hover:bg-red-200'
                    } transition-colors`}>
                      <DollarSign className={`h-5 w-5 ${
                        transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{transaction.category}</span>
                        <span>{new Date(transaction.date).toLocaleDateString(languageService.getLanguageLocale(state.currentLanguage))}</span>
                        <span>{transaction.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'Income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Member Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('memberInsights') || 'Member Insights'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">{t('recentAdditions') || 'Recent Additions'}</h4>
                <div className="space-y-3">
                  {members
                    .filter(m => {
                      const joinDate = new Date(m.joinDate);
                      const twoWeeksAgo = new Date();
                      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
                      return joinDate >= twoWeeksAgo;
                    })
                    .slice(0, 3)
                    .map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                           onClick={() => onViewMember && onViewMember(member)}>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                          <p className="text-sm text-gray-500">{t('joined') || 'Joined'} {new Date(member.joinDate).toLocaleDateString(languageService.getLanguageLocale(state.currentLanguage))}</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{t('new') || 'New'}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">{t('ministryLeaders') || 'Ministry Leaders'}</h4>
                <div className="space-y-3">
                  {members
                    .filter(m => m.role === 'leader' || m.role === 'pastor')
                    .slice(0, 3)
                    .map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                           onClick={() => onViewMember && onViewMember(member)}>
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Award className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                          <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-purple-600">{member.ministry.length}</p>
                          <p className="text-xs text-gray-500">{t('ministries')}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{t('recentActivity')}</h3>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">{t('liveUpdates') || 'Live updates'}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Sample activity items */}
          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-gray-900">
                <span className="font-medium">John Smith</span> {t('wasAddedToWorshipTeam') || 'was added to Worship Team'}
              </p>
              <p className="text-sm text-gray-500">{t('hoursAgo', '2') || '2 hours ago'}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-gray-900">
                <span className="font-medium">{t('sundayMorningService') || 'Sunday Morning Service'}</span> {t('attendanceRecorded') || 'attendance recorded'}
              </p>
              <p className="text-sm text-gray-500">{t('dayAgo', '1') || '1 day ago'}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-gray-900">
                <span className="font-medium">{formatCurrency(2500)}</span> {t('titheCollectionProcessed') || 'tithe collection processed'}
              </p>
              <p className="text-sm text-gray-500">{t('daysAgo', '2') || '2 days ago'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;