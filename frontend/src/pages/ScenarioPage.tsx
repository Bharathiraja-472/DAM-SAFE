import React, { useState } from 'react';
import { ScenarioRequest, ScenarioResponse } from '../types';
import { submitScenario } from '../services/api';
import { Sliders, Play, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ScenarioPage: React.FC = () => {
  const [formData, setFormData] = useState<ScenarioRequest>({
    dam_name: 'Mettur Dam',
    scenario_type: 'Maximum Reservoir',
    reservoir_level_ft: 120.0,
    breach_width_m: 150.0,
    breach_formation_time_min: 30.0,
    breach_elevation_m: 40.0,
    simulation_duration_hrs: 24.0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScenarioResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await submitScenario(formData);
    setResult(res);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', backgroundColor: 'transparent' }}>
      {/* Page Title Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sliders style={{ color: '#333333', width: '24px', height: '24px' }} />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111' }}>
                Dam-Break Breach Scenario Control Panel
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#333333' }}>
                Define hydraulic breach parameters & reservoir initial boundary conditions
              </p>
            </div>
          </div>
          <span className="badge">PROTOTYPE MODE</span>
        </div>
      </div>

      {/* Prototype Disclaimer Alert */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #8B6234',
        borderRadius: '0.5rem',
        padding: '1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        color: '#333333'
      }}>
        <AlertTriangle style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px', color: '#333333' }} />
        <div style={{ fontSize: '0.825rem', color: '#333333' }}>
          <strong style={{ color: '#111111' }}>PROTOTYPE MODE NOTICE:</strong> In Step 1, submitting this scenario registers the configuration in backend state and verifies API parameters. Live Delft3D-FM CLI grid execution (`dflowfm-cli.exe`) will be connected in Step 7. No fabricated scientific observations are rendered.
        </div>
      </div>

      {/* Form Controls */}
      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Target Dam Facility</label>
            <select
              className="form-select"
              value={formData.dam_name}
              onChange={(e) => setFormData({ ...formData, dam_name: e.target.value })}
            >
              <option value="Mettur Dam">Mettur Dam (Cauvery River, Salem)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Breach Scenario Type</label>
            <select
              className="form-select"
              value={formData.scenario_type}
              onChange={(e) => setFormData({ ...formData, scenario_type: e.target.value })}
            >
              <option value="Maximum Reservoir">Maximum Reservoir Level (FRL Failure)</option>
              <option value="Moderate">Moderate Operating Level</option>
              <option value="Custom">Custom Parameter Configuration</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Reservoir Level (ft)</label>
            <input
              type="number"
              className="form-input"
              value={formData.reservoir_level_ft}
              onChange={(e) => setFormData({ ...formData, reservoir_level_ft: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Final Breach Width (m)</label>
            <input
              type="number"
              className="form-input"
              value={formData.breach_width_m}
              onChange={(e) => setFormData({ ...formData, breach_width_m: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Breach Formation Time (min)</label>
            <input
              type="number"
              className="form-input"
              value={formData.breach_formation_time_min}
              onChange={(e) => setFormData({ ...formData, breach_formation_time_min: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Breach Bottom Elevation (m MSL)</label>
            <input
              type="number"
              className="form-input"
              value={formData.breach_elevation_m}
              onChange={(e) => setFormData({ ...formData, breach_elevation_m: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Simulation Duration (hrs)</label>
            <input
              type="number"
              className="form-input"
              value={formData.simulation_duration_hrs}
              onChange={(e) => setFormData({ ...formData, simulation_duration_hrs: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
          <Play style={{ width: '18px', height: '18px' }} />
          <span>{loading ? 'Processing Scenario Payload...' : 'RUN PROTOTYPE SIMULATION'}</span>
        </button>
      </form>

      {/* Submission Result Output */}
      {result && (
        <div className="card" style={{ borderLeft: '4px solid #8B6234' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#111111', fontWeight: 600, marginBottom: '0.5rem' }}>
            <CheckCircle2 style={{ width: '18px', height: '18px', color: '#333333' }} />
            <span>Scenario Successfully Configured in Backend</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#333333' }}>
            {result.message}
          </p>
          <div style={{ marginTop: '0.75rem', backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.775rem', fontFamily: 'monospace', color: '#333333' }}>
            Scenario ID: {result.scenario_id}<br />
            Status: {result.status}<br />
            Mode: {result.meta?.data_status}
          </div>
        </div>
      )}
    </div>
  );
};

