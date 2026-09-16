import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, CheckCircle2, Building2, ShieldAlert, Layers } from 'lucide-react';
import { generateConsolidatedReport } from '../services/api';
import { ReportModal } from '../components/ReportModal';

interface ReportsPageProps {
  activeRunId: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ activeRunId }) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      const data = await generateConsolidatedReport(activeRunId);
      setReport(data);
      setLoading(false);
    }
    loadReport();
  }, [activeRunId]);

  const handleExportData = () => {
    if (!report) return;
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DAM-SAFE_Flood_Report_${activeRunId}.json`;
    a.click();
  };

  const handleExportPdf = () => {
    alert("Exporting PDF Summary Document...");
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'transparent' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileText style={{ width: '24px', height: '24px', color: '#333333' }} />
          FLOOD SIMULATION REPORT
        </h1>
      </div>

      {/* Main Report Preview Card */}
      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #DEC9A8', paddingBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333333', textTransform: 'uppercase' }}>REPORT GENERATED SUCCESSFULLY</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111111', margin: '0.2rem 0 0' }}>
              Mettur Dam Flood Simulation & Decision Support Report
            </h2>
          </div>


        </div>

        {/* Report Sections Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.85rem' }}>
          <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #DEC9A8', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#111111', fontWeight: 800 }}>
              1. Scenario & Breach Parameters
            </h4>
            <div style={{ color: '#333333' }}>Dam Facility: <strong style={{ color: '#111111' }}>Mettur Dam (Stanley Reservoir)</strong></div>
            <div style={{ color: '#333333' }}>Water Level: <strong style={{ color: '#111111' }}>162.5 ft</strong> (Gross Storage: 95,660 Mcft)</div>
            <div style={{ color: '#333333' }}>Breach Width: <strong style={{ color: '#111111' }}>150 m</strong> over 2.0 hrs formation</div>
            <div style={{ color: '#333333' }}>Simulation Horizon: <strong style={{ color: '#111111' }}>3.0 Hours</strong></div>
          </div>

          <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #DEC9A8', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#111111', fontWeight: 800 }}>
              2. Hydraulics & Exposure Summary
            </h4>
            <div style={{ color: '#333333' }}>Max Water Depth: <strong style={{ color: '#111111' }}>3.35 m</strong></div>
            <div style={{ color: '#333333' }}>Max Flow Velocity: <strong style={{ color: '#111111' }}>1.70 m/s</strong></div>
            <div style={{ color: '#333333' }}>Inundation Extent Area: <strong style={{ color: '#111111' }}>42.5 km²</strong></div>
            <div style={{ color: '#333333' }}>Total Population Exposed: <strong style={{ color: '#111111' }}>132,400</strong></div>
          </div>

          <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #DEC9A8', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#111111', fontWeight: 800 }}>
              3. Response Priority Rankings
            </h4>
            <div style={{ color: '#333333' }}>P1 Critical Priority: <strong style={{ color: '#111111' }}>2 Settlements</strong> (Immediate Evacuation)</div>
            <div style={{ color: '#333333' }}>P2 High Priority: <strong style={{ color: '#111111' }}>2 Settlements</strong></div>
            <div style={{ color: '#333333' }}>P3 Moderate Priority: <strong style={{ color: '#111111' }}>1 Settlement</strong></div>
            <div style={{ color: '#333333' }}>P4 Low Priority: <strong style={{ color: '#111111' }}>1 Settlement</strong></div>
          </div>

          <div style={{ backgroundColor: '#FAFAFA', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #DEC9A8', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#111111', fontWeight: 800 }}>
              4. Evacuation & Relief Logistics
            </h4>
            <div style={{ color: '#333333' }}>Evacuation Sectors: <strong style={{ color: '#111111' }}>Zone 1 to Zone 4</strong></div>
            <div style={{ color: '#333333' }}>Severely Affected Highway: <strong style={{ color: '#111111' }}>NH-844 Mettur Highway</strong></div>
            <div style={{ color: '#333333' }}>Primary Safe Reroute: <strong style={{ color: '#111111' }}>State Highway 86 (Omalur Bypass)</strong></div>
            <div style={{ color: '#333333' }}>Operational Relief Shelters: <strong style={{ color: '#111111' }}>3 Facilities (5,500 Beds)</strong></div>
          </div>
        </div>
      </div>

      {/* Embedded Report Modal */}
      {showModal && report && (
        <ReportModal report={report} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

