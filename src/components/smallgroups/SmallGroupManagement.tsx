import React, { useState } from 'react';
import { Users, MapPin, Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { SmallGroup, Member } from '../../types';

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
    startDate: new Date().toISOString().split('T')[0]
  });

  const categories = ['Bible Study', 'Life Group', 'Youth', 'Men\'s Group', 'Women\'s Group', 'Couples', 'Singles', 'Recovery', 'Prayer'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLeader = members.find(m => m.id === newGroup.leaderId);
    if (selectedLeader) {
      const groupData = {
        ...newGroup,
        leader: `${selectedLeader.firstName} ${selectedLeader.lastName}`
      };
      
      if (editingGroup) {
        onUpdateGroup(editingGroup.id, groupData);
        setEditingGroup(null);
      } else {
        onAddGroup(groupData);
      }
      
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
        startDate: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
    }
  };

  const startEdit = (group: SmallGroup) => {
    setNewGroup(group);
    setEditingGroup(group);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingGroup(null);
    setShowAddForm(false);
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
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const activeGroups = smallGroups.filter(g => g.isActive);
  const totalMembers = smallGroups.reduce((sum, g) => sum + g.members.length, 0);
  const averageSize = activeGroups.length > 0 ? Math.round(totalMembers / activeGroups.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Small Group Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Group</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-indigo-100">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{activeGroups.length}</p>
            <p className="text-sm text-gray-500">Active Groups</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            <p className="text-sm text-gray-500">Total Participants</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{averageSize}</p>
            <p className="text-sm text-gray-500">Average Group Size</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            <p className="text-sm text-gray-500">Categories</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingGroup ? 'Edit Small Group' : 'Create New Small Group'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Group Name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              
              <select
                value={newGroup.category}
                onChange={(e) => setNewGroup({...newGroup, category: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={newGroup.leaderId}
                onChange={(e) => setNewGroup({...newGroup, leaderId: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                required
              />

              <select
                value={newGroup.meetingDay}
                onChange={(e) => setNewGroup({...newGroup, meetingDay: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>

              <input
                type="time"
                value={newGroup.meetingTime}
                onChange={(e) => setNewGroup({...newGroup, meetingTime: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />

              <input
                type="text"
                placeholder="Meeting Location"
                value={newGroup.location}
                onChange={(e) => setNewGroup({...newGroup, location: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />

              <input
                type="date"
                value={newGroup.startDate}
                onChange={(e) => setNewGroup({...newGroup, startDate: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <textarea
              placeholder="Group Description"
              value={newGroup.description}
              onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
              required
            />

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editingGroup ? 'Update Group' : 'Create Group'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Groups by Category */}
      <div className="space-y-6">
        {categories.map(category => {
          const categoryGroups = activeGroups.filter(g => g.category === category);
          if (categoryGroups.length === 0) return null;

          return (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{category} Groups</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryGroups.map((group) => (
                  <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{group.name}</h4>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEdit(group)}
                          className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteGroup(group.id)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Leader: {group.leader}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{group.meetingDay}s</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{group.meetingTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{group.location}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {group.members.length}/{group.capacity} members
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${(group.members.length / group.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {group.ageGroup && (
                      <div className="mt-2">
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                          {group.ageGroup}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Group Members Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Membership Overview</h3>
        <div className="space-y-4">
          {activeGroups.map((group) => (
            <div key={group.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{group.name}</h4>
                <span className="text-sm text-gray-500">
                  {group.members.length}/{group.capacity} members
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.members.map((memberId) => {
                  const member = members.find(m => m.id === memberId);
                  return member ? (
                    <span key={memberId} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">
                      {member.firstName} {member.lastName}
                    </span>
                  ) : null;
                })}
                {group.members.length < group.capacity && (
                  <button className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                    + Add Member
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmallGroupManagement;