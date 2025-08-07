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
  LogOut,
  FileText,
  CreditCard,
  UserCircle,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { signOut } from '../../config/supabase';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isCollapsed, onToggleCollapse }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, category: 'main' },
    { id: 'members', label: 'Members', icon: Users, category: 'people' },
    { id: 'families', label: 'Families', icon: Users, category: 'people' },
    { id: 'attendance', label: 'Attendance', icon: UserCheck, category: 'people' },
    { id: 'giving', label: 'Giving', icon: Heart, category: 'finance' },
    { id: 'finance', label: 'Finance', icon: DollarSign, category: 'finance' },
    { id: 'accounts', label: 'Accounts', icon: CreditCard, category: 'finance' },
    { id: 'events', label: 'Events', icon: Calendar, category: 'ministry' },
    { id: 'volunteers', label: 'Volunteers', icon: UserPlus, category: 'ministry' },
    { id: 'ministries', label: 'Ministries', icon: Briefcase, category: 'ministry' },
    { id: 'communication', label: 'Communication', icon: MessageSquare, category: 'ministry' },
    { id: 'children', label: 'Children', icon: Baby, category: 'ministry' },
    { id: 'sermons', label: 'Sermons', icon: Play, category: 'ministry' },
    { id: 'smallgroups', label: 'Small Groups', icon: Users, category: 'ministry' },
    { id: 'campuses', label: 'Campuses', icon: Building, category: 'admin' },
    { id: 'documents', label: 'Documents', icon: FileText, category: 'admin' },
    { id: 'reports', label: 'Reports', icon: BarChart3, category: 'admin' },
    { id: 'users', label: 'User Management', icon: Shield, category: 'admin' },
    { id: 'profile', label: 'Profile', icon: UserCircle, category: 'user' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'user' },
  ];

  const categories = [
    { id: 'main', label: 'Main', items: navItems.filter(item => item.category === 'main') },
    { id: 'people', label: 'People', items: navItems.filter(item => item.category === 'people') },
    { id: 'finance', label: 'Finance', items: navItems.filter(item => item.category === 'finance') },
    { id: 'ministry', label: 'Ministry', items: navItems.filter(item => item.category === 'ministry') },
    { id: 'admin', label: 'Administration', items: navItems.filter(item => item.category === 'admin') },
    { id: 'user', label: 'User', items: navItems.filter(item => item.category === 'user') },
  ];

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('demoUser');
    window.location.reload();
  };

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Church className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">ChurchHub</h1>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {categories.map((category) => (
          <div key={category.id} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {category.label}
              </h3>
            )}
            <div className="space-y-1">
              {category.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;