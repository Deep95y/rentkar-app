// src/app/admin/products/page.tsx
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
  createdAt: string;
  updatedAt: string;
  totalBookings: number;
  revenue: number;
};

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState({
    name: '',
    category: '2-wheeler',
    city: 'mumbai',
    deposit: 0,
    stock: 0,
    status: 'active' as 'active' | 'inactive',
    plans: [{ durationDays: 1, price: 0 }],
  });
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '2-wheeler',
    city: 'mumbai',
    deposit: 0,
    stock: 0,
    status: 'active' as 'active' | 'inactive',
    plans: [{ durationDays: 1, price: 0 }],
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get all products
      const sampleProducts: Product[] = [
        {
          _id: '1',
          name: 'Basic Scooter',
          category: '2-wheeler',
          images: ['https://example.com/scooter1.jpg'],
          deposit: 1000,
          plans: [
            { durationDays: 1, price: 590 },
            { durationDays: 2, price: 1000 },
            { durationDays: 7, price: 3000 }
          ],
          city: 'mumbai',
          stock: 5,
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
          totalBookings: 45,
          revenue: 22500,
        },
        {
          _id: '2',
          name: 'Premium Scooter',
          category: '2-wheeler',
          images: ['https://example.com/scooter2.jpg'],
          deposit: 1500,
          plans: [
            { durationDays: 1, price: 790 },
            { durationDays: 2, price: 1400 },
            { durationDays: 7, price: 4200 }
          ],
          city: 'mumbai',
          stock: 3,
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
          totalBookings: 28,
          revenue: 19600,
        },
        {
          _id: '3',
          name: 'Electric Bike',
          category: '2-wheeler',
          images: ['https://example.com/bike1.jpg'],
          deposit: 2000,
          plans: [
            { durationDays: 1, price: 1200 },
            { durationDays: 2, price: 2200 },
            { durationDays: 7, price: 7000 }
          ],
          city: 'mumbai',
          stock: 2,
          status: 'inactive',
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-18T15:00:00Z',
          totalBookings: 12,
          revenue: 14400,
        },
        {
          _id: '4',
          name: 'Compact Car',
          category: '4-wheeler',
          images: ['https://example.com/car1.jpg'],
          deposit: 5000,
          plans: [
            { durationDays: 1, price: 2500 },
            { durationDays: 2, price: 4500 },
            { durationDays: 7, price: 15000 }
          ],
          city: 'mumbai',
          stock: 1,
          status: 'active',
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
          totalBookings: 8,
          revenue: 20000,
        },
      ];
      setProducts(sampleProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId: string, newStatus: string) => {
    try {
      // This would be a real API call to update product status
      setProducts(prev => prev.map(product => 
        product._id === productId 
          ? { ...product, status: newStatus as any, updatedAt: new Date().toISOString() }
          : product
      ));
      alert(`Product status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product status');
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    try {
      // This would be a real API call to update stock
      setProducts(prev => prev.map(product => 
        product._id === productId 
          ? { ...product, stock: newStock, updatedAt: new Date().toISOString() }
          : product
      ));
      alert(`Stock updated to ${newStock}`);
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  const exportToCSV = () => {
    try {
      // Prepare CSV data
      const csvData = filteredProducts.map(product => ({
        'Product ID': product._id,
        'Name': product.name,
        'Category': product.category,
        'City': product.city,
        'Status': product.status,
        'Stock': product.stock,
        'Deposit': product.deposit,
        'Total Bookings': product.totalBookings,
        'Revenue': product.revenue,
        'Pricing Plans': product.plans.map(plan => `${plan.durationDays} days: ₹${plan.price}`).join('; '),
        'Created At': formatDate(product.createdAt),
        'Updated At': formatDate(product.updatedAt),
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
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Exported ${filteredProducts.length} products to CSV successfully!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleAddProduct = async () => {
    try {
      setAdding(true);
      
      // Validate required fields
      if (!newProduct.name || !newProduct.category || !newProduct.city || newProduct.deposit <= 0 || newProduct.stock < 0) {
        alert('Please fill in all required fields with valid values');
        return;
      }

      // Validate pricing plans
      if (newProduct.plans.length === 0 || newProduct.plans.some(plan => plan.durationDays <= 0 || plan.price <= 0)) {
        alert('Please add at least one valid pricing plan');
        return;
      }

      // This would be a real API call to add product
      const productId = (products.length + 1).toString();
      const newProductData: Product = {
        _id: productId,
        name: newProduct.name,
        category: newProduct.category,
        images: [], // Default empty images array
        deposit: newProduct.deposit,
        plans: newProduct.plans,
        city: newProduct.city,
        stock: newProduct.stock,
        status: newProduct.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalBookings: 0,
        revenue: 0,
      };

      setProducts(prev => [newProductData, ...prev]);
      
      // Reset form
      setNewProduct({
        name: '',
        category: '2-wheeler',
        city: 'mumbai',
        deposit: 0,
        stock: 0,
        status: 'active',
        plans: [{ durationDays: 1, price: 0 }],
      });
      
      setShowAddModal(false);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPricingPlan = () => {
    setNewProduct(prev => ({
      ...prev,
      plans: [...prev.plans, { durationDays: 1, price: 0 }]
    }));
  };

  const removePricingPlan = (index: number) => {
    if (newProduct.plans.length > 1) {
      setNewProduct(prev => ({
        ...prev,
        plans: prev.plans.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePricingPlan = (index: number, field: 'durationDays' | 'price', value: number) => {
    setNewProduct(prev => ({
      ...prev,
      plans: prev.plans.map((plan, i) => 
        i === index ? { ...plan, [field]: value } : plan
      )
    }));
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditingProduct({
      name: product.name,
      category: product.category,
      city: product.city,
      deposit: product.deposit,
      stock: product.stock,
      status: product.status,
      plans: product.plans,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      setSaving(true);
      
      if (!selectedProduct) return;

      // Validate required fields
      if (!editingProduct.name || !editingProduct.category || !editingProduct.city || editingProduct.deposit <= 0 || editingProduct.stock < 0) {
        alert('Please fill in all required fields with valid values');
        return;
      }

      // Validate pricing plans
      if (editingProduct.plans.length === 0 || editingProduct.plans.some(plan => plan.durationDays <= 0 || plan.price <= 0)) {
        alert('Please add at least one valid pricing plan');
        return;
      }

      // This would be a real API call to update product
      setProducts(prev => prev.map(product => 
        product._id === selectedProduct._id 
          ? {
              ...product,
              name: editingProduct.name,
              category: editingProduct.category,
              city: editingProduct.city,
              deposit: editingProduct.deposit,
              stock: editingProduct.stock,
              status: editingProduct.status,
              plans: editingProduct.plans,
              updatedAt: new Date().toISOString(),
            }
          : product
      ));

      setShowModal(false);
      setIsEditing(false);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditInputChange = (field: string, value: any) => {
    setEditingProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addEditPricingPlan = () => {
    setEditingProduct(prev => ({
      ...prev,
      plans: [...prev.plans, { durationDays: 1, price: 0 }]
    }));
  };

  const removeEditPricingPlan = (index: number) => {
    if (editingProduct.plans.length > 1) {
      setEditingProduct(prev => ({
        ...prev,
        plans: prev.plans.filter((_, i) => i !== index)
      }));
    }
  };

  const updateEditPricingPlan = (index: number, field: 'durationDays' | 'price', value: number) => {
    setEditingProduct(prev => ({
      ...prev,
      plans: prev.plans.map((plan, i) => 
        i === index ? { ...plan, [field]: value } : plan
      )
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '2-wheeler': return '🏍️';
      case '4-wheeler': return '🚗';
      case 'bicycle': return '🚲';
      default: return '📦';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' || product.status === filter;
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.city.toLowerCase().includes(searchTerm.toLowerCase());
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
                <p className="text-gray-600">View and manage product catalog</p>
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
                  Add Product
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
                      <option value="all">All Products</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      placeholder="Search by name, category, or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Products ({filteredProducts.length})
                </h3>
              </div>
              <div className="px-6 py-4">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
                                <p className="text-sm text-gray-500">{product.category} • {product.city}</p>
                                <p className="text-sm text-gray-500">Deposit: {formatCurrency(product.deposit)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                              {product.status.toUpperCase()}
                            </span>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">Stock: {product.stock}</p>
                              <p className="text-sm text-gray-500">{product.totalBookings} bookings</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Pricing Plans</p>
                            <div className="space-y-1">
                              {product.plans.map((plan, index) => (
                                <p key={index} className="text-sm text-gray-900">
                                  {plan.durationDays} day(s): {formatCurrency(plan.price)}
                                </p>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Performance</p>
                            <p className="text-sm text-gray-900">Bookings: {product.totalBookings}</p>
                            <p className="text-sm text-gray-900">Revenue: {formatCurrency(product.revenue)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Last Updated</p>
                            <p className="text-sm text-gray-900">{formatDate(product.updatedAt)}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                const newStatus = product.status === 'active' ? 'inactive' : 'active';
                                updateProductStatus(product._id, newStatus);
                              }}
                              className={`px-3 py-1 rounded text-sm ${
                                product.status === 'active' 
                                  ? 'bg-red-600 text-white hover:bg-red-700' 
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {product.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                            >
                              Edit Product
                            </button>
                            <button
                              onClick={() => {
                                window.location.href = `/admin/products/${product._id}/analytics`;
                              }}
                              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                            >
                              View Analytics
                            </button>
                          </div>
                          <div className="text-sm text-gray-500">
                            Created: {formatDate(product.createdAt)}
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

        {/* Edit Product Modal */}
        {showModal && selectedProduct && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isEditing ? 'Edit Product' : 'Product Details'}
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
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => handleEditInputChange('name', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => handleEditInputChange('category', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        >
                          <option value="2-wheeler">2-wheeler</option>
                          <option value="4-wheeler">4-wheeler</option>
                          <option value="bicycle">Bicycle</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={editingProduct.city}
                          onChange={(e) => handleEditInputChange('city', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status *
                        </label>
                        <select
                          value={editingProduct.status}
                          onChange={(e) => handleEditInputChange('status', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deposit Amount (₹) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editingProduct.deposit}
                          onChange={(e) => handleEditInputChange('deposit', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="Enter deposit amount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editingProduct.stock}
                          onChange={(e) => handleEditInputChange('stock', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="Enter stock quantity"
                        />
                      </div>
                    </div>

                    {/* Pricing Plans Section */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-medium text-gray-900">Pricing Plans *</h4>
                        <button
                          type="button"
                          onClick={addEditPricingPlan}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          + Add Plan
                        </button>
                      </div>
                      <div className="space-y-3">
                        {editingProduct.plans.map((plan, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration (Days)
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={plan.durationDays}
                                onChange={(e) => updateEditPricingPlan(index, 'durationDays', Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price (₹)
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={plan.price}
                                onChange={(e) => updateEditPricingPlan(index, 'price', Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                              />
                            </div>
                            {editingProduct.plans.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeEditPricingPlan(index)}
                                className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-sm text-gray-900">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="text-sm text-gray-900">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">City</p>
                      <p className="text-sm text-gray-900">{selectedProduct.city}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Deposit</p>
                      <p className="text-sm text-gray-900">{formatCurrency(selectedProduct.deposit)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Stock</p>
                      <p className="text-sm text-gray-900">{selectedProduct.stock}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProduct.status)}`}>
                        {selectedProduct.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pricing Plans</p>
                      <div className="space-y-1">
                        {selectedProduct.plans.map((plan, index) => (
                          <p key={index} className="text-sm text-gray-900">
                            {plan.durationDays} day(s): {formatCurrency(plan.price)}
                          </p>
                        ))}
                      </div>
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
                      onClick={handleSaveProduct}
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
                      Edit Product
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Product</h3>
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
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      >
                        <option value="2-wheeler">2-wheeler</option>
                        <option value="4-wheeler">4-wheeler</option>
                        <option value="bicycle">Bicycle</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={newProduct.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status *
                      </label>
                      <select
                        value={newProduct.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deposit Amount (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newProduct.deposit}
                        onChange={(e) => handleInputChange('deposit', Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter deposit amount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newProduct.stock}
                        onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter stock quantity"
                      />
                    </div>
                  </div>

                  {/* Pricing Plans Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-medium text-gray-900">Pricing Plans *</h4>
                      <button
                        type="button"
                        onClick={addPricingPlan}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        + Add Plan
                      </button>
                    </div>
                    <div className="space-y-3">
                      {newProduct.plans.map((plan, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duration (Days)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={plan.durationDays}
                              onChange={(e) => updatePricingPlan(index, 'durationDays', Number(e.target.value))}
                              className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price (₹)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={plan.price}
                              onChange={(e) => updatePricingPlan(index, 'price', Number(e.target.value))}
                              className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                            />
                          </div>
                          {newProduct.plans.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePricingPlan(index)}
                              className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
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
                    onClick={handleAddProduct}
                    disabled={adding}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {adding ? 'Adding...' : 'Add Product'}
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
