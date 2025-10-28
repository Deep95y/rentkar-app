// src/components/InteractiveMap.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type Location = {
  lat: number;
  lng: number;
  timestamp: string;
};

type InteractiveMapProps = {
  currentLocation: Location | null;
  locationHistory: Location[];
  onLocationSelect?: (location: Location) => void;
  height?: string;
};

export default function InteractiveMap({ 
  currentLocation, 
  locationHistory, 
  onLocationSelect,
  height = "400px" 
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      loadMap();
    }
  }, [currentLocation]);

  const loadMap = () => {
    if (!mapRef.current || !currentLocation) return;

    // Create a simple map using OpenStreetMap tiles
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = ''; // Clear previous content

    // Create map container
    const mapDiv = document.createElement('div');
    mapDiv.style.width = '100%';
    mapDiv.style.height = height;
    mapDiv.style.position = 'relative';
    mapDiv.style.background = '#f0f0f0';
    mapDiv.style.borderRadius = '8px';
    mapDiv.style.overflow = 'hidden';

    // Create map tiles (simplified version)
    const tileContainer = document.createElement('div');
    tileContainer.style.width = '100%';
    tileContainer.style.height = '100%';
    tileContainer.style.background = `url('https://tile.openstreetmap.org/15/${Math.floor(currentLocation.lat * 1000000) % 256}/${Math.floor(currentLocation.lng * 1000000) % 256}.png') center/cover`;
    tileContainer.style.position = 'relative';

    // Add current location marker
    const marker = document.createElement('div');
    marker.style.position = 'absolute';
    marker.style.top = '50%';
    marker.style.left = '50%';
    marker.style.transform = 'translate(-50%, -50%)';
    marker.style.width = '20px';
    marker.style.height = '20px';
    marker.style.backgroundColor = '#ef4444';
    marker.style.border = '3px solid white';
    marker.style.borderRadius = '50%';
    marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    marker.style.cursor = 'pointer';
    marker.style.zIndex = '10';

    // Add pulsing animation
    marker.style.animation = 'pulse 2s infinite';

    // Add location info overlay
    const infoOverlay = document.createElement('div');
    infoOverlay.style.position = 'absolute';
    infoOverlay.style.top = '10px';
    infoOverlay.style.left = '10px';
    infoOverlay.style.backgroundColor = 'white';
    infoOverlay.style.padding = '8px 12px';
    infoOverlay.style.borderRadius = '6px';
    infoOverlay.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    infoOverlay.style.fontSize = '12px';
    infoOverlay.style.zIndex = '10';

    infoOverlay.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px;">
        <div style="width: 8px; height: 8px; background: #ef4444; border-radius: 50%; animation: pulse 2s infinite;"></div>
        <span style="font-weight: 500;">Your Location</span>
      </div>
      <div style="margin-top: 4px; color: #666; font-family: monospace;">
        ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}
      </div>
    `;

    // Add controls
    const controls = document.createElement('div');
    controls.style.position = 'absolute';
    controls.style.bottom = '10px';
    controls.style.right = '10px';
    controls.style.display = 'flex';
    controls.style.gap = '8px';
    controls.style.zIndex = '10';

    const zoomInBtn = document.createElement('button');
    zoomInBtn.innerHTML = '+';
    zoomInBtn.style.width = '32px';
    zoomInBtn.style.height = '32px';
    zoomInBtn.style.backgroundColor = 'white';
    zoomInBtn.style.border = '1px solid #ddd';
    zoomInBtn.style.borderRadius = '4px';
    zoomInBtn.style.cursor = 'pointer';
    zoomInBtn.style.fontSize = '16px';
    zoomInBtn.style.fontWeight = 'bold';

    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.innerHTML = '−';
    zoomOutBtn.style.width = '32px';
    zoomOutBtn.style.height = '32px';
    zoomOutBtn.style.backgroundColor = 'white';
    zoomOutBtn.style.border = '1px solid #ddd';
    zoomOutBtn.style.borderRadius = '4px';
    zoomOutBtn.style.cursor = 'pointer';
    zoomOutBtn.style.fontSize = '16px';
    zoomOutBtn.style.fontWeight = 'bold';

    const openMapsBtn = document.createElement('button');
    openMapsBtn.innerHTML = '🗺️';
    openMapsBtn.style.width = '32px';
    openMapsBtn.style.height = '32px';
    openMapsBtn.style.backgroundColor = 'white';
    openMapsBtn.style.border = '1px solid #ddd';
    openMapsBtn.style.borderRadius = '4px';
    openMapsBtn.style.cursor = 'pointer';
    openMapsBtn.style.fontSize = '14px';

    openMapsBtn.onclick = () => {
      const mapUrl = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
      window.open(mapUrl, '_blank');
    };

    controls.appendChild(zoomInBtn);
    controls.appendChild(zoomOutBtn);
    controls.appendChild(openMapsBtn);

    // Add history markers
    locationHistory.slice(0, 5).forEach((location, index) => {
      const historyMarker = document.createElement('div');
      historyMarker.style.position = 'absolute';
      historyMarker.style.top = `${50 + (index * 5)}%`;
      historyMarker.style.left = `${50 + (index * 3)}%`;
      historyMarker.style.width = '12px';
      historyMarker.style.height = '12px';
      historyMarker.style.backgroundColor = '#3b82f6';
      historyMarker.style.border = '2px solid white';
      historyMarker.style.borderRadius = '50%';
      historyMarker.style.cursor = 'pointer';
      historyMarker.style.zIndex = '5';
      historyMarker.title = `Location ${index + 1}: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;

      historyMarker.onclick = () => {
        setSelectedLocation(location);
        if (onLocationSelect) {
          onLocationSelect(location);
        }
      };

      tileContainer.appendChild(historyMarker);
    });

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

    tileContainer.appendChild(marker);
    mapDiv.appendChild(tileContainer);
    mapDiv.appendChild(infoOverlay);
    mapDiv.appendChild(controls);
    mapContainer.appendChild(mapDiv);

    setMapLoaded(true);
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
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
          <div>No location data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} style={{ width: '100%', height }} />
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg text-xs">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span>Current Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Previous Locations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Delivery Points</span>
          </div>
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
          <h4 className="font-medium text-sm text-gray-900">Selected Location</h4>
          <p className="text-xs text-gray-600 mt-1">
            {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(selectedLocation.timestamp).toLocaleString()}
          </p>
          <button
            onClick={() => {
              setSelectedLocation(null);
            }}
            className="mt-2 text-xs text-indigo-600 hover:text-indigo-500"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}
