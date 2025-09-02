import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import { useApp } from './context/AppContext';
import LoginForm from './components/auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import NotificationCenter from './components/Layout/NotificationCenter';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import MemberDetail from './components/members/MemberDetail';
import FamilyManagement from './components/families/FamilyManagement';
import Attendance from './components/Attendance';
import Finance from './components/Finance';
import AccountManagement from './components/accounts/AccountManagement';
import Events from './components/Events';
import DetailedReports from './components/reports/DetailedReports';
import GivingManagement from './components/giving/GivingManagement';
import VolunteerScheduling from './components/volunteers/VolunteerScheduling';
import CommunicationCenter from './components/communication/CommunicationCenter';
import ChildCheckIn from './components/children/ChildCheckIn';
import SermonManagement from './components/sermons/SermonManagement';
import SmallGroupManagement from './components/smallgroups/SmallGroupManagement';
import CampusManagement from './components/campus/CampusManagement';
import MinistryManagement from './components/ministries/MinistryManagement';
import DocumentManager from './components/documents/DocumentManager';
import UserManagement from './components/users/UserManagement';
import ProfilePage from './components/profile/ProfilePage';
import Settings from './components/settings/Settings';
import AIInsights from './components/ai/AIInsights';
import IntegrationHub from './components/integrations/IntegrationHub';
import LanguageManager from './components/localization/LanguageManager';
import CurrencyManager from './components/currency/CurrencyManager';
import OfflineManager from './components/offline/OfflineManager';
import { useOffline } from './hooks/useOffline';
import { 
  Member, 
  AttendanceRecord, 
  FinancialTransaction, 
  Event, 
  Giving,
  VolunteerAssignment,
  Communication,
  Child,
  ChildCheckIn as ChildCheckInType,
  Sermon,
  SmallGroup,
  Campus,
  Ministry,
  Family,
  Account,
  Document,
  UserProfile
} from './types';
import { 
  mockMembers, 
  mockAttendance, 
  mockTransactions, 
  mockEvents 
} from './data/mockData';

function App() {
  const { user, loading } = useAuth();
  const { 
    notifications, 
    addNotification, 
    markAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();
  const { isOnline, offlineActions, addOfflineAction, syncOfflineActions } = useOffline();
  const { t, formatCurrency, sendNotification, state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [families, setFamilies] = useState<Family[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(mockTransactions);
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Main Checking Account',
      type: 'Bank',
      accountNumber: '****1234',
      bankName: 'First National Bank',
      balance: 25000,
      currency: state.baseCurrency,
      isActive: true,
      campus: 'Main Campus',
      openingBalance: 20000,
      openingDate: '2024-01-01'
    },
    {
      id: '2',
      name: 'M-Pesa Account',
      type: 'Mobile Money',
      accountNumber: '254712345678',
      balance: 5000,
      currency: 'KES',
      isActive: true,
      campus: 'Main Campus',
      openingBalance: 0,
      openingDate: '2024-01-01'
    }
  ]);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [giving, setGiving] = useState<Giving[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerAssignment[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [childCheckIns, setChildCheckIns] = useState<ChildCheckInType[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [smallGroups, setSmallGroups] = useState<SmallGroup[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([
    {
      id: '1',
      userId: 'admin-1',
      firstName: 'Church',
      lastName: 'Admin',
      email: 'admin@church.com',
      role: 'admin',
      permissions: ['all'],
      campus: ['Main Campus'],
      isActive: true,
      preferences: {
        theme: 'light',
        language: state.currentLanguage,
        timezone: 'America/New_York',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      }
    }
  ]);
  const [ministries, setMinistries] = useState<Ministry[]>([
    {
      id: '1',
      name: 'Worship Team',
      description: 'Leading worship through music and song',
      leader: 'John Smith',
      leaderId: '1',
      members: ['1', '2'],
      campus: 'Main Campus',
      department: 'Worship & Music',
      meetingSchedule: 'Sundays 9:00 AM, Wednesdays 7:00 PM',
      budget: 5000,
      isActive: true
    },
    {
      id: '2',
      name: 'Children\'s Ministry',
      description: 'Teaching and caring for children ages 0-12',
      leader: 'Sarah Johnson',
      leaderId: '2',
      members: ['2', '4'],
      campus: 'Main Campus',
      department: 'Children\'s Ministry',
      meetingSchedule: 'Sundays 10:00 AM',
      budget: 3000,
      isActive: true
    }
  ]);
  const [campuses, setCampuses] = useState<Campus[]>([
    {
      id: '1',
      name: 'Main Campus',
      address: '123 Faith Street, Grace City, GC 12345',
      phone: '(555) 123-4567',
      email: 'main@church.com',
      pastor: 'Pastor John Smith',
      capacity: 500,
      services: [
        { name: 'Sunday Morning', time: '10:00', day: 'Sunday' },
        { name: 'Sunday Evening', time: '18:00', day: 'Sunday' },
        { name: 'Wednesday Prayer', time: '19:00', day: 'Wednesday' }
      ],
      facilities: ['Sanctuary', 'Fellowship Hall', 'Children\'s Wing', 'Youth Center', 'Parking'],
      isActive: true
    }
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onSuccess={() => {}} />;
  }

  // Member management functions
  const addMember = (newMember: Omit<Member, 'id'>) => {
    const member: Member = {
      ...newMember,
      id: Date.now().toString()
    };
    setMembers([...members, member]);
    sendNotification({
      type: 'success',
      title: t('memberAdded') || 'Member Added',
      message: t('memberAddedSuccess', `${member.firstName} ${member.lastName}`) || `${member.firstName} ${member.lastName} has been added successfully`,
      userId: user.id,
      priority: 'medium',
      category: 'members',
      read: false
    });
  };

  const updateMember = (id: string, updatedMember: Partial<Member>) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, ...updatedMember } : member
    ));
    const member = members.find(m => m.id === id);
    if (member) {
      sendNotification({
        type: 'info',
        title: t('memberUpdated') || 'Member Updated',
        message: t('memberUpdatedSuccess', `${member.firstName} ${member.lastName}`) || `${member.firstName} ${member.lastName}'s information has been updated`,
        userId: user.id,
        priority: 'low',
        category: 'members',
        read: false
      });
    }
  };

  const deleteMember = (id: string) => {
    const member = members.find(m => m.id === id);
    setMembers(members.filter(member => member.id !== id));
    setAttendance(attendance.filter(record => record.memberId !== id));
    if (member) {
      sendNotification({
        type: 'warning',
        title: t('memberDeleted') || 'Member Deleted',
        message: t('memberDeletedSuccess', `${member.firstName} ${member.lastName}`) || `${member.firstName} ${member.lastName} has been removed from the system`,
        userId: user.id,
        priority: 'medium',
        category: 'members',
        read: false
      });
    }
  };

  // Family management functions
  const addFamily = (newFamily: Omit<Family, 'id'>) => {
    const family: Family = {
      ...newFamily,
      id: Date.now().toString()
    };
    setFamilies([...families, family]);
    sendNotification({
      type: 'success',
      title: t('familyAdded') || 'Family Added',
      message: t('familyAddedSuccess', family.familyName) || `${family.familyName} family has been registered`,
      userId: user.id,
      priority: 'medium',
      category: 'families',
      read: false
    });
  };

  const updateFamily = (id: string, updatedFamily: Partial<Family>) => {
    setFamilies(families.map(family => 
      family.id === id ? { ...family, ...updatedFamily } : family
    ));
  };

  const deleteFamily = (id: string) => {
    setFamilies(families.filter(family => family.id !== id));
  };
  // Attendance management functions
  const addAttendance = (newRecord: Omit<AttendanceRecord, 'id'>) => {
    const record: AttendanceRecord = {
      ...newRecord,
      id: Date.now().toString()
    };
    setAttendance([...attendance, record]);
    sendNotification({
      type: 'info',
      title: t('attendanceRecorded') || 'Attendance Recorded',
      message: t('attendanceRecordedSuccess', record.service, new Date(record.date).toLocaleDateString()) || `Attendance for ${record.service} on ${new Date(record.date).toLocaleDateString()} has been recorded`,
      userId: user.id,
      priority: 'low',
      category: 'attendance',
      read: false
    });
  };

  // Financial management functions
  const addTransaction = (newTransaction: Omit<FinancialTransaction, 'id'>) => {
    const transaction: FinancialTransaction = {
      ...newTransaction,
      id: Date.now().toString(),
      accountId: newTransaction.accountId || accounts[0]?.id || '1'
    };
    setTransactions([...transactions, transaction]);
    sendNotification({
      type: transaction.type === 'Income' ? 'success' : 'info',
      title: t('transactionAdded') || 'Transaction Added',
      message: t('transactionAddedSuccess', transaction.type, formatCurrency(transaction.amount)) || `${transaction.type} of ${formatCurrency(transaction.amount)} recorded`,
      userId: user.id,
      priority: 'medium',
      category: 'finance',
      read: false
    });
  };

  // Account management functions
  const addAccount = (newAccount: Omit<Account, 'id'>) => {
    const account: Account = {
      ...newAccount,
      id: Date.now().toString(),
      balance: newAccount.openingBalance
    };
    setAccounts([...accounts, account]);
    sendNotification({
      type: 'success',
      title: t('accountAdded') || 'Account Added',
      message: t('accountAddedSuccess', account.name) || `${account.name} account has been created`,
      userId: user.id,
      priority: 'medium',
      category: 'accounts',
      read: false
    });
  };

  const updateAccount = (id: string, updatedAccount: Partial<Account>) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, ...updatedAccount } : account
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };
  // Event management functions
  const addEvent = (newEvent: Omit<Event, 'id'>) => {
    const event: Event = {
      ...newEvent,
      id: Date.now().toString()
    };
    setEvents([...events, event]);
    sendNotification({
      type: 'success',
      title: t('eventCreated') || 'Event Created',
      message: t('eventCreatedSuccess', event.title, new Date(event.date).toLocaleDateString()) || `${event.title} has been scheduled for ${new Date(event.date).toLocaleDateString()}`,
      userId: user.id,
      priority: 'medium',
      category: 'events',
      read: false
    });
  };

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Giving management functions
  const addGiving = (newGiving: Omit<Giving, 'id'>) => {
    const givingRecord: Giving = {
      ...newGiving,
      id: Date.now().toString()
    };
    setGiving([...giving, givingRecord]);
    sendNotification({
      type: 'success',
      title: t('givingRecorded') || 'Giving Recorded',
      message: t('givingRecordedSuccess', formatCurrency(givingRecord.amount), givingRecord.type, givingRecord.memberName) || `${formatCurrency(givingRecord.amount)} ${givingRecord.type} from ${givingRecord.memberName}`,
      userId: user.id,
      priority: 'medium',
      category: 'giving',
      read: false
    });
  };

  // Volunteer management functions
  const addVolunteerAssignment = (newAssignment: Omit<VolunteerAssignment, 'id'>) => {
    const assignment: VolunteerAssignment = {
      ...newAssignment,
      id: Date.now().toString()
    };
    setVolunteers([...volunteers, assignment]);
    addNotification({
      type: 'info',
      title: 'Volunteer Scheduled',
      message: `${assignment.memberName} assigned to ${assignment.role}`,
      read: false,
      userId: user.id,
      priority: 'low',
      category: 'volunteers'
    });
  };

  const updateVolunteerAssignment = (id: string, updatedAssignment: Partial<VolunteerAssignment>) => {
    setVolunteers(volunteers.map(v => 
      v.id === id ? { ...v, ...updatedAssignment } : v
    ));
  };

  // Communication functions
  const sendCommunication = (newCommunication: Omit<Communication, 'id'>) => {
    const communication: Communication = {
      ...newCommunication,
      id: Date.now().toString()
    };
    setCommunications([...communications, communication]);
    addNotification({
      type: 'success',
      title: 'Message Sent',
      message: `${communication.title} sent to ${communication.recipientGroups.join(', ')}`,
      read: false,
      userId: user.id,
      priority: 'medium',
      category: 'communication'
    });
  };

  // Child management functions
  const addChild = (newChild: Omit<Child, 'id'>) => {
    const child: Child = {
      ...newChild,
      id: Date.now().toString()
    };
    setChildren([...children, child]);
  };

  const checkInChild = (newCheckIn: Omit<ChildCheckInType, 'id'>) => {
    const checkIn: ChildCheckInType = {
      ...newCheckIn,
      id: Date.now().toString()
    };
    setChildCheckIns([...childCheckIns, checkIn]);
  };

  const checkOutChild = (id: string, checkOutTime: string, checkedOutBy: string) => {
    setChildCheckIns(childCheckIns.map(c => 
      c.id === id ? { ...c, checkOutTime, checkedOutBy } : c
    ));
  };

  // Sermon management functions
  const addSermon = (newSermon: Omit<Sermon, 'id'>) => {
    const sermon: Sermon = {
      ...newSermon,
      id: Date.now().toString()
    };
    setSermons([...sermons, sermon]);
  };

  const updateSermon = (id: string, updatedSermon: Partial<Sermon>) => {
    setSermons(sermons.map(s => 
      s.id === id ? { ...s, ...updatedSermon } : s
    ));
  };

  // Small group management functions
  const addSmallGroup = (newGroup: Omit<SmallGroup, 'id'>) => {
    const group: SmallGroup = {
      ...newGroup,
      id: Date.now().toString()
    };
    setSmallGroups([...smallGroups, group]);
  };

  const updateSmallGroup = (id: string, updatedGroup: Partial<SmallGroup>) => {
    setSmallGroups(smallGroups.map(g => 
      g.id === id ? { ...g, ...updatedGroup } : g
    ));
  };

  const deleteSmallGroup = (id: string) => {
    setSmallGroups(smallGroups.filter(g => g.id !== id));
  };

  // Campus management functions
  const addCampus = (newCampus: Omit<Campus, 'id'>) => {
    const campus: Campus = {
      ...newCampus,
      id: Date.now().toString()
    };
    setCampuses([...campuses, campus]);
  };

  const updateCampus = (id: string, updatedCampus: Partial<Campus>) => {
    setCampuses(campuses.map(c => 
      c.id === id ? { ...c, ...updatedCampus } : c
    ));
  };

  const deleteCampus = (id: string) => {
    setCampuses(campuses.filter(c => c.id !== id));
  };

  // Ministry management functions
  const addMinistry = (newMinistry: Omit<Ministry, 'id'>) => {
    const ministry: Ministry = {
      ...newMinistry,
      id: Date.now().toString()
    };
    setMinistries([...ministries, ministry]);
  };

  const updateMinistry = (id: string, updatedMinistry: Partial<Ministry>) => {
    setMinistries(ministries.map(m => 
      m.id === id ? { ...m, ...updatedMinistry } : m
    ));
  };

  const deleteMinistry = (id: string) => {
    setMinistries(ministries.filter(m => m.id !== id));
  };

  // Document management functions
  const addDocument = (newDocument: Omit<Document, 'id'>) => {
    const document: Document = {
      ...newDocument,
      id: Date.now().toString()
    };
    setDocuments([...documents, document]);
    addNotification({
      type: 'success',
      title: 'Document Uploaded',
      message: `${document.name} has been uploaded successfully`,
      read: false,
      userId: user.id,
      priority: 'low',
      category: 'documents'
    });
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  // User management functions
  const addUser = (newUser: Omit<UserProfile, 'id'>) => {
    const user: UserProfile = {
      ...newUser,
      id: Date.now().toString()
    };
    setUsers([...users, user]);
  };

  const updateUser = (id: string, updatedUser: Partial<UserProfile>) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, ...updatedUser } : u
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // Offline action handler
  const handleOfflineAction = (action: any) => {
    if (!isOnline) {
      addOfflineAction(action);
      return;
    }
    // Execute action immediately if online
    executeAction(action);
  };

  const executeAction = (action: any) => {
    // Execute the actual action based on type
    switch (action.type) {
      case 'create':
        if (action.entity === 'member') addMember(action.data);
        if (action.entity === 'event') addEvent(action.data);
        break;
      case 'update':
        if (action.entity === 'member') updateMember(action.id, action.data);
        break;
      case 'delete':
        if (action.entity === 'member') deleteMember(action.id);
        break;
    }
  };

  const handleSync = async (syncedActions: any[]) => {
    // Process synced actions
    syncedActions.forEach(action => executeAction(action));
    addNotification({
      type: 'success',
      title: 'Data Synchronized',
      message: `${syncedActions.length} offline actions have been synchronized`,
      read: false,
      userId: user.id,
      priority: 'medium',
      category: 'system'
    });
  };

  // Quick actions handler
  const handleQuickAction = (action: string) => {
    setActiveTab(action);
    sendNotification({
      type: 'info',
      title: t('navigationUpdate') || 'Navigation Update',
      message: t('navigatedTo', action) || `Navigated to ${action}`,
      userId: user.id,
      priority: 'low',
      category: 'navigation',
      read: false
    });
  };

  // Integration handler
  const handleIntegrationConnect = (integration: any) => {
    sendNotification({
      type: 'success',
      title: t('integrationConnected') || 'Integration Connected',
      message: t('integrationConnectedSuccess', integration.provider) || `${integration.provider} has been connected successfully`,
      userId: user.id,
      priority: 'medium',
      category: 'integrations',
      read: false
    });
  };
  };
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            members={members}
            attendance={attendance}
            transactions={transactions}
            events={events}
            onQuickAction={handleQuickAction}
            onViewMember={setSelectedMember}
          />
        );
      case 'members':
        return (
          <Members 
            members={members}
            ministries={ministries}
            onAddMember={addMember}
            onUpdateMember={updateMember}
            onDeleteMember={deleteMember}
            onViewMember={setSelectedMember}
          />
        );
      case 'families':
        return (
          <FamilyManagement 
            families={families}
            members={members}
            onAddFamily={addFamily}
            onUpdateFamily={updateFamily}
            onDeleteFamily={deleteFamily}
          />
        );
      case 'attendance':
        return (
          <Attendance 
            members={members}
            attendance={attendance}
            onAddAttendance={addAttendance}
          />
        );
      case 'finance':
        return (
          <Finance 
            transactions={transactions}
            accounts={accounts}
            onAddTransaction={addTransaction}
          />
        );
      case 'accounts':
        return (
          <AccountManagement 
            accounts={accounts}
            onAddAccount={addAccount}
            onUpdateAccount={updateAccount}
            onDeleteAccount={deleteAccount}
          />
        );
      case 'events':
        return (
          <Events 
            events={events}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
          />
        );
      case 'reports':
        return (
          <DetailedReports 
            members={members}
            attendance={attendance}
            transactions={transactions}
            events={events}
            giving={giving}
            accounts={accounts}
          />
        );
      case 'giving':
        return (
          <GivingManagement 
            giving={giving}
            members={members}
            onAddGiving={addGiving}
          />
        );
      case 'volunteers':
        return (
          <VolunteerScheduling 
            volunteers={volunteers}
            members={members}
            events={events}
            onAddAssignment={addVolunteerAssignment}
            onUpdateAssignment={updateVolunteerAssignment}
          />
        );
      case 'communication':
        return (
          <CommunicationCenter 
            communications={communications}
            members={members}
            onSendCommunication={sendCommunication}
          />
        );
      case 'children':
        return (
          <ChildCheckIn 
            children={children}
            checkIns={childCheckIns}
            members={members}
            onCheckIn={checkInChild}
            onCheckOut={checkOutChild}
            onAddChild={addChild}
          />
        );
      case 'sermons':
        return (
          <SermonManagement 
            sermons={sermons}
            onAddSermon={addSermon}
            onUpdateSermon={updateSermon}
          />
        );
      case 'smallgroups':
        return (
          <SmallGroupManagement 
            smallGroups={smallGroups}
            members={members}
            onAddGroup={addSmallGroup}
            onUpdateGroup={updateSmallGroup}
            onDeleteGroup={deleteSmallGroup}
          />
        );
      case 'ministries':
        return (
          <MinistryManagement 
            ministries={ministries}
            members={members}
            onAddMinistry={addMinistry}
            onUpdateMinistry={updateMinistry}
            onDeleteMinistry={deleteMinistry}
          />
        );
      case 'campuses':
        return (
          <CampusManagement 
            campuses={campuses}
            onAddCampus={addCampus}
            onUpdateCampus={updateCampus}
            onDeleteCampus={deleteCampus}
          />
        );
      case 'documents':
        return (
          <DocumentManager 
            documents={documents}
            onAddDocument={addDocument}
            onDeleteDocument={deleteDocument}
          />
        );
      case 'users':
        return (
          <UserManagement 
            users={users}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
          />
        );
      case 'profile':
        return (
          <ProfilePage 
            currentUser={users[0]}
            onUpdateProfile={(profile) => updateUser(users[0].id, profile)}
          />
        );
      case 'settings':
        return (
          <Settings 
            currentUser={user}
            onUpdateSettings={(settings) => console.log('Settings updated:', settings)}
          />
        );
      case 'ai-insights':
        return (
          <AIInsights 
            members={members}
            transactions={transactions}
            attendance={attendance}
            giving={giving}
          />
        );
      case 'integrations':
        return (
          <IntegrationHub 
            onConnect={handleIntegrationConnect}
          />
        );
      case 'languages':
        return (
          <LanguageManager />
        );
      case 'currencies':
        return (
          <CurrencyManager />
        );
      default:
        return <Dashboard members={members} attendance={attendance} transactions={transactions} events={events} onQuickAction={handleQuickAction} onViewMember={setSelectedMember} />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-0'}`}>
          {/* Top Navigation Bar */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900 capitalize">
                  {t(activeTab) || activeTab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h1>
                {!isOnline && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full">
                    {t('offlineMode') || 'Offline Mode'}
                  </span>
                )}
                <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full">
                  {state.baseCurrency}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                  {state.languages.find(l => l.code === state.currentLanguage)?.nativeName || state.currentLanguage.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString(languageService.getLanguageLocale(state.currentLanguage), { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <NotificationCenter
                  notifications={state.notifications}
                  onMarkAsRead={(id) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id })}
                  onRemove={(id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })}
                  onClearAll={() => dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' })}
                />
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8">
          {renderActiveComponent()}
          </div>
        </main>
        
        {/* Member Detail Modal */}
        {selectedMember && (
          <MemberDetail
            member={selectedMember}
            family={families.find(f => f.members.includes(selectedMember.id))}
            familyMembers={members.filter(m => 
              families.find(f => f.members.includes(selectedMember.id))?.members.includes(m.id)
            )}
            attendance={attendance}
            giving={giving}
            onUpdateMember={updateMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </div>
      
      {/* Offline Manager */}
      <OfflineManager 
        isOnline={isOnline}
        onSync={handleSync}
      />
    </Router>
  );
}

export default App;