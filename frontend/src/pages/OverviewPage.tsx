import React from 'react';
import { DamParameters, SimulationStatus } from '../types';
import { Building2, MapPin, Database, Cpu, ArrowRight } from 'lucide-react';
import { InteractiveMap } from '../components/Map/InteractiveMap';

interface OverviewPageProps {
  damData?: DamParameters;
  simStatus?: SimulationStatus;
  dbStatus?: {
    type?: string;
    status?: string;
    database?: string;
    host?: string;
    message?: string;
  };
  onNavigate: (tab: any) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ damData, simStatus, dbStatus, onNavigate }) => {
  const params = damData?.parameters || {};
  const meta = damData?.meta;
  const isDbConnected = dbStatus?.status === 'connected';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Top Telemetry / Status Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {/* Dam Identity Card */}
        <div className="card">
          <div className="card-title">
            <Building2 style={{ color: '#333333', width: '20px', height: '20px' }} />
            <span>Target Dam Facility</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111' }}>
            {params['Dam Name'] || 'Mettur Dam'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#333333', marginTop: '0.2rem' }}>
            River: <strong>{params['River'] || 'Cauvery'}</strong>
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="badge">
              {meta?.data_status?.toUpperCase() || 'VERIFIED'} DATA
            </span>
            <span style={{ fontSize: '0.75rem', color: '#666666' }}>Salem District</span>
          </div>
        </div>

        {/* Study Area Bounds */}
        <div className="card">
          <div className="card-title">
            <MapPin style={{ color: '#333333', width: '20px', height: '20px' }} />
            <span>Study Area</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111' }}>
            Cauvery Downstream
          </div>
          <div style={{ fontSize: '0.8rem', color: '#333333', marginTop: '0.2rem' }}>
            Tamil Nadu Floodplains
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="badge">GEO-REFERENCED</span>
            <span style={{ fontSize: '0.75rem', color: '#666666' }}>11.8016° N, 77.8016° E</span>
          </div>
        </div>

        {/* Primary Database Status Card */}
        <div className="card">
          <div className="card-title">
            <Database style={{ color: '#333333', width: '20px', height: '20px' }} />
            <span>Primary Database</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111' }}>
            PostgreSQL + PostGIS
          </div>
          <div style={{ fontSize: '0.8rem', color: '#333333', marginTop: '0.2rem' }}>
            DB Name: <code>{dbStatus?.database || 'dam_safe'}</code>
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="badge">
              {isDbConnected ? 'CONNECTED' : 'NOT CONNECTED'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#666666' }}>
              {isDbConnected ? 'PostGIS Active' : 'Setup Required'}
            </span>
          </div>
        </div>

        {/* Simulation Engine Status */}
        <div className="card">
          <div className="card-title">
            <Cpu style={{ color: '#333333', width: '20px', height: '20px' }} />
            <span>Hydraulic Engine</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111' }}>
            {simStatus?.engine || 'Delft3D-FM'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#333333', marginTop: '0.2rem' }}>
            Binary: <code>{simStatus?.cli_binary || 'dflowfm-cli.exe'}</code>
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="badge">
              {simStatus?.integration_status || 'PENDING STEP 7'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#666666' }}>Prototype Mode</span>
          </div>
        </div>
      </div>

      {/* Main Interactive GIS Canvas */}
      <div className="card" style={{ flex: 1, minHeight: '500px', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #DEC9A8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAFA' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#111111' }}>
            <MapPin style={{ width: '16px', height: '16px', color: '#333333' }} />
            <span>DAM-SAFE Interactive Flood Map Workspace</span>
          </div>
          <button
            onClick={() => onNavigate('scenarios')}
            className="btn-primary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', width: 'auto' }}
          >
            <span>Configure Breach Scenario</span>
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <InteractiveMap damParams={params} />
        </div>
      </div>
    </div>
  );
};

