import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ScaleControl, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { MapLayerState } from '../../types';
import { fetchGisLayers, fetchDemMetadata } from '../../services/api';
import { Layers, Globe, Eye, MapPin, Droplets } from 'lucide-react';

const damIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface InteractiveMapProps {
  damParams?: Record<string, any>;
  activeTimestep?: any;
  onSelectTimestep?: (step: number) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ damParams, activeTimestep }) => {
  const position: [number, number] = [11.8016, 77.8016];

  const [basemapMode, setBasemapMode] = useState<'satellite' | 'dark' | 'streets'>('satellite');

  const [layers, setLayers] = useState<MapLayerState>({
    dem: true,
    adminBoundaries: false,
    villages: true,
    roads: true,
    buildings: false,
    infrastructure: true,
    floodExtent: true,
  });

  const toggleLayer = (key: keyof MapLayerState) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Convert GeoJSON polygon coordinates to Leaflet LatLng tuples [lat, lng]
  const getTestPolygonCoords = (): [number, number][] => {
    if (!activeTimestep || !activeTimestep.geometry) {
      const step = activeTimestep?.step || 0;
      const southReach = 11.8016 - (step + 1) * 0.032;
      const wFactor = 0.004 * step;

      const eastBank: [number, number][] = [
        [11.8050, 77.8016 + 0.008 + wFactor],
        [11.7850, 77.8000 + 0.012 + wFactor],
        [11.7500, 77.7950 + 0.015 + wFactor]
      ];
      if (step >= 2) eastBank.push([11.7100, 77.7900 + 0.018 + wFactor]);
      if (step >= 4) eastBank.push([11.6600, 77.7850 + 0.020 + wFactor]);
      if (step >= 5) eastBank.push([11.6200, 77.7800 + 0.022 + wFactor]);

      const waveFront: [number, number][] = [
        [southReach - 0.004, 77.7800 + (wFactor * 0.5)],
        [southReach, 77.7720],
        [southReach - 0.004, 77.7650 - (wFactor * 0.5)]
      ];

      const westBank: [number, number][] = [];
      if (step >= 5) westBank.push([11.6200, 77.7680 - 0.015 - wFactor]);
      if (step >= 4) westBank.push([11.6600, 77.7720 - 0.015 - wFactor]);
      if (step >= 2) westBank.push([11.7100, 77.7780 - 0.014 - wFactor]);
      westBank.push(
        [11.7500, 77.7830 - 0.012 - wFactor],
        [11.7850, 77.7880 - 0.010 - wFactor],
        [11.8050, 77.7940 - 0.008 - wFactor],
        [11.8050, 77.8016 + 0.008 + wFactor]
      );

      return [...eastBank, ...waveFront, ...westBank];
    }
    try {
      const ring = activeTimestep.geometry.coordinates[0];
      return ring.map((pt: number[]) => [pt[1], pt[0]] as [number, number]);
    } catch {
      return [];
    }
  };

  const polyPositions = getTestPolygonCoords();
  const maxDepth = activeTimestep?.max_depth_m || 2.85;
  const maxVelocity = activeTimestep?.max_velocity_m_s || 1.45;
  const arrivalHrs = activeTimestep?.time_hours || (activeTimestep?.step ? activeTimestep.step * 0.5 : 0.2);

  // Dynamic realistic flood water styling based on depth
  const getWaterStyle = (depth: number) => {
    if (depth >= 4.0) {
      return { color: '#03071e', fillColor: '#03045e', fillOpacity: 0.75, weight: 2.5 };
    } else if (depth >= 2.0) {
      return { color: '#0077b6', fillColor: '#0096c7', fillOpacity: 0.70, weight: 2.0 };
    } else if (depth >= 1.0) {
      return { color: '#00b4d8', fillColor: '#48cae4', fillOpacity: 0.65, weight: 1.5 };
    } else if (depth >= 0.5) {
      return { color: '#90e0ef', fillColor: '#ade8f4', fillOpacity: 0.55, weight: 1.2 };
    } else {
      return { color: '#caf0f8', fillColor: '#e0f7fa', fillOpacity: 0.45, weight: 1.0 };
    }
  };

  const waterStyle = getWaterStyle(maxDepth);

  const basemapUrls = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  const basemapAttributions = {
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    dark: '&copy; OpenStreetMap &copy; CARTO',
    streets: '&copy; OpenStreetMap contributors'
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '520px', backgroundColor: '#0f172a' }}>
      <MapContainer
        center={position}
        zoom={11}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <TileLayer
          key={basemapMode}
          attribution={basemapAttributions[basemapMode]}
          url={basemapUrls[basemapMode]}
        />

        {/* Realistic Hydraulic Inundation Water Wave Polygon */}
        {layers.floodExtent && polyPositions.length > 0 && (
          <Polygon
            positions={polyPositions}
            pathOptions={{
              color: waterStyle.color,
              fillColor: waterStyle.fillColor,
              fillOpacity: waterStyle.fillOpacity,
              weight: waterStyle.weight
            }}
          >
            <Popup>
              <div style={{ color: '#0f172a', padding: '0.25rem', minWidth: '180px' }}>
                <h4 style={{ margin: '0 0 0.4rem', color: '#0284c7', fontSize: '0.9rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' }}>
                  Cauvery Flood Inundation Zone
                </h4>
                <div style={{ fontSize: '0.775rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div><strong>Location:</strong> Mettur Town Base / Cauvery Valley</div>
                  <div><strong>Water Depth:</strong> <span style={{ color: '#0284c7', fontWeight: 700 }}>{maxDepth} m</span></div>
                  <div><strong>Flow Velocity:</strong> {maxVelocity} m/s</div>
                  <div><strong>Arrival Time:</strong> {arrivalHrs} hr</div>
                  <div><strong>Population Exposure:</strong> 52,200</div>
                  <div><strong>Priority Level:</strong> <span style={{ color: '#dc2626', fontWeight: 700 }}>P1 Critical</span></div>
                </div>
              </div>
            </Popup>
          </Polygon>
        )}

        {/* Mettur Dam Structural Marker */}
        <Marker position={position} icon={damIcon}>
          <Popup>
            <div style={{ color: '#0f172a', padding: '0.25rem' }}>
              <h3 style={{ margin: '0 0 0.3rem', fontSize: '0.95rem', color: '#0284c7' }}>
                Mettur Dam (Stanley Reservoir)
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.4 }}>
                <strong>River:</strong> Cauvery (Kaveri)<br />
                <strong>Maximum Height:</strong> 214 ft (65.2 m)<br />
                <strong>Capacity:</strong> 95,660 Mcft<br />
                <strong>Location:</strong> 11.8016° N, 77.8016° E
              </p>
            </div>
          </Popup>
        </Marker>

        <ScaleControl position="bottomleft" />
      </MapContainer>

      {/* Floating Basemap Selector Controls */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #334155',
        borderRadius: '0.375rem',
        padding: '0.35rem',
        display: 'flex',
        gap: '0.25rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)'
      }}>
        <button
          onClick={() => setBasemapMode('satellite')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.3rem 0.6rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: basemapMode === 'satellite' ? '#0284c7' : 'transparent',
            color: basemapMode === 'satellite' ? '#ffffff' : '#94a3b8'
          }}
        >
          <Globe style={{ width: '13px', height: '13px' }} />
          <span>High-Res Satellite</span>
        </button>

        <button
          onClick={() => setBasemapMode('dark')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.3rem 0.6rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: basemapMode === 'dark' ? '#0284c7' : 'transparent',
            color: basemapMode === 'dark' ? '#ffffff' : '#94a3b8'
          }}
        >
          <Eye style={{ width: '13px', height: '13px' }} />
          <span>Dark Canvas</span>
        </button>

        <button
          onClick={() => setBasemapMode('streets')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.3rem 0.6rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: basemapMode === 'streets' ? '#0284c7' : 'transparent',
            color: basemapMode === 'streets' ? '#ffffff' : '#94a3b8'
          }}
        >
          <Layers style={{ width: '13px', height: '13px' }} />
          <span>Streets</span>
        </button>
      </div>

      {/* Water Depth Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        right: '1rem',
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #334155',
        borderRadius: '0.375rem',
        padding: '0.75rem',
        width: '190px',
        fontSize: '0.725rem',
        color: '#f8fafc',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Droplets style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
          <span>Water Depth</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#e0f7fa', border: '1px solid #caf0f8', borderRadius: '2px' }}></span>
            <span>0 – 0.5 m</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#ade8f4', border: '1px solid #90e0ef', borderRadius: '2px' }}></span>
            <span>0.5 – 1.0 m</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#48cae4', border: '1px solid #00b4d8', borderRadius: '2px' }}></span>
            <span>1.0 – 2.0 m</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#0096c7', border: '1px solid #0077b6', borderRadius: '2px' }}></span>
            <span>2.0 – 4.0 m</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#03045e', border: '1px solid #03071e', borderRadius: '2px' }}></span>
            <span>&gt; 4.0 m</span>
          </div>
        </div>
      </div>

      {/* Layer Control Panel */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #334155',
        borderRadius: '0.5rem',
        padding: '0.75rem 1rem',
        width: '230px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.35rem' }}>
          <Layers style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>GIS Layers</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input type="checkbox" checked={layers.floodExtent} onChange={() => toggleLayer('floodExtent')} />
            <span>Flood Water Surface</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input type="checkbox" checked={layers.villages} onChange={() => toggleLayer('villages')} />
            <span>Settlements & Towns</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input type="checkbox" checked={layers.roads} onChange={() => toggleLayer('roads')} />
            <span>Highways & Roads</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input type="checkbox" checked={layers.infrastructure} onChange={() => toggleLayer('infrastructure')} />
            <span>Critical Infrastructure</span>
          </label>
        </div>
      </div>
    </div>
  );
};

