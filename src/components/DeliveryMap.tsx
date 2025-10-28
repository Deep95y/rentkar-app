// src/components/DeliveryMap.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

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

type DeliveryMapProps = {
  currentLocation: Location | null;
  deliveryPoints: DeliveryPoint[];
  onDeliverySelect?: (delivery: DeliveryPoint) => void;
  height?: string;
};

export default function DeliveryMap({ 
  currentLocation, 
  deliveryPoints, 
  onDeliverySelect,
  height = "500px" 
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryPoint | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      loadDeliveryMap();
    }
  }, [currentLocation, deliveryPoints]);

  const loadDeliveryMap = () => {
    if (!mapRef.current || !currentLocation) return;

    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';

    const mapDiv = document.createElement('div');
    mapDiv.style.width = '100%';
    mapDiv.style.height = height;
    mapDiv.style.position = 'relative';
    mapDiv.style.background = '#f0f0f0';
    mapDiv.style.borderRadius = '8px';
    mapDiv.style.overflow = 'hidden';

    // Create map background with delivery points
    const tileContainer = document.createElement('div');
    tileContainer.style.width = '100%';
    tileContainer.style.height = '100%';
    tileContainer.style.background = 'linear-gradient(135deg, #e5f3ff 0%, #f0f8ff 100%)';
    tileContainer.style.position = 'relative';

    // Add current location marker (larger, pulsing)
    const currentMarker = document.createElement('div');
    currentMarker.style.position = 'absolute';
    currentMarker.style.top = '50%';
    currentMarker.style.left = '50%';
    currentMarker.style.transform = 'translate(-50%, -50%)';
    currentMarker.style.width = '24px';
    currentMarker.style.height = '24px';
    currentMarker.style.backgroundColor = '#ef4444';
    currentMarker.style.border = '4px solid white';
    currentMarker.style.borderRadius = '50%';
    currentMarker.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    currentMarker.style.cursor = 'pointer';
    currentMarker.style.zIndex = '20';
    currentMarker.style.animation = 'pulse 2s infinite';

    // Add delivery point markers
    deliveryPoints.forEach((delivery, index) => {
      const deliveryMarker = document.createElement('div');
      const offsetX = (index % 3) * 20 - 20; // Spread markers around
      const offsetY = Math.floor(index / 3) * 15 - 15;
      
      deliveryMarker.style.position = 'absolute';
      deliveryMarker.style.top = `${50 + offsetY}%`;
      deliveryMarker.style.left = `${50 + offsetX}%`;
      deliveryMarker.style.width = '16px';
      deliveryMarker.style.height = '16px';
      deliveryMarker.style.backgroundColor = getDeliveryColor(delivery.status);
      deliveryMarker.style.border = '2px solid white';
      deliveryMarker.style.borderRadius = '50%';
      deliveryMarker.style.cursor = 'pointer';
      deliveryMarker.style.zIndex = '10';
      deliveryMarker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      deliveryMarker.title = `${delivery.name} - ${delivery.address}`;

      // Add priority indicator
      if (delivery.priority === 'high') {
        deliveryMarker.style.border = '3px solid #f59e0b';
        deliveryMarker.style.animation = 'pulse 1.5s infinite';
      }

      deliveryMarker.onclick = () => {
        setSelectedDelivery(delivery);
        if (onDeliverySelect) {
          onDeliverySelect(delivery);
        }
      };

      tileContainer.appendChild(deliveryMarker);
    });

    // Add route lines if enabled
    if (showRoutes && deliveryPoints.length > 0) {
      const routeLine = document.createElement('div');
      routeLine.style.position = 'absolute';
      routeLine.style.top = '50%';
      routeLine.style.left = '50%';
      routeLine.style.width = '2px';
      routeLine.style.height = '100px';
      routeLine.style.backgroundColor = '#3b82f6';
      routeLine.style.transform = 'translate(-50%, -50%) rotate(45deg)';
      routeLine.style.opacity = '0.6';
      routeLine.style.zIndex = '5';

      tileContainer.appendChild(routeLine);
    }

    // Add map controls
    const controls = document.createElement('div');
    controls.style.position = 'absolute';
    controls.style.bottom = '10px';
    controls.style.right = '10px';
    controls.style.display = 'flex';
    controls.style.flexDirection = 'column';
    controls.style.gap = '8px';
    controls.style.zIndex = '20';

    const toggleRoutesBtn = document.createElement('button');
    toggleRoutesBtn.innerHTML = showRoutes ? '🚫' : '🛣️';
    toggleRoutesBtn.style.width = '40px';
    toggleRoutesBtn.style.height = '40px';
    toggleRoutesBtn.style.backgroundColor = 'white';
    toggleRoutesBtn.style.border = '1px solid #ddd';
    toggleRoutesBtn.style.borderRadius = '6px';
    toggleRoutesBtn.style.cursor = 'pointer';
    toggleRoutesBtn.style.fontSize = '16px';
    toggleRoutesBtn.title = showRoutes ? 'Hide Routes' : 'Show Routes';

    toggleRoutesBtn.onclick = () => {
      setShowRoutes(!showRoutes);
      loadDeliveryMap(); // Reload map
    };

    const openMapsBtn = document.createElement('button');
    openMapsBtn.innerHTML = '🗺️';
    openMapsBtn.style.width = '40px';
    openMapsBtn.style.height = '40px';
    openMapsBtn.style.backgroundColor = 'white';
    openMapsBtn.style.border = '1px solid #ddd';
    openMapsBtn.style.borderRadius = '6px';
    openMapsBtn.style.cursor = 'pointer';
    openMapsBtn.style.fontSize = '16px';
    openMapsBtn.title = 'Open in Google Maps';

    openMapsBtn.onclick = () => {
      const mapUrl = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
      window.open(mapUrl, '_blank');
    };

    controls.appendChild(toggleRoutesBtn);
    controls.appendChild(openMapsBtn);

    // Add location info overlay
    const infoOverlay = document.createElement('div');
    infoOverlay.style.position = 'absolute';
    infoOverlay.style.top = '10px';
    infoOverlay.style.left = '10px';
    infoOverlay.style.backgroundColor = 'white';
    infoOverlay.style.padding = '12px';
    infoOverlay.style.borderRadius = '8px';
    infoOverlay.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    infoOverlay.style.fontSize = '12px';
    infoOverlay.style.zIndex = '20';
    infoOverlay.style.maxWidth = '200px';

    infoOverlay.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <div style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%; animation: pulse 2s infinite;"></div>
        <span style="font-weight: 600;">Your Location</span>
      </div>
      <div style="color: #666; font-family: monospace; margin-bottom: 8px;">
        ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}
      </div>
      <div style="color: #666;">
        <div style="margin-bottom: 4px;">Deliveries: ${deliveryPoints.length}</div>
        <div>Pending: ${deliveryPoints.filter(d => d.status === 'pending').length}</div>
      </div>
    `;

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    tileContainer.appendChild(currentMarker);
    mapDiv.appendChild(tileContainer);
    mapDiv.appendChild(infoOverlay);
    mapDiv.appendChild(controls);
    mapContainer.appendChild(mapDiv);
  };

  const getDeliveryColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (!currentLocation) {
    return (
      <div 
        ref={mapRef}
        style={{ 
          width: '100%', 
          height, 
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚚</div>
          <div>No location data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} style={{ width: '100%', height }} />
      
      {/* Delivery Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg text-xs">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Pending Deliveries</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Selected Delivery Info */}
      {selectedDelivery && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm text-gray-900">{selectedDelivery.name}</h4>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              selectedDelivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              selectedDelivery.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {selectedDelivery.status.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2">{selectedDelivery.address}</p>
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded ${
              selectedDelivery.priority === 'high' ? 'bg-red-100 text-red-800' :
              selectedDelivery.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {selectedDelivery.priority.toUpperCase()} Priority
            </span>
            <button
              onClick={() => setSelectedDelivery(null)}
              className="text-xs text-indigo-600 hover:text-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delivery Summary */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg text-xs">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">Delivery Summary</div>
          <div className="text-gray-600">
            Total: {deliveryPoints.length} | 
            Pending: {deliveryPoints.filter(d => d.status === 'pending').length} | 
            In Progress: {deliveryPoints.filter(d => d.status === 'in_progress').length} | 
            Completed: {deliveryPoints.filter(d => d.status === 'completed').length}
          </div>
        </div>
      </div>
    </div>
  );
}
