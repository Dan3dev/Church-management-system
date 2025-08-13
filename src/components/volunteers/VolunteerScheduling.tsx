import React, { useState } from 'react';
import { Users, Calendar, Clock, Plus, CheckCircle, XCircle, AlertCircle, Bell, Mail, Phone, Award, Filter, Search } from 'lucide-react';
import { VolunteerAssignment, Member, Event } from '../../types';
import { useApp } from '../../context/AppContext';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const { t, state } = useApp();

  const [newAssignment, setNewAssignment] = useState<Omit<VolunteerAssignment, 'id'>>({
    eventId: '',
    eventTitle: '',
    memberId: '',
    memberName: '',
    role: '',
    department: '',
    campus: 'Main Campus',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const departments = ['Worship', 'Children', 'Youth', 'Hospitality', 'Security', 'Media', 'Parking', 'Cleaning', 'Ushering', 'Technical'];
  const roles = {
    'Worship': ['Worship Leader', 'Vocalist', 'Instrumentalist', 'Sound Tech', 'Lighting Tech', 'Stage Manager'],
    'Children': ['Teacher', 'Assistant Teacher', 'Check-in Coordinator', 'Security', 'Snack Coordinator'],
    'Youth': ['Youth Leader', 'Small Group Leader', 'Games Coordinator', 'Mentor', 'Event Coordinator'],
    'Hospitality': ['Greeter', 'Usher', 'Coffee Team', 'Setup Team', 'Welcome Desk', 'Guest Services'],
    'Security': ['Security Officer', 'Parking Attendant', 'Building Monitor', 'Emergency Coordinator'],
    'Media': ['Camera Operator', 'Live Stream Tech', 'Social Media Manager', 'Graphics Operator', 'Video Editor'],
    'Parking': ['Parking Attendant', 'Traffic Director', 'Valet Service', 'Security'],
    'Cleaning': ['Custodian', 'Setup/Teardown', 'Maintenance', 'Supplies Manager'],
    'Ushering': ['Head Usher', 'Usher', 'Offering Coordinator', 'Seating Coordinator'],
    'Technical': ['IT Support', 'Equipment Manager', 'Troubleshooter', 'Setup Coordinator']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMember = members.find(m => m.id === newAssignment.memberId);
    const selectedEvent = events.find(e => e.id === newAssignment.eventId);
    
    if (selectedMember && selectedEvent) {
      onAddAssignment({
        ...newAssignment,
        memberName: `${selectedMember.firstName} ${selectedMember.lastName}`,
        eventTitle: selectedEvent.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Send notification to volunteer
      state.dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          userId: selectedMember.id,
          type: 'info',
          title: 'Volunteer Assignment',
          message: `You've been scheduled for ${newAssignment.role} on ${new Date(newAssignment.date).toLocaleDateString()}`,
          read: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
          category: 'volunteers'
        }
      });
      
      resetForm();
    }
  };

  const resetForm = () => {
    setNewAssignment({
      eventId: '',
      eventTitle: '',
      memberId: '',
      memberName: '',
      role: '',
      department: '',
      campus: 'Main Campus',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setShowAddForm(false);
  };

  const sendReminder = async (volunteer: VolunteerAssignment) => {
    // Simulate sending reminder
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onUpdateAssignment(volunteer.id, { 
      reminderSent: true,
      updatedAt: new Date().toISOString()
    });
    
    state.dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        userId: 'admin',
        type: 'success',
        title: 'Reminder Sent',
        message: `Reminder sent to ${volunteer.memberName} for ${volunteer.role}`,
        read: false,
        createdAt: new Date().toISOString(),
        priority: 'low',
        category: 'volunteers'
      }
    });
  };

  const confirmVolunteer = (volunteer: VolunteerAssignment) => {
    onUpdateAssignment(volunteer.id, { 
      status: 'confirmed',
      updatedAt: new Date().toISOString()
    });
    
    state.dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        userId: 'admin',
        type: 'success',
        title: 'Volunteer Confirmed',
        message: `${volunteer.memberName} confirmed for ${volunteer.role}`,
        read: false,
        createdAt: new Date().toISOString(),
        priority: 'medium',
        category: 'volunteers'
      }
    });
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesDate = v.date === selectedDate;
    const matchesDepartment = selectedDepartment === 'All' || v.department === selectedDepartment;
    const matchesSearch = v.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDate && matchesDepartment && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'no-show': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'no-show': return XCircle;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const upcomingAssignments = volunteers.filter(v => new Date(v.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const volunteerStats = {
    total: upcomingAssignments.length,
    confirmed: volunteers.filter(v => v.status === 'confirmed').length,
    pending: volunteers.filter(v => v.status === 'scheduled').length,
    completed: volunteers.filter(v => v.status === 'completed').length,
    activeVolunteers: new Set(volunteers.map(v => v.memberId)).size
  };

  const getVolunteerHistory = (memberId: string) => {
    return volunteers.filter(v => v.memberId === memberId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getVolunteerReliability = (memberId: string) => {
    const history = getVolunteerHistory(memberId);
    if (history.length === 0) return 0;
    
    const completed = history.filter(v => v.status === 'completed').length;
    const noShows = history.filter(v => v.status === 'no-show').length;
    
    return Math.round(((completed / (completed + noShows)) * 100) || 0);
  };

  const renderCalendarView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Volunteer Schedule - {new Date(selectedDate).toLocaleDateString()}
      </h3>
      
      {filteredVolunteers.length > 0 ? (
        <div className="space-y-6">
          {departments.map(department => {
            const deptVolunteers = filteredVolunteers.filter(v => v.department === department);
            if (deptVolunteers.length === 0) return null;

            return (
              <div key={department} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span>{department} ({deptVolunteers.length})</span>
                  </h4>
                  <div className="text-sm text-gray-500">
                    {deptVolunteers.filter(v => v.status === 'confirmed').length} confirmed
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deptVolunteers.map((volunteer) => {
                    const StatusIcon = getStatusIcon(volunteer.status);
                    const member = members.find(m => m.id === volunteer.memberId);
                    const reliability = getVolunteerReliability(volunteer.memberId);
                    
                    return (
                      <div key={volunteer.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-medium text-sm">
                                {volunteer.memberName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{volunteer.memberName}</p>
                              <p className="text-sm text-purple-600 font-medium">{volunteer.role}</p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{volunteer.startTime} - {volunteer.endTime}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(volunteer.status)}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span>{volunteer.status}</span>
                          </span>
                        </div>

                        {/* Volunteer Details on Hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="border-t border-gray-200 pt-3 space-y-2">
                            {member && (
                              <>
                                <div className="flex items-center space-x-2 text-xs text-gray-600">
                                  <Phone className="h-3 w-3" />
                                  <span>{member.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-600">
                                  <Mail className="h-3 w-3" />
                                  <span>{member.email}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">Reliability:</span>
                                  <span className={`font-medium ${
                                    reliability >= 90 ? 'text-green-600' :
                                    reliability >= 70 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {reliability}%
                                  </span>
                                </div>
                              </>
                            )}
                            
                            <div className="flex space-x-2 mt-3">
                              {volunteer.status === 'scheduled' && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmVolunteer(volunteer);
                                    }}
                                    className="flex-1 bg-green-600 text-white text-xs py-1 px-2 rounded hover:bg-green-700 transition-colors"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      sendReminder(volunteer);
                                    }}
                                    className="flex-1 bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition-colors"
                                  >
                                    Remind
                                  </button>
                                </>
                              )}
                              
                              {volunteer.status === 'confirmed' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateAssignment(volunteer.id, { 
                                      status: 'completed',
                                      checkOutTime: new Date().toISOString(),
                                      updatedAt: new Date().toISOString()
                                    });
                                  }}
                                  className="w-full bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                  Mark Complete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {volunteer.notes && (
                          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                            <p className="text-yellow-800">{volunteer.notes}</p>
                          </div>
                        )}
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
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No volunteers scheduled</p>
          <p className="text-sm">Schedule volunteers for {new Date(selectedDate).toLocaleDateString()}</p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Schedule First Volunteer
          </button>
        </div>
      )}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">All Volunteer Assignments</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {upcomingAssignments.slice(0, 20).map((assignment) => {
          const StatusIcon = getStatusIcon(assignment.status);
          const member = members.find(m => m.id === assignment.memberId);
          const reliability = getVolunteerReliability(assignment.memberId);
          
          return (
            <div key={assignment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-medium">
                      {assignment.memberName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{assignment.memberName}</h4>
                    <p className="text-sm text-purple-600 font-medium">{assignment.role}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{assignment.department}</span>
                      <span>{assignment.eventTitle}</span>
                      <span>{new Date(assignment.date).toLocaleDateString()}</span>
                      <span>{assignment.startTime} - {assignment.endTime}</span>
                      <span className={`font-medium ${
                        reliability >= 90 ? 'text-green-600' :
                        reliability >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {reliability}% reliable
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(assignment.status)}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span>{assignment.status}</span>
                  </span>
                  
                  <div className="flex space-x-2">
                    {assignment.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => confirmVolunteer(assignment)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Confirm Volunteer"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => sendReminder(assignment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Send Reminder"
                        >
                          <Bell className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    <select
                      value={assignment.status}
                      onChange={(e) => onUpdateAssignment(assignment.id, { 
                        status: e.target.value as VolunteerAssignment['status'],
                        updatedAt: new Date().toISOString()
                      })}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="no-show">No Show</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('volunteers')}</h2>
        <div className="flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Calendar
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
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Volunteer</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{volunteerStats.total}</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{volunteerStats.confirmed}</p>
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
            <p className="text-2xl font-bold text-gray-900">{volunteerStats.pending}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{volunteerStats.completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-indigo-100">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{volunteerStats.activeVolunteers}</p>
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
                {members.filter(m => m.membershipStatus === 'Active').map(member => {
                  const reliability = getVolunteerReliability(member.id);
                  return (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} ({reliability}% reliable)
                    </option>
                  );
                })}
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
                placeholder="Special notes or requirements"
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
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search volunteers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
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

          <div className="text-sm text-gray-500 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            {filteredVolunteers.length} assignments
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'calendar' ? renderCalendarView() : renderListView()}

      {/* Volunteer Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members
            .filter(member => volunteers.some(v => v.memberId === member.id))
            .map(member => {
              const memberVolunteering = volunteers.filter(v => v.memberId === member.id);
              const completed = memberVolunteering.filter(v => v.status === 'completed').length;
              const noShows = memberVolunteering.filter(v => v.status === 'no-show').length;
              const reliability = getVolunteerReliability(member.id);
              const totalHours = memberVolunteering.reduce((sum, v) => sum + (v.hoursServed || 0), 0);
              
              return (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium">
                        {member.firstName[0]}{member.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{member.firstName} {member.lastName}</h4>
                      <p className="text-sm text-gray-500">{member.ministry.join(', ')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assignments:</span>
                      <span className="font-medium">{memberVolunteering.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium text-green-600">{completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">No Shows:</span>
                      <span className="font-medium text-red-600">{noShows}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reliability:</span>
                      <span className={`font-medium ${
                        reliability >= 90 ? 'text-green-600' :
                        reliability >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {reliability}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hours Served:</span>
                      <span className="font-medium text-blue-600">{totalHours}h</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setNewAssignment({
                            ...newAssignment,
                            memberId: member.id,
                            memberName: `${member.firstName} ${member.lastName}`
                          });
                          setShowAddForm(true);
                        }}
                        className="flex-1 bg-purple-600 text-white text-xs py-2 px-3 rounded hover:bg-purple-700 transition-colors"
                      >
                        Schedule
                      </button>
                      <button className="flex-1 bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 transition-colors">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
            .slice(0, 9)}
        </div>
      </div>
    </div>
  );
};

export default VolunteerScheduling;