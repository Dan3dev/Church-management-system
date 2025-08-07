import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Clock, Users, Edit, Trash2 } from 'lucide-react';
import { Event } from '../types';

interface EventsProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent: (id: string, event: Partial<Event>) => void;
  onDeleteEvent: (id: string) => void;
}

const Events: React.FC<EventsProps> = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Service',
    organizer: '',
    expectedAttendance: 0
  });

  const eventTypes = ['Service', 'Meeting', 'Fellowship', 'Outreach', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, newEvent);
      setEditingEvent(null);
    } else {
      onAddEvent(newEvent);
    }
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'Service',
      organizer: '',
      expectedAttendance: 0
    });
    setShowAddForm(false);
  };

  const startEdit = (event: Event) => {
    setNewEvent(event);
    setEditingEvent(event);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setShowAddForm(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'Service',
      organizer: '',
      expectedAttendance: 0
    });
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter(event => new Date(event.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Add/Edit Event Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent md:col-span-2"
                required
              />
              
              <textarea
                placeholder="Event Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent md:col-span-2"
                rows={3}
                required
              />
              
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value as Event['type']})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Organizer"
                value={newEvent.organizer}
                onChange={(e) => setNewEvent({...newEvent, organizer: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              
              <input
                type="number"
                placeholder="Expected Attendance"
                value={newEvent.expectedAttendance}
                onChange={(e) => setNewEvent({...newEvent, expectedAttendance: parseInt(e.target.value)})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingEvent ? 'Update Event' : 'Add Event'}
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

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.type === 'Service' ? 'bg-blue-100 text-blue-700' :
                        event.type === 'Meeting' ? 'bg-gray-100 text-gray-700' :
                        event.type === 'Fellowship' ? 'bg-green-100 text-green-700' :
                        event.type === 'Outreach' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>Expected: {event.expectedAttendance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Organized by: {event.organizer}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(event)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteEvent(event.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No upcoming events scheduled</p>
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Events</h3>
          <div className="space-y-3">
            {pastEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>{event.location}</span>
                        <span>{event.organizer}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  event.type === 'Service' ? 'bg-blue-100 text-blue-700' :
                  event.type === 'Meeting' ? 'bg-gray-100 text-gray-700' :
                  event.type === 'Fellowship' ? 'bg-green-100 text-green-700' :
                  event.type === 'Outreach' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;