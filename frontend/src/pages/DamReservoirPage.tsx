import React from 'react';
import { DamParameters, ReservoirHistoryResponse } from '../types';
import { Building2, Database, ExternalLink, Table } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DamReservoirPageProps {
  damData?: DamParameters;
  reservoirData?: ReservoirHistoryResponse;
}

export const DamReservoirPage: React.FC<DamReservoirPageProps> = ({ damData, reservoirData }) => {
  const params = damData?.parameters || {};
  const meta = damData?.meta;
  const records = reservoirData?.records || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Info Banner */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111' }}>
              {params['Dam Name'] || 'Mettur Dam'} Specification & Reservoir Telemetry
            </h2>
            <span className={`badge badge-${meta?.data_status || 'verified'}`}>
              DATA STATUS: {meta?.data_status?.toUpperCase() || 'VERIFIED'}
            </span>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#333333', marginTop: '0.25rem' }}>
            River System: {params['River'] || 'Cauvery (Kaveri)'} | Catchment: {params['Catchment Area'] || '16,300 sq miles'}
          </p>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#666666', textAlign: 'right' }}>
          Source: {meta?.data_source === 'official' ? 'Tamil Nadu Agrisnet / WRD' : 'Prototype Repository'}<br />
          File: <code>{meta?.file_path ? meta.file_path.split(/[/\\\\]/).pop() : 'mettur_dam_dataset.csv'}</code>
        </div>
      </div>

      {/* Structural Geometry & Reservoir Capacity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Dam Structure Card */}
        <div className="card">
          <div className="card-title">
            <Building2 style={{ color: '#333333', width: '18px', height: '18px' }} />
            <span>Structural & Geometric Parameters</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Maximum Height</span>
              <strong style={{ color: '#111111' }}>{params['Maximum Height'] || '214 ft'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Dam Length</span>
              <strong style={{ color: '#111111' }}>{params['Dam Length'] || '5300 ft'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Maximum Width</span>
              <strong style={{ color: '#111111' }}>{params['Maximum Width'] || '171 ft'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Top Width</span>
              <strong style={{ color: '#111111' }}>{params['Top Width'] || '20 ft 5 in'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Tunnel Length</span>
              <strong style={{ color: '#111111' }}>{params['Tunnel Length'] || '4400 ft'}</strong>
            </div>
          </div>
        </div>

        {/* Reservoir Capacity Card */}
        <div className="card">
          <div className="card-title">
            <Database style={{ color: '#333333', width: '18px', height: '18px' }} />
            <span>Reservoir Hydrologic Limits</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Total Storage Capacity</span>
              <strong style={{ color: '#111111' }}>{params['Total Capacity'] || '95,660 Mcft'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Effective Usable Storage</span>
              <strong style={{ color: '#111111' }}>{params['Effective Capacity'] || '93,470 Mcft'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Max Reservoir Height (FRL)</span>
              <strong style={{ color: '#111111' }}>{params['Maximum Reservoir Height'] || '165 ft'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Usable Water Height</span>
              <strong style={{ color: '#111111' }}>{params['Usable Water Height'] || '120 ft'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Water Spread Area (FRL)</span>
              <strong style={{ color: '#111111' }}>{params['Maximum Water Spread Area'] || '59.25 sq miles'}</strong>
            </div>
          </div>
        </div>

        {/* Spillway Gates Card */}
        <div className="card">
          <div className="card-title">
            <ExternalLink style={{ color: '#333333', width: '18px', height: '18px' }} />
            <span>Spillways & Powerhouse Gates</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Main Spillway Gates</span>
              <strong style={{ color: '#111111' }}>{params['Spillway Gates'] || '16 × 60 ft × 20 ft'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Upper-level Sluices</span>
              <strong style={{ color: '#111111' }}>{params['Upper-level Gates'] || '8 × 10.6 ft × 16 ft'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Lower-level Sluices</span>
              <strong style={{ color: '#111111' }}>{params['Lower-level Gates'] || '5 × 7 ft × 14 ft'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Dam Powerhouse</span>
              <strong style={{ color: '#111111' }}>{params['Dam Powerhouse'] || '4 turbines'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #DEC9A8', paddingBottom: '0.35rem' }}>
              <span style={{ color: '#333333' }}>Tunnel Powerhouse</span>
              <strong style={{ color: '#111111' }}>{params['Tunnel Powerhouse'] || '4 turbines'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Reservoir Storage Time-Series Chart */}
      <div className="card">
        <div className="card-title">
          <Table style={{ color: '#333333', width: '18px', height: '18px' }} />
          <span>Historical Reservoir Telemetry & Storage Chart</span>
        </div>
        
        {records.length > 0 ? (
          <div style={{ width: '100%', height: '280px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={records}>
                <defs>
                  <linearGradient id="storageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B6234" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B6234" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DEC9A8" />
                <XAxis dataKey="date" stroke="#8B6234" fontSize={12} />
                <YAxis stroke="#8B6234" fontSize={12} unit=" Mcft" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAFAFA', borderColor: '#DEC9A8', borderRadius: '0.375rem', color: '#111111' }}
                />
                <Area type="monotone" dataKey="current_storage_Mcft" name="Storage (Mcft)" stroke="#8B6234" fillOpacity={1} fill="url(#storageGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#333333', padding: '1rem 0' }}>
            No historical reservoir records currently loaded.
          </p>
        )}
      </div>
    </div>
  );
};
