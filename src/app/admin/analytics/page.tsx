// src/app/admin/analytics/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type AnalyticsData = {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  bookings: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    byStatus: {
      pending: number;
      confirmed: number;
      completed: number;
      cancelled: number;
    };
  };
  users: {
    total: number;
    customers: number;
    partners: number;
    admins: number;
    growth: number;
  };
  partners: {
    total: number;
    active: number;
    offline: number;
    suspended: number;
    averageRating: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
    topPerforming: Array<{
      name: string;
      bookings: number;
      revenue: number;
    }>;
  };
  monthlyData: Array<{
    month: string;
    revenue: number;
    bookings: number;
    users: number;
  }>;
  topCities: Array<{
    city: string;
    bookings: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
};

export default function AdminAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get analytics data
      const sampleAnalytics: AnalyticsData = {
        revenue: {
          total: 1250000,
          thisMonth: 450000,
          lastMonth: 380000,
          growth: 18.4,
        },
        bookings: {
          total: 3420,
          thisMonth: 156,
          lastMonth: 142,
          growth: 9.9,
          byStatus: {
            pending: 64,
            confirmed: 92,
            completed: 3200,
            cancelled: 64,
          },
        },
        users: {
          total: 1250,
          customers: 1100,
          partners: 45,
          admins: 5,
          growth: 12.5,
        },
        partners: {
          total: 45,
          active: 38,
          offline: 5,
          suspended: 2,
          averageRating: 4.6,
        },
        products: {
          total: 12,
          active: 10,
          inactive: 2,
          topPerforming: [
            { name: 'Basic Scooter', bookings: 45, revenue: 22500 },
            { name: 'Premium Scooter', bookings: 28, revenue: 19600 },
            { name: 'Compact Car', bookings: 8, revenue: 20000 },
          ],
        },
        monthlyData: [
          { month: 'Jan', revenue: 450000, bookings: 156, users: 1250 },
          { month: 'Dec', revenue: 380000, bookings: 142, users: 1100 },
          { month: 'Nov', revenue: 320000, bookings: 120, users: 950 },
          { month: 'Oct', revenue: 280000, bookings: 98, users: 800 },
        ],
        topCities: [
          { city: 'Mumbai', bookings: 120, revenue: 180000 },
          { city: 'Delhi', bookings: 85, revenue: 127500 },
          { city: 'Bangalore', bookings: 65, revenue: 97500 },
          { city: 'Pune', bookings: 45, revenue: 67500 },
        ],
        recentActivity: [
          {
            type: 'booking',
            description: 'New booking created for Basic Scooter',
            timestamp: '2024-01-20T10:30:00Z',
            user: 'John Doe',
          },
          {
            type: 'partner',
            description: 'New partner registered: Mike Johnson',
            timestamp: '2024-01-20T09:15:00Z',
            user: 'Mike Johnson',
          },
          {
            type: 'booking',
            description: 'Booking completed successfully',
            timestamp: '2024-01-20T08:45:00Z',
            user: 'Sarah Wilson',
          },
          {
            type: 'product',
            description: 'Product pricing updated',
            timestamp: '2024-01-20T07:20:00Z',
            user: 'Admin',
          },
        ],
      };
      setAnalytics(sampleAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
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

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return '↗️';
    if (growth < 0) return '↘️';
    return '→';
  };

  const exportReport = async () => {
    try {
      setExporting(true);
      
      if (!analytics) {
        alert('No analytics data available to export');
        return;
      }

      // Generate comprehensive report data
      const reportData = {
        'Report Generated': new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        'Time Range': timeRange,
        '': '', // Empty row for spacing
        
        // Revenue Section
        'REVENUE METRICS': '',
        'Total Revenue': formatCurrency(analytics.revenue.total),
        'This Month Revenue': formatCurrency(analytics.revenue.thisMonth),
        'Last Month Revenue': formatCurrency(analytics.revenue.lastMonth),
        'Revenue Growth': `${analytics.revenue.growth}%`,
        '': '', // Empty row for spacing
        
        // Bookings Section
        'BOOKING METRICS': '',
        'Total Bookings': analytics.bookings.total.toLocaleString(),
        'This Month Bookings': analytics.bookings.thisMonth,
        'Last Month Bookings': analytics.bookings.lastMonth,
        'Booking Growth': `${analytics.bookings.growth}%`,
        'Pending Bookings': analytics.bookings.byStatus.pending,
        'Confirmed Bookings': analytics.bookings.byStatus.confirmed,
        'Completed Bookings': analytics.bookings.byStatus.completed,
        'Cancelled Bookings': analytics.bookings.byStatus.cancelled,
        '': '', // Empty row for spacing
        
        // Users Section
        'USER METRICS': '',
        'Total Users': analytics.users.total.toLocaleString(),
        'Customers': analytics.users.customers,
        'Partners': analytics.users.partners,
        'Admins': analytics.users.admins,
        'User Growth': `${analytics.users.growth}%`,
        '': '', // Empty row for spacing
        
        // Partners Section
        'PARTNER METRICS': '',
        'Total Partners': analytics.partners.total,
        'Active Partners': analytics.partners.active,
        'Offline Partners': analytics.partners.offline,
        'Suspended Partners': analytics.partners.suspended,
        'Average Rating': analytics.partners.averageRating.toFixed(1),
        '': '', // Empty row for spacing
        
        // Products Section
        'PRODUCT METRICS': '',
        'Total Products': analytics.products.total,
        'Active Products': analytics.products.active,
        'Inactive Products': analytics.products.inactive,
        '': '', // Empty row for spacing
        
        // Top Performing Products
        'TOP PERFORMING PRODUCTS': '',
        ...analytics.products.topPerforming.map((product, index) => ({
          [`Product ${index + 1}`]: product.name,
          [`Bookings ${index + 1}`]: product.bookings,
          [`Revenue ${index + 1}`]: formatCurrency(product.revenue),
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        '': '', // Empty row for spacing
        
        // Monthly Data
        'MONTHLY TRENDS': '',
        ...analytics.monthlyData.map((data, index) => ({
          [`Month ${index + 1}`]: data.month,
          [`Revenue ${index + 1}`]: formatCurrency(data.revenue),
          [`Bookings ${index + 1}`]: data.bookings,
          [`Users ${index + 1}`]: data.users,
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        '': '', // Empty row for spacing
        
        // Top Cities
        'TOP CITIES': '',
        ...analytics.topCities.map((city, index) => ({
          [`City ${index + 1}`]: city.city,
          [`Bookings ${index + 1}`]: city.bookings,
          [`Revenue ${index + 1}`]: formatCurrency(city.revenue),
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        '': '', // Empty row for spacing
        
        // Recent Activity
        'RECENT ACTIVITY': '',
        ...analytics.recentActivity.map((activity, index) => ({
          [`Activity ${index + 1}`]: activity.description,
          [`User ${index + 1}`]: activity.user,
          [`Time ${index + 1}`]: formatDate(activity.timestamp),
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      };

      // Convert to CSV format
      const csvContent = Object.entries(reportData)
        .map(([key, value]) => {
          // Handle empty rows
          if (key === '' && value === '') return '';
          
          // Escape commas and quotes in CSV
          const escapedKey = typeof key === 'string' && (key.includes(',') || key.includes('"') || key.includes('\n'))
            ? `"${key.replace(/"/g, '""')}"` : key;
          const escapedValue = typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))
            ? `"${value.replace(/"/g, '""')}"` : value;
          
          return `${escapedKey},${escapedValue}`;
        })
        .filter(row => row !== '') // Remove empty rows
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics_report_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Analytics report exported successfully for ${timeRange} time range!`);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setExporting(false);
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

  if (!analytics) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">No analytics data available</h3>
            <p className="text-gray-500">Please try again later.</p>
          </div>
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
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600">System performance and insights</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Dashboard
                </Link>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <button 
                  onClick={exportReport}
                  disabled={exporting || !analytics}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {exporting ? 'Exporting...' : 'Export Report'}
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
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">💰</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatCurrency(analytics.revenue.total)}</dd>
                        <dd className={`text-sm ${getGrowthColor(analytics.revenue.growth)}`}>
                          {getGrowthIcon(analytics.revenue.growth)} {analytics.revenue.growth}% vs last month
                        </dd>
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
                        <span className="text-white font-bold">📋</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                        <dd className="text-lg font-medium text-gray-900">{analytics.bookings.total.toLocaleString()}</dd>
                        <dd className={`text-sm ${getGrowthColor(analytics.bookings.growth)}`}>
                          {getGrowthIcon(analytics.bookings.growth)} {analytics.bookings.growth}% vs last month
                        </dd>
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
                        <span className="text-white font-bold">👥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{analytics.users.total.toLocaleString()}</dd>
                        <dd className={`text-sm ${getGrowthColor(analytics.users.growth)}`}>
                          {getGrowthIcon(analytics.users.growth)} {analytics.users.growth}% vs last month
                        </dd>
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
                        <dd className="text-lg font-medium text-gray-900">{analytics.partners.active}</dd>
                        <dd className="text-sm text-gray-500">
                          {analytics.partners.averageRating.toFixed(1)}/5 avg rating
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {analytics.monthlyData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">{data.month}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-900">{formatCurrency(data.revenue)}</span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(data.revenue / Math.max(...analytics.monthlyData.map(d => d.revenue))) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bookings Status */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Booking Status</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Completed</span>
                      <span className="text-sm text-green-600">{analytics.bookings.byStatus.completed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Confirmed</span>
                      <span className="text-sm text-blue-600">{analytics.bookings.byStatus.confirmed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Pending</span>
                      <span className="text-sm text-yellow-600">{analytics.bookings.byStatus.pending}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Cancelled</span>
                      <span className="text-sm text-red-600">{analytics.bookings.byStatus.cancelled}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Products */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Top Performing Products</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {analytics.products.topPerforming.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Cities */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Top Cities</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {analytics.topCities.map((city, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{city.city}</h4>
                        <p className="text-sm text-gray-500">{city.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(city.revenue)}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <span className="text-2xl">
                        {activity.type === 'booking' ? '📋' : 
                         activity.type === 'partner' ? '🚚' : 
                         activity.type === 'product' ? '📦' : '📄'}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">by {activity.user}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
