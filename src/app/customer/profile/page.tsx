// src/app/customer/profile/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CustomerProfile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.profile.name || '',
    email: user?.email || '',
    phone: user?.profile.phone || '',
    city: user?.profile.city || '',
    address: '',
    dateOfBirth: '',
    emergencyContact: '',
    drivingLicense: '',
    licenseExpiry: '',
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.profile.name || '',
        email: user.email || '',
        phone: user.profile.phone || '',
        city: user.profile.city || '',
      }));
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!profile.name || !profile.email) {
        alert('Please fill in all required fields');
        return;
      }

      // This would be a real API call to update profile
      // await fetch('/api/customer/profile', { method: 'PUT', body: JSON.stringify(profile) });
      
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Manage your account information</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/customer/dashboard"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Dashboard
                </Link>
                <button
                  onClick={() => setEditing(!editing)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{profile.name || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{profile.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter your city"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{profile.city || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    {editing ? (
                      <textarea
                        value={profile.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{profile.address || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    {editing ? (
                      <input
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{profile.dateOfBirth || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={profile.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter emergency contact number"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{profile.emergencyContact || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {editing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Driving License Information */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Driving License Information</h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profile.drivingLicense}
                        onChange={(e) => handleInputChange('drivingLicense', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter your driving license number"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{profile.drivingLicense || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Expiry Date
                    </label>
                    {editing ? (
                      <input
                        type="date"
                        value={profile.licenseExpiry}
                        onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{profile.licenseExpiry || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Account Actions</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-500">Update your account password</p>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                      Change Password
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                      <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}