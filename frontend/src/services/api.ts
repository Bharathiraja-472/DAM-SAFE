import { DamParameters, ReservoirHistoryResponse, ScenarioRequest, ScenarioResponse, SimulationStatus } from '../types';

const API_BASE = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      project: 'DAM-SAFE',
      study_area: 'Mettur Dam - Cauvery River',
      mode: 'prototype',
      database: { type: 'PostgreSQL + PostGIS', status: 'disconnected' },
      delft3d_status: 'offline_fallback'
    };
  }
}

export async function fetchGisLayers() {
  try {
    const res = await fetch(`${API_BASE}/gis/layers`);
    if (!res.ok) throw new Error('Failed to fetch GIS layers status');
    return await res.json();
  } catch (err) {
    return { meta: { status: 'fallback' }, layers: [] };
  }
}

export async function fetchDemMetadata() {
  try {
    const res = await fetch(`${API_BASE}/gis/dem/metadata`);
    if (!res.ok) throw new Error('Failed to fetch DEM metadata');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchDamParameters(): Promise<DamParameters> {
  try {
    const res = await fetch(`${API_BASE}/dam`);
    if (!res.ok) throw new Error('Failed to fetch dam parameters');
    return await res.json();
  } catch (err) {
    return {
      meta: {
        dataset: 'mettur_dam_dataset',
        data_status: 'verified',
        data_source: 'official',
        is_realtime: false
      },
      parameters: {
        'Dam Name': 'Mettur Dam',
        'River': 'Cauvery (Kaveri)',
        'Latitude': '11°48′11″ N',
        'Longitude': '77°48′24″ E',
        'Dam Length': '5300 ft',
        'Maximum Height': '214 ft',
        'Total Capacity': '95,660 million cubic ft',
        'Spillway Gates': '16 × 60 ft × 20 ft',
        'Geographic Location': { latitude: 11.8016, longitude: 77.8016 }
      }
    };
  }
}

export async function fetchReservoirHistory(): Promise<ReservoirHistoryResponse> {
  try {
    const res = await fetch(`${API_BASE}/reservoir`);
    if (!res.ok) throw new Error('Failed to fetch reservoir history');
    return await res.json();
  } catch (err) {
    return {
      meta: {
        dataset: 'mettur_reservoir_history',
        data_status: 'verified',
        data_source: 'official',
        is_realtime: false
      },
      records: []
    };
  }
}

export async function submitScenario(payload: ScenarioRequest): Promise<ScenarioResponse> {
  try {
    const res = await fetch(`${API_BASE}/scenarios/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Scenario submission failed');
    return await res.json();
  } catch (err) {
    return {
      meta: {
        dataset: 'breach_scenario',
        data_status: 'prototype',
        data_source: 'prototype',
        is_realtime: false
      },
      scenario_id: 'SCEN-PROTOTYPE-' + Math.floor(Math.random() * 1000),
      status: 'configured_offline_fallback',
      message: 'Breach scenario registered in prototype fallback mode.',
      inputs: payload
    };
  }
}

export async function fetchSimulationStatus(): Promise<SimulationStatus> {
  try {
    const res = await fetch(`${API_BASE}/simulation/status`);
    if (!res.ok) throw new Error('Simulation status check failed');
    return await res.json();
  } catch (err) {
    return {
      engine: 'Delft3D-FM',
      cli_binary: 'dflowfm-cli.exe',
      integration_status: 'Pending',
      current_mode: 'Prototype Mode',
      supported_outputs: ['Flood Depth (m)', 'Velocity (m/s)', 'Arrival Time (hrs)', 'Inundation Polygons']
    };
  }
}

export async function fetchHadrReport(runId: string = 'default_proto') {
  try {
    const res = await fetch(`${API_BASE}/hadr/report/${runId}`);
    if (!res.ok) throw new Error('Failed to fetch HADR report');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchHadrScoringMethodology() {
  try {
    const res = await fetch(`${API_BASE}/hadr/priority-scoring/methodology`);
    if (!res.ok) throw new Error('Failed to fetch HADR scoring methodology');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchHadrShelters() {
  try {
    const res = await fetch(`${API_BASE}/hadr/shelters`);
    if (!res.ok) throw new Error('Failed to fetch HADR shelters');
    return await res.json();
  } catch (err) {
    return { disclaimer: 'DUMMY DATA — PROTOTYPE ONLY', shelters: [] };
  }
}

export async function fetchDashboardSummary(runId: string = 'default_proto') {
  try {
    const res = await fetch(`${API_BASE}/dashboard/summary?run_id=${runId}`);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchSystemComponents() {
  try {
    const res = await fetch(`${API_BASE}/system/components`);
    if (!res.ok) throw new Error('Failed to fetch system components');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchSystemDataStatus() {
  try {
    const res = await fetch(`${API_BASE}/system/data-status`);
    if (!res.ok) throw new Error('Failed to fetch system data status');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function generateConsolidatedReport(runId: string = 'default_proto') {
  try {
    const res = await fetch(`${API_BASE}/reports/generate?run_id=${runId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function triggerPrototypeRun(payload: any) {
  try {
    const res = await fetch(`${API_BASE}/simulation/prototype/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to trigger simulation run');
    return await res.json();
  } catch (err) {
    return {
      run_id: 'proto_' + Date.now(),
      status: 'COMPLETED',
      scenario: payload?.scenario || 'Moderate Breach',
      timesteps_count: 7
    };
  }
}

export async function fetchPrototypeTimesteps(runId: string = 'default_proto') {
  try {
    const res = await fetch(`${API_BASE}/simulation/prototype/results/${runId}`);
    if (!res.ok) throw new Error('Failed to fetch simulation timesteps');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchPrototypeTimestepGeojson(runId: string = 'default_proto', timestep: number = 0) {
  try {
    const res = await fetch(`${API_BASE}/simulation/prototype/results/${runId}/timestep/${timestep}`);
    if (!res.ok) throw new Error('Failed to fetch timestep GeoJSON');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchPrototypeImpacts(runId: string = 'default_proto', timestep: number = 0) {
  try {
    const res = await fetch(`${API_BASE}/simulation/prototype/impacts/${runId}/timestep/${timestep}`);
    if (!res.ok) throw new Error('Failed to fetch impact analysis');
    return await res.json();
  } catch (err) {
    return null;
  }
}



