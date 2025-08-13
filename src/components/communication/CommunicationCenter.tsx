import React, { useState } from 'react';
import { Mail, MessageSquare, Bell, Send, Users, Filter, Calendar } from 'lucide-react';
import { Communication, Member } from '../../types';

interface CommunicationCenterProps {
  communications: Communication[];
  members: Member[];
  onSendCommunication: (communication: Omit<Communication, 'id'>) => void;
}

const CommunicationCenter: React.FC<CommunicationCenterProps> = ({
  communications,
  members,
  onSendCommunication
}) => {
  const [activeTab, setActiveTab] = useState('compose');
  const [showComposeForm, setShowComposeForm] = useState(false);

  const [newCommunication, setNewCommunication] = useState<Omit<Communication, 'id'>>({
    type: 'email',
    title: '',
    content: '',
    recipients: [],
    recipientGroups: [],
    sender: 'Admin',
    sentDate: '',
    status: 'draft',
    campus: 'Main Campus',
    priority: 'medium',
    readReceipts: {}
  });

  const communicationTypes = [
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'push', label: 'Push Notification', icon: Bell },
    { id: 'announcement', label: 'Announcement', icon: Users }
  ];

  const recipientGroups = [
    'All Members',
    'Active Members',
    'Leaders',
    'Volunteers',
    'Small Group Leaders',
    'Youth',
    'Children Ministry',
    'New Members',
    'Visitors'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendCommunication({
      ...newCommunication,
      sentDate: new Date().toISOString(),
      status: newCommunication.scheduledDate ? 'scheduled' : 'sent'
    });
    setNewCommunication({
      type: 'email',
      title: '',
      content: '',
      recipients: [],
      recipientGroups: [],
      sender: 'Admin',
      sentDate: '',
      status: 'draft',
      campus: 'Main Campus',
      priority: 'medium',
      readReceipts: {}
    });
    setShowComposeForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const recentCommunications = communications
    .sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Communication Center</h2>
        <button
          onClick={() => setShowComposeForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Send className="h-4 w-4" />
          <span>Compose Message</span>
        </button>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {communicationTypes.map((type) => {
          const Icon = type.icon;
          const count = communications.filter(c => c.type === type.id).length;
          return (
            <div key={type.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-500">{type.label} Sent</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compose Form */}
      {showComposeForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose New Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newCommunication.type}
                onChange={(e) => setNewCommunication({...newCommunication, type: e.target.value as Communication['type']})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {communicationTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>

              <select
                value={newCommunication.priority}
                onChange={(e) => setNewCommunication({...newCommunication, priority: e.target.value as Communication['priority']})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Message Title"
              value={newCommunication.title}
              onChange={(e) => setNewCommunication({...newCommunication, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            <textarea
              placeholder="Message Content"
              value={newCommunication.content}
              onChange={(e) => setNewCommunication({...newCommunication, content: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {recipientGroups.map(group => (
                    <label key={group} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCommunication.recipientGroups.includes(group)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCommunication({
                              ...newCommunication,
                              recipientGroups: [...newCommunication.recipientGroups, group]
                            });
                          } else {
                            setNewCommunication({
                              ...newCommunication,
                              recipientGroups: newCommunication.recipientGroups.filter(g => g !== group)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{group}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Send (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={newCommunication.scheduledDate || ''}
                  onChange={(e) => setNewCommunication({...newCommunication, scheduledDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {newCommunication.scheduledDate ? 'Schedule Message' : 'Send Now'}
              </button>
              <button
                type="button"
                onClick={() => setShowComposeForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Communications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Communications</h3>
        <div className="space-y-4">
          {recentCommunications.map((comm) => {
            const TypeIcon = communicationTypes.find(t => t.id === comm.type)?.icon || Mail;
            return (
              <div key={comm.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{comm.title}</h4>
                      <p className="text-gray-600 mt-1 line-clamp-2">{comm.content}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>To: {comm.recipientGroups.join(', ')}</span>
                        <span>{new Date(comm.sentDate).toLocaleDateString()}</span>
                        <span>by {comm.sender}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(comm.priority)}`}>
                      {comm.priority.charAt(0).toUpperCase() + comm.priority.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(comm.status)}`}>
                      {comm.status.charAt(0).toUpperCase() + comm.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Messages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Messages</h3>
        <div className="space-y-3">
          {communications
            .filter(c => c.status === 'scheduled')
            .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
            .map((comm) => {
              const TypeIcon = communicationTypes.find(t => t.id === comm.type)?.icon || Mail;
              return (
                <div key={comm.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <TypeIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{comm.title}</p>
                      <p className="text-sm text-gray-500">
                        Scheduled for {new Date(comm.scheduledDate!).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">Pending</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;