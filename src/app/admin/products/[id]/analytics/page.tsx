// src/app/admin/products/[id]/analytics/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type ProductAnalytics = {
  productId: string;
  productName: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  bookingTrends: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
  monthlyStats: Array<{
    month: string;
    bookings: number;
    revenue: number;
    avgRating: number;
  }>;
  customerSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
  peakHours: Array<{
    hour: number;
    bookings: number;
  }>;
  seasonalTrends: Array<{
    season: string;
    bookings: number;
    revenue: number;
  }>;
  competitorAnalysis: Array<{
    competitor: string;
    price: number;
    marketShare: number;
  }>;
};

type BookingDetail = {
  _id: string;
  customerName: string;
  bookingDate: string;
  duration: number;
  totalAmount: number;
  status: string;
  rating?: number;
};

export default function ProductAnalytics() {
  const { user } = useAuth();
  const params = useParams();
  const productId = params.id as string;
  
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadAnalytics();
    loadRecentBookings();
  }, [productId, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get product analytics
      const sampleAnalytics: ProductAnalytics = {
        productId: productId,
        productName: 'Basic Scooter',
        totalBookings: 45,
        totalRevenue: 22500,
        averageRating: 4.2,
        bookingTrends: [
          { date: '2024-01-01', bookings: 2, revenue: 1180 },
          { date: '2024-01-02', bookings: 3, revenue: 1770 },
          { date: '2024-01-03', bookings: 1, revenue: 590 },
          { date: '2024-01-04', bookings: 4, revenue: 2360 },
          { date: '2024-01-05', bookings: 2, revenue: 1180 },
          { date: '2024-01-06', bookings: 5, revenue: 2950 },
          { date: '2024-01-07', bookings: 3, revenue: 1770 },
        ],
        monthlyStats: [
          { month: 'Jan 2024', bookings: 15, revenue: 8850, avgRating: 4.1 },
          { month: 'Dec 2023', bookings: 12, revenue: 7080, avgRating: 4.3 },
          { month: 'Nov 2023', bookings: 18, revenue: 10620, avgRating: 4.0 },
        ],
        customerSegments: [
          { segment: 'Students', count: 18, percentage: 40 },
          { segment: 'Working Professionals', count: 15, percentage: 33 },
          { segment: 'Tourists', count: 8, percentage: 18 },
          { segment: 'Others', count: 4, percentage: 9 },
        ],
        peakHours: [
          { hour: 9, bookings: 8 },
          { hour: 10, bookings: 12 },
          { hour: 11, bookings: 15 },
          { hour: 14, bookings: 10 },
          { hour: 15, bookings: 7 },
          { hour: 16, bookings: 5 },
        ],
        seasonalTrends: [
          { season: 'Summer', bookings: 20, revenue: 11800 },
          { season: 'Monsoon', bookings: 8, revenue: 4720 },
          { season: 'Winter', bookings: 17, revenue: 10030 },
        ],
        competitorAnalysis: [
          { competitor: 'RentKar Basic', price: 590, marketShare: 35 },
          { competitor: 'QuickRent', price: 650, marketShare: 25 },
          { competitor: 'EasyRide', price: 550, marketShare: 20 },
          { competitor: 'FastRent', price: 700, marketShare: 20 },
        ],
      };
      setAnalytics(sampleAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentBookings = async () => {
    try {
      // This would be a real API call to get recent bookings
      const sampleBookings: BookingDetail[] = [
        {
          _id: '1',
          customerName: 'John Doe',
          bookingDate: '2024-01-20T10:30:00Z',
          duration: 1,
          totalAmount: 590,
          status: 'completed',
          rating: 5,
        },
        {
          _id: '2',
          customerName: 'Jane Smith',
          bookingDate: '2024-01-19T14:20:00Z',
          duration: 2,
          totalAmount: 1000,
          status: 'completed',
          rating: 4,
        },
        {
          _id: '3',
          customerName: 'Mike Johnson',
          bookingDate: '2024-01-18T09:15:00Z',
          duration: 1,
          totalAmount: 590,
          status: 'active',
        },
        {
          _id: '4',
          customerName: 'Sarah Davis',
          bookingDate: '2024-01-17T16:45:00Z',
          duration: 7,
          totalAmount: 3000,
          status: 'completed',
          rating: 4,
        },
      ];
      setRecentBookings(sampleBookings);
    } catch (error) {
      console.error('Error loading recent bookings:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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

  if (!analytics) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <Link
              href="/admin/products"
              className="text-indigo-600 hover:text-indigo-500"
            >
              ← Back to Products
            </Link>
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
                <h1 className="text-3xl font-bold text-gray-900">Product Analytics</h1>
                <p className="text-gray-600">{analytics.productName} - Performance Insights</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/products"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Products
                </Link>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Last Year</option>
                </select>
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
                        <span className="text-white font-bold">📋</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                        <dd className="text-lg font-medium text-gray-900">{analytics.totalBookings}</dd>
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
                        <span className="text-white font-bold">💰</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatCurrency(analytics.totalRevenue)}</dd>
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
                        <span className="text-white font-bold">⭐</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                        <dd className="text-lg font-medium text-gray-900">{analytics.averageRating}/5</dd>
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
                        <span className="text-white font-bold">📊</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Avg Revenue/Booking</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatCurrency(analytics.totalRevenue / analytics.totalBookings)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Booking Trends */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Booking Trends</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {analytics.bookingTrends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{trend.date}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-900">{trend.bookings} bookings</span>
                          <span className="text-sm font-medium text-green-600">{formatCurrency(trend.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Segments */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Customer Segments</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {analytics.customerSegments.map((segment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{segment.segment}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${segment.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{segment.count} ({segment.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Peak Hours */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Peak Booking Hours</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {analytics.peakHours.map((hour, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{hour.hour}:00</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(hour.bookings / Math.max(...analytics.peakHours.map(h => h.bookings))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{hour.bookings} bookings</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seasonal Trends */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Seasonal Performance</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {analytics.seasonalTrends.map((season, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{season.season}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-900">{season.bookings} bookings</span>
                          <span className="text-sm font-medium text-green-600">{formatCurrency(season.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Monthly Performance</h3>
              </div>
              <div className="px-6 py-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rating</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.monthlyStats.map((stat, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.month}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.bookings}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(stat.revenue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.avgRating}/5</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Competitor Analysis */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Competitor Analysis</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {analytics.competitorAnalysis.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{competitor.competitor}</h4>
                        <p className="text-sm text-gray-500">Price: {formatCurrency(competitor.price)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{ width: `${competitor.marketShare}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{competitor.marketShare}% market share</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{booking.customerName}</h4>
                        <p className="text-sm text-gray-500">{formatDate(booking.bookingDate)} • {booking.duration} day(s)</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(booking.totalAmount)}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                        {booking.rating && (
                          <span className="text-sm text-gray-500">⭐ {booking.rating}/5</span>
                        )}
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
