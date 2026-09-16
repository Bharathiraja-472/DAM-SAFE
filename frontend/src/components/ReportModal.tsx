import React from 'react';
import { FileText, Download, X, ShieldAlert, CheckCircle, Info } from 'lucide-react';

interface ReportModalProps {
  report: any;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dam_safe_report_${report.report_id || 'proto'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0f172a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText style={{ width: '22px', height: '22px', color: '#38bdf8' }} />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                {report.title || 'DAM-SAFE Consolidated Prototype Report'}
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Report ID: {report.report_id} | Generated: {report.generated_at}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.85rem' }}>
          {/* Disclaimers Box */}
          <div style={{ backgroundColor: '#451a1a', border: '1px solid #991b1b', borderRadius: '0.5rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fca5a5', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert style={{ width: '18px', height: '18px', color: '#f87171' }} />
              Mandatory Prototype Governance Disclaimers
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#f87171', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {(report.disclaimers || []).map((disc: string, idx: number) => (
                <li key={idx}>{disc}</li>
              ))}
            </ul>
          </div>

          {/* Scenario & Hydraulic Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', padding: '1rem' }}>
              <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Scenario Profile</h4>
              <div>Scenario: <strong>{report.scenario?.name}</strong></div>
              <div>Run ID: <code style={{ color: '#cbd5e1' }}>{report.scenario?.run_id}</code></div>
              <div>Engine: <strong>{report.scenario?.dflowfm_cli_status}</strong></div>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', padding: '1rem' }}>
              <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Hydraulic Status (`PROTOTYPE SIMULATION`)</h4>
              <div>Inundation Area: <strong>{report.hydraulic_summary?.inundation_area_sq_km} sq km</strong></div>
              <div>Max Water Depth: <strong>{report.hydraulic_summary?.max_water_depth_m} m</strong></div>
              <div>Max Velocity: <strong>{report.hydraulic_summary?.max_velocity_m_s} m/s</strong></div>
            </div>
          </div>

          {/* HADR & Evacuation Summary */}
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', padding: '1rem' }}>
            <h4 style={{ color: '#34d399', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>HADR & Evacuation Summary</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', color: '#cbd5e1' }}>
              <div>Exposed Population: <strong style={{ color: '#f8fafc' }}>{report.hadr_summary?.total_population_exposed?.toLocaleString()}</strong></div>
              <div>P1 Critical Settlements: <strong style={{ color: '#f87171' }}>{report.hadr_summary?.p1_critical_count}</strong></div>
              <div>Severely Cut Roads: <strong style={{ color: '#fbbf24' }}>{report.evacuation_summary?.severely_affected_roads_count}</strong></div>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.5rem' }}>
              Population exposure estimate based on Census 2011
            </div>
          </div>

          {/* Limitations List */}
          <div>
            <h4 style={{ color: '#cbd5e1', margin: '0 0 0.4rem', fontSize: '0.85rem' }}>System Limitations</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94a3b8', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {(report.limitations || []).map((lim: string, idx: number) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0f172a'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {report.saved_file ? `Saved: ${report.saved_file}` : 'Consolidated Report Ready'}
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: '#334155',
                color: '#f8fafc',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              <Download style={{ width: '14px', height: '14px' }} />
              Download JSON Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
