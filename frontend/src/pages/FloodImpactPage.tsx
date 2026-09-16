import React, { useState, useEffect } from 'react';
import { BarChart3, Users, MapPin, Building2, ArrowRight } from 'lucide-react';
import { fetchHadrReport } from '../services/api';

interface FloodImpactPageProps {
  activeRunId: string;
  onNavigate?: (tab: any) => void;
}

export const FloodImpactPage: React.FC<FloodImpactPageProps> = ({ activeRunId, onNavigate }) => {
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
        <p>Loading Flood Impact Analysis...</p>
      </div>
    );
  }

  const villages = report?.village_impact_results || [
    { village_id: 'V1', village_name: 'Mettur Town Base', district: 'Salem', taluk: 'Mettur', population_exposure: 52200, min_arrival_time_hrs: 0.2, max_water_depth_m: 3.35, max_velocity_m_s: 1.7, severity_level: 'EXTREME' },
    { village_id: 'V2', village_name: 'Navavoor / Ellis Colony', district: 'Salem', taluk: 'Mettur', population_exposure: 34100, min_arrival_time_hrs: 0.6, max_water_depth_m: 2.80, max_velocity_m_s: 1.4, severity_level: 'EXTREME' },
    { village_id: 'V3', village_name: 'Palamalai Reach', district: 'Salem', taluk: 'Mettur', population_exposure: 18500, min_arrival_time_hrs: 1.1, max_water_depth_m: 1.95, max_velocity_m_s: 1.1, severity_level: 'HIGH' },
    { village_id: 'V4', village_name: 'Koneripatti Inundation Sector', district: 'Salem', taluk: 'Omalur', population_exposure: 12400, min_arrival_time_hrs: 1.8, max_water_depth_m: 1.40, max_velocity_m_s: 0.8, severity_level: 'HIGH' },
    { village_id: 'V5', village_name: 'Poolampatti Riverbank Sector', district: 'Salem', taluk: 'Sankari', population_exposure: 8900, min_arrival_time_hrs: 2.3, max_water_depth_m: 0.90, max_velocity_m_s: 0.6, severity_level: 'MODERATE' },
    { village_id: 'V6', village_name: 'Bhavani Confluence Reach', district: 'Erode', taluk: 'Bhavani', population_exposure: 6300, min_arrival_time_hrs: 3.0, max_water_depth_m: 0.45, max_velocity_m_s: 0.4, severity_level: 'LOW' }
  ];

  const totalPop = villages.reduce((acc: number, v: any) => acc + (v.population_exposure || 0), 0);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'transparent' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', margin: '0 0 0.3rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BarChart3 style={{ width: '24px', height: '24px', color: '#333333' }} />
            FLOOD IMPACT ANALYSIS
          </h1>

        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('response')}
            className="btn-primary"
            style={{ width: 'auto', padding: '0.6rem 1.1rem', fontSize: '0.825rem', gap: '0.5rem' }}
          >
            <span>Response Priorities</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>

      {/* Top 4 Summary Cards Only */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333333', textTransform: 'uppercase' }}>Affected Area</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>
            42.5 km²
          </div>
          <div style={{ fontSize: '0.725rem', color: '#666666', marginTop: '0.2rem' }}>Downstream Cauvery Corridor</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333333', textTransform: 'uppercase' }}>Population Exposed</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>
            {totalPop.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#666666', marginTop: '0.2rem' }}>Census 2011 Baseline</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333333', textTransform: 'uppercase' }}>Settlements Affected</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>
            {villages.length} Villages
          </div>
          <div style={{ fontSize: '0.725rem', color: '#666666', marginTop: '0.2rem' }}>Salem & Erode Districts</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333333', textTransform: 'uppercase' }}>Critical Infrastructure</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>
            12 Facilities
          </div>
          <div style={{ fontSize: '0.725rem', color: '#666666', marginTop: '0.2rem' }}>Substations, Pumping Stations, Bridges</div>
        </div>
      </div>

      {/* Settlements Exposure Matrix */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111111', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users style={{ width: '18px', height: '18px', color: '#333333' }} />
          SETTLEMENT IMPACT BREAKDOWN
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #DEC9A8', color: '#333333', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Settlement</th>
                <th style={{ padding: '0.75rem' }}>District / Taluk</th>
                <th style={{ padding: '0.75rem' }}>Exposed Population</th>
                <th style={{ padding: '0.75rem' }}>Arrival Time</th>
                <th style={{ padding: '0.75rem' }}>Water Depth</th>
                <th style={{ padding: '0.75rem' }}>Flow Velocity</th>
                <th style={{ padding: '0.75rem' }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {villages.map((v: any) => (
                <tr key={v.village_id} style={{ borderBottom: '1px solid #DEC9A8' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#111111' }}>{v.village_name}</td>
                  <td style={{ padding: '0.75rem', color: '#333333' }}>{v.district} / {v.taluk}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#111111' }}>{v.population_exposure?.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem', color: '#333333', fontWeight: 600 }}>+{v.min_arrival_time_hrs} hr</td>
                  <td style={{ padding: '0.75rem', color: '#111111', fontWeight: 700 }}>{v.max_water_depth_m} m</td>
                  <td style={{ padding: '0.75rem', color: '#333333' }}>{v.max_velocity_m_s} m/s</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge">
                      {v.severity_level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


