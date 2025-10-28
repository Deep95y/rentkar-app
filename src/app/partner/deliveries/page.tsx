// src/app/partner/deliveries/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Delivery = {
  _id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  startDate: string;
  endDate: string;
  address: {
    buildingAreaName: string;
    houseNumber: string;
    streetAddress: string;
    zip: string;
    latitude: number;
    longitude: number;
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED';
  assignedAt: string;
  notes?: string;
};

export default function PartnerDeliveries() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get partner's deliveries
      // For now, we'll simulate with sample data
      const sampleDeliveries: Delivery[] = [
        {
          _id: '1',
          bookingId: 'BOOK001',
          customerName: 'John Doe',
          customerPhone: '+91 98765 43210',
          productName: 'Basic Scooter',
          startDate: '2024-01-15T09:00:00Z',
          endDate: '2024-01-16T18:00:00Z',
          address: {
            buildingAreaName: 'Sunrise Apartments',
            houseNumber: 'A-101',
            streetAddress: 'MG Road, Mumbai',
            zip: '400001',
            latitude: 19.0760,
            longitude: 72.8777,
          },
          status: 'PENDING',
          assignedAt: '2024-01-14T10:00:00Z',
          notes: 'Customer prefers morning delivery',
        },
        {
          _id: '2',
          bookingId: 'BOOK002',
          customerName: 'Jane Smith',
          customerPhone: '+91 98765 43211',
          productName: 'Premium Scooter',
          startDate: '2024-01-16T10:00:00Z',
          endDate: '2024-01-17T19:00:00Z',
          address: {
            buildingAreaName: 'Green Valley',
            houseNumber: 'B-205',
            streetAddress: 'Andheri West, Mumbai',
            zip: '400053',
            latitude: 19.1176,
            longitude: 72.8460,
          },
          status: 'IN_PROGRESS',
          assignedAt: '2024-01-15T14:00:00Z',
        },
      ];
      setDeliveries(sampleDeliveries);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    try {
      setUpdating(deliveryId);
      
      // This would be a real API call to update delivery status
      // await fetch(`/api/deliveries/${deliveryId}`, { 
      //   method: 'PUT', 
      //   body: JSON.stringify({ status: newStatus }) 
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDeliveries(prev => prev.map(delivery => 
        delivery._id === deliveryId 
          ? { ...delivery, status: newStatus as any }
          : delivery
      ));
      
      alert(`Delivery status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating delivery:', error);
      alert('Failed to update delivery status');
    } finally {
      setUpdating(null);
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

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PENDING': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'DELIVERED';
      case 'DELIVERED': return 'COMPLETED';
      default: return null;
    }
  };

  const getStatusButtonText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PENDING': return 'Start Delivery';
      case 'IN_PROGRESS': return 'Mark as Delivered';
      case 'DELIVERED': return 'Mark as Completed';
      default: return null;
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
                <h1 className="text-3xl font-bold text-gray-900">My Deliveries</h1>
                <p className="text-gray-600">Manage your assigned deliveries</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/partner/dashboard"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Dashboard
                </Link>
                <Link
                  href="/partner/gps"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Update GPS
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {deliveries.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No deliveries assigned</h3>
                <p className="mt-1 text-sm text-gray-500">You'll receive delivery assignments here when available.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {deliveries.map((delivery) => {
                  const nextStatus = getNextStatus(delivery.status);
                  const buttonText = getStatusButtonText(delivery.status);
                  
                  return (
                    <div key={delivery._id} className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {delivery.productName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Booking ID: {delivery.bookingId} • Customer: {delivery.customerName}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                              {delivery.status}
                            </span>
                            {nextStatus && buttonText && (
                              <button
                                onClick={() => updateDeliveryStatus(delivery._id, nextStatus)}
                                disabled={updating === delivery._id}
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                              >
                                {updating === delivery._id ? 'Updating...' : buttonText}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Customer Details</p>
                            <p className="text-sm text-gray-900">{delivery.customerName}</p>
                            <p className="text-sm text-gray-900">{delivery.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Delivery Period</p>
                            <p className="text-sm text-gray-900">{formatDate(delivery.startDate)} - {formatDate(delivery.endDate)}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                          <p className="text-sm text-gray-900">
                            {delivery.address.buildingAreaName}, {delivery.address.houseNumber}
                          </p>
                          <p className="text-sm text-gray-900">
                            {delivery.address.streetAddress}, {delivery.address.zip}
                          </p>
                        </div>

                        {delivery.notes && (
                          <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                            <p className="text-sm text-yellow-800">
                              <strong>Notes:</strong> {delivery.notes}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex space-x-4">
                            <button className="text-sm text-indigo-600 hover:text-indigo-500">
                              View on Map
                            </button>
                            <button className="text-sm text-indigo-600 hover:text-indigo-500">
                              Call Customer
                            </button>
                            <button className="text-sm text-indigo-600 hover:text-indigo-500">
                              View Details
                            </button>
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            Assigned: {formatDate(delivery.assignedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
