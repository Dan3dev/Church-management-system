import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AppProvider } from './context/AppContext';
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

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

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
      case 'attendance':
        return <Attendance />;
      case 'finance':
        return <Finance />;
      case 'events':
        return <Events />;
      case 'reports':
        return <Reports />;
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
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NotificationCenter />
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
