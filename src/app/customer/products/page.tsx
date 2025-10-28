// src/app/customer/products/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product = {
  _id: string;
  name: string;
  category: string;
  images: string[];
  deposit: number;
  plans: Array<{
    durationDays: number;
    price: number;
  }>;
  city: string;
  stock: number;
  status: 'active' | 'inactive';
};

type BookingForm = {
  userId: string;
  packageId: string;
  planDurationDays: number;
  startDate: string;
  endDate: string;
  isSelfPickup: boolean;
  location: string;
  address: {
    buildingAreaName: string;
    houseNumber: string;
    streetAddress: string;
    zip: string;
    latitude: number;
    longitude: number;
  };
};

export default function CustomerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    userId: user?._id || '',
    packageId: '',
    planDurationDays: 1,
    startDate: '',
    endDate: '',
    isSelfPickup: false,
    location: user?.profile.city || 'mumbai',
    address: {
      buildingAreaName: '',
      houseNumber: '',
      streetAddress: '',
      zip: '',
      latitude: 19.0760,
      longitude: 72.8777,
    },
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        userId: user._id,
        location: user.profile.city || 'mumbai',
      }));
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (product: Product) => {
    setSelectedProduct(product);
    setBookingForm(prev => ({
      ...prev,
      packageId: product._id,
      planDurationDays: product.plans[0]?.durationDays || 1,
    }));
    setShowBookingForm(true);
  };

  const handleSubmitBooking = async () => {
    if (!selectedProduct) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingForm),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Booking created successfully!');
        setShowBookingForm(false);
        setSelectedProduct(null);
        // Reset form
        setBookingForm(prev => ({
          ...prev,
          packageId: '',
          planDurationDays: 1,
          startDate: '',
          endDate: '',
        }));
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateEndDate = (startDate: string, durationDays: number) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + durationDays);
    return end.toISOString().split('T')[0];
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
                <h1 className="text-3xl font-bold text-gray-900">Available Vehicles</h1>
                <p className="text-gray-600">Choose your perfect ride for your next adventure</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/customer/dashboard"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Dashboard
                </Link>
                <Link
                  href="/customer/bookings"
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  My Bookings
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles available</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later for new vehicles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {product.stock} available
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900">Rental Plans:</p>
                        <div className="mt-2 space-y-1">
                          {product.plans.map((plan, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">{plan.durationDays} day(s)</span>
                              <span className="font-medium text-gray-900">₹{plan.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          <strong>Deposit:</strong> ₹{product.deposit}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Location:</strong> {product.city}
                        </p>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => handleBookNow(product)}
                          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Booking Form Modal */}
        {showBookingForm && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Book {selectedProduct.name}
                </h3>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Product Info */}
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
                  <p className="text-gray-900"><strong>Name:</strong> {selectedProduct.name}</p>
                  <p className="text-gray-900"><strong>Category:</strong> {selectedProduct.category}</p>
                  <p className="text-gray-900"><strong>Deposit:</strong> ₹{selectedProduct.deposit}</p>
                </div>

                {/* Booking Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Duration</label>
                    <select
                      value={bookingForm.planDurationDays}
                      onChange={(e) => {
                        const duration = Number(e.target.value);
                        setBookingForm(prev => ({
                          ...prev,
                          planDurationDays: duration,
                          endDate: calculateEndDate(prev.startDate, duration),
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    >
                      {selectedProduct.plans.map((plan, idx) => (
                        <option key={idx} value={plan.durationDays}>
                          {plan.durationDays} day(s) - ₹{plan.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={bookingForm.startDate}
                      onChange={(e) => {
                        const startDate = e.target.value;
                        setBookingForm(prev => ({
                          ...prev,
                          startDate,
                          endDate: calculateEndDate(startDate, prev.planDurationDays),
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={bookingForm.endDate}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Delivery Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Building/Area Name</label>
                      <input
                        type="text"
                        value={bookingForm.address.buildingAreaName}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          address: { ...prev.address, buildingAreaName: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">House Number</label>
                      <input
                        type="text"
                        value={bookingForm.address.houseNumber}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          address: { ...prev.address, houseNumber: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={bookingForm.address.streetAddress}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          address: { ...prev.address, streetAddress: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={bookingForm.address.zip}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          address: { ...prev.address, zip: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmitBooking}
                    disabled={submitting || !bookingForm.startDate || !bookingForm.address.buildingAreaName}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitting ? 'Creating Booking...' : 'Create Booking'}
                  </button>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-900"
                  >
                    Cancel
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
