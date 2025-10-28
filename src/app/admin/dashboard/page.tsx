// src/app/admin/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type SystemStats = {
  totalUsers: number;
  totalBookings: number;
  totalPartners: number;
  totalProducts: number;
  activeBookings: number;
  completedBookings: number;
  pendingBookings: number;
  revenue: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
};

type RecentActivity = {
  _id: string;
  type: 'booking' | 'user' | 'partner' | 'product';
  action: string;
  description: string;
  timestamp: string;
  user: string;
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalPartners: 0,
    totalProducts: 0,
    activeBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    revenue: 0,
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadRecentActivity();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get system statistics
      // For now, we'll simulate with sample data
      setStats({
        totalUsers: 1250,
        totalBookings: 3420,
        totalPartners: 45,
        totalProducts: 12,
        activeBookings: 156,
        completedBookings: 3200,
        pendingBookings: 64,
        revenue: 1250000,
        thisMonthRevenue: 450000,
        lastMonthRevenue: 380000,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      // This would be a real API call to get recent activity
      const sampleActivity: RecentActivity[] = [
        {
          _id: '1',
          type: 'booking',
          action: 'created',
          description: 'New booking created for Basic Scooter',
          timestamp: '2024-01-20T10:30:00Z',
          user: 'John Doe',
        },
        {
          _id: '2',
          type: 'partner',
          action: 'registered',
          description: 'New partner registered: Mike Johnson',
          timestamp: '2024-01-20T09:15:00Z',
          user: 'Mike Johnson',
        },
        {
          _id: '3',
          type: 'booking',
          action: 'completed',
          description: 'Booking completed successfully',
          timestamp: '2024-01-20T08:45:00Z',
          user: 'Sarah Wilson',
        },
        {
          _id: '4',
          type: 'product',
          action: 'updated',
          description: 'Product pricing updated',
          timestamp: '2024-01-20T07:20:00Z',
          user: 'Admin',
        },
      ];
      setRecentActivity(sampleActivity);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return '📋';
      case 'user': return '👤';
      case 'partner': return '🚚';
      case 'product': return '📦';
      default: return '📄';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      case 'partner': return 'bg-yellow-100 text-yellow-800';
      case 'product': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">System overview and management</p>
              </div>
              <div className="flex items-center space-x-4">
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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">👥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalUsers.toLocaleString()}</dd>
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
                        <span className="text-white font-bold">📋</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalBookings.toLocaleString()}</dd>
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
                        <span className="text-white font-bold">🚚</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Partners</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalPartners}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">📦</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Products</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalProducts}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue and Bookings Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Revenue Overview</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Total Revenue</span>
                      <span className="text-lg font-semibold text-gray-900">{formatCurrency(stats.revenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">This Month</span>
                      <span className="text-sm text-gray-900">{formatCurrency(stats.thisMonthRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Last Month</span>
                      <span className="text-sm text-gray-900">{formatCurrency(stats.lastMonthRevenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(stats.thisMonthRevenue / stats.lastMonthRevenue) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {((stats.thisMonthRevenue / stats.lastMonthRevenue - 1) * 100).toFixed(1)}% increase from last month
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Booking Status</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Active Bookings</span>
                      <span className="text-lg font-semibold text-blue-600">{stats.activeBookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Completed</span>
                      <span className="text-sm text-green-600">{stats.completedBookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Pending</span>
                      <span className="text-sm text-yellow-600">{stats.pendingBookings}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(stats.completedBookings / stats.totalBookings) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {((stats.completedBookings / stats.totalBookings) * 100).toFixed(1)}% completion rate
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href="/admin/bookings"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">📋</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Manage Bookings</p>
                      <p className="text-xs text-gray-500">View and manage all bookings</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/partners"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">🚚</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Manage Partners</p>
                      <p className="text-xs text-gray-500">Partner management</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/products"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">📦</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Manage Products</p>
                      <p className="text-xs text-gray-500">Product catalog</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/users"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">👥</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Manage Users</p>
                      <p className="text-xs text-gray-500">User management</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/analytics"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">📊</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Analytics</p>
                      <p className="text-xs text-gray-500">System analytics</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/messages"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">💬</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Message Center</p>
                      <p className="text-xs text-gray-500">Communicate with users</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/settings"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">⚙️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">System Settings</p>
                      <p className="text-xs text-gray-500">Configuration</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="px-6 py-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                    <p className="mt-1 text-sm text-gray-500">System activity will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity._id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">by {activity.user}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                            {activity.type}
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
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
