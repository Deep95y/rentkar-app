// src/app/customer/bookings/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Booking = {
  _id: string;
  packageId: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'ASSIGNED' | 'CONFIRMED' | 'CANCELLED';
  selectedPlan: {
    durationDays: number;
    price: number;
  };
  priceBreakDown: {
    basePrice: number;
    deliveryCharge: number;
    grandTotal: number;
  };
  address: {
    buildingAreaName: string;
    houseNumber: string;
    streetAddress: string;
    zip: string;
  };
  assignedPartnerId?: string | null;
  document: Array<{
    docType: string;
    docLink: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }>;
};

type Product = {
  _id: string;
  name: string;
  category: string;
  images: string[];
  deposit: number;
};

export default function CustomerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json() as Booking[];
        setBookings(data);
        
        // Load product details for each booking
        const productIds: string[] = [...new Set(data.map((b: Booking) => b.packageId))];
        const productPromises = productIds.map(async (id: string) => {
          const res = await fetch(`/api/products/${id}`);
          if (res.ok) {
            const product = await res.json();
            return { id, product };
          }
          return null;
        });
        
        const productResults = await Promise.all(productPromises);
        const productMap: Record<string, Product> = {};
        productResults.forEach((result: { id: string; product: Product } | null) => {
          if (result && result.id) {
            productMap[result.id] = result.product;
          }
        });
        setProducts(productMap);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
                <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600">Track and manage your vehicle rentals</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/customer/dashboard"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Dashboard
                </Link>
                <Link
                  href="/products"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Book New Vehicle
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by booking your first vehicle.</p>
                <div className="mt-6">
                  <Link
                    href="/products"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Browse Vehicles
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => {
                  const product = products[booking.packageId];
                  return (
                    <div key={booking._id} className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {product?.name || 'Unknown Product'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {product?.category || 'Vehicle'} • {booking.selectedPlan.durationDays} day(s)
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                ₹{booking.priceBreakDown.grandTotal}
                              </p>
                              <p className="text-xs text-gray-500">Total amount</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Start Date</p>
                            <p className="text-sm text-gray-900">{formatDate(booking.startDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">End Date</p>
                            <p className="text-sm text-gray-900">{formatDate(booking.endDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                            <p className="text-sm text-gray-900">
                              {booking.address.buildingAreaName}, {booking.address.streetAddress}
                            </p>
                          </div>
                        </div>

                        {booking.assignedPartnerId && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-800">
                              <strong>Assigned Partner:</strong> {booking.assignedPartnerId}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex space-x-2">
                            {booking.document.map((doc, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                  doc.status === 'APPROVED' 
                                    ? 'bg-green-100 text-green-800'
                                    : doc.status === 'REJECTED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {doc.docType}: {doc.status}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex space-x-2">
                            {booking.status === 'PENDING' && (
                              <button className="text-sm text-red-600 hover:text-red-500">
                                Cancel Booking
                              </button>
                            )}
                            <button className="text-sm text-indigo-600 hover:text-indigo-500">
                              View Details
                            </button>
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
