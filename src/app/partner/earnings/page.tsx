// src/app/partner/earnings/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Earning = {
  _id: string;
  deliveryId: string;
  customerName: string;
  productName: string;
  amount: number;
  commission: number;
  status: 'PENDING' | 'PROCESSED' | 'PAID';
  date: string;
  paymentMethod?: string;
};

type EarningsSummary = {
  totalEarnings: number;
  pendingEarnings: number;
  processedEarnings: number;
  paidEarnings: number;
  thisMonth: number;
  lastMonth: number;
  averagePerDelivery: number;
};

export default function PartnerEarnings() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [summary, setSummary] = useState<EarningsSummary>({
    totalEarnings: 0,
    pendingEarnings: 0,
    processedEarnings: 0,
    paidEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    averagePerDelivery: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processed' | 'paid'>('all');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutRequest, setPayoutRequest] = useState({
    amount: 0,
    paymentMethod: 'UPI',
    upiId: '',
    bankAccount: '',
    ifscCode: '',
    accountHolderName: '',
  });
  const [requesting, setRequesting] = useState(false);
  const [payoutHistory, setPayoutHistory] = useState([
    {
      id: '1',
      amount: 1000,
      status: 'PROCESSED',
      requestDate: '2024-01-10T10:00:00Z',
      processDate: '2024-01-12T14:00:00Z',
      paymentMethod: 'UPI',
      transactionId: 'TXN123456789'
    },
    {
      id: '2',
      amount: 750,
      status: 'PENDING',
      requestDate: '2024-01-15T09:00:00Z',
      processDate: null,
      paymentMethod: 'BANK',
      transactionId: null
    }
  ]);

  useEffect(() => {
    loadEarnings();
    loadSummary();
  }, []);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get partner's earnings
      // For now, we'll simulate with sample data
      const sampleEarnings: Earning[] = [
        {
          _id: '1',
          deliveryId: 'DEL001',
          customerName: 'John Doe',
          productName: 'Basic Scooter',
          amount: 500,
          commission: 50,
          status: 'PAID',
          date: '2024-01-15T10:00:00Z',
          paymentMethod: 'UPI',
        },
        {
          _id: '2',
          deliveryId: 'DEL002',
          customerName: 'Jane Smith',
          productName: 'Premium Scooter',
          amount: 750,
          commission: 75,
          status: 'PROCESSED',
          date: '2024-01-16T14:00:00Z',
        },
        {
          _id: '3',
          deliveryId: 'DEL003',
          customerName: 'Mike Johnson',
          productName: 'Basic Scooter',
          amount: 500,
          commission: 50,
          status: 'PENDING',
          date: '2024-01-17T09:00:00Z',
        },
        {
          _id: '4',
          deliveryId: 'DEL004',
          customerName: 'Sarah Wilson',
          productName: 'Premium Scooter',
          amount: 750,
          commission: 75,
          status: 'PAID',
          date: '2024-01-18T16:00:00Z',
          paymentMethod: 'Bank Transfer',
        },
      ];
      setEarnings(sampleEarnings);
    } catch (error) {
      console.error('Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      // This would be a real API call to get earnings summary
      // For now, we'll simulate with calculated values
      const totalEarnings = 2500;
      const pendingEarnings = 500;
      const processedEarnings = 750;
      const paidEarnings = 1250;
      
      setSummary({
        totalEarnings,
        pendingEarnings,
        processedEarnings,
        paidEarnings,
        thisMonth: 2000,
        lastMonth: 1500,
        averagePerDelivery: 625,
      });
    } catch (error) {
      console.error('Error loading summary:', error);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSED': return 'bg-blue-100 text-blue-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'PROCESSED': return '🔄';
      case 'PAID': return '✅';
      default: return '❓';
    }
  };

  const handlePayoutRequest = () => {
    // Set default amount to available earnings
    setPayoutRequest(prev => ({
      ...prev,
      amount: summary.processedEarnings + summary.pendingEarnings
    }));
    setShowPayoutModal(true);
  };

  const handlePayoutSubmit = async () => {
    try {
      setRequesting(true);
      
      // Validate required fields
      if (payoutRequest.amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      if (payoutRequest.amount < 500) {
        alert('Minimum payout amount is ₹500');
        return;
      }

      if (payoutRequest.amount > (summary.processedEarnings + summary.pendingEarnings)) {
        alert('Amount cannot exceed available earnings');
        return;
      }

      if (payoutRequest.paymentMethod === 'UPI' && !payoutRequest.upiId) {
        alert('Please enter UPI ID');
        return;
      }

      if (payoutRequest.paymentMethod === 'BANK' && (!payoutRequest.bankAccount || !payoutRequest.ifscCode || !payoutRequest.accountHolderName)) {
        alert('Please fill all bank account details');
        return;
      }

      // This would be a real API call to submit payout request
      // await fetch('/api/partners/payout-request', { method: 'POST', body: JSON.stringify(payoutRequest) });
      
      alert('Payout request submitted successfully! You will receive payment within 2-3 business days.');
      setShowPayoutModal(false);
      
      // Reset form
      setPayoutRequest({
        amount: 0,
        paymentMethod: 'UPI',
        upiId: '',
        bankAccount: '',
        ifscCode: '',
        accountHolderName: '',
      });
    } catch (error) {
      console.error('Error submitting payout request:', error);
      alert('Failed to submit payout request. Please try again.');
    } finally {
      setRequesting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setPayoutRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredEarnings = earnings.filter(earning => {
    if (filter === 'all') return true;
    return earning.status.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <ProtectedRoute requiredRole="PARTNER">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="PARTNER">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Earnings</h1>
                <p className="text-gray-600">Track your delivery earnings and payments</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/partner/dashboard"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Dashboard
                </Link>
                <button 
                  onClick={handlePayoutRequest}
                  disabled={summary.processedEarnings + summary.pendingEarnings < 500}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Request Payout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Earnings Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">💰</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatCurrency(summary.totalEarnings)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">⏳</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatCurrency(summary.pendingEarnings)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">🔄</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Processed</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatCurrency(summary.processedEarnings)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Paid</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatCurrency(summary.paidEarnings)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">This Month</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.thisMonth)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Last Month</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.lastMonth)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📈</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg per Delivery</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.averagePerDelivery)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Earnings History</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        filter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('pending')}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setFilter('processed')}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        filter === 'processed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      Processed
                    </button>
                    <button
                      onClick={() => setFilter('paid')}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        filter === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      Paid
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                {filteredEarnings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No earnings found</h3>
                    <p className="mt-1 text-sm text-gray-500">Your earnings will appear here after completing deliveries.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEarnings.map((earning) => (
                      <div key={earning._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getStatusIcon(earning.status)}</span>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{earning.productName}</h4>
                              <p className="text-sm text-gray-500">Customer: {earning.customerName}</p>
                              <p className="text-sm text-gray-500">Delivery ID: {earning.deliveryId}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(earning.amount)}</p>
                            <p className="text-sm text-gray-500">Commission: {formatCurrency(earning.commission)}</p>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(earning.status)}`}>
                              {earning.status}
                            </span>
                            <p className="text-sm text-gray-500">{formatDate(earning.date)}</p>
                            {earning.paymentMethod && (
                              <p className="text-xs text-gray-500">{earning.paymentMethod}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <p className="text-sm text-gray-900">UPI / Bank Transfer</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Schedule</p>
                    <p className="text-sm text-gray-900">Weekly (Every Friday)</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Minimum Payout</p>
                    <p className="text-sm text-gray-900">₹500</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Next Payout</p>
                    <p className="text-sm text-gray-900">Friday, Jan 26, 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout History */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Payout History</h3>
              </div>
              <div className="px-6 py-4">
                {payoutHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No payout requests yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Your payout requests will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payoutHistory.map((payout) => (
                      <div key={payout.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">
                              {payout.status === 'PROCESSED' ? '✅' : 
                               payout.status === 'PENDING' ? '⏳' : '❌'}
                            </span>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                Payout Request #{payout.id}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Requested: {formatDate(payout.requestDate)}
                              </p>
                              {payout.processDate && (
                                <p className="text-sm text-gray-500">
                                  Processed: {formatDate(payout.processDate)}
                                </p>
                              )}
                              <p className="text-sm text-gray-500">
                                Method: {payout.paymentMethod}
                              </p>
                              {payout.transactionId && (
                                <p className="text-sm text-gray-500">
                                  Transaction ID: {payout.transactionId}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(payout.amount)}</p>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payout.status === 'PROCESSED' ? 'bg-green-100 text-green-800' :
                              payout.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payout.status}
                            </span>
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

        {/* Payout Request Modal */}
        {showPayoutModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Request Payout</h3>
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Available Earnings Info */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Available for Payout</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Processed Earnings:</span>
                        <span className="ml-2 font-medium text-blue-900">{formatCurrency(summary.processedEarnings)}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Pending Earnings:</span>
                        <span className="ml-2 font-medium text-blue-900">{formatCurrency(summary.pendingEarnings)}</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <span className="text-sm font-medium text-blue-900">Total Available:</span>
                      <span className="ml-2 text-lg font-bold text-blue-900">
                        {formatCurrency(summary.processedEarnings + summary.pendingEarnings)}
                      </span>
                    </div>
                  </div>

                  {/* Payout Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payout Amount (₹) *
                    </label>
                    <input
                      type="number"
                      min="500"
                      max={summary.processedEarnings + summary.pendingEarnings}
                      value={payoutRequest.amount}
                      onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      placeholder="Enter payout amount"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum: ₹500 | Maximum: {formatCurrency(summary.processedEarnings + summary.pendingEarnings)}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method *
                    </label>
                    <select
                      value={payoutRequest.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="UPI">UPI</option>
                      <option value="BANK">Bank Transfer</option>
                    </select>
                  </div>

                  {/* UPI Details */}
                  {payoutRequest.paymentMethod === 'UPI' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID *
                      </label>
                      <input
                        type="text"
                        value={payoutRequest.upiId}
                        onChange={(e) => handleInputChange('upiId', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter your UPI ID (e.g., 1234567890@paytm)"
                      />
                    </div>
                  )}

                  {/* Bank Account Details */}
                  {payoutRequest.paymentMethod === 'BANK' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Holder Name *
                        </label>
                        <input
                          type="text"
                          value={payoutRequest.accountHolderName}
                          onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="Enter account holder name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Account Number *
                        </label>
                        <input
                          type="text"
                          value={payoutRequest.bankAccount}
                          onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="Enter bank account number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IFSC Code *
                        </label>
                        <input
                          type="text"
                          value={payoutRequest.ifscCode}
                          onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="Enter IFSC code"
                        />
                      </div>
                    </div>
                  )}

                  {/* Terms and Conditions */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Terms & Conditions</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Minimum payout amount is ₹500</li>
                      <li>• Processing time: 2-3 business days</li>
                      <li>• Payout requests are processed every Friday</li>
                      <li>• Only processed and pending earnings are eligible for payout</li>
                      <li>• Bank charges (if any) will be deducted from the payout amount</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayoutSubmit}
                    disabled={requesting}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {requesting ? 'Submitting...' : 'Submit Request'}
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
