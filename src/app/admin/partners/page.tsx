// src/app/admin/partners/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Partner = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: 'online' | 'offline' | 'suspended';
  totalDeliveries: number;
  completedDeliveries: number;
  rating: number;
  earnings: number;
  joinedAt: string;
  lastActiveAt: string;
  location: {
    lat: number;
    lng: number;
  };
  vehicleType: string;
  licenseNumber: string;
};

export default function AdminPartners() {
  const { user } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'suspended'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    vehicleType: 'Scooter',
    licenseNumber: '',
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get all partners
      const samplePartners: Partner[] = [
        {
          _id: '1',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+91 98765 43210',
          city: 'Mumbai',
          status: 'online',
          totalDeliveries: 45,
          completedDeliveries: 42,
          rating: 4.8,
          earnings: 22500,
          joinedAt: '2024-01-01T00:00:00Z',
          lastActiveAt: '2024-01-20T10:30:00Z',
          location: { lat: 19.0760, lng: 72.8777 },
          vehicleType: 'Scooter',
          licenseNumber: 'DL1234567890',
        },
        {
          _id: '2',
          name: 'Sarah Davis',
          email: 'sarah@example.com',
          phone: '+91 98765 43211',
          city: 'Mumbai',
          status: 'offline',
          totalDeliveries: 32,
          completedDeliveries: 30,
          rating: 4.6,
          earnings: 16000,
          joinedAt: '2024-01-05T00:00:00Z',
          lastActiveAt: '2024-01-19T18:45:00Z',
          location: { lat: 19.1176, lng: 72.8460 },
          vehicleType: 'Bike',
          licenseNumber: 'DL2345678901',
        },
        {
          _id: '3',
          name: 'Raj Patel',
          email: 'raj@example.com',
          phone: '+91 98765 43212',
          city: 'Mumbai',
          status: 'suspended',
          totalDeliveries: 15,
          completedDeliveries: 12,
          rating: 3.2,
          earnings: 7500,
          joinedAt: '2024-01-10T00:00:00Z',
          lastActiveAt: '2024-01-18T14:20:00Z',
          location: { lat: 19.0760, lng: 72.8777 },
          vehicleType: 'Scooter',
          licenseNumber: 'DL3456789012',
        },
        {
          _id: '4',
          name: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '+91 98765 43213',
          city: 'Mumbai',
          status: 'online',
          totalDeliveries: 28,
          completedDeliveries: 26,
          rating: 4.9,
          earnings: 14000,
          joinedAt: '2024-01-08T00:00:00Z',
          lastActiveAt: '2024-01-20T09:15:00Z',
          location: { lat: 19.0760, lng: 72.8777 },
          vehicleType: 'Scooter',
          licenseNumber: 'DL4567890123',
        },
      ];
      setPartners(samplePartners);
    } catch (error) {
      console.error('Error loading partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePartnerStatus = async (partnerId: string, newStatus: string) => {
    try {
      // This would be a real API call to update partner status
      setPartners(prev => prev.map(partner => 
        partner._id === partnerId 
          ? { ...partner, status: newStatus as any }
          : partner
      ));
      alert(`Partner status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating partner:', error);
      alert('Failed to update partner status');
    }
  };

  const suspendPartner = async (partnerId: string) => {
    try {
      // This would be a real API call to suspend partner
      setPartners(prev => prev.map(partner => 
        partner._id === partnerId 
          ? { ...partner, status: 'suspended' }
          : partner
      ));
      alert('Partner suspended successfully');
    } catch (error) {
      console.error('Error suspending partner:', error);
      alert('Failed to suspend partner');
    }
  };

  const activatePartner = async (partnerId: string) => {
    try {
      // This would be a real API call to activate partner
      setPartners(prev => prev.map(partner => 
        partner._id === partnerId 
          ? { ...partner, status: 'online' }
          : partner
      ));
      alert('Partner activated successfully');
    } catch (error) {
      console.error('Error activating partner:', error);
      alert('Failed to activate partner');
    }
  };

  const exportToCSV = () => {
    try {
      // Prepare CSV data
      const csvData = filteredPartners.map(partner => ({
        'Partner ID': partner._id,
        'Name': partner.name,
        'Email': partner.email,
        'Phone': partner.phone,
        'City': partner.city,
        'Status': partner.status,
        'Vehicle Type': partner.vehicleType,
        'License Number': partner.licenseNumber,
        'Total Deliveries': partner.totalDeliveries,
        'Completed Deliveries': partner.completedDeliveries,
        'Rating': partner.rating,
        'Earnings': partner.earnings,
        'Joined At': formatDate(partner.joinedAt),
        'Last Active': formatDate(partner.lastActiveAt),
        'Location': `${partner.location.lat}, ${partner.location.lng}`,
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
      link.setAttribute('download', `partners_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Exported ${filteredPartners.length} partners to CSV successfully!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleAddPartner = async () => {
    try {
      setAdding(true);
      
      // Validate required fields
      if (!newPartner.name || !newPartner.email || !newPartner.phone || !newPartner.city || !newPartner.licenseNumber) {
        alert('Please fill in all required fields');
        return;
      }

      // This would be a real API call to add partner
      const partnerId = (partners.length + 1).toString();
      const newPartnerData: Partner = {
        _id: partnerId,
        name: newPartner.name,
        email: newPartner.email,
        phone: newPartner.phone,
        city: newPartner.city,
        status: 'offline',
        totalDeliveries: 0,
        completedDeliveries: 0,
        rating: 0,
        earnings: 0,
        joinedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        location: { lat: 19.0760, lng: 72.8777 }, // Default Mumbai location
        vehicleType: newPartner.vehicleType,
        licenseNumber: newPartner.licenseNumber,
      };

      setPartners(prev => [newPartnerData, ...prev]);
      
      // Reset form
      setNewPartner({
        name: '',
        email: '',
        phone: '',
        city: '',
        vehicleType: 'Scooter',
        licenseNumber: '',
      });
      
      setShowAddModal(false);
      alert('Partner added successfully!');
    } catch (error) {
      console.error('Error adding partner:', error);
      alert('Failed to add partner. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewPartner(prev => ({
      ...prev,
      [field]: value
    }));
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
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPartners = partners.filter(partner => {
    const matchesFilter = filter === 'all' || partner.status === filter;
    const matchesSearch = searchTerm === '' || 
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.phone.includes(searchTerm) ||
      partner.city.toLowerCase().includes(searchTerm.toLowerCase());
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Partners</h1>
                <p className="text-gray-600">View and manage all delivery partners</p>
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
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Export Data
                </button>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Partner
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
                      <option value="all">All Partners</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      placeholder="Search by name, email, phone, or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Partners List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Partners ({filteredPartners.length})
                </h3>
              </div>
              <div className="px-6 py-4">
                {filteredPartners.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-5.523-4.477-10-10-10S-3 12.477-3 18v2m20 0H7" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No partners found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPartners.map((partner) => (
                      <div key={partner._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{partner.name}</h4>
                            <p className="text-sm text-gray-500">{partner.email} • {partner.phone}</p>
                            <p className="text-sm text-gray-500">{partner.city} • {partner.vehicleType}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(partner.status)}`}>
                              {partner.status.toUpperCase()}
                            </span>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">Rating: {partner.rating}/5</p>
                              <p className="text-sm text-gray-500">{partner.completedDeliveries}/{partner.totalDeliveries} deliveries</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Total Deliveries</p>
                            <p className="text-sm text-gray-900">{partner.totalDeliveries}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Completed</p>
                            <p className="text-sm text-gray-900">{partner.completedDeliveries}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Earnings</p>
                            <p className="text-sm text-gray-900">{formatCurrency(partner.earnings)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Last Active</p>
                            <p className="text-sm text-gray-900">{formatDate(partner.lastActiveAt)}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500 mb-2">Location</p>
                          <p className="text-sm text-gray-900">
                            Lat: {partner.location.lat.toFixed(6)}, Lng: {partner.location.lng.toFixed(6)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {partner.status === 'suspended' ? (
                              <button
                                onClick={() => activatePartner(partner._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => suspendPartner(partner._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                              >
                                Suspend
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedPartner(partner);
                                setShowModal(true);
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              View Details
                            </button>
                            <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">
                              Message
                            </button>
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined: {formatDate(partner.joinedAt)}
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

        {/* Partner Details Modal */}
        {showModal && selectedPartner && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Partner Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-sm text-gray-900">{selectedPartner.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedPartner.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{selectedPartner.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">License Number</p>
                    <p className="text-sm text-gray-900">{selectedPartner.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vehicle Type</p>
                    <p className="text-sm text-gray-900">{selectedPartner.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPartner.status)}`}>
                      {selectedPartner.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Partner Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Partner</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newPartner.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      placeholder="Enter partner's full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={newPartner.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={newPartner.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={newPartner.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type *
                    </label>
                    <select
                      value={newPartner.vehicleType}
                      onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="Scooter">Scooter</option>
                      <option value="Bike">Bike</option>
                      <option value="Car">Car</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number *
                    </label>
                    <input
                      type="text"
                      value={newPartner.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      placeholder="Enter license number"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPartner}
                    disabled={adding}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {adding ? 'Adding...' : 'Add Partner'}
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
