# ⚙️ DAM-SAFE Step 7 Simulation Pipeline Documentation

This document records the end-to-end software simulation pipeline architecture, FastAPI controller endpoints, PostGIS test results table schema, frontend time-slider playback interface, and scientific model gate protection rules.

---

## 🏛️ End-to-End Pipeline Architecture

```
User Interactive Trigger (Simulation Page)
        │
        ▼
POST /api/simulation/run  ─────────────► Scientific Model Gate Check
        │                                       │
        │                                 (is_scientific?)
        │                                       ├─► TRUE & Grid Missing: 400 Bad Request ("BLOCKED BY REAL DATA")
        │                                       └─► FALSE (Software Test): Proceed
        ▼
Simulation Controller (simulation_service.py)
        │
        ├──► Create Run Directory: models/mettur/runs/software_test_<run_id>/
        ├──► Generate Timestep GeoJSON Polygons (T+00:00 to T+03:00)
        ├──► Store Output Files: run_metadata.json, timesteps.json, timestep_XXX.geojson
        └──► Ingest Records into PostGIS: simulation_test_results (EPSG:4326)
        │
        ▼
GET /api/simulation/results/{run_id}/timestep/{timestep}
        │
        ▼
React Leaflet Dynamic Map Playback (InteractiveMap.tsx)
        │
        ├──► Time Slider Controls (Play/Pause, Step 0 to Step 6)
        ├──► Render Depth-Coded Inundation Polygons (0.0m - 5.0m)
        ├──► Spatial Exposure Impact Intersection (flood_postprocessor.py)
        └──► Permanent Warning Banner Overlay:
             "SOFTWARE PIPELINE TEST — SYNTHETIC DATA — NOT A SCIENTIFIC FLOOD SIMULATION"
```

---

## 🛡️ Scientific Gate Protection Rules

1. **Reserved Scientific Mesh**: The scientific mesh filename `models/mettur/geometry/mettur_cauvery_net.nc` remains **un-created** and marked `[PENDING REAL DATA / BLOCKED BY REAL DATA]`.
2. **Rejection of Scientific Run Requests**: If an API request specifies `is_scientific: true` or `mode: "scientific"`, the backend controller returns HTTP 400 with message:  
   `"Scientific Mettur Delft3D-FM simulation is currently unavailable because required real hydraulic data is pending."`
3. **Zero Automatic Fallback**: The API never silently falls back to synthetic data when a scientific simulation is requested.

---

## 📊 Database & API Specifications

### PostGIS Test Table Schema (`simulation_test_results`)
- `id`: Primary key serial
- `run_id`: Unique test run identifier string
- `timestep`: Integer index (0, 1, 2, ...)
- `time_hours`: Numeric time offset in hours
- `max_depth_m`: Water depth in meters
- `max_velocity_m_s`: Velocity in m/s
- `geom`: Polygon geometry (`EPSG:4326`) with GIST spatial index
- `data_status`: `SYNTHETIC_TEST_ONLY`
- `scientific_use`: `FALSE`

---

## 🔄 Future Delft3D-FM Integration Pathway

When real Cauvery vector centerlines and riverbed bathymetry cross-sections are acquired in Step 8:
1. `models/mettur/geometry/mettur_cauvery_net.nc` will be generated from real geometry.
2. `simulation_service.py` will invoke `dflowfm-cli.exe -m base/mettur_base.mdu`.
3. Output NetCDF files (`*_map.nc`) will be parsed by `flood_postprocessor.py`.
4. The frontend UI, time-slider controls, and PostGIS queries will function **without requiring redesign**, simply rendering real scientific flood outputs instead of test assets.
