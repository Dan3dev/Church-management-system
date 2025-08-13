import React, { useState } from 'react';
import { Baby, Clock, Shield, AlertTriangle, CheckCircle, Search, Plus } from 'lucide-react';
import { Child, ChildCheckIn as ChildCheckInType, Member } from '../../types';

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

  const [newChild, setNewChild] = useState<Omit<Child, 'id'>>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    parentIds: [],
    campus: 'Main Campus',
    photoPermission: false,
    emergencyContacts: [{ name: '', phone: '', relationship: '' }]
  });

  const services = ['Sunday Morning', 'Sunday Evening', 'Wednesday Kids', 'Special Event'];
  const rooms = ['Nursery', 'Toddlers', 'Preschool', 'Elementary', 'Kids Church'];

  const generateSecurityCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const getAgeGroup = (dateOfBirth: string) => {
    const age = Math.floor((new Date().getTime() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 2) return 'Nursery';
    if (age < 4) return 'Toddlers';
    if (age < 6) return 'Preschool';
    return 'Elementary';
  };

  const handleCheckIn = (child: Child) => {
    const parent = members.find(m => child.parentIds.includes(m.id));
    if (parent) {
      const securityCode = generateSecurityCode();
      onCheckIn({
        childId: child.id,
        childName: `${child.firstName} ${child.lastName}`,
        parentId: parent.id,
        parentName: `${parent.firstName} ${parent.lastName}`,
        checkInTime: new Date().toISOString(),
        service: selectedService,
        room: getAgeGroup(child.dateOfBirth),
        campus: child.campus,
        allergies: child.allergies,
        medicalNotes: child.medicalNotes,
        emergencyContact: child.emergencyContacts[0]?.phone || '',
        securityCode,
        checkedInBy: 'Admin'
      });
    }
  };

  const handleCheckOut = (checkIn: ChildCheckInType) => {
    onCheckOut(checkIn.id, new Date().toISOString(), 'Admin');
  };

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChild(newChild);
    setNewChild({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      parentIds: [],
      campus: 'Main Campus',
      photoPermission: false,
      emergencyContacts: [{ name: '', phone: '', relationship: '' }]
    });
    setShowAddChild(false);
  };

  const filteredChildren = children.filter(child =>
    `${child.firstName} ${child.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayCheckIns = checkIns.filter(c => 
    c.checkInTime.startsWith(new Date().toISOString().split('T')[0]) && 
    c.service === selectedService
  );

  const currentlyCheckedIn = todayCheckIns.filter(c => !c.checkOutTime);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Child Check-In System</h2>
        <div className="flex space-x-3">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Baby className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{children.length}</p>
            <p className="text-sm text-gray-500">Total Children</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{currentlyCheckedIn.length}</p>
            <p className="text-sm text-gray-500">Currently Checked In</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{todayCheckIns.length}</p>
            <p className="text-sm text-gray-500">Today's Check-ins</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {children.filter(c => c.allergies || c.medicalNotes).length}
            </p>
            <p className="text-sm text-gray-500">Special Needs</p>
          </div>
        </div>
      </div>

      {/* Service Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Service:</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          <div className="text-sm text-gray-500">
            {currentlyCheckedIn.length} children currently checked in
          </div>
        </div>
      </div>

      {/* Add Child Form */}
      {showAddChild && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Child</h3>
          <form onSubmit={handleAddChild} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={newChild.firstName}
                onChange={(e) => setNewChild({...newChild, firstName: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newChild.lastName}
                onChange={(e) => setNewChild({...newChild, lastName: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={newChild.dateOfBirth}
                onChange={(e) => setNewChild({...newChild, dateOfBirth: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <select
                multiple
                value={newChild.parentIds}
                onChange={(e) => setNewChild({
                  ...newChild,
                  parentIds: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Allergies (optional)"
                value={newChild.allergies || ''}
                onChange={(e) => setNewChild({...newChild, allergies: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Medical Notes (optional)"
                value={newChild.medicalNotes || ''}
                onChange={(e) => setNewChild({...newChild, medicalNotes: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newChild.photoPermission}
                onChange={(e) => setNewChild({...newChild, photoPermission: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Photo Permission Granted</span>
            </label>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Child
              </button>
              <button
                type="button"
                onClick={() => setShowAddChild(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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
            placeholder="Search children..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Children List */}
      <div className="grid gap-4">
        {filteredChildren.map((child) => {
          const isCheckedIn = currentlyCheckedIn.some(c => c.childId === child.id);
          const checkInRecord = currentlyCheckedIn.find(c => c.childId === child.id);
          const ageGroup = getAgeGroup(child.dateOfBirth);
          const age = Math.floor((new Date().getTime() - new Date(child.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

          return (
            <div key={child.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Baby className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {child.firstName} {child.lastName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Age: {age}</span>
                      <span>Room: {ageGroup}</span>
                      <span>Parents: {child.parentIds.map(id => {
                        const parent = members.find(m => m.id === id);
                        return parent ? `${parent.firstName} ${parent.lastName}` : '';
                      }).join(', ')}</span>
                    </div>
                    {(child.allergies || child.medicalNotes) && (
                      <div className="flex items-center space-x-2 mt-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">
                          {child.allergies && `Allergies: ${child.allergies}`}
                          {child.allergies && child.medicalNotes && ' | '}
                          {child.medicalNotes && `Medical: ${child.medicalNotes}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {isCheckedIn ? (
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="text-lg font-bold text-green-600">
                          {checkInRecord?.securityCode}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Checked in at {new Date(checkInRecord?.checkInTime || '').toLocaleTimeString()}
                      </p>
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

      {/* Currently Checked In */}
      {currentlyCheckedIn.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Currently Checked In - {selectedService}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentlyCheckedIn.map((checkIn) => (
              <div key={checkIn.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{checkIn.childName}</h4>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">{checkIn.securityCode}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Room: {checkIn.room}</p>
                  <p>Parent: {checkIn.parentName}</p>
                  <p>Check-in: {new Date(checkIn.checkInTime).toLocaleTimeString()}</p>
                  {checkIn.allergies && (
                    <p className="text-red-600">⚠️ Allergies: {checkIn.allergies}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildCheckIn;