export type NavTab = 
  | 'home'
  | 'scenario'
  | 'simulation'
  | 'map'
  | 'impact'
  | 'response'
  | 'evacuation'
  | 'reports'
  | 'system_status';

export interface DataMeta {
  dataset: string;
  data_status: 'verified' | 'partial' | 'prototype' | 'mock' | 'simulated';
  data_source: 'official' | 'inventory' | 'prototype';
  is_realtime: boolean;
  file_path?: string;
  loaded_file?: string;
  record_count?: number;
}

export interface DamParameters {
  meta: DataMeta;
  parameters: Record<string, any>;
}

export interface ReservoirRecord {
  date?: string;
  reservoir?: string;
  river?: string;
  full_depth_ft?: number;
  full_capacity_Mcft?: number;
  current_level_ft?: number;
  current_storage_Mcft?: number;
  current_inflow_cusecs?: number;
  current_outflow_cusecs?: number;
  [key: string]: any;
}

export interface ReservoirHistoryResponse {
  meta: DataMeta;
  records: ReservoirRecord[];
}

export interface ScenarioRequest {
  dam_name: string;
  scenario_type: string;
  reservoir_level_ft: number;
  breach_width_m: number;
  breach_formation_time_min: number;
  breach_elevation_m: number;
  simulation_duration_hrs: number;
}

export interface ScenarioResponse {
  meta: DataMeta;
  scenario_id: string;
  run_id?: string;
  status: string;
  message: string;
  inputs: ScenarioRequest;
}

export interface SimulationStatus {
  engine: string;
  cli_binary: string;
  integration_status: string;
  current_mode: string;
  supported_outputs: string[];
}

export interface MapLayerState {
  dem: boolean;
  adminBoundaries: boolean;
  villages: boolean;
  roads: boolean;
  buildings: boolean;
  infrastructure: boolean;
  floodExtent: boolean;
}

export interface SimulationTimestep {
  step: number;
  timestamp_offset_hrs: number;
  label: string;
  max_depth_m: number;
  max_velocity_m_s: number;
  inundated_area_sq_km: number;
  exposed_population: number;
  affected_settlements_count: number;
  geometry?: any;
}

