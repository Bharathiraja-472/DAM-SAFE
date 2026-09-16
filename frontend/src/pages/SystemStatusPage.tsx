import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, Server, Database, Cpu } from 'lucide-react';
import { fetchSystemComponents } from '../services/api';

export const SystemStatusPage: React.FC = () => {
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchSystemComponents();
      setComponents(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    loadData();
  }, []);

  const getStatusStyle = (status: string) => {
    if (status.includes('ONLINE') || status.includes('CONNECTED') || status.includes('AVAILABLE') || status.includes('OPERATIONAL')) {
      return { bg: 'rgba(107, 78, 43, 0.08)', text: '#6B4E2B', border: '#DEC9A8' };
    }
    if (status.includes('INSTALLED') || status.includes('ISOLATED')) {
      return { bg: 'rgba(107, 78, 43, 0.06)', text: '#8B6234', border: '#DEC9A8' };
    }
    return { bg: '#FAFAFA', text: '#A07850', border: '#DEC9A8' };
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', color: '#333333', textAlign: 'center' }}>
        <p>Checking System Component Status...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', margin: '0 0 0.3rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Settings style={{ width: '24px', height: '24px', color: '#333333' }} />
          SYSTEM SETTINGS & TECHNICAL STATUS
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#333333', margin: 0 }}>
          Backend API services, PostgreSQL 18.3 / PostGIS 3.6 database, GIS DEM layers, and hydraulic engine status.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {components.map((item: any, idx: number) => {
          const st = getStatusStyle(item.status);
          return (
            <div key={idx} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111111', margin: 0 }}>{item.component}</h4>
                  <span style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    backgroundColor: st.bg,
                    color: st.text,
                    border: `1px solid ${st.border}`
                  }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#333333' }}>Category: {item.category}</div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#333333', marginTop: '1rem', backgroundColor: '#FAFAFA', padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #DEC9A8' }}>
                {item.notes}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

