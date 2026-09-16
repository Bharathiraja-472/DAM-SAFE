# 🔍 DAM-SAFE Step 8 Initial Architecture Audit

This audit evaluates the existing codebase, real datasets in `d:/SIH2026/data/`, database tables, backend APIs, frontend components, and Delft3D-FM workspace infrastructure before executing Step 8.

---

## 📊 1. Real Available Datasets Audit (`d:/SIH2026/data/`)

| # | Dataset Name | File Path | Provenance / Data Status | Verification Result | Reusability in Step 8 Prototype |
|---|---|---|---|---|---|
| 1 | **SRTM 30m DEM** | `data/output_SRTMGL1.tif` | `REAL` | 2,520 x 2,700 raster, WGS 84 (`EPSG:4326`) | Primary land surface elevation source |
| 2 | **Metric DEM Copy** | `models/mettur/bathymetry/SRTM_Mettur_30m_UTM44N_LandSurface.tif` | `DERIVED_FROM_REAL` | Projected UTM 44N (`EPSG:32644`), 9.39 MB | Primary metric grid terrain source |
| 3 | **Mettur Dam Data** | `data/mettur_dam_dataset.csv` | `REAL` | Structural height 214ft, FRL 165ft, Capacity 95,660 Mcft | Primary Mettur dam & reservoir parameter source |
| 4 | **Reservoir Telemetry** | `data/mettur_reservoir_dataset_3.csv` & historical | `REAL` | Daily levels, storage, inflow, outflow | Primary reservoir initial condition source |
| 5 | **Rainfall Telemetry** | `data/mettur_cauvery_rainfall_dataset_5_complete.csv` | `REAL` | 175,735 rows across 145 rain stations | Primary catchment precipitation source |
| 6 | **Hydrology Registry** | `data/Dataset_6_Mettur_Cauvery_Hydrology_Source_and_Verified_Observations.csv` | `REAL` | Station locations & observation metadata | Gauging network reference source |
| 7 | **Spatial GIS Tables** | PostgreSQL `dam_safe` database (`dams`, `rainfall_stations`) | `REAL` | PostGIS spatial tables (`EPSG:4326`) | Primary PostGIS GIS database source |

---

## 🚫 2. Missing Real Datasets & Research Target List

| Missing Component | Current Status | Cause | Strategy for Step 8 Prototype |
|---|---|---|---|
| **Cauvery River Centerline** | `REAL DATA NOT FOUND` | Downloadable vector shapefile pending institutional download | Active portal research; create `DUMMY_FOR_PROTOTYPE` channel line under `prototype_assumptions/dummy_data/` if missing |
| **Riverbed Bathymetry / Cross-Sections** | `REAL DATA NOT FOUND` | Sub-surface channel surveys missing in open web downloads | Active portal research; create `DUMMY_FOR_PROTOTYPE` bed profile & cross-sections under `prototype_assumptions/dummy_data/` if missing |
| **High-Frequency Gauge Hydrograph** | `PARTIAL` | Daily telemetry available; hourly stage hydrographs missing | Active portal research; create `PROTOTYPE_ASSUMPTION` breach hydrograph for prototype runs |

---

## 🏛️ 3. Existing Architecture Reuse & Extension Plan

### Reusable Infrastructure (Preserved 100% Intact)
- **Step 7 Synthetic Pipeline**: Backend `simulation_service.py` software testing controls and `models/mettur/synthetic_test/` files remain completely intact.
- **Scientific Mesh Isolation**: `models/mettur/geometry/mettur_cauvery_net.nc` remains **un-created** and marked `[PENDING REAL DATA / BLOCKED BY REAL DATA]`.
- **Database Tables**: PostgreSQL `dam_safe` tables (`dams`, `rainfall_stations`, `hydro_observations`, `simulation_test_results`) remain untouched.

### New Step 8 Extensions Created
- **PostGIS Table**: `simulation_prototype_results` (Migration `004_simulation_prototype_results.sql`).
- **Prototype Model Workspace**: `models/mettur/prototype/` (`geometry/`, `bathymetry/`, `boundary/`, `forcing/`, `scenarios/`, `runs/`, `output/`, `validation/`, `docs/`).
- **Prototype Assumptions & Dummy Data**: `models/mettur/prototype_assumptions/` and `dummy_data/`.
- **Backend Controller**: `prototype_simulation_service.py` to invoke D-Flow FM CLI (`dflowfm-cli.exe`) or prototype model engine.
- **FastAPI Endpoints**: `/api/simulation/prototype/*` routes.
- **Frontend UI**: Mettur Prototype Simulation controls & Data Provenance Panel displaying itemized `[REAL]`, `[DERIVED_FROM_REAL]`, `[PROTOTYPE ASSUMPTION]`, `[DUMMY FOR PROTOTYPE]` badges.
