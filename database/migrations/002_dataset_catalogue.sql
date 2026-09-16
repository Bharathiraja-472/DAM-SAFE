-- DAM-SAFE PostgreSQL + PostGIS Schema Migration
-- Migration 002: Dataset Catalogue & Rainfall Ingestion Tables

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Dataset Catalogue Table (Tracking all 16 Project Categories)
CREATE TABLE IF NOT EXISTS dataset_catalogue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_number INTEGER NOT NULL UNIQUE,
    category_name VARCHAR(255) NOT NULL,
    dataset_name VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size_bytes BIGINT,
    row_count INTEGER,
    column_count INTEGER,
    columns_list TEXT[],
    date_start VARCHAR(100),
    date_end VARCHAR(100),
    has_spatial_data BOOLEAN DEFAULT FALSE,
    geometry_type VARCHAR(100),
    crs VARCHAR(100),
    data_status VARCHAR(50) NOT NULL, -- VERIFIED, PARTIAL, NOT_AVAILABLE, MOCK
    data_source VARCHAR(100) NOT NULL, -- OFFICIAL, INVENTORY, PROTOTYPE
    is_realtime BOOLEAN DEFAULT FALSE,
    db_table_mapped VARCHAR(100),
    last_scanned TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- 2. Detailed Rainfall Observations Table (Dataset 5)
CREATE TABLE IF NOT EXISTS rainfall_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_name VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100),
    agency VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    observation_date DATE NOT NULL,
    rainfall_mm DOUBLE PRECISION,
    data_status VARCHAR(50) DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_rainfall_obs_station ON rainfall_observations(station_name);
CREATE INDEX IF NOT EXISTS idx_rainfall_obs_date ON rainfall_observations(observation_date);
CREATE INDEX IF NOT EXISTS idx_catalogue_cat_num ON dataset_catalogue(category_number);
