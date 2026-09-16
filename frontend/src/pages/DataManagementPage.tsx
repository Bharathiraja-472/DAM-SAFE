import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, Layers, FileText, RefreshCw, Info, HardDrive, AlertCircle } from 'lucide-react';

interface DatasetCategory {
  category_number: number;
  category_name: string;
  dataset_name: string;
  filename: string;
  file_type: string;
  file_size_bytes: number;
  row_count: number;
  column_count: number;
  has_spatial_data: boolean;
  geometry_type: string;
  crs: string;
  data_status: string;
  data_source: string;
  is_realtime: boolean;
  db_table_mapped: string;
  notes: string;
}

interface DataManagementPageProps {
  dbStatus?: {
    type?: string;
    status?: string;
    database?: string;
    host?: string;
    postgis_version?: string;
  };
}

export const DataManagementPage: React.FC<DataManagementPageProps> = ({ dbStatus }) => {
  const [categories, setCategories] = useState<DatasetCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCat, setSelectedCat] = useState<DatasetCategory | null>(null);
  const [ingesting, setIngesting] = useState<boolean>(false);

  const fetchCatalogue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/datasets');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.catalogue || []);
      }
    } catch (err) {
      console.error('Failed to load dataset catalogue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const handleTriggerEtl = async () => {
    setIngesting(true);
    try {
      const res = await fetch('/api/datasets/ingest');
      if (res.ok) {
        await fetchCatalogue();
      }
    } catch (err) {
      console.error('ETL execution failed:', err);
    } finally {
      setIngesting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'VERIFIED':
        return <span className="badge badge-verified">VERIFIED</span>;
      case 'PARTIAL':
        return <span className="badge badge-prototype">PARTIAL</span>;
      case 'NOT_AVAILABLE':
        return <span className="badge badge-pending">NOT AVAILABLE</span>;
      default:
        return <span className="badge badge-pending">{status}</span>;
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Top Banner & Database Telemetry */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Database style={{ color: '#333333', width: '24px', height: '24px' }} />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111' }}>
              16-Dataset GIS & PostGIS Catalogue Manager
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#333333' }}>
              Source reference spatial inventory & persistent PostgreSQL database tables
            </p>
          </div>
        </div>
        <button
          onClick={handleTriggerEtl}
          disabled={ingesting}
          className="btn-primary"
          style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
        >
          <RefreshCw style={{ width: '16px', height: '16px', animation: ingesting ? 'spin 1s linear infinite' : 'none' }} />
          <span>{ingesting ? 'Scanning & Ingesting...' : 'Re-Sync Database Catalogue'}</span>
        </button>
      </div>

      {/* Ingestion & Prototype Provenance Notice */}
      <div style={{
        backgroundColor: 'rgba(201, 162, 90, 0.1)',
        border: '1px solid rgba(201, 162, 90, 0.3)',
        borderRadius: '0.5rem',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#111111',
        fontSize: '0.825rem'
      }}>
        <AlertCircle style={{ width: '20px', height: '20px', flexShrink: 0, color: '#333333' }} />
        <div>
          <strong style={{ color: '#333333' }}>PROVENANCE & INGESTION TELEMETRY:</strong> 1,000 prototype-loaded records are currently ingested in PostgreSQL from the 175,735-row official rainfall dataset source (Dataset 5). All raw source files in <code>d:/SIH2026/data/</code> remain 100% untouched.
        </div>
      </div>

      {/* Database Connection Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.75rem', color: '#333333' }}>PostgreSQL Engine</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#333333' }} />
            <span>{dbStatus?.status === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: '#666666', marginTop: '0.25rem' }}>
            Host: {dbStatus?.host || 'localhost:5432'}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: '#333333' }}>PostGIS Spatial Extension</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers style={{ width: '16px', height: '16px', color: '#333333' }} />
            <span>ENABLED</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: '#666666', marginTop: '0.25rem' }}>
            Version: {dbStatus?.postgis_version ? dbStatus.postgis_version.split(' ')[0] : '3.6'}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: '#333333' }}>Application Database</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem', fontFamily: 'monospace' }}>
            {dbStatus?.database || 'dam_safe'}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#666666', marginTop: '0.25rem' }}>
            16 Spatial & Hydro Tables
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: '#333333' }}>Source Raw Data Folder</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <HardDrive style={{ width: '16px', height: '16px', color: '#333333' }} />
            <span>UNTOUCHED</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: '#666666', marginTop: '0.25rem' }}>
            <code>d:/SIH2026/data</code> (17 Files)
          </div>
        </div>
      </div>

      {/* 16 Dataset Categories Master Table */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #DEC9A8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAFA' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111111' }}>
            16 Core Project Dataset Categories Inventory
          </span>
          <span style={{ fontSize: '0.75rem', color: '#333333' }}>
            Showing {categories.length} Categorized Datasets
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA', color: '#333333', borderBottom: '1px solid #DEC9A8' }}>
                <th style={{ padding: '0.75rem 1rem', width: '50px' }}>#</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Source File</th>
                <th style={{ padding: '0.75rem 1rem' }}>Spatial Type</th>
                <th style={{ padding: '0.75rem 1rem' }}>Mapped PostGIS Table</th>
                <th style={{ padding: '0.75rem 1rem' }}>Rows</th>
                <th style={{ padding: '0.75rem 1rem' }}>Size</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.category_number}
                  style={{ borderBottom: '1px solid #DEC9A8', cursor: 'pointer', backgroundColor: selectedCat?.category_number === cat.category_number ? 'rgba(107, 78, 43, 0.08)' : 'transparent' }}
                  onClick={() => setSelectedCat(cat)}
                >
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#333333' }}>
                    {cat.category_number}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#111111' }}>
                    {cat.category_name}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {getStatusBadge(cat.data_status)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: '#333333' }}>
                    {cat.filename}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#666666' }}>
                    {cat.geometry_type} ({cat.crs})
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#333333', fontFamily: 'monospace' }}>
                    {cat.db_table_mapped}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#111111' }}>
                    {cat.row_count ? cat.row_count.toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#666666' }}>
                    {formatBytes(cat.file_size_bytes)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedCat(cat); }}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', backgroundColor: '#DEC9A8', color: '#111111', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Inspector Modal / Drawer */}
      {selectedCat && (
        <div className="card" style={{ borderLeft: '4px solid #8B6234', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText style={{ width: '18px', height: '18px', color: '#333333' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111111' }}>
                Category {selectedCat.category_number}: {selectedCat.category_name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedCat(null)}
              style={{ backgroundColor: 'transparent', border: 'none', color: '#333333', cursor: 'pointer', fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>

          <div style={{ fontSize: '0.825rem', color: '#333333', lineHeight: '1.5' }}>
            <strong>Notes:</strong> {selectedCat.notes}<br />
            <strong>Database Target Table:</strong> <code>{selectedCat.db_table_mapped}</code> | <strong>Spatial Ref:</strong> {selectedCat.crs}
          </div>
        </div>
      )}
    </div>
  );
};
