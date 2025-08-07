import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Home,
  UserCheck,
  Settings,
  Church,
  Heart,
  UserPlus,
  MessageSquare,
  Baby,
  Play,
  Building,
  Briefcase,
  LogOut
} from 'lucide-react';
import { signOut } from '../config/supabase';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'giving', label: 'Giving', icon: Heart },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'volunteers', label: 'Volunteers', icon: UserPlus },
    { id: 'ministries', label: 'Ministries', icon: Briefcase },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'children', label: 'Children', icon: Baby },
    { id: 'sermons', label: 'Sermons', icon: Play },
    { id: 'smallgroups', label: 'Small Groups', icon: Users },
    { id: 'campuses', label: 'Campuses', icon: Building },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Church className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">ChurchHub</h1>
          </div>
          
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button 
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;