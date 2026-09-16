-- Migration 005: Create HADR Decision Support Tables for Step 9 DAM-SAFE
-- Target DB: dam_safe
-- Storage CRS: EPSG:4326

-- 1. HADR Impact Results
CREATE TABLE IF NOT EXISTS hadr_impact_results (
    id SERIAL PRIMARY KEY,
    run_id VARCHAR(100) NOT NULL,
    scenario VARCHAR(150) NOT NULL,
    village_id VARCHAR(50),
    village_name VARCHAR(150),
    district VARCHAR(100),
    taluk VARCHAR(100),
    population_exposure INTEGER DEFAULT 0,
    pop_source_label VARCHAR(150) DEFAULT 'Population exposure estimate based on Census 2011',
    max_water_depth_m NUMERIC(6,2),
    max_velocity_m_s NUMERIC(6,2),
    min_arrival_time_hrs NUMERIC(6,2),
    severity_level VARCHAR(50),
    priority_score NUMERIC(5,2),
    priority_rank VARCHAR(20),
    geom GEOMETRY(Geometry, 4326),
    data_status VARCHAR(50) DEFAULT 'MIXED_DATA_PROTOTYPE',
    scientific_use BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hadr_impact_geom ON hadr_impact_results USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_hadr_impact_run_id ON hadr_impact_results (run_id);

-- 2. HADR Evacuation Zones
CREATE TABLE IF NOT EXISTS hadr_evacuation_zones (
    id SERIAL PRIMARY KEY,
    run_id VARCHAR(100) NOT NULL,
    zone_code VARCHAR(20) NOT NULL,
    zone_name VARCHAR(100) NOT NULL,
    priority_level VARCHAR(20) NOT NULL,
    area_sq_km NUMERIC(10,2),
    est_population INTEGER DEFAULT 0,
    pop_source_label VARCHAR(150) DEFAULT 'Population exposure estimate based on Census 2011',
    min_arrival_hrs NUMERIC(6,2),
    max_depth_m NUMERIC(6,2),
    geom GEOMETRY(Geometry, 4326),
    data_status VARCHAR(50) DEFAULT 'MIXED_DATA_PROTOTYPE',
    scientific_use BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hadr_evac_zones_geom ON hadr_evacuation_zones USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_hadr_evac_zones_run_id ON hadr_evacuation_zones (run_id);

-- 3. HADR Route Analysis
CREATE TABLE IF NOT EXISTS hadr_route_analysis (
    id SERIAL PRIMARY KEY,
    run_id VARCHAR(100) NOT NULL,
    road_name VARCHAR(150) NOT NULL,
    road_type VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    max_water_depth_m NUMERIC(6,2),
    passable_status VARCHAR(50),
    alternative_route_info TEXT,
    geom GEOMETRY(Geometry, 4326),
    data_status VARCHAR(50) DEFAULT 'MIXED_DATA_PROTOTYPE',
    scientific_use BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hadr_route_geom ON hadr_route_analysis USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_hadr_route_run_id ON hadr_route_analysis (run_id);

-- 4. HADR Priority Areas
CREATE TABLE IF NOT EXISTS hadr_priority_areas (
    id SERIAL PRIMARY KEY,
    run_id VARCHAR(100) NOT NULL,
    area_name VARCHAR(150) NOT NULL,
    category VARCHAR(50),
    priority_score NUMERIC(5,2) NOT NULL,
    priority_rank VARCHAR(20) NOT NULL,
    depth_risk NUMERIC(5,4),
    velocity_risk NUMERIC(5,4),
    arrival_risk NUMERIC(5,4),
    pop_risk NUMERIC(5,4),
    infra_risk NUMERIC(5,4),
    evac_action_recommended TEXT,
    geom GEOMETRY(Geometry, 4326),
    data_status VARCHAR(50) DEFAULT 'MIXED_DATA_PROTOTYPE',
    scientific_use BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hadr_priority_geom ON hadr_priority_areas USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_hadr_priority_run_id ON hadr_priority_areas (run_id);

-- 5. HADR Shelters
CREATE TABLE IF NOT EXISTS hadr_shelters (
    id SERIAL PRIMARY KEY,
    shelter_name VARCHAR(150) NOT NULL,
    district VARCHAR(100),
    taluk VARCHAR(100),
    capacity INTEGER DEFAULT 1000,
    current_occupancy INTEGER DEFAULT 0,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'OPERATIONAL',
    geom GEOMETRY(Geometry, 4326),
    data_status VARCHAR(50) DEFAULT 'DUMMY_FOR_PROTOTYPE',
    ui_badge_label VARCHAR(150) DEFAULT 'DUMMY DATA — PROTOTYPE ONLY',
    scientific_use BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hadr_shelters_geom ON hadr_shelters USING GIST (geom);

-- 6. HADR Alert Zones
CREATE TABLE IF NOT EXISTS hadr_alert_zones (
    id SERIAL PRIMARY KEY,
    run_id VARCHAR(100) NOT NULL,
    alert_level VARCHAR(50) NOT NULL,
    alert_message TEXT,
    target_region VARCHAR(150),
    lead_time_hrs NUMERIC(6,2),
    recommended_actions TEXT,
    geom GEOMETRY(Geometry, 4326),
    data_status VARCHAR(50) DEFAULT 'MIXED_DATA_PROTOTYPE',
    scientific_use BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_hadr_alert_geom ON hadr_alert_zones USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_hadr_alert_run_id ON hadr_alert_zones (run_id);
