# DAM-SAFE — Complete System Architecture & Operational Documentation

## Executive Overview
**DAM-SAFE** is a real-data-driven Mettur Dam-Break Flood Simulation + HADR Decision Support Platform for Tamil Nadu.

This document synthesizes the engineering accomplishments, spatial database schema, simulation engine integration, HADR risk scoring methodology, data governance rules, testing protocols, limitations, and future scientific upgrade path across all 10 project milestones.

---

## 1. Milestone Evolution (Steps 1–10 Summary)

### Step 1 — Project Foundation & Repository Setup
- Established clean modular workspace architecture: `backend/`, `frontend/`, `data/`, `database/`, `models/mettur/`.
- Configured FastAPI backend, React 18 + Vite + TypeScript frontend, and environment configuration.

### Step 2 — PostGIS Database Architecture & Migrations
- Installed PostgreSQL 18.3 + PostGIS 3.6 (`dam_safe` database).
- Created migration pipeline (`001_initial_schema.sql` to `005_hadr_decision_support.sql`) creating 26 PostGIS tables with spatial GIST indexes on `geom` (`EPSG:4326`).

### Step 3 — GIS Data Processing & Land Surface Elevation
- Acquired real SRTM 30m DEM (`output_SRTMGL1.tif`) and reprojected to UTM Zone 44N (`SRTM_Mettur_30m_UTM44N_LandSurface.tif`).
- Ingested verified Mettur Dam specs (`mettur_dam_dataset.csv`), storage history (`mettur_reservoir_dataset_3.csv`), and 175,735 daily rainfall records across 145 gauge stations (`mettur_cauvery_rainfall_dataset_5_complete.csv`).

### Step 4 — Delft3D-FM Suite Installation & Verification
- Verified local installation of Delft3D-FM CLI at `D:\DAM-SAFE\delft3d\install_fm-suite\bin\dflowfm-cli.exe` (v2024.03).
- Established dry execution wrappers and subprocess handlers.

### Step 5 — Real-Data Acquisition & Portal Auditing
- Conducted exhaustive real data search audits across official portals (TNSDMA, Government of Tamil Nadu, CWC, India-WRIS, ISRO/Bhuvan, IMD, Survey of India, Census 2011).
- Documented findings in `models/mettur/docs/STEP5_REAL_DATA_RESEARCH.md`.

### Step 6 — Mesh Isolation & Software Pipeline Test Track
- Isolated scientific model track (`[BLOCKED BY REAL DATA]`). Reserved mesh file `models/mettur/geometry/mettur_cauvery_net.nc` remains **strictly UN-CREATED**.
- Created isolated synthetic test mesh `mettur_software_test_net.nc` for software pipeline validation without making false scientific claims.

### Step 7 — End-to-End Software Pipeline Verification
- Validated end-to-end software flow: Scenario Configuration $\rightarrow$ Engine Execution $\rightarrow$ GeoJSON Timesteps $\rightarrow$ Leaflet Time Slider $\rightarrow$ Impact Intersection.

### Step 8 — Real-Data Mettur Prototype Integration
- Built **Mettur Dam-Break Prototype** workspace (`models/mettur/prototype/`) combining real SRTM DEM, dam specs, daily telemetry, and explicit prototype assumptions (`PROTOTYPE_ASSUMPTIONS.md`).
- Applied migration `004_simulation_prototype_results.sql` and implemented `prototype_simulation_service.py`.

### Step 9 — HADR Impact Analysis & Decision Support Layer
- Built HADR risk classification engine (`hadr_service.py`) applying the normalized 0–100 HADR Priority Score formula:
  $$\text{Score} = 100 \times \left( 0.25 R_d + 0.20 R_v + 0.25 R_a + 0.15 R_p + 0.15 R_i \right)$$
  where $R_a = 1.0 - \min\left(1.0, \frac{\text{arrival}}{3.0}\right)$.
- Applied migration `005_hadr_decision_support.sql` creating 6 PostGIS HADR tables.
- Integrated Census 2011 population exposure attribution and dummy shelter badges.

### Step 10 — Command & Control Dashboard & Final Integration
- Built unified Command & Control Dashboard (`CommandCenterPage.tsx`) integrating system status, current prototype scenario, flood status (`PROTOTYPE SIMULATION`), HADR status, evacuation status, prototype advisories, report exporter, and interactive map.
- Implemented backend dashboard summary services (`dashboard_service.py`, `system_service.py`, `report_service.py`).
- Integrated 9 main navigation tabs in frontend React app.

---

## 2. Data Governance Framework & Badges
All 5 status categories are enforced across database tables, backend APIs, and UI components:
1. `REAL OBSERVATION`: Verified SRTM DEM, Dam parameters, Reservoir telemetry, Rain gauge observations, Census 2011 demographics.
2. `DERIVED FROM REAL`: Projected UTM Zone 44N metric land surface elevation grid (`EPSG:32644`).
3. `PROTOTYPE ASSUMPTION`: Engineering breach parameters (150m width, 2.0h formation, deep sill invert).
4. `DUMMY PROTOTYPE DATA`: Simplified river centerline, trapezoidal riverbed profile, relief shelter assembly points.
5. `SYNTHETIC SOFTWARE TEST`: Step 7 isolated software testing assets (`mettur_software_test_net.nc`).

---

## 3. Future Scientific Model Upgrade Path
The scientific Delft3D hydraulic model remains **`[BLOCKED BY REAL DATA]`** to preserve scientific integrity. To upgrade the prototype into an operationally validated scientific simulation in the future, the following datasets must be acquired and imported:
1. High-density river cross-section surveys / multibeam sonar bathymetry for the Cauvery River downstream of Mettur Dam.
2. Official high-resolution river centerline and bank GIS vectors.
3. High-frequency boundary stage/discharge telemetry at Mettur tailrace and downstream gauge stations.

Once acquired, the reserved mesh `models/mettur/geometry/mettur_cauvery_net.nc` can be generated and calibrated against Sentinel-1 SAR flood imagery.
