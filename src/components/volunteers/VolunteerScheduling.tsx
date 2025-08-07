import React, { useState } from 'react';
import { Users, Calendar, Clock, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { VolunteerAssignment, Member, Event } from '../../types';

interface VolunteerSchedulingProps {
  volunteers: VolunteerAssignment[];
  members: Member[];
  events: Event[];
  onAddAssignment: (assignment: Omit<VolunteerAssignment, 'id'>) => void;
  onUpdateAssignment: (id: string, assignment: Partial<VolunteerAssignment>) => void;
}

const VolunteerScheduling: React.FC<VolunteerSchedulingProps> = ({
  volunteers,
  members,
  events,
  onAddAssignment,
  onUpdateAssignment
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  const [newAssignment, setNewAssignment] = useState<Omit<VolunteerAssignment, 'id'>>({
    eventId: '',
    memberId: '',
    memberName: '',
    role: '',
    department: '',
    campus: 'Main Campus',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    status: 'scheduled'
  });

  const departments = ['Worship', 'Children', 'Youth', 'Hospitality', 'Security', 'Media', 'Parking', 'Cleaning'];
  const roles = {
    'Worship': ['Worship Leader', 'Vocalist', 'Instrumentalist', 'Sound Tech', 'Lighting'],
    'Children': ['Teacher', 'Assistant', 'Check-in', 'Security'],
    'Youth': ['Leader', 'Small Group Leader', 'Games Coordinator'],
    'Hospitality': ['Greeter', 'Usher', 'Coffee Team', 'Setup'],
    'Security': ['Security Officer', 'Parking Attendant'],
    'Media': ['Camera Operator', 'Live Stream', 'Social Media'],
    'Parking': ['Parking Attendant', 'Traffic Director'],
    'Cleaning': ['Custodian', 'Setup/Teardown']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMember = members.find(m => m.id === newAssignment.memberId);
    if (selectedMember) {
      onAddAssignment({
        ...newAssignment,
        memberName: `${selectedMember.firstName} ${selectedMember.lastName}`
      });
      setNewAssignment({
        eventId: '',
        memberId: '',
        memberName: '',
        role: '',
        department: '',
        campus: 'Main Campus',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        status: 'scheduled'
      });
      setShowAddForm(false);
    }
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesDate = v.date === selectedDate;
    const matchesDepartment = selectedDepartment === 'All' || v.department === selectedDepartment;
    return matchesDate && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'no-show': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'no-show': return XCircle;
      default: return AlertCircle;
    }
  };

  const upcomingAssignments = volunteers.filter(v => new Date(v.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Volunteer Scheduling</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Volunteer</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{upcomingAssignments.length}</p>
            <p className="text-sm text-gray-500">Upcoming Assignments</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {volunteers.filter(v => v.status === 'confirmed').length}
            </p>
            <p className="text-sm text-gray-500">Confirmed</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-100">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {volunteers.filter(v => v.status === 'scheduled').length}
            </p>
            <p className="text-sm text-gray-500">Pending Confirmation</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {new Set(volunteers.map(v => v.memberId)).size}
            </p>
            <p className="text-sm text-gray-500">Active Volunteers</p>
          </div>
        </div>
      </div>

      {/* Add Assignment Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Volunteer</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newAssignment.eventId}
                onChange={(e) => setNewAssignment({...newAssignment, eventId: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select Event</option>
                {events.filter(e => new Date(e.date) >= new Date()).map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </select>

              <select
                value={newAssignment.memberId}
                onChange={(e) => setNewAssignment({...newAssignment, memberId: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select Volunteer</option>
                {members.filter(m => m.membershipStatus === 'Active').map(member => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName}
                  </option>
                ))}
              </select>

              <select
                value={newAssignment.department}
                onChange={(e) => {
                  setNewAssignment({...newAssignment, department: e.target.value, role: ''});
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={newAssignment.role}
                onChange={(e) => setNewAssignment({...newAssignment, role: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                disabled={!newAssignment.department}
              >
                <option value="">Select Role</option>
                {newAssignment.department && roles[newAssignment.department as keyof typeof roles]?.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <input
                type="date"
                value={newAssignment.date}
                onChange={(e) => setNewAssignment({...newAssignment, date: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />

              <input
                type="time"
                value={newAssignment.startTime}
                onChange={(e) => setNewAssignment({...newAssignment, startTime: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />

              <input
                type="time"
                value={newAssignment.endTime}
                onChange={(e) => setNewAssignment({...newAssignment, endTime: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />

              <textarea
                placeholder="Notes (optional)"
                value={newAssignment.notes || ''}
                onChange={(e) => setNewAssignment({...newAssignment, notes: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Schedule Volunteer
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {filteredVolunteers.length} assignments for {new Date(selectedDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Volunteer Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Schedule for {new Date(selectedDate).toLocaleDateString()}
        </h3>
        
        {filteredVolunteers.length > 0 ? (
          <div className="space-y-4">
            {departments.map(department => {
              const deptVolunteers = filteredVolunteers.filter(v => v.department === department);
              if (deptVolunteers.length === 0) return null;

              return (
                <div key={department} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{department}</h4>
                  <div className="space-y-2">
                    {deptVolunteers.map((volunteer) => {
                      const StatusIcon = getStatusIcon(volunteer.status);
                      return (
                        <div key={volunteer.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{volunteer.memberName}</p>
                              <p className="text-sm text-gray-500">{volunteer.role}</p>
                              <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <Clock className="h-3 w-3" />
                                <span>{volunteer.startTime} - {volunteer.endTime}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(volunteer.status)}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span>{volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}</span>
                            </span>
                            <select
                              value={volunteer.status}
                              onChange={(e) => onUpdateAssignment(volunteer.id, { status: e.target.value as VolunteerAssignment['status'] })}
                              className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="no-show">No Show</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No volunteers scheduled for this date</p>
          </div>
        )}
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assignments</h3>
        <div className="space-y-3">
          {upcomingAssignments.slice(0, 10).map((assignment) => {
            const StatusIcon = getStatusIcon(assignment.status);
            return (
              <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-gray-900">{assignment.memberName}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{assignment.role}</span>
                      <span>{assignment.department}</span>
                      <span>{new Date(assignment.date).toLocaleDateString()}</span>
                      <span>{assignment.startTime}</span>
                    </div>
                  </div>
                </div>
                <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(assignment.status)}`}>
                  <StatusIcon className="h-3 w-3" />
                  <span>{assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VolunteerScheduling;