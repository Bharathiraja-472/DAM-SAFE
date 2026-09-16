-- DAM-SAFE PostgreSQL + PostGIS Schema Migration
-- Migration 001: Initial Infrastructure, Hydrology, & Simulation Schema

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Dams Table
CREATE TABLE IF NOT EXISTS dams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    river VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    dam_length_ft DOUBLE PRECISION,
    max_height_ft DOUBLE PRECISION,
    max_width_ft DOUBLE PRECISION,
    top_width_ft DOUBLE PRECISION,
    total_capacity_mcft DOUBLE PRECISION,
    effective_capacity_mcft DOUBLE PRECISION,
    spillway_gates_desc TEXT,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Reservoirs Table
CREATE TABLE IF NOT EXISTS reservoirs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dam_id UUID REFERENCES dams(id),
    name VARCHAR(255) NOT NULL,
    full_reservoir_level_ft DOUBLE PRECISION,
    water_spread_sq_miles DOUBLE PRECISION,
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Hydro Observations Table
CREATE TABLE IF NOT EXISTS hydro_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_name VARCHAR(255) NOT NULL,
    observation_date DATE NOT NULL,
    reservoir_level_ft DOUBLE PRECISION,
    storage_mcft DOUBLE PRECISION,
    inflow_cusecs DOUBLE PRECISION,
    outflow_cusecs DOUBLE PRECISION,
    data_source VARCHAR(255) DEFAULT 'official',
    data_status VARCHAR(50) DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Rainfall Stations Table
CREATE TABLE IF NOT EXISTS rainfall_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_name VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. River Centerlines Table
CREATE TABLE IF NOT EXISTS river_centerlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    river_name VARCHAR(255) NOT NULL,
    segment_name VARCHAR(255),
    reach_order INTEGER,
    geom GEOMETRY(MultiLineString, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Administrative Boundaries Table
CREATE TABLE IF NOT EXISTS admin_boundaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_name VARCHAR(100) DEFAULT 'Tamil Nadu',
    district_name VARCHAR(100) NOT NULL,
    taluk_name VARCHAR(100),
    admin_level VARCHAR(50),
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Villages & Settlements Table
CREATE TABLE IF NOT EXISTS villages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_name VARCHAR(255) NOT NULL,
    taluk_name VARCHAR(100),
    district_name VARCHAR(100),
    population_census INTEGER,
    households INTEGER,
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Buildings Footprints Table
CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_type VARCHAR(100),
    floors INTEGER DEFAULT 1,
    height_m DOUBLE PRECISION,
    village_id UUID REFERENCES villages(id),
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Road Networks Table
CREATE TABLE IF NOT EXISTS roads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    road_name VARCHAR(255),
    road_type VARCHAR(100), -- National Highway, State Highway, District Road, Local
    surface_type VARCHAR(100),
    geom GEOMETRY(MultiLineString, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Critical Infrastructure Table
CREATE TABLE IF NOT EXISTS infrastructure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Hospital, School, Police, Shelter, Power, Bridge
    district VARCHAR(100),
    capacity INTEGER,
    is_evacuation_shelter BOOLEAN DEFAULT FALSE,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Simulation Scenarios Table
CREATE TABLE IF NOT EXISTS simulation_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dam_id UUID REFERENCES dams(id),
    scenario_name VARCHAR(255) NOT NULL,
    scenario_type VARCHAR(100) NOT NULL,
    reservoir_level_ft DOUBLE PRECISION NOT NULL,
    breach_width_m DOUBLE PRECISION NOT NULL,
    breach_formation_time_min DOUBLE PRECISION NOT NULL,
    breach_elevation_m DOUBLE PRECISION NOT NULL,
    duration_hrs DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Simulation Runs Table
CREATE TABLE IF NOT EXISTS simulation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_id UUID REFERENCES simulation_scenarios(id),
    status VARCHAR(50) NOT NULL, -- QUEUED, RUNNING, COMPLETED, FAILED
    execution_engine VARCHAR(100) DEFAULT 'Delft3D-FM',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    output_dir TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Flood Inundation Results Table
CREATE TABLE IF NOT EXISTS flood_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID REFERENCES simulation_runs(id),
    time_step_min INTEGER NOT NULL,
    max_depth_m DOUBLE PRECISION,
    max_velocity_ms DOUBLE PRECISION,
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial Indexes
CREATE INDEX IF NOT EXISTS idx_dams_geom ON dams USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_reservoirs_geom ON reservoirs USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_rainfall_geom ON rainfall_stations USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_rivers_geom ON river_centerlines USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_admin_geom ON admin_boundaries USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_villages_geom ON villages USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_buildings_geom ON buildings USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_roads_geom ON roads USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_infra_geom ON infrastructure USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_flood_geom ON flood_results USING GIST(geom);
