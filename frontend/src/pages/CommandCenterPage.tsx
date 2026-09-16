import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Activity,
  Cpu,
  Database,
  Map as MapIcon,
  LifeBuoy,
  Navigation,
  FileText,
  AlertTriangle,
  Users,
  Home,
  CheckCircle,
  Clock,
  Download,
  Info
} from 'lucide-react';
import { InteractiveMap } from '../components/Map/InteractiveMap';
import { ReportModal } from '../components/ReportModal';
import { fetchDashboardSummary, generateConsolidatedReport } from '../services/api';

interface CommandCenterPageProps {
  damData?: any;
  onNavigate?: (tab: any) => void;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({ damData, onNavigate }) => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<string>("Prototype Moderate Breach");
  const [breachWidth, setBreachWidth] = useState<number>(150);
  const [reportModalData, setReportModalData] = useState<any>(null);
  const [generatingReport, setGeneratingReport] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchDashboardSummary('default_proto');
      setSummary(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    const rep = await generateConsolidatedReport('default_proto');
    setReportModalData(rep);
    setGeneratingReport(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: '#333333', textAlign: 'center' }}>
        <Activity className="animate-spin" style={{ width: '32px', height: '32px', margin: '0 auto 1rem', color: '#333333' }} />
        <p>Initializing DAM-SAFE Command & Control Center...</p>
      </div>
    );
  }

  const sys = summary?.system_status || {};
  const currentScen = summary?.current_scenario || {};
  const flood = summary?.flood_status || {};
  const hadr = summary?.hadr_status || {};
  const evac = summary?.evacuation_status || {};

  return (
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'transparent' }}>
      {/* Permanent Advisory Banner Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #8B6234',
          borderRadius: '0.5rem',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <ShieldAlert style={{ width: '24px', height: '24px', color: '#333333', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111111', letterSpacing: '0.03em' }}>
              PROTOTYPE — REAL DATA + EXPLICIT ASSUMPTIONS — NOT SCIENTIFICALLY VALIDATED
            </div>
            <div style={{ fontSize: '0.75rem', color: '#333333', marginTop: '0.15rem' }}>
              HADR DECISION SUPPORT PROTOTYPE — NOT AN OPERATIONAL EMERGENCY WARNING SYSTEM
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity style={{ width: '26px', height: '26px', color: '#333333' }} />
            DAM-SAFE COMMAND CENTER — METTUR DAM & CAUVERY
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#333333', marginTop: '0.2rem' }}>
            Integrated Mettur Dam-Break Prototype, Flood Simulation, HADR Impact & Evacuation Decision Support
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="btn-primary"
            style={{
              width: 'auto',
              padding: '0.6rem 1.1rem',
              fontSize: '0.825rem'
            }}
          >
            <Download style={{ width: '16px', height: '16px' }} />
            {generatingReport ? 'Generating Report...' : 'Export Consolidated Report'}
          </button>
        </div>
      </div>

      {/* Grid Row 1: System Status & Scenario Control */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        {/* System Status Matrix */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111111', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu style={{ width: '18px', height: '18px', color: '#333333' }} />
            SYSTEM COMPONENT STATUS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.825rem' }}>
            <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', borderRadius: '0.375rem', padding: '0.6rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#333333' }}>Backend Engine</span>
              <span className="badge">● ONLINE</span>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', borderRadius: '0.375rem', padding: '0.6rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#333333' }}>PostgreSQL / PostGIS</span>
              <span className="badge">● CONNECTED</span>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', borderRadius: '0.375rem', padding: '0.6rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#333333' }}>SRTM 30m GIS DEM</span>
              <span className="badge">● AVAILABLE</span>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', borderRadius: '0.375rem', padding: '0.6rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#333333' }}>Delft3D-FM CLI</span>
              <span className="badge">● INSTALLED</span>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', borderRadius: '0.375rem', padding: '0.6rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#333333' }}>Prototype Model</span>
              <span className="badge">● AVAILABLE</span>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', borderRadius: '0.375rem', padding: '0.6rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#333333' }}>Scientific Mettur Model</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#333333', border: '1px solid rgba(107, 78, 43, 0.25)', padding: '0.15rem 0.4rem', borderRadius: '0.2rem' }}>DATA PENDING</span>
            </div>
          </div>
        </div>

        {/* Current Scenario Selector & Provenance */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111111', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock style={{ width: '18px', height: '18px', color: '#333333' }} />
            CURRENT PROTOTYPE SCENARIO
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#333333', display: 'block', marginBottom: '0.25rem' }}>Scenario Preset:</label>
              <select
                value={activeScenario}
                onChange={(e) => setActiveScenario(e.target.value)}
                className="form-select"
              >
                <option value="Maximum Reservoir Level Breach">Maximum Reservoir Level Breach (165 ft FRL)</option>
                <option value="Prototype Moderate Breach">Prototype Moderate Breach (162.5 ft WL, 150m breach)</option>
                <option value="Severe Overtopping Breach">Severe Overtopping Breach (200m breach)</option>
                <option value="Custom Breach Scenario">Custom Breach Scenario</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={{ backgroundColor: '#FAFAFA', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #DEC9A8' }}>
                <span style={{ fontSize: '0.7rem', color: '#333333' }}>Reservoir Level:</span>
                <div style={{ fontWeight: 700, color: '#111111' }}>162.5 ft <span className="badge" style={{ fontSize: '0.6rem' }}>OBSERVATION</span></div>
              </div>

              <div style={{ backgroundColor: '#FAFAFA', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #DEC9A8' }}>
                <span style={{ fontSize: '0.7rem', color: '#333333' }}>Breach Width:</span>
                <div style={{ fontWeight: 700, color: '#111111' }}>150 m <span className="badge" style={{ fontSize: '0.6rem' }}>ASSUMPTION</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Status KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {/* Flood Status Card */}
        <div className="card" style={{ padding: '1rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#333333', textTransform: 'uppercase' }}>Flood Extent</span>
            <span className="badge" style={{ fontSize: '0.65rem' }}>
              SIMULATION
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>
            {flood.inundation_area_sq_km} sq km
          </div>
          <div style={{ fontSize: '0.75rem', color: '#333333', marginTop: '0.2rem' }}>
            Max Depth: <strong style={{ color: '#111111' }}>{flood.max_water_depth_m} m</strong> | Max Velocity: <strong style={{ color: '#111111' }}>{flood.max_velocity_m_s} m/s</strong>
          </div>
        </div>

        {/* HADR Status Card */}
        <div className="card" style={{ padding: '1rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#333333', textTransform: 'uppercase' }}>Exposed Population</span>
            <span className="badge" style={{ fontSize: '0.65rem' }}>
              OBSERVATION
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>
            {hadr.total_population_exposed?.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#333333', marginTop: '0.2rem' }}>
            Population exposure estimate based on Census 2011
          </div>
        </div>

        {/* Evacuation Status Card */}
        <div className="card" style={{ padding: '1rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#333333', textTransform: 'uppercase' }}>P1 Critical Settlements</span>
            <span className="badge" style={{ fontSize: '0.65rem' }}>
              STATUS
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>
            {hadr.p1_critical_count} Villages
          </div>
          <div style={{ fontSize: '0.75rem', color: '#333333', marginTop: '0.2rem' }}>
            Top Risk: <strong style={{ color: '#111111' }}>{hadr.top_priority_settlement}</strong> (Score ≥ 75.0)
          </div>
        </div>

        {/* Shelters Card */}
        <div className="card" style={{ padding: '1rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#333333', textTransform: 'uppercase' }}>Relief Staging Capacity</span>
            <span className="badge" style={{ fontSize: '0.65rem' }}>
              PROTOTYPE DATA
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>
            {evac.operational_shelters_capacity?.toLocaleString()} Beds
          </div>
          <div style={{ fontSize: '0.72rem', color: '#333333', marginTop: '0.2rem' }}>
            Relief staging & shelter capacity
          </div>
        </div>
      </div>

      {/* Grid Row 3: Prototype Advisories Panel */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle style={{ width: '18px', height: '18px', color: '#333333' }} />
            PROTOTYPE DECISION SUPPORT ADVISORIES
          </h3>
          <span className="badge">
            PROTOTYPE ADVISORY
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem' }}>
          {(summary?.advisories || []).map((adv: any) => (
            <div key={adv.id} style={{
              backgroundColor: '#FAFAFA',
              border: '1px solid #DEC9A8',
              borderLeft: '4px solid #8B6234',
              borderRadius: '0.375rem',
              padding: '0.85rem'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111111' }}>{adv.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#333333', marginTop: '0.2rem' }}>
                Target Region: <strong style={{ color: '#111111' }}>{adv.target}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#333333', marginTop: '0.25rem' }}>
                {adv.message}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#666666', marginTop: '0.4rem', borderTop: '1px dashed #DEC9A8', paddingTop: '0.3rem' }}>
                {adv.disclaimer}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Row 4: Command Center Embedded Map */}
      <div className="card" style={{ padding: 0, height: '520px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FAFAFA', borderBottom: '1px solid #DEC9A8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <MapIcon style={{ width: '16px', height: '16px', color: '#333333' }} />
            METTUR FLOODPLAIN PROTOTYPE SPATIAL MAP
          </h3>
          <span style={{ fontSize: '0.7rem', color: '#333333' }}>
            Click map elements for impact popups & priority details
          </span>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <InteractiveMap damParams={damData?.parameters} activeTimestep={{ step: 6, label: "T+03:00 Hours (Mettur Prototype)", max_depth_m: 3.35, max_velocity_m_s: 1.7 }} />
        </div>
      </div>

      {/* Consolidated Report Modal View */}
      {reportModalData && (
        <ReportModal report={reportModalData} onClose={() => setReportModalData(null)} />
      )}
    </div>
  );
};

