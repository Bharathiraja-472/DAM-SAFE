import React, { useState, useEffect } from 'react';
import { Database, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Info } from 'lucide-react';
import { fetchSystemDataStatus } from '../services/api';

export const DataProvenancePage: React.FC = () => {
  const [dataMatrix, setDataMatrix] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchSystemDataStatus();
      setDataMatrix(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'REAL OBSERVATION': return { bg: 'rgba(107, 78, 43, 0.08)', text: '#6B4E2B', border: '#DEC9A8' };
      case 'DERIVED FROM REAL': return { bg: 'rgba(107, 78, 43, 0.06)', text: '#8B6234', border: '#DEC9A8' };
      case 'PROTOTYPE ASSUMPTION': return { bg: '#FAFAFA', text: '#8B6234', border: '#DEC9A8' };
      case 'DUMMY PROTOTYPE DATA': return { bg: '#FAFAFA', text: '#8B6234', border: '#DEC9A8' };
      case 'SYNTHETIC SOFTWARE TEST': return { bg: '#FAFAFA', text: '#8B6234', border: '#DEC9A8' };
      case 'BLOCKED BY REAL DATA': return { bg: '#FAFAFA', text: '#A07850', border: '#DEC9A8' };
      default: return { bg: '#FAFAFA', text: '#8B6234', border: '#DEC9A8' };
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: '#333333', textAlign: 'center' }}>
        <Database className="animate-spin" style={{ width: '32px', height: '32px', margin: '0 auto 1rem', color: '#333333' }} />
        <p>Loading Dataset Provenance Matrix...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Disclaimer Banner */}
      <div style={{
        backgroundColor: 'rgba(201, 162, 90, 0.1)',
        border: '1px solid #DEC9A8',
        borderRadius: '0.5rem',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <ShieldAlert style={{ width: '24px', height: '24px', color: '#333333', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111111' }}>
            STRICT DATA GOVERNANCE & PROVENANCE DECLARATION
          </div>
          <div style={{ fontSize: '0.75rem', color: '#333333', marginTop: '0.15rem' }}>
            Dummy prototype assets and Step 7 synthetic test data are explicitly labeled and never presented as real hydraulic observations.
          </div>
        </div>
      </div>

      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Database style={{ width: '26px', height: '26px', color: '#333333' }} />
          Project Dataset Governance & Provenance Matrix (16 Categories)
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#333333', marginTop: '0.2rem' }}>
          Itemized data source, status badge, coverage details, and scientific use permissions for every dataset category.
        </p>
      </div>

      {/* Dataset Matrix Table */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #DEC9A8', color: '#333333', textAlign: 'left' }}>
              <th style={{ padding: '0.6rem' }}>Cat #</th>
              <th style={{ padding: '0.6rem' }}>Dataset Name</th>
              <th style={{ padding: '0.6rem' }}>Governance Status</th>
              <th style={{ padding: '0.6rem' }}>Authoritative Data Source</th>
              <th style={{ padding: '0.6rem' }}>Scientific Use Permission</th>
            </tr>
          </thead>
          <tbody>
            {dataMatrix.map((item: any) => {
              const bStyle = getBadgeStyle(item.status);
              return (
                <tr key={item.cat_num} style={{ borderBottom: '1px solid #DEC9A8' }}>
                  <td style={{ padding: '0.65rem 0.6rem', color: '#333333', fontWeight: 600 }}>#{item.cat_num}</td>
                  <td style={{ padding: '0.65rem 0.6rem', fontWeight: 600, color: '#111111' }}>{item.name}</td>
                  <td style={{ padding: '0.65rem 0.6rem' }}>
                    <span style={{
                      padding: '0.25rem 0.55rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: bStyle.bg,
                      color: bStyle.text,
                      border: `1px solid ${bStyle.border}`
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.6rem', color: '#333333' }}>{item.source}</td>
                  <td style={{ padding: '0.65rem 0.6rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: item.scientific_use === 'Permitted' ? '#6B4E2B' : '#A07850'
                    }}>
                      {item.scientific_use}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
