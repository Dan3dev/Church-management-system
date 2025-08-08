import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone, MapPin, Calendar, Eye, Filter, Users, Heart, Award } from 'lucide-react';
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
  const [ministryFilter, setMinistryFilter] = useState<string>('All');
  const [campusFilter, setCampusFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

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
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'Admin',
    updatedBy: 'Admin'
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || member.membershipStatus === statusFilter;
    const matchesMinistry = ministryFilter === 'All' || member.ministry.includes(ministryFilter);
    const matchesCampus = campusFilter === 'All' || member.campus === campusFilter;
    return matchesSearch && matchesStatus && matchesMinistry && matchesCampus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const memberData = {
      ...newMember,
      createdAt: editingMember ? editingMember.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin'
    };

    if (editingMember) {
      onUpdateMember(editingMember.id, memberData);
      setEditingMember(null);
    } else {
      onAddMember(memberData);
    }
    resetForm();
  };

  const resetForm = () => {
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
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Admin',
      updatedBy: 'Admin'
    });
    setShowAddForm(false);
  };

  const startEdit = (member: Member) => {
    setNewMember(member);
    setEditingMember(member);
    setShowAddForm(true);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getConnectionStatus = (member: Member) => {
    if (member.connectionStatus) return member.connectionStatus;
    if (member.ministry.length > 0) return 'Connected';
    if (member.membershipStatus === 'Visitor') return 'Connecting';
    return 'Disconnected';
  };

  const getConnectionColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'bg-green-100 text-green-700';
      case 'Connecting': return 'bg-yellow-100 text-yellow-700';
      case 'Disconnected': return 'bg-gray-100 text-gray-700';
      case 'At Risk': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const memberStats = {
    total: members.length,
    active: members.filter(m => m.membershipStatus === 'Active').length,
    visitors: members.filter(m => m.membershipStatus === 'Visitor').length,
    newThisMonth: members.filter(m => {
      const joinDate = new Date(m.joinDate);
      const thisMonth = new Date();
      return joinDate.getMonth() === thisMonth.getMonth() && joinDate.getFullYear() === thisMonth.getFullYear();
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Member Management</h2>
          <p className="text-gray-600 mt-1">Manage church members, families, and relationships</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Members</p>
              <p className="text-3xl font-bold">{memberStats.total}</p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Members</p>
              <p className="text-3xl font-bold">{memberStats.active}</p>
            </div>
            <Award className="h-12 w-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Visitors</p>
              <p className="text-3xl font-bold">{memberStats.visitors}</p>
            </div>
            <Heart className="h-12 w-12 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">New This Month</p>
              <p className="text-3xl font-bold">{memberStats.newThisMonth}</p>
            </div>
            <Plus className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
            <option value="New Member">New Member</option>
          </select>

          <select
            value={ministryFilter}
            onChange={(e) => setMinistryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Ministries</option>
            {ministries.map(ministry => (
              <option key={ministry.id} value={ministry.name}>{ministry.name}</option>
            ))}
          </select>

          <select
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Campuses</option>
            <option value="Main Campus">Main Campus</option>
          </select>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredMembers.length} of {members.length} members
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Advanced filters applied</span>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {editingMember ? 'Edit Member' : 'Add New Member'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={newMember.firstName}
                  onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newMember.lastName}
                  onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={newMember.dateOfBirth}
                  onChange={(e) => setNewMember({...newMember, dateOfBirth: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <select
                  value={newMember.membershipStatus}
                  onChange={(e) => setNewMember({...newMember, membershipStatus: e.target.value as Member['membershipStatus']})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Visitor">Visitor</option>
                  <option value="New Member">New Member</option>
                </select>
                <input
                  type="text"
                  placeholder="Occupation (optional)"
                  value={newMember.occupation || ''}
                  onChange={(e) => setNewMember({...newMember, occupation: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <select
                  value={newMember.maritalStatus || ''}
                  onChange={(e) => setNewMember({...newMember, maritalStatus: e.target.value as Member['maritalStatus']})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              
              <div className="mt-4">
                <textarea
                  placeholder="Address"
                  value={newMember.address}
                  onChange={(e) => setNewMember({...newMember, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={2}
                  required
                />
              </div>
            </div>

            {/* Ministry Assignment */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Ministry Assignment</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {ministries.map(ministry => (
                  <label key={ministry.id} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded transition-colors">
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

            {/* Spiritual Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Spiritual Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  placeholder="Salvation Date"
                  value={newMember.salvationDate || ''}
                  onChange={(e) => setNewMember({...newMember, salvationDate: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="date"
                  placeholder="Water Baptism Date"
                  value={newMember.waterBaptismDate || ''}
                  onChange={(e) => setNewMember({...newMember, waterBaptismDate: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="date"
                  placeholder="Holy Ghost Baptism Date"
                  value={newMember.holyGhostBaptismDate || ''}
                  onChange={(e) => setNewMember({...newMember, holyGhostBaptismDate: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="date"
                  placeholder="Membership Class Date"
                  value={newMember.membershipClassDate || ''}
                  onChange={(e) => setNewMember({...newMember, membershipClassDate: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Emergency Contact Name"
                  value={newMember.emergencyContact.name}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    emergencyContact: {...newMember.emergencyContact, name: e.target.value}
                  })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="tel"
                  placeholder="Emergency Contact Phone"
                  value={newMember.emergencyContact.phone}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    emergencyContact: {...newMember.emergencyContact, phone: e.target.value}
                  })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  value={newMember.emergencyContact.relationship}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    emergencyContact: {...newMember.emergencyContact, relationship: e.target.value}
                  })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Additional Information</h4>
              <div className="space-y-4">
                <textarea
                  placeholder="Skills (comma separated)"
                  value={newMember.skills?.join(', ') || ''}
                  onChange={(e) => setNewMember({...newMember, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={2}
                />
                <textarea
                  placeholder="Notes"
                  value={newMember.notes || ''}
                  onChange={(e) => setNewMember({...newMember, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
              >
                {editingMember ? 'Update Member' : 'Add Member'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members Grid */}
      <div className="grid gap-4">
        {filteredMembers.map((member) => {
          const connectionStatus = getConnectionStatus(member);
          const age = calculateAge(member.dateOfBirth);
          
          return (
            <div 
              key={member.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
              onClick={() => onViewMember && onViewMember(member)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        {member.profileImage ? (
                          <img src={member.profileImage} alt={`${member.firstName} ${member.lastName}`} className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-xl">
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        member.membershipStatus === 'Active' ? 'bg-green-500' :
                        member.membershipStatus === 'Visitor' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {member.firstName} {member.lastName}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          member.membershipStatus === 'Active' ? 'bg-green-100 text-green-700' :
                          member.membershipStatus === 'Inactive' ? 'bg-red-100 text-red-700' :
                          member.membershipStatus === 'Visitor' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {member.membershipStatus}
                        </span>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getConnectionColor(connectionStatus)}`}>
                          {connectionStatus}
                        </span>
                        <span className="text-sm text-gray-500">Age: {age}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        <Phone className="h-4 w-4 text-green-500" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-start space-x-3 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                        <span className="line-clamp-2">{member.address}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                      </div>
                      {member.ministry.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Ministries:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.ministry.slice(0, 3).map((ministry, index) => (
                              <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                                {ministry}
                              </span>
                            ))}
                            {member.ministry.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                +{member.ministry.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {member.occupation && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Occupation:</span> {member.occupation}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Details */}
                  {hoveredMember === member.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Last Attended:</span>
                          <p className="text-gray-600">{member.lastAttended ? new Date(member.lastAttended).toLocaleDateString() : 'No record'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Role:</span>
                          <p className="text-gray-600 capitalize">{member.role}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Campus:</span>
                          <p className="text-gray-600">{member.campus}</p>
                        </div>
                      </div>
                      {member.followUpNeeded && (
                        <div className="mt-3 p-2 bg-yellow-100 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-800 text-sm font-medium">⚠️ Follow-up needed</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2">
                  {onViewMember && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewMember(member);
                      }}
                      className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(member);
                    }}
                    className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Edit Member"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
                        onDeleteMember(member.id);
                      }
                    }}
                    className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Delete Member"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search criteria or add a new member.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Member
          </button>
        </div>
      )}
    </div>
  );
};

export default Members;