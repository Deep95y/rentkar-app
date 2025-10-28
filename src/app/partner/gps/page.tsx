// src/app/partner/gps/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import InteractiveMap from '@/components/InteractiveMap';
import DeliveryMap from '@/components/DeliveryMap';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Location = {
  lat: number;
  lng: number;
  timestamp: string;
};

type DeliveryPoint = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
};

export default function PartnerGPS() {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoint[]>([]);
  const [showDeliveryMap, setShowDeliveryMap] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    loadDeliveryPoints();
  }, []);

  const loadDeliveryPoints = () => {
    // Sample delivery points for demonstration
    const sampleDeliveries: DeliveryPoint[] = [
      {
        id: '1',
        name: 'John Doe',
        address: '123 Main St, Mumbai',
        lat: 19.0760 + (Math.random() - 0.5) * 0.01,
        lng: 72.8777 + (Math.random() - 0.5) * 0.01,
        status: 'pending',
        priority: 'high'
      },
      {
        id: '2',
        name: 'Jane Smith',
        address: '456 Park Ave, Mumbai',
        lat: 19.0760 + (Math.random() - 0.5) * 0.01,
        lng: 72.8777 + (Math.random() - 0.5) * 0.01,
        status: 'pending',
        priority: 'medium'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        address: '789 Oak St, Mumbai',
        lat: 19.0760 + (Math.random() - 0.5) * 0.01,
        lng: 72.8777 + (Math.random() - 0.5) * 0.01,
        status: 'in_progress',
        priority: 'high'
      },
      {
        id: '4',
        name: 'Sarah Davis',
        address: '321 Pine St, Mumbai',
        lat: 19.0760 + (Math.random() - 0.5) * 0.01,
        lng: 72.8777 + (Math.random() - 0.5) * 0.01,
        status: 'completed',
        priority: 'low'
      }
    ];
    setDeliveryPoints(sampleDeliveries);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };
        setCurrentLocation(location);
        setError(null);
      },
      (error) => {
        setError('Error getting location: ' + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const updateLocation = async () => {
    if (!currentLocation) {
      alert('Please get your current location first');
      return;
    }

    try {
      setUpdating(true);
      
      // This would be a real API call to update partner location
      const response = await fetch('/api/partners/gps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        }),
      });

      if (response.ok) {
        // Add to location history
        setLocationHistory(prev => [currentLocation!, ...prev.slice(0, 9)]); // Keep last 10 locations
        alert('Location updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update location: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Failed to update location');
    } finally {
      setUpdating(false);
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    // In a real app, this would start continuous GPS tracking
    alert('GPS tracking started! Your location will be updated automatically.');
  };

  const stopTracking = () => {
    setIsTracking(false);
    alert('GPS tracking stopped.');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute requiredRole="PARTNER">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">GPS Tracking</h1>
                <p className="text-gray-600">Update your location for delivery tracking</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/partner/dashboard"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Dashboard
                </Link>
                <Link
                  href="/partner/deliveries"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  My Deliveries
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Location */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Current Location</h3>
                </div>
                <div className="px-6 py-4">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  
                  {currentLocation ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Latitude</p>
                          <p className="text-lg font-mono text-gray-900">{currentLocation.lat.toFixed(6)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Longitude</p>
                          <p className="text-lg font-mono text-gray-900">{currentLocation.lng.toFixed(6)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Updated</p>
                        <p className="text-sm text-gray-900">
                          {formatDate(currentLocation.timestamp)} at {formatTime(currentLocation.timestamp)}
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={getCurrentLocation}
                          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                        >
                          Refresh Location
                        </button>
                        <button
                          onClick={updateLocation}
                          disabled={updating}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {updating ? 'Updating...' : 'Update Location'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No location data</h3>
                      <p className="mt-1 text-sm text-gray-500">Get your current location to start tracking.</p>
                      <div className="mt-4">
                        <button
                          onClick={getCurrentLocation}
                          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                          Get Current Location
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tracking Controls */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Tracking Controls</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Auto Tracking</p>
                        <p className="text-sm text-gray-500">Automatically update location every 5 minutes</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isTracking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isTracking ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      {!isTracking ? (
                        <button
                          onClick={startTracking}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                        >
                          Start Tracking
                        </button>
                      ) : (
                        <button
                          onClick={stopTracking}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                        >
                          Stop Tracking
                        </button>
                      )}
                    </div>

                    <div className="p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Keep GPS tracking enabled for accurate delivery tracking and better customer experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location History */}
            {locationHistory.length > 0 && (
              <div className="mt-8">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Location History</h3>
                  </div>
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {locationHistory.map((location, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(location.timestamp)} at {formatTime(location.timestamp)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => {
                                const mapUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
                                window.open(mapUrl, '_blank');
                              }}
                              className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              View on Map
                            </button>
                            <button 
                              onClick={() => {
                                setCurrentLocation(location);
                                alert('Location updated to selected position');
                              }}
                              className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              Use This Location
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Map */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Location Map</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowDeliveryMap(!showDeliveryMap)}
                        className={`text-sm px-3 py-1 rounded ${
                          showDeliveryMap 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                      >
                        {showDeliveryMap ? 'Show Basic Map' : 'Show Delivery Map'}
                      </button>
                      <button
                        onClick={() => {
                          if (currentLocation) {
                            const mapUrl = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
                            window.open(mapUrl, '_blank');
                          }
                        }}
                        disabled={!currentLocation}
                        className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Open in Google Maps
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  {showDeliveryMap ? (
                    <DeliveryMap
                      currentLocation={currentLocation}
                      deliveryPoints={deliveryPoints}
                      onDeliverySelect={(delivery) => {
                        alert(`Selected delivery: ${delivery.name} - ${delivery.address}`);
                      }}
                      height="500px"
                    />
                  ) : (
                    <InteractiveMap
                      currentLocation={currentLocation}
                      locationHistory={locationHistory}
                      onLocationSelect={(location) => {
                        setCurrentLocation(location);
                        alert('Location updated to selected position');
                      }}
                      height="400px"
                    />
                  )}

                  {/* Map Controls and Info */}
                  {currentLocation && (
                    <div className="mt-4 space-y-4">
                      {/* Map Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-900">Current Position</span>
                          </div>
                          <p className="text-xs text-blue-700 mt-1">
                            Last updated: {formatTime(currentLocation.timestamp)}
                          </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-green-900">Tracking Status</span>
                          </div>
                          <p className="text-xs text-green-700 mt-1">
                            {isTracking ? 'Active' : 'Inactive'}
                          </p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm font-medium text-purple-900">Location History</span>
                          </div>
                          <p className="text-xs text-purple-700 mt-1">
                            {locationHistory.length} recent locations
                          </p>
                        </div>
                      </div>

                      {/* Delivery Points List */}
                      {showDeliveryMap && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Delivery Points</h4>
                          <div className="space-y-2">
                            {deliveryPoints.map((delivery) => (
                              <div key={delivery.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h5 className="text-sm font-medium text-gray-900">{delivery.name}</h5>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      delivery.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {delivery.status.toUpperCase()}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      delivery.priority === 'high' ? 'bg-red-100 text-red-800' :
                                      delivery.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {delivery.priority.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">{delivery.address}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => {
                                      const mapUrl = `https://www.google.com/maps?q=${delivery.lat},${delivery.lng}`;
                                      window.open(mapUrl, '_blank');
                                    }}
                                    className="text-xs text-indigo-600 hover:text-indigo-500"
                                  >
                                    Navigate
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Delivery Routes (if any) */}
                      {!showDeliveryMap && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Delivery Routes</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">No active deliveries</span>
                              <span className="text-gray-400">Routes will appear here when you have assigned deliveries</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
