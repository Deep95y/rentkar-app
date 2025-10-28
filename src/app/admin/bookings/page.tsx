// src/app/admin/bookings/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Booking = {
  _id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'ASSIGNED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  assignedPartnerId?: string;
  partnerName?: string;
  totalAmount: number;
  createdAt: string;
  address: {
    buildingAreaName: string;
    streetAddress: string;
    city: string;
  };
  documents: Array<{
    docType: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }>;
};

export default function AdminBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'assigned' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get all bookings
      const sampleBookings: Booking[] = [
        {
          _id: '1',
          userId: 'user1',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          productName: 'Basic Scooter',
          startDate: '2024-01-20T09:00:00Z',
          endDate: '2024-01-21T18:00:00Z',
          status: 'PENDING',
          totalAmount: 850,
          createdAt: '2024-01-19T10:00:00Z',
          address: {
            buildingAreaName: 'Sunrise Apartments',
            streetAddress: 'MG Road, Mumbai',
            city: 'Mumbai',
          },
          documents: [
            { docType: 'SELFIE', status: 'PENDING' },
            { docType: 'SIGNATURE', status: 'PENDING' },
          ],
        },
        {
          _id: '2',
          userId: 'user2',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          productName: 'Premium Scooter',
          startDate: '2024-01-21T10:00:00Z',
          endDate: '2024-01-22T19:00:00Z',
          status: 'ASSIGNED',
          assignedPartnerId: 'partner1',
          partnerName: 'Mike Johnson',
          totalAmount: 1200,
          createdAt: '2024-01-20T14:00:00Z',
          address: {
            buildingAreaName: 'Green Valley',
            streetAddress: 'Andheri West, Mumbai',
            city: 'Mumbai',
          },
          documents: [
            { docType: 'SELFIE', status: 'APPROVED' },
            { docType: 'SIGNATURE', status: 'APPROVED' },
          ],
        },
        {
          _id: '3',
          userId: 'user3',
          customerName: 'Bob Wilson',
          customerEmail: 'bob@example.com',
          productName: 'Basic Scooter',
          startDate: '2024-01-18T08:00:00Z',
          endDate: '2024-01-19T17:00:00Z',
          status: 'COMPLETED',
          assignedPartnerId: 'partner2',
          partnerName: 'Sarah Davis',
          totalAmount: 750,
          createdAt: '2024-01-17T16:00:00Z',
          address: {
            buildingAreaName: 'Royal Heights',
            streetAddress: 'Bandra West, Mumbai',
            city: 'Mumbai',
          },
          documents: [
            { docType: 'SELFIE', status: 'APPROVED' },
            { docType: 'SIGNATURE', status: 'APPROVED' },
          ],
        },
      ];
      setBookings(sampleBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      // This would be a real API call to update booking status
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: newStatus as any }
          : booking
      ));
      alert(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status');
    }
  };

  const assignPartner = async (bookingId: string) => {
    try {
      // This would be a real API call to assign partner
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'ASSIGNED', assignedPartnerId: 'partner1', partnerName: 'Mike Johnson' }
          : booking
      ));
      alert('Partner assigned successfully');
    } catch (error) {
      console.error('Error assigning partner:', error);
      alert('Failed to assign partner');
    }
  };

  const exportToCSV = () => {
    try {
      // Prepare CSV data
      const csvData = filteredBookings.map(booking => ({
        'Booking ID': booking._id,
        'Customer Name': booking.customerName,
        'Customer Email': booking.customerEmail,
        'Product Name': booking.productName,
        'Start Date': formatDate(booking.startDate),
        'End Date': formatDate(booking.endDate),
        'Status': booking.status,
        'Total Amount': booking.totalAmount,
        'Partner Name': booking.partnerName || 'Not Assigned',
        'Partner ID': booking.assignedPartnerId || 'N/A',
        'Address': `${booking.address.buildingAreaName}, ${booking.address.streetAddress}, ${booking.address.city}`,
        'Document Status': booking.documents.map(doc => `${doc.docType}: ${doc.status}`).join('; '),
        'Created At': formatDate(booking.createdAt),
      }));

      // Convert to CSV string
      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Exported ${filteredBookings.length} bookings to CSV successfully!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
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
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status.toLowerCase() === filter;
    const matchesSearch = searchTerm === '' || 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
                <p className="text-gray-600">View and manage all system bookings</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Dashboard
                </Link>
                <button 
                  onClick={exportToCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Export Data
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="all">All Bookings</option>
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      placeholder="Search by customer name, email, or product..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Bookings ({filteredBookings.length})
                </h3>
              </div>
              <div className="px-6 py-4">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{booking.productName}</h4>
                            <p className="text-sm text-gray-500">Customer: {booking.customerName} ({booking.customerEmail})</p>
                            <p className="text-sm text-gray-500">Booking ID: {booking._id}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <span className="text-lg font-semibold text-gray-900">{formatCurrency(booking.totalAmount)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Start Date</p>
                            <p className="text-sm text-gray-900">{formatDate(booking.startDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">End Date</p>
                            <p className="text-sm text-gray-900">{formatDate(booking.endDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Address</p>
                            <p className="text-sm text-gray-900">{booking.address.buildingAreaName}, {booking.address.city}</p>
                          </div>
                        </div>

                        {booking.assignedPartnerId && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-800">
                              <strong>Assigned Partner:</strong> {booking.partnerName} (ID: {booking.assignedPartnerId})
                            </p>
                          </div>
                        )}

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500 mb-2">Document Status</p>
                          <div className="flex space-x-4">
                            {booking.documents.map((doc, index) => (
                              <span key={index} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                doc.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                doc.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {doc.docType}: {doc.status}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {booking.status === 'PENDING' && (
                              <button
                                onClick={() => assignPartner(booking._id)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                              >
                                Assign Partner
                              </button>
                            )}
                            {booking.status === 'ASSIGNED' && (
                              <button
                                onClick={() => updateBookingStatus(booking._id, 'CONFIRMED')}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Confirm Booking
                              </button>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <button
                                onClick={() => updateBookingStatus(booking._id, 'COMPLETED')}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Mark Completed
                              </button>
                            )}
                            {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                              <button
                                onClick={() => updateBookingStatus(booking._id, 'CANCELLED')}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created: {formatDate(booking.createdAt)}
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
