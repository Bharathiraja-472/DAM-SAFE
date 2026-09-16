-- Migration 003: Create simulation_test_results table for isolated software pipeline testing
-- Target DB: dam_safe
-- Storage CRS: EPSG:4326

CREATE TABLE IF NOT EXISTS simulation_test_results (
    id SERIAL PRIMARY KEY,
    run_id VARCHAR(100) NOT NULL,
    timestep INTEGER NOT NULL,
    time_hours NUMERIC(6,2) NOT NULL,
    label VARCHAR(150),
    max_depth_m NUMERIC(6,2),
    max_velocity_m_s NUMERIC(6,2),
    water_surface_elevation_m NUMERIC(6,2),
    geom GEOMETRY(Geometry, 4326),
    data_status VARCHAR(50) DEFAULT 'SYNTHETIC_TEST_ONLY',
    scientific_use BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Spatial Index on geometry
CREATE INDEX IF NOT EXISTS idx_simulation_test_results_geom ON simulation_test_results USING GIST (geom);

-- Create Index on run_id and timestep
CREATE INDEX IF NOT EXISTS idx_simulation_test_results_run_ts ON simulation_test_results (run_id, timestep);
