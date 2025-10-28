// src/app/customer/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.profile.name}!</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">🚗</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Browse Products
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Find vehicles to rent
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Link
                    href="/customer/products"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Products →
                  </Link>
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
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          My Bookings
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Track your rentals
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Link
                    href="/customer/bookings"
                    className="text-sm font-medium text-green-600 hover:text-green-500"
                  >
                    View Bookings →
                  </Link>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">👤</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Profile
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Manage your account
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Link
                    href="/customer/profile"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Edit Profile →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/customer/products"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">🚗</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Browse Vehicles</p>
                      <p className="text-xs text-gray-500">Find your perfect ride</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/customer/bookings"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">📋</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">My Bookings</p>
                      <p className="text-xs text-gray-500">Track your rentals</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/customer/profile"
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
                  href="/customer/support"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center mr-3">
                      <span className="text-white font-bold">💬</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Support</p>
                      <p className="text-xs text-gray-500">Get help</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  <li className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900">Welcome to Rentkar!</p>
                        <p className="text-sm text-gray-500">Get started by browsing our available vehicles.</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
