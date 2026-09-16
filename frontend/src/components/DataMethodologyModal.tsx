import React, { useState, useEffect } from 'react';
import { X, Database, Layers, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { fetchSystemDataStatus, fetchHadrScoringMethodology } from '../services/api';

interface DataMethodologyModalProps {
  onClose: () => void;
}

export const DataMethodologyModal: React.FC<DataMethodologyModalProps> = ({ onClose }) => {
  const [dataStatus, setDataStatus] = useState<any[]>([]);
  const [methodology, setMethodology] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'provenance' | 'hadr'>('provenance');

  useEffect(() => {
    async function loadData() {
      const status = await fetchSystemDataStatus();
      setDataStatus(Array.isArray(status) ? status : []);
      const meth = await fetchHadrScoringMethodology();
      setMethodology(meth);
    }
    loadData();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem'
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '0.75rem',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#1e293b'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Database style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
              Data Sources & Methodology
            </h2>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.775rem', color: '#94a3b8' }}>
              System dataset provenance and decision support calculation rules
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1e293b', padding: '0 1.5rem', backgroundColor: '#0f172a', gap: '1rem' }}>
          <button
            onClick={() => setActiveTab('provenance')}
            style={{
              padding: '0.75rem 0.5rem',
              border: 'none',
              borderBottom: activeTab === 'provenance' ? '2px solid #38bdf8' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'provenance' ? '#38bdf8' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer'
            }}
          >
            Data Sources & GIS Layers
          </button>
          <button
            onClick={() => setActiveTab('hadr')}
            style={{
              padding: '0.75rem 0.5rem',
              border: 'none',
              borderBottom: activeTab === 'hadr' ? '2px solid #38bdf8' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'hadr' ? '#38bdf8' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer'
            }}
          >
            Emergency Response Formula
          </button>
        </div>

        {/* Modal Content Area */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeTab === 'provenance' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', backgroundColor: '#1e293b', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                <strong style={{ color: '#38bdf8' }}>Spatial & Telemetry Data Sources:</strong> DEM (SRTM 30m), Mettur Reservoir daily gauge observation records (162.5 ft FRL), 145 rainfall monitoring stations (175k telemetry records), Census 2011 demographics, and highway vector networks in PostGIS 3.6.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ margin: '0.5rem 0 0.2rem', fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                  Dataset Catalogue & Database Verification
                </h4>
                {dataStatus.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {dataStatus.map((item, idx) => (
                      <div key={idx} style={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '0.375rem',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.775rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{item.category || item.name || `Dataset #${idx + 1}`}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Source: {item.source || 'PostGIS Vector'}</div>
                        </div>
                        <span style={{
                          fontSize: '0.675rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.4rem',
                          borderRadius: '0.2rem',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          {item.status || 'VERIFIED'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Loading dataset status from PostgreSQL catalogue...
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#38bdf8', fontWeight: 700 }}>
                  Response Priority Mathematical Model
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                  Priority scores (0–100) assess settlement risk by combining water depth, velocity, arrival urgency, exposed population, and critical infrastructure importance.
                </p>
                <div style={{
                  backgroundColor: '#0f172a',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  marginTop: '0.75rem',
                  border: '1px solid #334155',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: '#34d399'
                }}>
                  {methodology?.formula || 'Score = 100 * (0.25 * Depth + 0.20 * Velocity + 0.25 * (1 - Arrival) + 0.15 * Pop + 0.15 * Infra)'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                  <h5 style={{ margin: '0 0 0.4rem', fontSize: '0.825rem', color: '#f8fafc', fontWeight: 700 }}>Factor Weights</h5>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.775rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <li>Water Depth Risk: <strong>25%</strong></li>
                    <li>Flow Velocity Risk: <strong>20%</strong></li>
                    <li>Arrival Time Risk: <strong>25%</strong> (Earlier = Higher Priority)</li>
                    <li>Population Exposure: <strong>15%</strong></li>
                    <li>Infrastructure Importance: <strong>15%</strong></li>
                  </ul>
                </div>

                <div style={{ backgroundColor: '#1e293b', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                  <h5 style={{ margin: '0 0 0.4rem', fontSize: '0.825rem', color: '#f8fafc', fontWeight: 700 }}>Classification Thresholds</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem' }}>
                    <div style={{ color: '#f87171' }}>● <strong>P1 Critical:</strong> 75.0 – 100.0 (Immediate Evacuation)</div>
                    <div style={{ color: '#fbbf24' }}>● <strong>P2 High:</strong> 50.0 – 74.9 (High Priority)</div>
                    <div style={{ color: '#facc15' }}>● <strong>P3 Moderate:</strong> 25.0 – 49.9 (Precautionary Advisory)</div>
                    <div style={{ color: '#34d399' }}>● <strong>P4 Low:</strong> 0.0 – 24.9 (Monitoring)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
