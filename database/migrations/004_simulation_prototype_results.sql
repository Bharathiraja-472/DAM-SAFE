-- Migration 004: Create simulation_prototype_results table for Step 8 Mettur Dam-Break Prototype
-- Target DB: dam_safe
-- Storage CRS: EPSG:4326

CREATE TABLE IF NOT EXISTS simulation_prototype_results (
    id SERIAL PRIMARY KEY,
    run_id VARCHAR(100) NOT NULL,
    scenario VARCHAR(150) NOT NULL,
    timestep INTEGER NOT NULL,
    time_hours NUMERIC(6,2) NOT NULL,
    label VARCHAR(150),
    max_depth_m NUMERIC(6,2),
    max_velocity_m_s NUMERIC(6,2),
    water_surface_elevation_m NUMERIC(6,2),
    geom GEOMETRY(Geometry, 4326),
    data_status VARCHAR(50) DEFAULT 'PROTOTYPE_ASSUMPTION',
    source_type VARCHAR(100) DEFAULT 'MIXED_DATA_PROTOTYPE',
    provenance_json TEXT,
    scientific_use BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Spatial Index on geometry
CREATE INDEX IF NOT EXISTS idx_sim_proto_results_geom ON simulation_prototype_results USING GIST (geom);

-- Create Index on run_id and timestep
CREATE INDEX IF NOT EXISTS idx_sim_proto_results_run_ts ON simulation_prototype_results (run_id, timestep);
