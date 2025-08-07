import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone, MapPin, Calendar, Eye } from 'lucide-react';
import { Member, Ministry } from '../types';

interface MembersProps {
  members: Member[];
  ministries: Ministry[];
  onAddMember: (member: Omit<Member, 'id'>) => void;
  onUpdateMember: (id: string, member: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
  onViewMember?: (member: Member) => void;
}

const Members: React.FC<MembersProps> = ({ members, ministries, onAddMember, onUpdateMember, onDeleteMember, onViewMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [newMember, setNewMember] = useState<Omit<Member, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    membershipStatus: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    ministry: [],
    campus: 'Main Campus',
    role: 'member',
    emergencyContacts: [{
      name: '',
      phone: '',
      relationship: '',
      isPrimary: true
    }],
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      communicationLanguage: 'English',
      preferredContactMethod: 'email',
      receiveNewsletter: true,
      allowPhotography: true
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || member.membershipStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      onUpdateMember(editingMember.id, newMember);
      setEditingMember(null);
    } else {
      onAddMember(newMember);
    }
    setNewMember({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      membershipStatus: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      ministry: [],
      emergencyContact: { name: '', phone: '', relationship: '' }
    });
    setShowAddForm(false);
  };

  const startEdit = (member: Member) => {
    setNewMember(member);
    setEditingMember(member);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingMember(null);
    setShowAddForm(false);
    setNewMember({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      membershipStatus: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      ministry: [],
      emergencyContact: { name: '', phone: '', relationship: '' }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Member Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Ministry Assignment</h4>
              <div className="space-y-2">
                {ministries.map(ministry => (
                  <label key={ministry.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newMember.ministry.includes(ministry.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewMember({
                            ...newMember,
                            ministry: [...newMember.ministry, ministry.name]
                          });
                        } else {
                          setNewMember({
                            ...newMember,
                            ministry: newMember.ministry.filter(m => m !== ministry.name)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{ministry.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Visitor">Visitor</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {filteredMembers.length} of {members.length} members
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingMember ? 'Edit Member' : 'Add New Member'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={newMember.firstName}
                onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newMember.lastName}
                onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={newMember.address}
                onChange={(e) => setNewMember({...newMember, address: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                required
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={newMember.dateOfBirth}
                onChange={(e) => setNewMember({...newMember, dateOfBirth: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <select
                value={newMember.membershipStatus}
                onChange={(e) => setNewMember({...newMember, membershipStatus: e.target.value as Member['membershipStatus']})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Visitor">Visitor</option>
              </select>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Emergency Contact Name"
                  value={newMember.emergencyContact.name}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    emergencyContact: {...newMember.emergencyContact, name: e.target.value}
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Emergency Contact Phone"
                  value={newMember.emergencyContact.phone}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    emergencyContact: {...newMember.emergencyContact, phone: e.target.value}
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  value={newMember.emergencyContact.relationship}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    emergencyContact: {...newMember.emergencyContact, relationship: e.target.value}
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingMember ? 'Update Member' : 'Add Member'}
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

      {/* Members List */}
      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {member.firstName} {member.lastName}
                    </h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      member.membershipStatus === 'Active' ? 'bg-green-100 text-green-700' :
                      member.membershipStatus === 'Inactive' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {member.membershipStatus}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{member.address}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                    </div>
                    {member.ministry.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Ministries:</span> {member.ministry.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {onViewMember && (
                  <button
                    onClick={() => onViewMember(member)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => startEdit(member)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteMember(member.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-500">
            <p className="text-lg mb-2">No members found</p>
            <p className="text-sm">Try adjusting your search criteria or add a new member.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;