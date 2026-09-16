import React, { useState, useEffect } from 'react';
import { ArrowRight, Map, Sliders, Clock } from 'lucide-react';
import { fetchDashboardSummary, fetchDamParameters } from '../services/api';

interface HomePageProps {
  onNavigate: (tab: any) => void;
  activeRunId: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, activeRunId }) => {
  const [summary, setSummary] = useState<any>(null);
  const [damParams, setDamParams] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchDashboardSummary(activeRunId);
      setSummary(data);
      const dam = await fetchDamParameters();
      setDamParams(dam?.parameters || {});
    }
    loadData();
  }, [activeRunId]);

  const flood = summary?.flood_status || {};
  const hadr = summary?.hadr_status || {};
  const scen = summary?.current_scenario || {};

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #DEC9A8',
        borderLeft: '5px solid #6B4E2B',
        borderRadius: '0.75rem',
        padding: '1.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 16px rgba(107, 78, 43, 0.08)'
      }}>
        <div style={{ maxWidth: '700px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111111', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            Hydravaa
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#666666', margin: 0, lineHeight: 1.5 }}>
            Dam-Break Flood Simulation & Emergency Decision Support System. Simulate downstream wave propagation and generate emergency response plans.
          </p>
        </div>

        {/* Primary Call to Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
          <button
            onClick={() => onNavigate('scenario')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#6B4E2B',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 14px rgba(107,78,43,0.25)'
            }}
          >
            <Sliders style={{ width: '18px', height: '18px' }} />
            <span>CREATE SCENARIO</span>
          </button>

          <button
            onClick={() => onNavigate('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#FAFAFA',
              color: '#111111',
              border: '1px solid #DEC9A8',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Map style={{ width: '18px', height: '18px', color: '#6B4E2B' }} />
            <span>VIEW FLOOD MAP</span>
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Mettur Dam Facility Card */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', margin: '0 0 0.25rem' }}>
              METTUR DAM
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#333333', margin: '0 0 1.25rem' }}>
              Cauvery River Stem | Salem District, Tamil Nadu
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', borderTop: '1px solid #DEC9A8', paddingTop: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#666666' }}>Reservoir Level</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111111', marginTop: '0.2rem' }}>
                  162.5 ft
                </div>
                <span style={{ fontSize: '0.7rem', color: '#666666' }}>FRL: 165.0 ft</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#666666' }}>Gross Storage</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111111', marginTop: '0.2rem' }}>
                  95,660 Mcft
                </div>
                <span style={{ fontSize: '0.7rem', color: '#666666' }}>2,708.8 Mm³</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#666666' }}>Study Area</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111111', marginTop: '0.3rem' }}>
                  Mettur → Erode
                </div>
                <span style={{ fontSize: '0.7rem', color: '#666666' }}>Downstream Reach</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px dashed #DEC9A8', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#333333' }}>
              Dam Height: <strong style={{ color: '#111111' }}>214 ft (65.2 m)</strong> | Spillway Gates: <strong style={{ color: '#111111' }}>16</strong>
            </div>
            <button
              onClick={() => onNavigate('scenario')}
              style={{ background: 'none', border: 'none', color: '#333333', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              Configure Scenario <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>

        {/* Recent Analysis Summary Card */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111111', margin: '0 0 0.35rem' }}>
              {scen.name || 'Mettur Dam Flood Analysis'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#333333', margin: '0 0 1rem' }}>
              Inundation model for 150 m breach opening over 3.0 hrs simulation horizon.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', backgroundColor: '#FAFAFA', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid #DEC9A8' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#666666' }}>Max Flood Depth</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111111' }}>
                  {flood.max_water_depth_m || 3.35} m
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#666666' }}>Affected Settlements</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111111' }}>
                  {hadr.p1_critical_count || 6} Villages
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#666666' }}>Population Exposed</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111111' }}>
                  {hadr.total_population_exposed ? hadr.total_population_exposed.toLocaleString() : '52,200'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#666666' }}>Top Priority Area</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>
                  {hadr.top_priority_settlement || 'Mettur Town Base'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => onNavigate('map')}
              className="btn-primary"
              style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              View Flood Animation
            </button>
            <button
              onClick={() => onNavigate('response')}
              style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', color: '#111111', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Response Priorities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
