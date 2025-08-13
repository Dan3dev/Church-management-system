import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  Send, 
  Users, 
  Filter, 
  Calendar, 
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Download,
  Upload,
  Settings,
  Target,
  BarChart3
} from 'lucide-react';
import { Communication, Member } from '../../types';
import { useApp } from '../../context/AppContext';
import { integrationService } from '../../services/integrationService';

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
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const { t, state } = useApp();

  const [newCommunication, setNewCommunication] = useState<Omit<Communication, 'id'>>({
    type: 'email',
    title: '',
    content: '',
    recipients: [],
    recipientGroups: [],
    sender: 'Admin',
    senderId: 'admin-1',
    sentDate: '',
    status: 'draft',
    campus: 'Main Campus',
    priority: 'medium',
    readReceipts: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const communicationTypes = [
    { id: 'email', label: 'Email', icon: Mail, description: 'Send email messages' },
    { id: 'sms', label: 'SMS', icon: MessageSquare, description: 'Send text messages' },
    { id: 'push', label: 'Push Notification', icon: Bell, description: 'Send push notifications' },
    { id: 'announcement', label: 'Announcement', icon: Users, description: 'Church-wide announcements' },
    { id: 'newsletter', label: 'Newsletter', icon: Mail, description: 'Regular newsletters' },
    { id: 'alert', label: 'Alert', icon: AlertTriangle, description: 'Emergency alerts' }
  ];

  const recipientGroups = [
    { id: 'all-members', label: 'All Members', count: members.length },
    { id: 'active-members', label: 'Active Members', count: members.filter(m => m.membershipStatus === 'Active').length },
    { id: 'leaders', label: 'Leaders', count: members.filter(m => m.role === 'leader' || m.role === 'pastor').length },
    { id: 'volunteers', label: 'Volunteers', count: members.filter(m => m.ministry.length > 0).length },
    { id: 'small-group-leaders', label: 'Small Group Leaders', count: members.filter(m => m.ministry.includes('Small Group')).length },
    { id: 'youth', label: 'Youth (13-25)', count: members.filter(m => {
      const age = Math.floor((new Date().getTime() - new Date(m.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      return age >= 13 && age <= 25;
    }).length },
    { id: 'adults', label: 'Adults (26+)', count: members.filter(m => {
      const age = Math.floor((new Date().getTime() - new Date(m.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      return age >= 26;
    }).length },
    { id: 'new-members', label: 'New Members', count: members.filter(m => {
      const joinDate = new Date(m.joinDate);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return joinDate >= threeMonthsAgo;
    }).length },
    { id: 'visitors', label: 'Visitors', count: members.filter(m => m.membershipStatus === 'Visitor').length }
  ];

  const messageTemplates = [
    {
      id: 'welcome-new-member',
      name: 'Welcome New Member',
      subject: 'Welcome to Our Church Family!',
      content: `Dear [Name],

Welcome to our church family! We're so excited to have you join us on this journey of faith.

Here are some next steps to help you get connected:
• Attend our New Member Orientation
• Join a Small Group
• Explore our ministries and volunteer opportunities
• Connect with our pastoral team

We're here to support you every step of the way. Please don't hesitate to reach out if you have any questions.

Blessings,
[Church Name] Team`
    },
    {
      id: 'event-reminder',
      name: 'Event Reminder',
      subject: 'Reminder: [Event Name]',
      content: `Dear [Name],

This is a friendly reminder about our upcoming event:

Event: [Event Name]
Date: [Date]
Time: [Time]
Location: [Location]

We're looking forward to seeing you there! If you have any questions, please contact us.

Blessings,
[Church Name] Team`
    },
    {
      id: 'volunteer-appreciation',
      name: 'Volunteer Appreciation',
      subject: 'Thank You for Your Service!',
      content: `Dear [Name],

Thank you so much for your faithful service in [Ministry]. Your dedication and heart for serving others is truly appreciated.

Your contributions make a real difference in our church community and in the lives of those we serve together.

We're grateful for volunteers like you who make our ministry possible.

With appreciation,
[Church Name] Leadership`
    },
    {
      id: 'birthday-wishes',
      name: 'Birthday Wishes',
      subject: 'Happy Birthday!',
      content: `Dear [Name],

Happy Birthday! 🎉

On this special day, we want you to know how grateful we are to have you as part of our church family. May God bless you abundantly in the year ahead.

We hope your day is filled with joy, love, and wonderful memories.

Birthday Blessings,
[Church Name] Family`
    }
  ];

  const tabs = [
    { id: 'compose', label: 'Compose', icon: Send },
    { id: 'sent', label: 'Sent Messages', icon: CheckCircle },
    { id: 'scheduled', label: 'Scheduled', icon: Clock },
    { id: 'templates', label: 'Templates', icon: Upload },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Calculate recipient count
      let recipientCount = 0;
      newCommunication.recipientGroups.forEach(groupId => {
        const group = recipientGroups.find(g => g.id === groupId);
        if (group) recipientCount += group.count;
      });

      const communication = {
        ...newCommunication,
        sentDate: newCommunication.scheduledDate || new Date().toISOString(),
        status: newCommunication.scheduledDate ? 'scheduled' : 'sent' as Communication['status'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSendCommunication(communication);

      // Send to connected integrations
      if (state.integrations.slack.connected) {
        await integrationService.sendNotification(
          newCommunication.content,
          newCommunication.title,
          'info'
        );
      }

      // Add success notification
      state.dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          userId: 'admin',
          type: 'success',
          title: 'Message Sent',
          message: `${newCommunication.title} sent to ${recipientCount} recipients`,
          read: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
          category: 'communication'
        }
      });

      resetForm();
    } catch (error) {
      state.dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          userId: 'admin',
          type: 'error',
          title: 'Send Failed',
          message: 'Failed to send message. Please try again.',
          read: false,
          createdAt: new Date().toISOString(),
          priority: 'high',
          category: 'communication'
        }
      });
    }
  };

  const resetForm = () => {
    setNewCommunication({
      type: 'email',
      title: '',
      content: '',
      recipients: [],
      recipientGroups: [],
      sender: 'Admin',
      senderId: 'admin-1',
      sentDate: '',
      status: 'draft',
      campus: 'Main Campus',
      priority: 'medium',
      readReceipts: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setShowComposeForm(false);
  };

  const applyTemplate = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setNewCommunication({
        ...newCommunication,
        title: template.subject,
        content: template.content,
        template: templateId
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-yellow-600 bg-yellow-100';
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

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || comm.status === filterStatus;
    const matchesType = filterType === 'All' || comm.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const recentCommunications = communications
    .sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime())
    .slice(0, 10);

  const scheduledMessages = communications.filter(c => c.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());

  const communicationStats = {
    total: communications.length,
    sent: communications.filter(c => c.status === 'sent').length,
    scheduled: communications.filter(c => c.status === 'scheduled').length,
    failed: communications.filter(c => c.status === 'failed').length,
    openRate: communications.length > 0 ? Math.round((communications.filter(c => c.openRate && c.openRate > 0).length / communications.length) * 100) : 0,
    clickRate: communications.length > 0 ? Math.round((communications.filter(c => c.clickRate && c.clickRate > 0).length / communications.length) * 100) : 0
  };

  const renderComposeTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Compose Message</h3>
        <button
          onClick={() => setShowComposeForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Message</span>
        </button>
      </div>

      {/* Message Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {communicationTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => {
                setNewCommunication({...newCommunication, type: type.id as Communication['type']});
                setShowComposeForm(true);
              }}
              className="flex flex-col items-center space-y-3 p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
            >
              <div className="p-3 bg-blue-100 rounded-full">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">{type.label}</p>
                <p className="text-xs text-gray-500">{type.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messageTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => {
                   applyTemplate(template.id);
                   setShowComposeForm(true);
                 }}>
              <h5 className="font-semibold text-gray-900 mb-2">{template.name}</h5>
              <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-blue-600">Use Template</span>
                <Send className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compose Form */}
      {showComposeForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose New Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newCommunication.type}
                onChange={(e) => setNewCommunication({...newCommunication, type: e.target.value as Communication['type']})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {communicationTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>

              <select
                value={newCommunication.priority}
                onChange={(e) => setNewCommunication({...newCommunication, priority: e.target.value as Communication['priority']})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Message Title/Subject"
              value={newCommunication.title}
              onChange={(e) => setNewCommunication({...newCommunication, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    if (e.target.value) applyTemplate(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Template (Optional)</option>
                  {messageTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Send (Optional)</label>
                <input
                  type="datetime-local"
                  value={newCommunication.scheduledDate || ''}
                  onChange={(e) => setNewCommunication({...newCommunication, scheduledDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <textarea
              placeholder="Message Content"
              value={newCommunication.content}
              onChange={(e) => setNewCommunication({...newCommunication, content: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={8}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Recipients</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recipientGroups.map(group => (
                  <label key={group.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCommunication.recipientGroups.includes(group.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewCommunication({
                            ...newCommunication,
                            recipientGroups: [...newCommunication.recipientGroups, group.id]
                          });
                        } else {
                          setNewCommunication({
                            ...newCommunication,
                            recipientGroups: newCommunication.recipientGroups.filter(g => g !== group.id)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">{group.label}</span>
                      <p className="text-xs text-gray-500">{group.count} members</p>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Total Recipients:</strong> {
                    newCommunication.recipientGroups.reduce((sum, groupId) => {
                      const group = recipientGroups.find(g => g.id === groupId);
                      return sum + (group?.count || 0);
                    }, 0)
                  } members
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {newCommunication.scheduledDate ? 'Schedule Message' : 'Send Now'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewCommunication({...newCommunication, status: 'draft'});
                  // Save as draft logic here
                }}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Save Draft
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  const renderSentTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Sent Messages</h3>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Types</option>
            {communicationTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCommunications.filter(c => c.status === 'sent').map((comm) => {
          const TypeIcon = communicationTypes.find(t => t.id === comm.type)?.icon || Mail;
          const openRate = comm.openRate || Math.random() * 100;
          const clickRate = comm.clickRate || Math.random() * 50;
          
          return (
            <div key={comm.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <TypeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{comm.title}</h4>
                    <p className="text-gray-600 mb-3 line-clamp-2">{comm.content}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>To: {comm.recipientGroups.join(', ')}</span>
                      <span>{new Date(comm.sentDate).toLocaleDateString()}</span>
                      <span>by {comm.sender}</span>
                      <span className="capitalize">{comm.type}</span>
                    </div>
                    
                    {/* Analytics */}
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="font-semibold text-green-600">{Math.round(openRate)}%</p>
                        <p className="text-xs text-gray-500">Open Rate</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="font-semibold text-blue-600">{Math.round(clickRate)}%</p>
                        <p className="text-xs text-gray-500">Click Rate</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <p className="font-semibold text-purple-600">{comm.deliveryRate || 98}%</p>
                        <p className="text-xs text-gray-500">Delivered</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-xs rounded-full ${getPriorityColor(comm.priority)}`}>
                    {comm.priority}
                  </span>
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(comm.status)}`}>
                    {comm.status}
                  </span>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderScheduledTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Scheduled Messages</h3>
      <div className="space-y-4">
        {scheduledMessages.map((comm) => {
          const TypeIcon = communicationTypes.find(t => t.id === comm.type)?.icon || Mail;
          const timeUntilSend = comm.scheduledDate ? 
            Math.ceil((new Date(comm.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60)) : 0;
          
          return (
            <div key={comm.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <TypeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{comm.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">To: {comm.recipientGroups.join(', ')}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Scheduled for {new Date(comm.scheduledDate!).toLocaleString()}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        timeUntilSend <= 1 ? 'bg-red-100 text-red-700' :
                        timeUntilSend <= 24 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {timeUntilSend > 0 ? `${timeUntilSend}h remaining` : 'Sending soon'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      // Cancel scheduled message
                      const updatedComm = communications.find(c => c.id === comm.id);
                      if (updatedComm) {
                        // Update status to cancelled
                        console.log('Cancelling scheduled message:', comm.id);
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Communication Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{communicationStats.total}</p>
            <p className="text-sm text-gray-500">Total Messages</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{communicationStats.sent}</p>
            <p className="text-sm text-gray-500">Successfully Sent</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{communicationStats.scheduled}</p>
            <p className="text-sm text-gray-500">Scheduled</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{communicationStats.openRate}%</p>
            <p className="text-sm text-gray-500">Avg Open Rate</p>
          </div>
        </div>
      </div>

      {/* Communication Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance by Type</h4>
        <div className="space-y-4">
          {communicationTypes.map(type => {
            const typeComms = communications.filter(c => c.type === type.id);
            const avgOpenRate = typeComms.length > 0 ? 
              typeComms.reduce((sum, c) => sum + (c.openRate || 0), 0) / typeComms.length : 0;
            
            return (
              <div key={type.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <type.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{type.label}</p>
                    <p className="text-sm text-gray-500">{typeComms.length} messages sent</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{Math.round(avgOpenRate)}%</p>
                  <p className="text-xs text-gray-500">Avg Open Rate</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('communication')}</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {communicationStats.total} messages • {communicationStats.openRate}% avg open rate
          </div>
          <button
            onClick={() => setShowComposeForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Compose</span>
          </button>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Sent</p>
              <p className="text-3xl font-bold">{communicationStats.sent}</p>
            </div>
            <Send className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Open Rate</p>
              <p className="text-3xl font-bold">{communicationStats.openRate}%</p>
            </div>
            <Eye className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Click Rate</p>
              <p className="text-3xl font-bold">{communicationStats.clickRate}%</p>
            </div>
            <Target className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Scheduled</p>
              <p className="text-3xl font-bold">{communicationStats.scheduled}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Failed</p>
              <p className="text-3xl font-bold">{communicationStats.failed}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Templates</p>
              <p className="text-3xl font-bold">{messageTemplates.length}</p>
            </div>
            <Upload className="h-8 w-8 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'compose' && renderComposeTab()}
          {activeTab === 'sent' && renderSentTab()}
          {activeTab === 'scheduled' && renderScheduledTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;