import React, { useState, useEffect } from 'react';
import { Navigation, Home, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { fetchHadrReport } from '../services/api';

interface EvacuationPageProps {
  activeRunId: string;
  onNavigate?: (tab: any) => void;
}

export const EvacuationPage: React.FC<EvacuationPageProps> = ({ activeRunId, onNavigate }) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const rep = await fetchHadrReport(activeRunId);
      setReport(rep);
      setLoading(false);
    }
    loadData();
  }, [activeRunId]);

  if (loading) {
    return (
      <div style={{ padding: '3rem', color: '#333333', textAlign: 'center' }}>
        <p>Loading Evacuation Plan...</p>
      </div>
    );
  }

  const evacZones = [
    { zone_code: 'ZONE 1', zone_name: 'Immediate Evacuation Zone', urgency: 'IMMEDIATE', priority: 'P1 CRITICAL', area: '12.4 km²', population: '52,200', arrival: '0.2 hr', depth: '3.35 m' },
    { zone_code: 'ZONE 2', zone_name: 'High Priority Evacuation Zone', urgency: 'HIGH PRIORITY', priority: 'P2 HIGH', area: '18.1 km²', population: '34,100', arrival: '0.6 hr', depth: '2.80 m' },
    { zone_code: 'ZONE 3', zone_name: 'Precautionary Advisory Zone', urgency: 'PRECAUTIONARY', priority: 'P3 MODERATE', area: '24.5 km²', population: '18,500', arrival: '1.1 hr', depth: '1.95 m' },
    { zone_code: 'ZONE 4', zone_name: 'Monitoring & Buffer Zone', urgency: 'MONITOR', priority: 'P4 LOW', area: '35.0 km²', population: '12,400', arrival: '1.8 hr', depth: '0.90 m' }
  ];

  const routes = report?.route_analysis || [
    { road_name: 'NH-844 Mettur Highway Corridor', road_type: 'National Highway', status: 'SEVERELY AFFECTED', max_water_depth_m: 2.8, passable_status: 'IMPASSABLE', alternative_route_info: 'Reroute via Omalur Bypass (State Highway 86)' },
    { road_name: 'SH-20 Salem-Mettur Main Road', road_type: 'State Highway', status: 'AFFECTED', max_water_depth_m: 1.4, passable_status: 'HEAVY VEHICLES ONLY', alternative_route_info: 'Use Mecheri Link Road' },
    { road_name: 'SH-86 Omalur-Mecheri Link Highway', road_type: 'State Highway', status: 'AT RISK', max_water_depth_m: 0.4, passable_status: 'OPEN WITH CAUTION', alternative_route_info: 'Primary Evacuation Corridor' },
    { road_name: 'Bhavani Riverbank Road', road_type: 'District Road', status: 'OPEN', max_water_depth_m: 0.0, passable_status: 'FULLY OPEN', alternative_route_info: 'Safe Shelter Access Route' }
  ];

  const shelters = report?.staging_shelters || [
    { shelter_name: 'Mettur Government Higher Secondary School', district: 'Salem', taluk: 'Mettur', capacity: 1500, current_occupancy: 420, contact_person: 'District Revenue Officer', contact_phone: '+91 427 2450001', status: 'OPERATIONAL' },
    { shelter_name: 'Salem Polytechnic Campus Staging Hub', district: 'Salem', taluk: 'Omalur', capacity: 2800, current_occupancy: 850, contact_person: 'Emergency Relief Superintendent', contact_phone: '+91 427 2450002', status: 'OPERATIONAL' },
    { shelter_name: 'Mecheri Community Relief Center', district: 'Salem', taluk: 'Omalur', capacity: 1200, current_occupancy: 310, contact_person: 'Tahsildar Mecheri', contact_phone: '+91 427 2450003', status: 'READY' }
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'transparent' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', margin: '0 0 0.3rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Navigation style={{ width: '24px', height: '24px', color: '#333333' }} />
            EVACUATION DECISION SUPPORT
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#333333', margin: 0 }}>
            Sector zoning, road usability status, and relief shelter capacity.
          </p>
        </div>


      </div>

      {/* Evacuation Priority Zones */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111111', marginBottom: '0.85rem' }}>
          EVACUATION PRIORITY ZONES
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {evacZones.map((z) => {
            return (
              <div key={z.zone_code} className="card" style={{ padding: '1.25rem', borderTop: '3px solid #8B6234' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#333333' }}>{z.zone_code}</span>
                  <span className="badge">
                    {z.urgency}
                  </span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111111', margin: '0 0 0.85rem' }}>
                  {z.zone_name}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: '#333333', borderTop: '1px solid #DEC9A8', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#333333' }}>Sector Population:</span>
                    <strong style={{ color: '#111111' }}>{z.population}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#333333' }}>Earliest Arrival:</span>
                    <strong style={{ color: '#111111' }}>+{z.arrival}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#333333' }}>Max Water Depth:</span>
                    <strong style={{ color: '#111111' }}>{z.depth}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Road Status */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111111', marginBottom: '1rem' }}>
          ROAD STATUS & HIGHWAY CORRIDORS
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {routes.map((r: any, idx: number) => {
            return (
              <div key={idx} style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', borderLeft: '4px solid #8B6234', borderRadius: '0.5rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111111' }}>{r.road_name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#333333', marginTop: '0.2rem' }}>
                    Type: {r.road_type} | Depth: <strong style={{ color: '#111111' }}>{r.max_water_depth_m} m</strong> ({r.passable_status})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#333333', marginTop: '0.3rem' }}>
                    Reroute Info: <strong>{r.alternative_route_info}</strong>
                  </div>
                </div>

                <span className="badge">
                  {r.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reliet Staging Shelters */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111111', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Home style={{ width: '18px', height: '18px', color: '#333333' }} />
          RELIEF STAGING SHELTERS
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {shelters.map((s: any, idx: number) => (
            <div key={idx} style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', borderRadius: '0.5rem', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111111', margin: 0 }}>{s.shelter_name}</h4>
                <span className="badge">
                  {s.status || 'OPERATIONAL'}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#333333', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div>District / Taluk: <strong>{s.district} / {s.taluk}</strong></div>
                <div>Capacity: <strong style={{ color: '#111111' }}>{s.capacity?.toLocaleString()} beds</strong></div>
                <div>Current Occupancy: {s.current_occupancy || 0}</div>
                <div>Officer: {s.contact_person} ({s.contact_phone})</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


