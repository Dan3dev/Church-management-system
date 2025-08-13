import React, { useState } from 'react';
import { 
  Baby, 
  Clock, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Plus, 
  Users,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Camera,
  Heart,
  Activity,
  Bell,
  QrCode,
  Printer
} from 'lucide-react';
import { Child, ChildCheckIn as ChildCheckInType, Member } from '../../types';
import { useApp } from '../../context/AppContext';

interface ChildCheckInProps {
  children: Child[];
  checkIns: ChildCheckInType[];
  members: Member[];
  onCheckIn: (checkIn: Omit<ChildCheckInType, 'id'>) => void;
  onCheckOut: (id: string, checkOutTime: string, checkedOutBy: string) => void;
  onAddChild: (child: Omit<Child, 'id'>) => void;
}

const ChildCheckIn: React.FC<ChildCheckInProps> = ({
  children,
  checkIns,
  members,
  onCheckIn,
  onCheckOut,
  onAddChild
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('Sunday Morning');
  const [showAddChild, setShowAddChild] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { t, state } = useApp();

  const [newChild, setNewChild] = useState<Omit<Child, 'id'>>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    parentIds: [],
    campus: 'Main Campus',
    photoPermission: false,
    internetPermission: false,
    fieldTripPermission: false,
    emergencyContacts: [{ 
      name: '', 
      phone: '', 
      relationship: '', 
      isPrimary: true, 
      canPickup: true 
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const services = [
    'Sunday Morning', 
    'Sunday Evening', 
    'Wednesday Kids', 
    'Youth Service',
    'Special Event',
    'VBS',
    'Kids Camp'
  ];
  
  const rooms = [
    { id: 'nursery', name: 'Nursery', ageRange: '0-2', capacity: 15 },
    { id: 'toddlers', name: 'Toddlers', ageRange: '2-4', capacity: 20 },
    { id: 'preschool', name: 'Preschool', ageRange: '4-6', capacity: 25 },
    { id: 'elementary', name: 'Elementary', ageRange: '6-12', capacity: 30 },
    { id: 'kids-church', name: 'Kids Church', ageRange: '6-12', capacity: 40 }
  ];

  const generateSecurityCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const getAgeGroup = (dateOfBirth: string) => {
    const age = Math.floor((new Date().getTime() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 2) return 'nursery';
    if (age < 4) return 'toddlers';
    if (age < 6) return 'preschool';
    return 'elementary';
  };

  const getAge = (dateOfBirth: string) => {
    return Math.floor((new Date().getTime() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const handleCheckIn = (child: Child) => {
    const parent = members.find(m => child.parentIds.includes(m.id));
    if (parent) {
      const securityCode = generateSecurityCode();
      const ageGroup = getAgeGroup(child.dateOfBirth);
      const room = rooms.find(r => r.id === ageGroup);
      
      onCheckIn({
        childId: child.id,
        childName: `${child.firstName} ${child.lastName}`,
        parentId: parent.id,
        parentName: `${parent.firstName} ${parent.lastName}`,
        checkInTime: new Date().toISOString(),
        service: selectedService,
        room: room?.name || 'Kids Area',
        campus: child.campus,
        allergies: child.allergies,
        medicalNotes: child.medicalNotes,
        emergencyContact: child.emergencyContacts[0]?.phone || '',
        securityCode,
        checkedInBy: 'Admin',
        authorizedPickup: child.emergencyContacts.filter(c => c.canPickup).map(c => c.name),
        specialInstructions: child.specialNeeds,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Send notification to parent
      state.dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          userId: parent.id,
          type: 'success',
          title: 'Child Checked In',
          message: `${child.firstName} has been safely checked into ${room?.name}. Security code: ${securityCode}`,
          read: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
          category: 'children'
        }
      });
    }
  };

  const handleCheckOut = (checkIn: ChildCheckInType) => {
    onCheckOut(checkIn.id, new Date().toISOString(), 'Admin');
    
    // Send notification to parent
    const parent = members.find(m => m.id === checkIn.parentId);
    if (parent) {
      state.dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          userId: parent.id,
          type: 'info',
          title: 'Child Checked Out',
          message: `${checkIn.childName} has been checked out from ${checkIn.room}`,
          read: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
          category: 'children'
        }
      });
    }
  };

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChild({
      ...newChild,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    state.dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        userId: 'admin',
        type: 'success',
        title: 'Child Added',
        message: `${newChild.firstName} ${newChild.lastName} has been registered`,
        read: false,
        createdAt: new Date().toISOString(),
        priority: 'medium',
        category: 'children'
      }
    });
    
    setNewChild({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      parentIds: [],
      campus: 'Main Campus',
      photoPermission: false,
      internetPermission: false,
      fieldTripPermission: false,
      emergencyContacts: [{ 
        name: '', 
        phone: '', 
        relationship: '', 
        isPrimary: true, 
        canPickup: true 
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setShowAddChild(false);
  };

  const printSecurityLabel = (checkIn: ChildCheckInType) => {
    // Simulate printing security label
    const printContent = `
      CHILD CHECK-IN LABEL
      
      Child: ${checkIn.childName}
      Parent: ${checkIn.parentName}
      Room: ${checkIn.room}
      Service: ${checkIn.service}
      Security Code: ${checkIn.securityCode}
      Check-in: ${new Date(checkIn.checkInTime).toLocaleTimeString()}
      
      Emergency: ${checkIn.emergencyContact}
      ${checkIn.allergies ? `ALLERGIES: ${checkIn.allergies}` : ''}
      ${checkIn.medicalNotes ? `MEDICAL: ${checkIn.medicalNotes}` : ''}
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Security Label</title></head>
          <body style="font-family: monospace; padding: 20px;">
            <pre>${printContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const filteredChildren = children.filter(child => {
    const matchesSearch = `${child.firstName} ${child.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const ageGroup = getAgeGroup(child.dateOfBirth);
    const matchesRoom = selectedRoom === 'All' || rooms.find(r => r.id === ageGroup)?.name === selectedRoom;
    return matchesSearch && matchesRoom;
  });

  const todayCheckIns = checkIns.filter(c => 
    c.checkInTime.startsWith(new Date().toISOString().split('T')[0]) && 
    c.service === selectedService
  );

  const currentlyCheckedIn = todayCheckIns.filter(c => !c.checkOutTime);

  const checkInStats = {
    total: children.length,
    checkedIn: currentlyCheckedIn.length,
    todayTotal: todayCheckIns.length,
    specialNeeds: children.filter(c => c.allergies || c.medicalNotes || c.specialNeeds).length,
    roomCapacity: rooms.reduce((sum, r) => sum + r.capacity, 0)
  };

  const getRoomOccupancy = (roomName: string) => {
    const occupancy = currentlyCheckedIn.filter(c => c.room === roomName).length;
    const room = rooms.find(r => r.name === roomName);
    return { occupancy, capacity: room?.capacity || 0 };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('children')} Check-In System</h2>
          <p className="text-gray-600">Secure child check-in and management system</p>
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
            onClick={() => setShowAddChild(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Child</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Children</p>
              <p className="text-3xl font-bold">{checkInStats.total}</p>
            </div>
            <Baby className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Checked In</p>
              <p className="text-3xl font-bold">{checkInStats.checkedIn}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Today's Total</p>
              <p className="text-3xl font-bold">{checkInStats.todayTotal}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Special Needs</p>
              <p className="text-3xl font-bold">{checkInStats.specialNeeds}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Capacity</p>
              <p className="text-3xl font-bold">{checkInStats.roomCapacity}</p>
            </div>
            <Users className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Service and Room Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Filter</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Rooms</option>
              {rooms.map(room => (
                <option key={room.id} value={room.name}>{room.name} ({room.ageRange})</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              <p>{currentlyCheckedIn.length} children currently checked in</p>
              <p>{filteredChildren.length} children available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Occupancy */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Occupancy</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {rooms.map(room => {
            const { occupancy, capacity } = getRoomOccupancy(room.name);
            const percentage = capacity > 0 ? (occupancy / capacity) * 100 : 0;
            
            return (
              <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900">{room.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{room.ageRange} years</p>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          percentage > 90 ? 'bg-red-500' :
                          percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium">
                      {occupancy}/{capacity}
                    </p>
                    <p className="text-xs text-gray-500">{Math.round(percentage)}% full</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Child Form */}
      {showAddChild && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Register New Child</h3>
          <form onSubmit={handleAddChild} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={newChild.firstName}
                  onChange={(e) => setNewChild({...newChild, firstName: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newChild.lastName}
                  onChange={(e) => setNewChild({...newChild, lastName: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={newChild.dateOfBirth}
                  onChange={(e) => setNewChild({...newChild, dateOfBirth: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Preferred Name (optional)"
                  value={newChild.preferredName || ''}
                  onChange={(e) => setNewChild({...newChild, preferredName: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Grade/School (optional)"
                  value={newChild.grade || ''}
                  onChange={(e) => setNewChild({...newChild, grade: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="School Name (optional)"
                  value={newChild.school || ''}
                  onChange={(e) => setNewChild({...newChild, school: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Parent Selection */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Parents/Guardians</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-4">
                {members.filter(m => m.membershipStatus === 'Active').map(member => (
                  <label key={member.id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={newChild.parentIds.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewChild({
                            ...newChild,
                            parentIds: [...newChild.parentIds, member.id]
                          });
                        } else {
                          setNewChild({
                            ...newChild,
                            parentIds: newChild.parentIds.filter(id => id !== member.id)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </span>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Medical & Special Needs</h4>
              <div className="space-y-4">
                <textarea
                  placeholder="Allergies (if any)"
                  value={newChild.allergies || ''}
                  onChange={(e) => setNewChild({...newChild, allergies: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
                <textarea
                  placeholder="Medical Notes"
                  value={newChild.medicalNotes || ''}
                  onChange={(e) => setNewChild({...newChild, medicalNotes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
                <textarea
                  placeholder="Special Needs or Instructions"
                  value={newChild.specialNeeds || ''}
                  onChange={(e) => setNewChild({...newChild, specialNeeds: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
            </div>

            {/* Emergency Contacts */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={newChild.emergencyContacts[0]?.name || ''}
                  onChange={(e) => setNewChild({
                    ...newChild,
                    emergencyContacts: [{
                      ...newChild.emergencyContacts[0],
                      name: e.target.value
                    }]
                  })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newChild.emergencyContacts[0]?.phone || ''}
                  onChange={(e) => setNewChild({
                    ...newChild,
                    emergencyContacts: [{
                      ...newChild.emergencyContacts[0],
                      phone: e.target.value
                    }]
                  })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  value={newChild.emergencyContacts[0]?.relationship || ''}
                  onChange={(e) => setNewChild({
                    ...newChild,
                    emergencyContacts: [{
                      ...newChild.emergencyContacts[0],
                      relationship: e.target.value
                    }]
                  })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={newChild.photoPermission}
                    onChange={(e) => setNewChild({...newChild, photoPermission: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Photo Permission</span>
                    <p className="text-xs text-gray-500">Allow photos during activities</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={newChild.internetPermission}
                    onChange={(e) => setNewChild({...newChild, internetPermission: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Internet Permission</span>
                    <p className="text-xs text-gray-500">Allow internet access during activities</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={newChild.fieldTripPermission}
                    onChange={(e) => setNewChild({...newChild, fieldTripPermission: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Field Trip Permission</span>
                    <p className="text-xs text-gray-500">Allow participation in field trips</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Register Child
              </button>
              <button
                type="button"
                onClick={() => setShowAddChild(false)}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search children by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Children List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map((child) => {
            const isCheckedIn = currentlyCheckedIn.some(c => c.childId === child.id);
            const checkInRecord = currentlyCheckedIn.find(c => c.childId === child.id);
            const ageGroup = getAgeGroup(child.dateOfBirth);
            const age = getAge(child.dateOfBirth);
            const room = rooms.find(r => r.id === ageGroup);
            const parents = child.parentIds.map(id => members.find(m => m.id === id)).filter(Boolean);

            return (
              <div key={child.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Baby className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {child.preferredName || child.firstName} {child.lastName}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Age: {age}</span>
                        <span>•</span>
                        <span>{room?.name}</span>
                        {child.grade && (
                          <>
                            <span>•</span>
                            <span>Grade {child.grade}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {(child.allergies || child.medicalNotes || child.specialNeeds) && (
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">Special Needs</span>
                    </div>
                  )}
                </div>

                {/* Parent Information */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Parents/Guardians</h4>
                  <div className="space-y-1">
                    {parents.map((parent, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="h-3 w-3" />
                        <span>{parent?.firstName} {parent?.lastName}</span>
                        <span>•</span>
                        <span>{parent?.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Alerts */}
                {(child.allergies || child.medicalNotes || child.specialNeeds) && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="space-y-1 text-sm">
                      {child.allergies && (
                        <div className="flex items-center space-x-2 text-red-700">
                          <AlertTriangle className="h-4 w-4" />
                          <span><strong>Allergies:</strong> {child.allergies}</span>
                        </div>
                      )}
                      {child.medicalNotes && (
                        <div className="flex items-center space-x-2 text-red-700">
                          <Heart className="h-4 w-4" />
                          <span><strong>Medical:</strong> {child.medicalNotes}</span>
                        </div>
                      )}
                      {child.specialNeeds && (
                        <div className="flex items-center space-x-2 text-red-700">
                          <Bell className="h-4 w-4" />
                          <span><strong>Special Needs:</strong> {child.specialNeeds}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Check-in Status */}
                <div className="flex items-center justify-between">
                  {isCheckedIn ? (
                    <div className="text-center flex-1">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Shield className="h-6 w-6 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {checkInRecord?.securityCode}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Checked in at {new Date(checkInRecord?.checkInTime || '').toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">Room: {checkInRecord?.room}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => checkInRecord && printSecurityLabel(checkInRecord)}
                          className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          <Printer className="h-3 w-3" />
                          <span>Print</span>
                        </button>
                        <button
                          onClick={() => checkInRecord && handleCheckOut(checkInRecord)}
                          className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          <Clock className="h-3 w-3" />
                          <span>Check Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 text-center">
                      <button
                        onClick={() => handleCheckIn(child)}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Check In to {room?.name}
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        Capacity: {getRoomOccupancy(room?.name || '').occupancy}/{room?.capacity}
                      </p>
                    </div>
                  )}
                </div>

                {/* Permissions Icons */}
                <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className={`flex items-center space-x-1 ${child.photoPermission ? 'text-green-600' : 'text-red-600'}`}>
                    <Camera className="h-3 w-3" />
                    <span>Photo</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${child.internetPermission ? 'text-green-600' : 'text-red-600'}`}>
                    <Activity className="h-3 w-3" />
                    <span>Internet</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${child.fieldTripPermission ? 'text-green-600' : 'text-red-600'}`}>
                    <MapPin className="h-3 w-3" />
                    <span>Field Trip</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Children</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredChildren.map((child) => {
              const isCheckedIn = currentlyCheckedIn.some(c => c.childId === child.id);
              const checkInRecord = currentlyCheckedIn.find(c => c.childId === child.id);
              const age = getAge(child.dateOfBirth);
              const parents = child.parentIds.map(id => members.find(m => m.id === id)).filter(Boolean);
              
              return (
                <div key={child.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Baby className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {child.preferredName || child.firstName} {child.lastName}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Age: {age}</span>
                          <span>Parents: {parents.map(p => `${p?.firstName} ${p?.lastName}`).join(', ')}</span>
                          {(child.allergies || child.medicalNotes) && (
                            <span className="text-red-600 font-medium">⚠️ Special Needs</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {isCheckedIn ? (
                        <div className="flex items-center space-x-3">
                          <div className="text-center">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-5 w-5 text-green-600" />
                              <span className="font-bold text-green-600 text-lg">
                                {checkInRecord?.securityCode}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(checkInRecord?.checkInTime || '').toLocaleTimeString()}
                            </p>
                          </div>
                          <button
                            onClick={() => checkInRecord && handleCheckOut(checkInRecord)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Check Out
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(child)}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Check In
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Currently Checked In Summary */}
      {currentlyCheckedIn.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Currently Checked In - {selectedService}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Print all security codes
                  currentlyCheckedIn.forEach(checkIn => printSecurityLabel(checkIn));
                }}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Print All Labels</span>
              </button>
              <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export List</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentlyCheckedIn.map((checkIn) => (
              <div key={checkIn.id} className="border border-green-200 rounded-lg p-4 bg-green-50 hover:bg-green-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{checkIn.childName}</h4>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">{checkIn.securityCode}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3" />
                    <span>Room: {checkIn.room}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3" />
                    <span>Parent: {checkIn.parentName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>In: {new Date(checkIn.checkInTime).toLocaleTimeString()}</span>
                  </div>
                  {checkIn.allergies && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>⚠️ {checkIn.allergies}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => printSecurityLabel(checkIn)}
                    className="flex-1 bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 transition-colors"
                  >
                    Print Label
                  </button>
                  <button
                    onClick={() => handleCheckOut(checkIn)}
                    className="flex-1 bg-red-600 text-white text-xs py-2 px-3 rounded hover:bg-red-700 transition-colors"
                  >
                    Check Out
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Check-in History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Check-in History</h3>
        <div className="space-y-3">
          {checkIns
            .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
            .slice(0, 10)
            .map((checkIn) => (
            <div key={checkIn.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Baby className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{checkIn.childName}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{checkIn.room}</span>
                    <span>{checkIn.service}</span>
                    <span>{new Date(checkIn.checkInTime).toLocaleDateString()}</span>
                    <span>{new Date(checkIn.checkInTime).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  checkIn.checkOutTime ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {checkIn.checkOutTime ? 'Completed' : 'In Progress'}
                </span>
                {checkIn.checkOutTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    Out: {new Date(checkIn.checkOutTime).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildCheckIn;