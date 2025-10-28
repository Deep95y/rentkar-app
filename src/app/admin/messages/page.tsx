// src/app/admin/messages/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Message = {
  _id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'admin_to_user' | 'user_to_admin' | 'system';
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'PARTNER';
  status: 'active' | 'inactive' | 'suspended';
};

export default function AdminMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'sent' | 'received'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    toUserId: '',
    subject: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
    loadUsers();
    
    // Check for URL parameters to pre-fill compose form
    const urlParams = new URLSearchParams(window.location.search);
    const compose = urlParams.get('compose');
    const toUserId = urlParams.get('to');
    
    if (compose === 'true' && toUserId) {
      setNewMessage(prev => ({ ...prev, toUserId }));
      setShowComposeModal(true);
    }
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get messages
      const sampleMessages: Message[] = [
        {
          _id: '1',
          fromUserId: 'admin1',
          toUserId: 'user1',
          fromUserName: 'Admin User',
          toUserName: 'John Doe',
          subject: 'Welcome to Rentkar!',
          content: 'Welcome to Rentkar! We are excited to have you on board. Please feel free to reach out if you have any questions.',
          timestamp: '2024-01-20T10:30:00Z',
          isRead: true,
          priority: 'medium',
          type: 'admin_to_user',
        },
        {
          _id: '2',
          fromUserId: 'user2',
          toUserId: 'admin1',
          fromUserName: 'Mike Johnson',
          toUserName: 'Admin User',
          subject: 'Delivery Issue',
          content: 'Hi, I had an issue with my delivery yesterday. The vehicle was not delivered on time and I missed my appointment.',
          timestamp: '2024-01-20T09:15:00Z',
          isRead: false,
          priority: 'high',
          type: 'user_to_admin',
        },
        {
          _id: '3',
          fromUserId: 'user3',
          toUserId: 'admin1',
          fromUserName: 'Jane Smith',
          toUserName: 'Admin User',
          subject: 'Account Suspension',
          content: 'My account has been suspended and I do not understand why. Can you please help me resolve this issue?',
          timestamp: '2024-01-20T08:45:00Z',
          isRead: false,
          priority: 'urgent',
          type: 'user_to_admin',
        },
        {
          _id: '4',
          fromUserId: 'admin1',
          toUserId: 'user4',
          fromUserName: 'Admin User',
          toUserName: 'Sarah Davis',
          subject: 'Payment Confirmation',
          content: 'Your payment has been processed successfully. Thank you for using Rentkar!',
          timestamp: '2024-01-20T07:20:00Z',
          isRead: true,
          priority: 'low',
          type: 'admin_to_user',
        },
        {
          _id: '5',
          fromUserId: 'system',
          toUserId: 'admin1',
          fromUserName: 'System',
          toUserName: 'Admin User',
          subject: 'System Maintenance',
          content: 'Scheduled system maintenance will occur tonight from 2 AM to 4 AM. Some features may be temporarily unavailable.',
          timestamp: '2024-01-20T06:00:00Z',
          isRead: true,
          priority: 'medium',
          type: 'system',
        },
      ];
      setMessages(sampleMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // This would be a real API call to get users
      const sampleUsers: User[] = [
        { _id: 'user1', name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER', status: 'active' },
        { _id: 'user2', name: 'Mike Johnson', email: 'mike@example.com', role: 'PARTNER', status: 'active' },
        { _id: 'user3', name: 'Jane Smith', email: 'jane@example.com', role: 'CUSTOMER', status: 'suspended' },
        { _id: 'user4', name: 'Sarah Davis', email: 'sarah@example.com', role: 'PARTNER', status: 'active' },
        { _id: 'user5', name: 'Admin User', email: 'admin@rentkar.com', role: 'ADMIN', status: 'active' },
      ];
      setUsers(sampleUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      setSending(true);
      
      // Validate required fields
      if (!newMessage.toUserId || !newMessage.subject || !newMessage.content) {
        alert('Please fill in all required fields');
        return;
      }

      // This would be a real API call to send message
      const messageId = (messages.length + 1).toString();
      const selectedUser = users.find(u => u._id === newMessage.toUserId);
      const newMessageData: Message = {
        _id: messageId,
        fromUserId: user?._id?.toString() || 'admin1',
        toUserId: newMessage.toUserId,
        fromUserName: user?.profile.name || 'Admin User',
        toUserName: selectedUser?.name || 'Unknown User',
        subject: newMessage.subject,
        content: newMessage.content,
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: newMessage.priority,
        type: 'admin_to_user',
      };

      setMessages(prev => [newMessageData, ...prev]);
      
      // Reset form
      setNewMessage({
        toUserId: '',
        subject: '',
        content: '',
        priority: 'medium',
      });
      
      setShowComposeModal(false);
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      setMessages(prev => prev.map(msg => 
        msg._id === messageId 
          ? { ...msg, isRead: true }
          : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      if (confirm('Are you sure you want to delete this message?')) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
        alert('Message deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'admin_to_user': return '📤';
      case 'user_to_admin': return '📥';
      case 'system': return '🤖';
      default: return '📄';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !message.isRead) ||
      (filter === 'sent' && message.type === 'admin_to_user') ||
      (filter === 'received' && message.type === 'user_to_admin');
    
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
    
    const matchesSearch = searchTerm === '' || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.fromUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.toUserName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesPriority && matchesSearch;
  });

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Message Center</h1>
                <p className="text-gray-600">Communicate with users and manage messages</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Dashboard
                </Link>
                <button
                  onClick={() => setShowComposeModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Compose Message
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Filters and Search */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Filters & Search</h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message Filter</label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="all">All Messages</option>
                      <option value="unread">Unread</option>
                      <option value="sent">Sent</option>
                      <option value="received">Received</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority Filter</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value as any)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="all">All Priorities</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      placeholder="Search by subject, content, or user..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Messages ({filteredMessages.length})
                </h3>
              </div>
              <div className="px-6 py-4">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages.map((message) => (
                      <div key={message._id} className={`border rounded-lg p-4 ${!message.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getTypeIcon(message.type)}</span>
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{message.subject}</h4>
                              <p className="text-sm text-gray-500">
                                {message.type === 'admin_to_user' ? 'To' : 'From'}: {message.type === 'admin_to_user' ? message.toUserName : message.fromUserName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(message.priority)}`}>
                              {message.priority.toUpperCase()}
                            </span>
                            {!message.isRead && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                NEW
                              </span>
                            )}
                            <span className="text-sm text-gray-500">{formatDate(message.timestamp)}</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-700 line-clamp-2">{message.content}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedMessage(message);
                                setShowModal(true);
                                if (!message.isRead) {
                                  markAsRead(message._id);
                                }
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => deleteMessage(message._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Delete
                            </button>
                            {!message.isRead && (
                              <button
                                onClick={() => markAsRead(message._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Mark as Read
                              </button>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {message.type === 'admin_to_user' ? 'Sent' : 'Received'} • {formatDate(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Message Details Modal */}
        {showModal && selectedMessage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Message Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Subject</p>
                    <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {selectedMessage.type === 'admin_to_user' ? 'To' : 'From'}
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedMessage.type === 'admin_to_user' ? selectedMessage.toUserName : selectedMessage.fromUserName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Priority</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Timestamp</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedMessage.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Content</p>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.content}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setShowComposeModal(true);
                      setNewMessage(prev => ({
                        ...prev,
                        toUserId: selectedMessage.type === 'admin_to_user' ? selectedMessage.toUserId : selectedMessage.fromUserId,
                        subject: selectedMessage.type === 'admin_to_user' ? `Re: ${selectedMessage.subject}` : `Re: ${selectedMessage.subject}`,
                      }));
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compose Message Modal */}
        {showComposeModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Compose Message</h3>
                  <button
                    onClick={() => setShowComposeModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To *
                    </label>
                    <select
                      value={newMessage.toUserId}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, toUserId: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="">Select a user</option>
                      {users.filter(u => u._id !== user?._id?.toString()).map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email}) - {user.role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      placeholder="Enter message subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newMessage.priority}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message Content *
                    </label>
                    <textarea
                      value={newMessage.content}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      placeholder="Enter your message here..."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowComposeModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={sending}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
