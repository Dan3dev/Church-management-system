import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/landing/LandingPage';
import LoginForm from './components/auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import NotificationCenter from './components/Layout/NotificationCenter';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Attendance from './components/Attendance';
import Finance from './components/Finance';
import Events from './components/Events';
import Reports from './components/Reports';
import Settings from './components/settings/Settings';
import ProfilePage from './components/profile/ProfilePage';
import FamilyManagement from './components/families/FamilyManagement';
import GivingManagement from './components/giving/GivingManagement';
import AccountManagement from './components/accounts/AccountManagement';
import VolunteerScheduling from './components/volunteers/VolunteerScheduling';
import MinistryManagement from './components/ministries/MinistryManagement';
import CommunicationCenter from './components/communication/CommunicationCenter';
import ChildCheckIn from './components/children/ChildCheckIn';
import SermonManagement from './components/sermons/SermonManagement';
import SmallGroupManagement from './components/smallgroups/SmallGroupManagement';
import CampusManagement from './components/campus/CampusManagement';
import DocumentManager from './components/documents/DocumentManager';
import UserManagement from './components/users/UserManagement';
import AIInsights from './components/ai/AIInsights';
import IntegrationHub from './components/integrations/IntegrationHub';
import LanguageManager from './components/localization/LanguageManager';
import CurrencyManager from './components/currency/CurrencyManager';
import { mockMembers, mockAttendance, mockTransactions, mockEvents } from './data/mockData';
import { Member } from './types';

function NotificationCenterWrapper() {
  const { state, dispatch } = useApp();

  const handleMarkAsRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  return (
    <NotificationCenter
      notifications={state.notifications}
      onMarkAsRead={handleMarkAsRead}
      onRemove={handleRemove}
      onClearAll={handleClearAll}
    />
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm onSuccess={() => window.location.href = '/dashboard'} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  const handleQuickAction = (action: string) => {
    setCurrentView(action);
    setSelectedMember(null);
  };

  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setCurrentView('member-detail');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            members={mockMembers}
            attendance={mockAttendance}
            transactions={mockTransactions}
            events={mockEvents}
            onQuickAction={handleQuickAction}
            onViewMember={handleViewMember}
          />
        );
      case 'members':
        return <Members onViewMember={handleViewMember} />;
      case 'families':
        return <FamilyManagement />;
      case 'attendance':
        return <Attendance />;
      case 'giving':
        return <GivingManagement />;
      case 'finance':
        return <Finance />;
      case 'accounts':
        return <AccountManagement />;
      case 'events':
        return <Events />;
      case 'volunteers':
        return <VolunteerScheduling />;
      case 'ministries':
        return <MinistryManagement />;
      case 'communication':
        return <CommunicationCenter />;
      case 'children':
        return <ChildCheckIn />;
      case 'sermons':
        return <SermonManagement />;
      case 'smallgroups':
        return <SmallGroupManagement />;
      case 'campuses':
        return <CampusManagement />;
      case 'documents':
        return <DocumentManager />;
      case 'reports':
        return <Reports />;
      case 'users':
        return <UserManagement />;
      case 'ai-insights':
        return <AIInsights />;
      case 'integrations':
        return <IntegrationHub />;
      case 'languages':
        return <LanguageManager />;
      case 'currencies':
        return <CurrencyManager />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <ProfilePage />;
      default:
        return (
          <Dashboard
            members={mockMembers}
            attendance={mockAttendance}
            transactions={mockTransactions}
            events={mockEvents}
            onQuickAction={handleQuickAction}
            onViewMember={handleViewMember}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={currentView}
        onTabChange={setCurrentView}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NotificationCenterWrapper />
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
