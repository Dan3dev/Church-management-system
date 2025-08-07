import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Calendar, DollarSign, MapPin } from 'lucide-react';
import { Ministry, Member } from '../../types';

interface MinistryManagementProps {
  ministries: Ministry[];
  members: Member[];
  onAddMinistry: (ministry: Omit<Ministry, 'id'>) => void;
  onUpdateMinistry: (id: string, ministry: Partial<Ministry>) => void;
  onDeleteMinistry: (id: string) => void;
}

const MinistryManagement: React.FC<MinistryManagementProps> = ({
  ministries,
  members,
  onAddMinistry,
  onUpdateMinistry,
  onDeleteMinistry
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);

  const [newMinistry, setNewMinistry] = useState<Omit<Ministry, 'id'>>({
    name: '',
    description: '',
    leader: '',
    leaderId: '',
    members: [],
    campus: 'Main Campus',
    department: '',
    meetingSchedule: '',
    isActive: true
  });

  const departments = [
    'Worship & Music',
    'Children\'s Ministry',
    'Youth Ministry',
    'Adult Ministry',
    'Outreach & Missions',
    'Administration',
    'Facilities',
    'Media & Technology'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLeader = members.find(m => m.id === newMinistry.leaderId);
    if (selectedLeader) {
      const ministryData = {
        ...newMinistry,
        leader: `${selectedLeader.firstName} ${selectedLeader.lastName}`
      };
      
      if (editingMinistry) {
        onUpdateMinistry(editingMinistry.id, ministryData);
        setEditingMinistry(null);
      } else {
        onAddMinistry(ministryData);
      }
      
      resetForm();
    }
  };

  const resetForm = () => {
    setNewMinistry({
      name: '',
      description: '',
      leader: '',
      leaderId: '',
      members: [],
      campus: 'Main Campus',
      department: '',
      meetingSchedule: '',
      isActive: true
    });
    setShowAddForm(false);
  };

  const startEdit = (ministry: Ministry) => {
    setNewMinistry(ministry);
    setEditingMinistry(ministry);
    setShowAddForm(true);
  };

  const activeMinistries = ministries.filter(m => m.isActive);
  const totalMembers = ministries.reduce((sum, m) => sum + m.members.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ministry Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Ministry</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{activeMinistries.length}</p>
            <p className="text-sm text-gray-500">Active Ministries</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            <p className="text-sm text-gray-500">Total Volunteers</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            <p className="text-sm text-gray-500">Departments</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              ${ministries.reduce((sum, m) => sum + (m.budget || 0), 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Total Budget</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingMinistry ? 'Edit Ministry' : 'Add New Ministry'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Ministry Name"
                value={newMinistry.name}
                onChange={(e) => setNewMinistry({...newMinistry, name: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              
              <select
                value={newMinistry.department}
                onChange={(e) => setNewMinistry({...newMinistry, department: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={newMinistry.leaderId}
                onChange={(e) => setNewMinistry({...newMinistry, leaderId: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                type="text"
                placeholder="Meeting Schedule"
                value={newMinistry.meetingSchedule}
                onChange={(e) => setNewMinistry({...newMinistry, meetingSchedule: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />

              <input
                type="number"
                placeholder="Budget (optional)"
                value={newMinistry.budget || ''}
                onChange={(e) => setNewMinistry({...newMinistry, budget: parseFloat(e.target.value)})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
              />
            </div>

            <textarea
              placeholder="Ministry Description"
              value={newMinistry.description}
              onChange={(e) => setNewMinistry({...newMinistry, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              required
            />

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingMinistry ? 'Update Ministry' : 'Add Ministry'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ministries by Department */}
      <div className="space-y-6">
        {departments.map(department => {
          const deptMinistries = activeMinistries.filter(m => m.department === department);
          if (deptMinistries.length === 0) return null;

          return (
            <div key={department} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{department}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deptMinistries.map((ministry) => (
                  <div key={ministry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{ministry.name}</h4>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEdit(ministry)}
                          className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteMinistry(ministry.id)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ministry.description}</p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Leader: {ministry.leader}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{ministry.meetingSchedule}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{ministry.campus}</span>
                      </div>
                      {ministry.budget && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Budget: ${ministry.budget.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {ministry.members.length} volunteers
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ministry.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {ministry.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MinistryManagement;