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
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Family Management</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'attendance':
        return <Attendance />;
      case 'giving':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Giving Management</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'finance':
        return <Finance />;
      case 'accounts':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Account Management</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'events':
        return <Events />;
      case 'volunteers':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Volunteer Scheduling</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'ministries':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Ministry Management</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'communication':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Communication Center</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'children':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Children Check-In</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'sermons':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Sermon Management</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'smallgroups':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Small Group Management</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'campuses':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Campus Management</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'documents':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Document Manager</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'reports':
        return <Reports />;
      case 'users':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">User Management</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'ai-insights':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">AI Insights</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'integrations':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Integration Hub</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'languages':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Language Manager</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
      case 'currencies':
        return <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold text-gray-900">Currency Manager</h2><p className="text-gray-600 mt-2">Coming soon</p></div>;
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
