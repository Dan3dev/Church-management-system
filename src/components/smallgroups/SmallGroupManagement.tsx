import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  UserPlus,
  UserMinus,
  MessageCircle,
  Heart,
  Activity,
  Award,
  Phone,
  Mail,
  Home,
  BookOpen,
  Target
} from 'lucide-react';
import { SmallGroup, Member, GroupAttendance, PrayerRequest } from '../../types';
import { useApp } from '../../context/AppContext';

interface SmallGroupManagementProps {
  smallGroups: SmallGroup[];
  members: Member[];
  onAddGroup: (group: Omit<SmallGroup, 'id'>) => void;
  onUpdateGroup: (id: string, group: Partial<SmallGroup>) => void;
  onDeleteGroup: (id: string) => void;
}

const SmallGroupManagement: React.FC<SmallGroupManagementProps> = ({
  smallGroups,
  members,
  onAddGroup,
  onUpdateGroup,
  onDeleteGroup
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SmallGroup | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<SmallGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { t, state } = useApp();

  const [newGroup, setNewGroup] = useState<Omit<SmallGroup, 'id'>>({
    name: '',
    description: '',
    leader: '',
    leaderId: '',
    members: [],
    campus: 'Main Campus',
    meetingDay: 'Sunday',
    meetingTime: '',
    location: '',
    capacity: 12,
    category: 'Bible Study',
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    meetingFrequency: 'weekly',
    childcareProvided: false,
    openGroup: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const categories = [
    'Bible Study', 
    'Life Group', 
    'Youth', 
    'Men\'s Group', 
    'Women\'s Group', 
    'Couples', 
    'Singles', 
    'Recovery', 
    'Prayer',
    'Discipleship',
    'Evangelism',
    'Support Group'
  ];
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const frequencies = ['weekly', 'biweekly', 'monthly'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLeader = members.find(m => m.id === newGroup.leaderId);
    if (selectedLeader) {
      const groupData = {
        ...newGroup,
        leader: `${selectedLeader.firstName} ${selectedLeader.lastName}`,
        createdAt: editingGroup ? editingGroup.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (editingGroup) {
        onUpdateGroup(editingGroup.id, groupData);
        setEditingGroup(null);
        
        state.dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now().toString(),
            userId: 'admin',
            type: 'success',
            title: 'Group Updated',
            message: `${newGroup.name} has been updated`,
            read: false,
            createdAt: new Date().toISOString(),
            priority: 'medium',
            category: 'smallgroups'
          }
        });
      } else {
        onAddGroup(groupData);
        
        state.dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now().toString(),
            userId: 'admin',
            type: 'success',
            title: 'Group Created',
            message: `${newGroup.name} small group has been created`,
            read: false,
            createdAt: new Date().toISOString(),
            priority: 'medium',
            category: 'smallgroups'
          }
        });
      }
      
      resetForm();
    }
  };

  const resetForm = () => {
    setNewGroup({
      name: '',
      description: '',
      leader: '',
      leaderId: '',
      members: [],
      campus: 'Main Campus',
      meetingDay: 'Sunday',
      meetingTime: '',
      location: '',
      capacity: 12,
      category: 'Bible Study',
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      meetingFrequency: 'weekly',
      childcareProvided: false,
      openGroup: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setShowAddForm(false);
  };

  const startEdit = (group: SmallGroup) => {
    setNewGroup(group);
    setEditingGroup(group);
    setShowAddForm(true);
  };

  const addMemberToGroup = (groupId: string, memberId: string) => {
    const group = smallGroups.find(g => g.id === groupId);
    const member = members.find(m => m.id === memberId);
    
    if (group && member && !group.members.includes(memberId)) {
      onUpdateGroup(groupId, {
        members: [...group.members, memberId],
        updatedAt: new Date().toISOString()
      });
      
      state.dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          userId: memberId,
          type: 'info',
          title: 'Added to Small Group',
          message: `You've been added to ${group.name}`,
          read: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
          category: 'smallgroups'
        }
      });
    }
  };

  const removeMemberFromGroup = (groupId: string, memberId: string) => {
    const group = smallGroups.find(g => g.id === groupId);
    const member = members.find(m => m.id === memberId);
    
    if (group && member) {
      onUpdateGroup(groupId, {
        members: group.members.filter(id => id !== memberId),
        updatedAt: new Date().toISOString()
      });
      
      state.dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          userId: memberId,
          type: 'info',
          title: 'Removed from Small Group',
          message: `You've been removed from ${group.name}`,
          read: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
          category: 'smallgroups'
        }
      });
    }
  };

  const filteredGroups = smallGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.leader.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || group.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const activeGroups = smallGroups.filter(g => g.isActive);
  const totalMembers = smallGroups.reduce((sum, g) => sum + g.members.length, 0);
  const averageSize = activeGroups.length > 0 ? Math.round(totalMembers / activeGroups.length) : 0;
  const totalCapacity = smallGroups.reduce((sum, g) => sum + g.capacity, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalMembers / totalCapacity) * 100) : 0;

  const groupStats = {
    total: activeGroups.length,
    totalMembers,
    averageSize,
    occupancyRate,
    openGroups: smallGroups.filter(g => g.openGroup && g.isActive).length,
    withChildcare: smallGroups.filter(g => g.childcareProvided && g.isActive).length
  };

  const getGroupHealth = (group: SmallGroup) => {
    const occupancy = (group.members.length / group.capacity) * 100;
    if (occupancy >= 90) return { status: 'full', color: 'red' };
    if (occupancy >= 75) return { status: 'filling', color: 'yellow' };
    if (occupancy >= 25) return { status: 'healthy', color: 'green' };
    return { status: 'low', color: 'blue' };
  };

  const renderGroupCard = (group: SmallGroup) => {
    const health = getGroupHealth(group);
    const leader = members.find(m => m.id === group.leaderId);
    const groupMembers = group.members.map(id => members.find(m => m.id === id)).filter(Boolean);
    
    return (
      <div key={group.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                {group.name}
              </h4>
              {group.openGroup && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Open</span>
              )}
              {group.childcareProvided && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Childcare</span>
              )}
            </div>
            <p className="text-sm text-indigo-600 font-medium mb-2">{group.category}</p>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{group.description}</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startEdit(group);
              }}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete ${group.name}?`)) {
                  onDeleteGroup(group.id);
                }
              }}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Group Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>Leader: {group.leader}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{group.meetingDay}s at {group.meetingTime}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{group.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="capitalize">{group.meetingFrequency}</span>
          </div>
        </div>

        {/* Member Avatars */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-gray-600">Members:</span>
          <div className="flex -space-x-2">
            {groupMembers.slice(0, 5).map((member, index) => (
              <div key={index} className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-indigo-600 font-medium text-xs">
                  {member?.firstName[0]}{member?.lastName[0]}
                </span>
              </div>
            ))}
            {group.members.length > 5 && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-gray-600 font-medium text-xs">+{group.members.length - 5}</span>
              </div>
            )}
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Capacity</span>
            <span className="font-medium">{group.members.length}/{group.capacity}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 bg-${health.color}-500`}
              style={{ width: `${(group.members.length / group.capacity) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 capitalize">{health.status}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGroup(group);
            }}
            className="flex-1 bg-indigo-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View Details
          </button>
          {group.openGroup && group.members.length < group.capacity && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Show member selection modal
                console.log('Add member to group:', group.id);
              }}
              className="bg-green-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Group Status Indicators */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex space-x-2">
            {group.ageGroup && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{group.ageGroup}</span>
            )}
            {group.cost && group.cost > 0 && (
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">${group.cost}</span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full ${
            group.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {group.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('smallgroups')} Management</h2>
          <p className="text-gray-600">Manage small groups and community connections</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Active Groups</p>
              <p className="text-3xl font-bold">{groupStats.total}</p>
            </div>
            <Users className="h-8 w-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Members</p>
              <p className="text-3xl font-bold">{groupStats.totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Avg Size</p>
              <p className="text-3xl font-bold">{groupStats.averageSize}</p>
            </div>
            <Target className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Occupancy</p>
              <p className="text-3xl font-bold">{groupStats.occupancyRate}%</p>
            </div>
            <Activity className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Open Groups</p>
              <p className="text-3xl font-bold">{groupStats.openGroups}</p>
            </div>
            <UserPlus className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100">With Childcare</p>
              <p className="text-3xl font-bold">{groupStats.withChildcare}</p>
            </div>
            <Heart className="h-8 w-8 text-pink-200" />
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingGroup ? 'Edit Small Group' : 'Create New Small Group'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Group Name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                
                <select
                  value={newGroup.category}
                  onChange={(e) => setNewGroup({...newGroup, category: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={newGroup.leaderId}
                  onChange={(e) => setNewGroup({...newGroup, leaderId: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Leader</option>
                  {members.filter(m => m.membershipStatus === 'Active').map(member => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Capacity"
                  value={newGroup.capacity}
                  onChange={(e) => setNewGroup({...newGroup, capacity: parseInt(e.target.value)})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="1"
                  max="50"
                  required
                />

                <input
                  type="text"
                  placeholder="Age Group (optional)"
                  value={newGroup.ageGroup || ''}
                  onChange={(e) => setNewGroup({...newGroup, ageGroup: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />

                <input
                  type="number"
                  step="0.01"
                  placeholder="Cost (optional)"
                  value={newGroup.cost || ''}
                  onChange={(e) => setNewGroup({...newGroup, cost: parseFloat(e.target.value)})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            {/* Meeting Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Meeting Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newGroup.meetingDay}
                  onChange={(e) => setNewGroup({...newGroup, meetingDay: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>

                <input
                  type="time"
                  value={newGroup.meetingTime}
                  onChange={(e) => setNewGroup({...newGroup, meetingTime: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />

                <select
                  value={newGroup.meetingFrequency}
                  onChange={(e) => setNewGroup({...newGroup, meetingFrequency: e.target.value as SmallGroup['meetingFrequency']})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Meeting Location"
                  value={newGroup.location}
                  onChange={(e) => setNewGroup({...newGroup, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Description</h4>
              <textarea
                placeholder="Group Description"
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            {/* Settings */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Group Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={newGroup.openGroup}
                      onChange={(e) => setNewGroup({...newGroup, openGroup: e.target.checked})}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Open Group</span>
                      <p className="text-xs text-gray-500">Allow new members to join</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={newGroup.childcareProvided}
                      onChange={(e) => setNewGroup({...newGroup, childcareProvided: e.target.checked})}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Childcare Provided</span>
                      <p className="text-xs text-gray-500">Childcare available during meetings</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newGroup.startDate}
                      onChange={(e) => setNewGroup({...newGroup, startDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                    <input
                      type="date"
                      value={newGroup.endDate || ''}
                      onChange={(e) => setNewGroup({...newGroup, endDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editingGroup ? 'Update Group' : 'Create Group'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="text-sm text-gray-500 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            {filteredGroups.length} groups • {filteredGroups.reduce((sum, g) => sum + g.members.length, 0)} members
          </div>
        </div>
      </div>

      {/* Groups Display */}
      {viewMode === 'grid' ? (
        <div className="space-y-8">
          {categories.map(category => {
            const categoryGroups = filteredGroups.filter(g => g.category === category && g.isActive);
            if (categoryGroups.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{category} Groups</h3>
                  <span className="text-sm text-gray-500">{categoryGroups.length} groups</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryGroups.map(group => renderGroupCard(group))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Small Groups</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredGroups.map((group) => {
              const health = getGroupHealth(group);
              const leader = members.find(m => m.id === group.leaderId);
              
              return (
                <div key={group.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                     onClick={() => setSelectedGroup(group)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{group.name}</h4>
                          {group.openGroup && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Open</span>
                          )}
                        </div>
                        <p className="text-sm text-indigo-600 font-medium">{group.category}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Leader: {group.leader}</span>
                          <span>{group.meetingDay}s at {group.meetingTime}</span>
                          <span>{group.location}</span>
                          <span>{group.members.length}/{group.capacity} members</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mb-1">
                          <div 
                            className={`h-2 rounded-full bg-${health.color}-500`}
                            style={{ width: `${(group.members.length / group.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 capitalize">{health.status}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(group);
                          }}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete ${group.name}?`)) {
                              onDeleteGroup(group.id);
                            }
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Group Detail Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedGroup.name}</h3>
                <p className="text-gray-600">{selectedGroup.category} • {selectedGroup.leader}</p>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Group Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Group Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{selectedGroup.meetingDay}s at {selectedGroup.meetingTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedGroup.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="capitalize">{selectedGroup.meetingFrequency}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{selectedGroup.members.length}/{selectedGroup.capacity} members</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Leader Contact</h4>
                  {(() => {
                    const leader = members.find(m => m.id === selectedGroup.leaderId);
                    return leader ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{leader.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{leader.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Home className="h-4 w-4 text-gray-500" />
                          <span>{leader.address}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Leader information not available</p>
                    );
                  })()}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">About This Group</h4>
                <p className="text-gray-700 leading-relaxed">{selectedGroup.description}</p>
              </div>

              {/* Group Members */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Group Members ({selectedGroup.members.length})</h4>
                  {selectedGroup.openGroup && selectedGroup.members.length < selectedGroup.capacity && (
                    <button className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      <UserPlus className="h-4 w-4" />
                      <span>Add Member</span>
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedGroup.members.map((memberId) => {
                    const member = members.find(m => m.id === memberId);
                    return member ? (
                      <div key={memberId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium text-sm">
                              {member.firstName[0]}{member.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeMemberFromGroup(selectedGroup.id, memberId)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedGroup(null);
                    startEdit(selectedGroup);
                  }}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Group</span>
                </button>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>Message Group</span>
                </button>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No small groups found</h3>
          <p className="text-gray-500 mb-6">Create your first small group to build community connections</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Your First Group
          </button>
        </div>
      )}
    </div>
  );
};

export default SmallGroupManagement;