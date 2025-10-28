// src/app/admin/users/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
  _id: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'PARTNER';
  profile: {
    name: string;
    phone?: string;
    city?: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
  totalBookings?: number;
  totalEarnings?: number;
  rating?: number;
};

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'customer' | 'partner' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState({
    email: '',
    role: 'CUSTOMER' as 'CUSTOMER' | 'ADMIN' | 'PARTNER',
    profile: {
      name: '',
      phone: '',
      city: '',
    },
    status: 'active' as 'active' | 'inactive' | 'suspended',
  });
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'CUSTOMER' as 'CUSTOMER' | 'ADMIN' | 'PARTNER',
    profile: {
      name: '',
      phone: '',
      city: '',
    },
    status: 'active' as 'active' | 'inactive' | 'suspended',
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get all users
      const sampleUsers: User[] = [
        {
          _id: '1',
          email: 'john@example.com',
          role: 'CUSTOMER',
          profile: {
            name: 'John Doe',
            phone: '+91 98765 43210',
            city: 'Mumbai',
          },
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: '2024-01-20T10:30:00Z',
          totalBookings: 5,
        },
        {
          _id: '2',
          email: 'mike@example.com',
          role: 'PARTNER',
          profile: {
            name: 'Mike Johnson',
            phone: '+91 98765 43211',
            city: 'Mumbai',
          },
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: '2024-01-20T09:15:00Z',
          totalEarnings: 22500,
          rating: 4.8,
        },
        {
          _id: '3',
          email: 'jane@example.com',
          role: 'CUSTOMER',
          profile: {
            name: 'Jane Smith',
            phone: '+91 98765 43212',
            city: 'Mumbai',
          },
          status: 'inactive',
          createdAt: '2024-01-05T00:00:00Z',
          lastLoginAt: '2024-01-18T14:20:00Z',
          totalBookings: 2,
        },
        {
          _id: '4',
          email: 'sarah@example.com',
          role: 'PARTNER',
          profile: {
            name: 'Sarah Davis',
            phone: '+91 98765 43213',
            city: 'Mumbai',
          },
          status: 'suspended',
          createdAt: '2024-01-08T00:00:00Z',
          lastLoginAt: '2024-01-15T16:45:00Z',
          totalEarnings: 16000,
          rating: 3.2,
        },
        {
          _id: '5',
          email: 'admin@rentkar.com',
          role: 'ADMIN',
          profile: {
            name: 'Admin User',
            phone: '+91 98765 43214',
            city: 'Mumbai',
          },
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: '2024-01-20T11:00:00Z',
        },
      ];
      setUsers(sampleUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      // This would be a real API call to update user status
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, status: newStatus as any }
          : user
      ));
      alert(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user status');
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      // This would be a real API call to suspend user
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, status: 'suspended' }
          : user
      ));
      alert('User suspended successfully');
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Failed to suspend user');
    }
  };

  const activateUser = async (userId: string) => {
    try {
      // This would be a real API call to activate user
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, status: 'active' }
          : user
      ));
      alert('User activated successfully');
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Failed to activate user');
    }
  };

  const exportToCSV = () => {
    try {
      // Prepare CSV data
      const csvData = filteredUsers.map(user => ({
        'User ID': user._id,
        'Name': user.profile.name,
        'Email': user.email,
        'Phone': user.profile.phone || 'Not Provided',
        'City': user.profile.city || 'Not Provided',
        'Role': user.role,
        'Status': user.status,
        'Created At': formatDate(user.createdAt),
        'Last Login': user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never',
        'Total Bookings': user.totalBookings || 0,
        'Total Earnings': user.totalEarnings || 0,
        'Rating': user.rating || 'N/A',
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
      link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Exported ${filteredUsers.length} users to CSV successfully!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleAddUser = async () => {
    try {
      setAdding(true);
      
      // Validate required fields
      if (!newUser.email || !newUser.password || !newUser.profile.name) {
        alert('Please fill in all required fields');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUser.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // Validate password length
      if (newUser.password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }

      // This would be a real API call to add user
      const userId = (users.length + 1).toString();
      const newUserData: User = {
        _id: userId,
        email: newUser.email,
        role: newUser.role,
        profile: {
          name: newUser.profile.name,
          phone: newUser.profile.phone || undefined,
          city: newUser.profile.city || undefined,
        },
        status: newUser.status,
        createdAt: new Date().toISOString(),
        lastLoginAt: undefined,
        totalBookings: newUser.role === 'CUSTOMER' ? 0 : undefined,
        totalEarnings: newUser.role === 'PARTNER' ? 0 : undefined,
        rating: newUser.role === 'PARTNER' ? 0 : undefined,
      };

      setUsers(prev => [newUserData, ...prev]);
      
      // Reset form
      setNewUser({
        email: '',
        password: '',
        role: 'CUSTOMER',
        profile: {
          name: '',
          phone: '',
          city: '',
        },
        status: 'active',
      });
      
      setShowAddModal(false);
      alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('profile.')) {
      const profileField = field.split('.')[1];
      setNewUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else {
      setNewUser(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditingUser({
      email: user.email,
      role: user.role,
      profile: {
        name: user.profile.name,
        phone: user.profile.phone || '',
        city: user.profile.city || '',
      },
      status: user.status,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveUser = async () => {
    try {
      setSaving(true);
      
      if (!selectedUser) return;

      // Validate required fields
      if (!editingUser.email || !editingUser.profile.name) {
        alert('Please fill in all required fields');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editingUser.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // This would be a real API call to update user
      setUsers(prev => prev.map(user => 
        user._id === selectedUser._id 
          ? {
              ...user,
              email: editingUser.email,
              role: editingUser.role,
              profile: {
                name: editingUser.profile.name,
                phone: editingUser.profile.phone || undefined,
                city: editingUser.profile.city || undefined,
              },
              status: editingUser.status,
            }
          : user
      ));

      setShowModal(false);
      setIsEditing(false);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditInputChange = (field: string, value: any) => {
    if (field.startsWith('profile.')) {
      const profileField = field.split('.')[1];
      setEditingUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else {
      setEditingUser(prev => ({
        ...prev,
        [field]: value
      }));
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'bg-blue-100 text-blue-800';
      case 'PARTNER': return 'bg-yellow-100 text-yellow-800';
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return '👤';
      case 'PARTNER': return '🚚';
      case 'ADMIN': return '👑';
      default: return '❓';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRoleFilter = filter === 'all' || user.role.toLowerCase() === filter;
    const matchesStatusFilter = statusFilter === 'all' || user.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      user.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.profile.phone && user.profile.phone.includes(searchTerm)) ||
      (user.profile.city && user.profile.city.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRoleFilter && matchesStatusFilter && matchesSearch;
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                <p className="text-gray-600">View and manage all system users</p>
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
                  Add User
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role Filter</label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="all">All Users</option>
                      <option value="customer">Customers</option>
                      <option value="partner">Partners</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
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

            {/* Users List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Users ({filteredUsers.length})
                </h3>
              </div>
              <div className="px-6 py-4">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-5.523-4.477-10-10-10S-3 12.477-3 18v2m20 0H7" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getRoleIcon(user.role)}</span>
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">{user.profile.name}</h4>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <p className="text-sm text-gray-500">
                                  {user.profile.phone} • {user.profile.city}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {user.status.toUpperCase()}
                            </span>
                            <div className="text-right">
                              {user.totalBookings && (
                                <p className="text-sm text-gray-900">{user.totalBookings} bookings</p>
                              )}
                              {user.totalEarnings && (
                                <p className="text-sm text-gray-900">{formatCurrency(user.totalEarnings)}</p>
                              )}
                              {user.rating && (
                                <p className="text-sm text-gray-500">Rating: {user.rating}/5</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Created</p>
                            <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Last Login</p>
                            <p className="text-sm text-gray-900">
                              {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">User ID</p>
                            <p className="text-sm text-gray-900 font-mono">{user._id}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {user.status === 'suspended' ? (
                              <button
                                onClick={() => activateUser(user._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => suspendUser(user._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                              >
                                Suspend
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowModal(true);
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                // Navigate to messages page with pre-filled recipient
                                window.location.href = `/admin/messages?compose=true&to=${user._id}`;
                              }}
                              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                            >
                              Message
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.lastLoginAt ? `Last active: ${formatDate(user.lastLoginAt)}` : 'Never logged in'}
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

        {/* Edit User Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isEditing ? 'Edit User' : 'User Details'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setIsEditing(false);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                {isEditing ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={editingUser.profile.name}
                          onChange={(e) => handleEditInputChange('profile.name', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="Enter user's full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => handleEditInputChange('email', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role *
                        </label>
                        <select
                          value={editingUser.role}
                          onChange={(e) => handleEditInputChange('role', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        >
                          <option value="CUSTOMER">Customer</option>
                          <option value="PARTNER">Partner</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status *
                        </label>
                        <select
                          value={editingUser.status}
                          onChange={(e) => handleEditInputChange('status', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editingUser.profile.phone}
                          onChange={(e) => handleEditInputChange('profile.phone', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={editingUser.profile.city}
                          onChange={(e) => handleEditInputChange('profile.city', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="Enter city"
                        />
                      </div>
                    </div>

                    {/* Role-specific Information */}
                    <div className="border-t pt-4">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Role Information</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {editingUser.role === 'CUSTOMER' && (
                          <div className="text-sm text-gray-600">
                            <p className="font-medium mb-2">Customer Account:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Can browse and book vehicles</li>
                              <li>Track booking history</li>
                              <li>Manage profile and preferences</li>
                              <li>Access customer support</li>
                            </ul>
                          </div>
                        )}
                        {editingUser.role === 'PARTNER' && (
                          <div className="text-sm text-gray-600">
                            <p className="font-medium mb-2">Partner Account:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Can accept delivery assignments</li>
                              <li>Track earnings and performance</li>
                              <li>Update GPS location</li>
                              <li>Manage delivery schedule</li>
                            </ul>
                          </div>
                        )}
                        {editingUser.role === 'ADMIN' && (
                          <div className="text-sm text-gray-600">
                            <p className="font-medium mb-2">Admin Account:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Full system access and control</li>
                              <li>Manage users, products, and bookings</li>
                              <li>View analytics and reports</li>
                              <li>System configuration and settings</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-sm text-gray-900">{selectedUser.profile.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{selectedUser.profile.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">City</p>
                      <p className="text-sm text-gray-900">{selectedUser.profile.city || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created</p>
                      <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Login</p>
                      <p className="text-sm text-gray-900">
                        {selectedUser.lastLoginAt ? formatDate(selectedUser.lastLoginAt) : 'Never'}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setIsEditing(false);
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    {isEditing ? 'Cancel' : 'Close'}
                  </button>
                  {isEditing ? (
                    <button
                      onClick={handleSaveUser}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Edit User
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={newUser.profile.name}
                        onChange={(e) => handleInputChange('profile.name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter user's full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter password (min 6 characters)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="PARTNER">Partner</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={newUser.profile.phone}
                        onChange={(e) => handleInputChange('profile.phone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={newUser.profile.city}
                        onChange={(e) => handleInputChange('profile.city', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status *
                      </label>
                      <select
                        value={newUser.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  {/* Role-specific Information */}
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Role Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {newUser.role === 'CUSTOMER' && (
                        <div className="text-sm text-gray-600">
                          <p className="font-medium mb-2">Customer Account:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Can browse and book vehicles</li>
                            <li>Track booking history</li>
                            <li>Manage profile and preferences</li>
                            <li>Access customer support</li>
                          </ul>
                        </div>
                      )}
                      {newUser.role === 'PARTNER' && (
                        <div className="text-sm text-gray-600">
                          <p className="font-medium mb-2">Partner Account:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Can accept delivery assignments</li>
                            <li>Track earnings and performance</li>
                            <li>Update GPS location</li>
                            <li>Manage delivery schedule</li>
                          </ul>
                        </div>
                      )}
                      {newUser.role === 'ADMIN' && (
                        <div className="text-sm text-gray-600">
                          <p className="font-medium mb-2">Admin Account:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Full system access and control</li>
                            <li>Manage users, products, and bookings</li>
                            <li>View analytics and reports</li>
                            <li>System configuration and settings</li>
                          </ul>
                        </div>
                      )}
                    </div>
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
                    onClick={handleAddUser}
                    disabled={adding}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {adding ? 'Adding...' : 'Add User'}
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
