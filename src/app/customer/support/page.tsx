// src/app/customer/support/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type SupportTicket = {
  _id: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'TECHNICAL' | 'BILLING' | 'BOOKING' | 'GENERAL';
  createdAt: string;
  updatedAt: string;
  response?: string;
  responseDate?: string;
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export default function CustomerSupport() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'GENERAL' as 'TECHNICAL' | 'BILLING' | 'BOOKING' | 'GENERAL',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'TECHNICAL' | 'BILLING' | 'BOOKING' | 'GENERAL'>('all');

  useEffect(() => {
    loadTickets();
    loadFAQs();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get customer's support tickets
      const sampleTickets: SupportTicket[] = [
        {
          _id: '1',
          subject: 'Booking cancellation issue',
          description: 'I need to cancel my booking but the option is not available in the app.',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          category: 'BOOKING',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-16T14:00:00Z',
          response: 'We have escalated your request to our booking team. You should receive an update within 24 hours.',
          responseDate: '2024-01-16T14:00:00Z',
        },
        {
          _id: '2',
          subject: 'Payment not processed',
          description: 'My payment was deducted but the booking was not confirmed.',
          status: 'RESOLVED',
          priority: 'URGENT',
          category: 'BILLING',
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-12T16:00:00Z',
          response: 'We have processed your refund and your booking has been confirmed. Thank you for your patience.',
          responseDate: '2024-01-12T16:00:00Z',
        },
        {
          _id: '3',
          subject: 'App not loading',
          description: 'The app keeps crashing when I try to browse vehicles.',
          status: 'OPEN',
          priority: 'MEDIUM',
          category: 'TECHNICAL',
          createdAt: '2024-01-18T15:00:00Z',
          updatedAt: '2024-01-18T15:00:00Z',
        },
      ];
      setTickets(sampleTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFAQs = async () => {
    try {
      // This would be a real API call to get FAQs
      const sampleFAQs: FAQ[] = [
        {
          id: '1',
          question: 'How do I cancel my booking?',
          answer: 'You can cancel your booking up to 2 hours before the scheduled pickup time. Go to My Bookings > Select your booking > Click Cancel Booking.',
          category: 'BOOKING',
        },
        {
          id: '2',
          question: 'What payment methods do you accept?',
          answer: 'We accept UPI, Credit/Debit cards, Net Banking, and digital wallets like Paytm, PhonePe, and Google Pay.',
          category: 'BILLING',
        },
        {
          id: '3',
          question: 'How do I track my delivery?',
          answer: 'You can track your delivery in real-time through the app. Go to My Bookings > Select your booking > View Live Tracking.',
          category: 'BOOKING',
        },
        {
          id: '4',
          question: 'What if the vehicle breaks down?',
          answer: 'In case of breakdown, contact our 24/7 support immediately. We will arrange a replacement vehicle or provide roadside assistance.',
          category: 'GENERAL',
        },
        {
          id: '5',
          question: 'How do I update my profile?',
          answer: 'Go to Profile > Edit Profile > Update your information > Save Changes. Make sure to verify your phone number and email.',
          category: 'GENERAL',
        },
        {
          id: '6',
          question: 'What documents do I need?',
          answer: 'You need a valid driving license and a government-issued ID proof. For some vehicles, additional documents may be required.',
          category: 'BOOKING',
        },
      ];
      setFaqs(sampleFAQs);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    }
  };

  const handleSubmitTicket = async () => {
    try {
      setSubmitting(true);
      
      // Validate required fields
      if (!newTicket.subject || !newTicket.description) {
        alert('Please fill in all required fields');
        return;
      }

      // This would be a real API call to create a support ticket
      // await fetch('/api/support/tickets', { method: 'POST', body: JSON.stringify(newTicket) });
      
      const newTicketData: SupportTicket = {
        _id: (tickets.length + 1).toString(),
        subject: newTicket.subject,
        description: newTicket.description,
        status: 'OPEN',
        priority: newTicket.priority,
        category: newTicket.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTickets(prev => [newTicketData, ...prev]);
      setShowNewTicket(false);
      
      // Reset form
      setNewTicket({
        subject: '',
        description: '',
        category: 'GENERAL',
        priority: 'MEDIUM',
      });
      
      alert('Support ticket created successfully! We will get back to you within 24 hours.');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create support ticket. Please try again.');
    } finally {
      setSubmitting(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'TECHNICAL': return '🔧';
      case 'BILLING': return '💳';
      case 'BOOKING': return '📋';
      case 'GENERAL': return '❓';
      default: return '❓';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (selectedCategory === 'all') return true;
    return ticket.category === selectedCategory;
  });

  const filteredFAQs = faqs.filter(faq => {
    if (selectedCategory === 'all') return true;
    return faq.category === selectedCategory;
  });

  if (loading) {
    return (
      <ProtectedRoute requiredRole="CUSTOMER">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
                <p className="text-gray-600">Get help with your bookings and account</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/customer/dashboard"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Dashboard
                </Link>
                <button
                  onClick={() => setShowNewTicket(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  New Ticket
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Quick Help */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Help</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">📞</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Call Support</p>
                      <p className="text-xs text-gray-500">+91 98765 43210</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">💬</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Live Chat</p>
                      <p className="text-xs text-gray-500">Available 24/7</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">📧</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Support</p>
                      <p className="text-xs text-gray-500">support@rentkar.com</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">⏰</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Response Time</p>
                      <p className="text-xs text-gray-500">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Browse by Category</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    selectedCategory === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory('TECHNICAL')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    selectedCategory === 'TECHNICAL' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  🔧 Technical
                </button>
                <button
                  onClick={() => setSelectedCategory('BILLING')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    selectedCategory === 'BILLING' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  💳 Billing
                </button>
                <button
                  onClick={() => setSelectedCategory('BOOKING')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    selectedCategory === 'BOOKING' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  📋 Booking
                </button>
                <button
                  onClick={() => setSelectedCategory('GENERAL')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    selectedCategory === 'GENERAL' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  ❓ General
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* FAQ Section */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
                </div>
                <div className="px-6 py-4">
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try selecting a different category.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredFAQs.map((faq) => (
                        <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">{faq.question}</h4>
                          <p className="text-sm text-gray-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Support Tickets */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">My Support Tickets</h3>
                </div>
                <div className="px-6 py-4">
                  {filteredTickets.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
                      <p className="mt-1 text-sm text-gray-500">Create a new support ticket to get help.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTickets.map((ticket) => (
                        <div key={ticket._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getCategoryIcon(ticket.category)}</span>
                              <h4 className="text-sm font-medium text-gray-900">{ticket.subject}</h4>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Created: {formatDate(ticket.createdAt)}</span>
                            <span>Updated: {formatDate(ticket.updatedAt)}</span>
                          </div>
                          {ticket.response && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <h5 className="text-sm font-medium text-blue-900 mb-1">Response:</h5>
                              <p className="text-sm text-blue-800">{ticket.response}</p>
                              <p className="text-xs text-blue-600 mt-1">
                                Responded: {ticket.responseDate ? formatDate(ticket.responseDate) : 'N/A'}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* New Ticket Modal */}
        {showNewTicket && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create Support Ticket</h3>
                  <button
                    onClick={() => setShowNewTicket(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="GENERAL">General</option>
                      <option value="TECHNICAL">Technical</option>
                      <option value="BILLING">Billing</option>
                      <option value="BOOKING">Booking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority *
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      placeholder="Please provide detailed information about your issue..."
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowNewTicket(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitTicket}
                    disabled={submitting}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Ticket'}
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
