// src/app/partner/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Delivery = {
  _id: string;
  bookingId: string;
  customerName: string;
  productName: string;
  startDate: string;
  endDate: string;
  address: {
    buildingAreaName: string;
    streetAddress: string;
    latitude: number;
    longitude: number;
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED';
  assignedAt: string;
};

type PartnerStats = {
  totalDeliveries: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  todayDeliveries: number;
};

export default function PartnerDashboard() {
  const { user, logout } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [stats, setStats] = useState<PartnerStats>({
    totalDeliveries: 0,
    completedDeliveries: 0,
    pendingDeliveries: 0,
    todayDeliveries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    loadDeliveries();
    loadStats();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get partner's deliveries
      // For now, we'll simulate with empty data
      setDeliveries([]);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // This would be a real API call to get partner stats
      // For now, we'll simulate with default values
      setStats({
        totalDeliveries: 0,
        completedDeliveries: 0,
        pendingDeliveries: 0,
        todayDeliveries: 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;
      setIsOnline(newStatus);
      
      // This would be a real API call to update partner status
      // await fetch('/api/partners/status', { method: 'POST', body: JSON.stringify({ status: newStatus ? 'online' : 'offline' }) });
      
      alert(`Status updated to ${newStatus ? 'Online' : 'Offline'}`);
    } catch (error) {
      console.error('Error updating status:', error);
      setIsOnline(!isOnline); // Revert on error
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
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.profile.name}!</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                  <button
                    onClick={toggleOnlineStatus}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      isOnline 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isOnline ? 'Go Offline' : 'Go Online'}
                  </button>
                </div>
                <span className="text-sm text-gray-500">{user?.email}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">📦</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Deliveries</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalDeliveries}</dd>
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
                        <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.completedDeliveries}</dd>
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
                        <dd className="text-lg font-medium text-gray-900">{stats.pendingDeliveries}</dd>
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
                        <span className="text-white font-bold">📅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Today</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.todayDeliveries}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/partner/deliveries"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">🚚</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">My Deliveries</p>
                      <p className="text-xs text-gray-500">View assigned deliveries</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/partner/gps"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">📍</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">GPS Tracking</p>
                      <p className="text-xs text-gray-500">Update location</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/partner/profile"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Profile</p>
                      <p className="text-xs text-gray-500">Manage account</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/partner/earnings"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">💰</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">My Earnings</p>
                      <p className="text-xs text-gray-500">Track payments</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Deliveries */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Deliveries</h3>
              </div>
              <div className="px-6 py-4">
                {deliveries.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No deliveries yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Your assigned deliveries will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliveries.map((delivery) => (
                      <div key={delivery._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{delivery.productName}</h4>
                          <p className="text-sm text-gray-500">Customer: {delivery.customerName}</p>
                          <p className="text-sm text-gray-500">Address: {delivery.address.buildingAreaName}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                            {delivery.status}
                          </span>
                          <div className="text-right">
                            <p className="text-sm text-gray-900">{formatDate(delivery.startDate)}</p>
                            <p className="text-xs text-gray-500">Start Date</p>
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
      </div>
    </ProtectedRoute>
  );
}
