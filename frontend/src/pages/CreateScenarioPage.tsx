import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { triggerPrototypeRun } from '../services/api';

interface CreateScenarioPageProps {
  onScenarioSubmitted: (runId: string) => void;
}

// Mettur Dam constants (all metric)
const DAM = {
  id: 'mettur',
  name: 'Mettur Dam (Cauvery River, Tamil Nadu)',
  frl_m: 50.3,       // Full Reservoir Level in metres  (165 ft)
  minLevel_m: 15.0,
  maxStorage_mm3: 2708.8,  // Gross capacity in Mm³
};

/** Convert metres → feet for backend payload (backend expects ft) */
const mToFt = (m: number) => parseFloat((m * 3.28084).toFixed(2));

/** Rough storage estimate: volume ∝ (level/FRL)³ × gross capacity */
const estimateStorage = (levelM: number) =>
  parseFloat((DAM.maxStorage_mm3 * Math.pow(levelM / DAM.frl_m, 3)).toFixed(1));

export const CreateScenarioPage: React.FC<CreateScenarioPageProps> = ({ onScenarioSubmitted }) => {
  const [reservoirLevel_m, setReservoirLevel_m] = useState<number>(49.5); // ≈ 162.5 ft
  const [breachWidth_m, setBreachWidth_m] = useState<number>(150);
  const [formationTime_hrs, setFormationTime_hrs] = useState<number>(0.5);
  const [breachElevation_m, setBreachElevation_m] = useState<number>(45.0);
  const [duration_hrs, setDuration_hrs] = useState<number>(3.0);
  const [outputInterval_mins, setOutputInterval_mins] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      scenario: 'Custom Breach',
      dam_name: DAM.name,
      initial_water_level_ft: mToFt(reservoirLevel_m),
      breach_width_m: breachWidth_m,
      breach_formation_time_hrs: formationTime_hrs,
      breach_elevation_m: breachElevation_m,
      duration_hours: duration_hrs,
      output_interval_mins: outputInterval_mins
    };

    const res = await triggerPrototypeRun(payload);
    const newRunId = res?.run_id || ('proto_' + Date.now());
    setIsSubmitting(false);
    onScenarioSubmitted(newRunId);
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.775rem',
    fontWeight: 600,
    color: '#333333',
    display: 'block',
    marginBottom: '0.35rem'
  };

  const hintStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    color: '#666666',
    marginTop: '0.25rem',
    display: 'block'
  };

  const estimatedStorage = estimateStorage(reservoirLevel_m);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', margin: '0 0 0.25rem', letterSpacing: '-0.01em' }}>
          Create Flood Scenario
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0 }}>
          All parameters are in SI metric units. Configure dam failure inputs and run a downstream inundation simulation.
        </p>
      </div>

      <form onSubmit={handleRunSimulation} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left — Input Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Target Dam — read-only display since only one dam is available */}
          <div>
            <label style={labelStyle}>Target Dam</label>
            <div style={{ padding: '0.6rem 0.75rem', borderRadius: '0.375rem', backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', color: '#111111', fontWeight: 700, fontSize: '0.875rem' }}>
              {DAM.name}
            </div>
          </div>

          {/* Reservoir Initial Water Level (m) */}
          <div>
            <label style={labelStyle}>Initial Reservoir Water Level (m)</label>
            <input
              type="number"
              step="0.1"
              min={DAM.minLevel_m}
              max={DAM.frl_m}
              value={reservoirLevel_m}
              onChange={(e) => setReservoirLevel_m(parseFloat(e.target.value) || 49.5)}
              className="form-input"
              style={{ fontWeight: 700 }}
            />
            <span style={hintStyle}>
              Full Reservoir Level (FRL): {DAM.frl_m} m &nbsp;|&nbsp; Estimated storage: <strong>{estimatedStorage} Mm³</strong>
            </span>
          </div>

          {/* Breach Width + Formation Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Breach Opening Width (m)</label>
              <input
                type="number"
                step="1"
                min="10"
                max="1000"
                value={breachWidth_m}
                onChange={(e) => setBreachWidth_m(parseFloat(e.target.value) || 150)}
                className="form-input"
              />
              <span style={hintStyle}>Typical range: 50 m – 300 m</span>
            </div>

            <div>
              <label style={labelStyle}>Breach Formation Time</label>
              <select
                value={formationTime_hrs}
                onChange={(e) => setFormationTime_hrs(parseFloat(e.target.value))}
                className="form-select"
              >
                <option value={0.25}>15 min — Instantaneous</option>
                <option value={0.5}>30 min — Rapid</option>
                <option value={1.0}>1.0 hr — Standard</option>
                <option value={2.0}>2.0 hr — Gradual erosion</option>
              </select>
              <span style={hintStyle}>Time to reach maximum breach opening</span>
            </div>
          </div>

          {/* Breach Sill Elevation */}
          <div>
            <label style={labelStyle}>Breach Sill Elevation (m MSL)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max={reservoirLevel_m}
              value={breachElevation_m}
              onChange={(e) => setBreachElevation_m(parseFloat(e.target.value) || 45.0)}
              className="form-input"
            />
            <span style={hintStyle}>Bottom elevation of the breach opening above mean sea level</span>
          </div>

          {/* Simulation Duration + Output Interval */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Simulation Duration (hrs)</label>
              <select
                value={duration_hrs}
                onChange={(e) => setDuration_hrs(parseFloat(e.target.value))}
                className="form-select"
              >
                <option value={1.0}>1 hr</option>
                <option value={3.0}>3 hrs</option>
                <option value={6.0}>6 hrs</option>
                <option value={12.0}>12 hrs</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Output Step Interval (mins)</label>
              <select
                value={outputInterval_mins}
                onChange={(e) => setOutputInterval_mins(parseInt(e.target.value))}
                className="form-select"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right — Scenario Summary */}
        <div style={{ position: 'sticky', top: '1rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111111', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #DEC9A8' }}>
              Scenario Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666666' }}>Dam</span>
                <strong style={{ color: '#111111' }}>Mettur Dam</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666666' }}>Reservoir Level</span>
                <strong style={{ color: '#111111' }}>{reservoirLevel_m} m</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666666' }}>Est. Storage</span>
                <strong style={{ color: '#111111' }}>{estimatedStorage} Mm³</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666666' }}>Breach Width</span>
                <strong style={{ color: '#111111' }}>{breachWidth_m} m</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666666' }}>Formation Time</span>
                <strong style={{ color: '#111111' }}>
                  {formationTime_hrs < 1 ? `${Math.round(formationTime_hrs * 60)} min` : `${formationTime_hrs} hr`}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666666' }}>Sill Elevation</span>
                <strong style={{ color: '#111111' }}>{breachElevation_m} m MSL</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666666' }}>Duration</span>
                <strong style={{ color: '#111111' }}>{duration_hrs} hr</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666666' }}>Output Interval</span>
                <strong style={{ color: '#111111' }}>{outputInterval_mins} min</strong>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ padding: '0.9rem', fontSize: '0.9rem' }}
              >
                <PlayCircle style={{ width: '20px', height: '20px' }} />
                <span>{isSubmitting ? 'Initializing...' : 'Run Flood Simulation'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
