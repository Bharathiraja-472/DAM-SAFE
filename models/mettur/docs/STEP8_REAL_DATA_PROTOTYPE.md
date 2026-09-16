# 🌊 Step 8 Mettur Dam-Break Prototype Technical Specification

This document records the full technical specification of the Mettur Dam-Break Prototype model, workspace structure, scenario configurations, D-Flow FM CLI engine integration, PostGIS storage, and frontend dynamic map playback.

---

## 🏛️ 1. Workspace Directory Architecture (`models/mettur/prototype/`)

```
models/mettur/prototype/
├── geometry/
│   ├── mettur_prototype_net.nc        # UGRID NetCDF prototype grid (EPSG:32644)
│   └── mettur_prototype_net.json      # Grid metadata descriptor
├── bathymetry/                        # Derived metric terrain raster
├── boundary/                          # Prototype boundary definitions
├── forcing/                           # Daily telemetry and hydrograph inputs
├── scenarios/                         # Scenario definitions (Max RL, Moderate, Severe, Custom)
├── runs/                              # Prototype simulation output runs (run_<run_id>/)
├── output/                            # Output maps and GeoJSON timesteps
├── validation/                        # Empirical observation comparisons
└── docs/                              # Prototype technical documentation
```

---

## 📊 2. Provenance Transparency & 5 Data Status Categories

Every parameter, spatial layer, and output feature in the Step 8 Prototype carries an explicit provenance tag:

1. **`REAL`**: Real-world data from official sources (SRTM 30m DEM, Mettur Dam parameters, daily telemetry, 175k rainfall records).
2. **`DERIVED_FROM_REAL`**: Metric terrain copy reprojected to EPSG:32644 (`SRTM_Mettur_30m_UTM44N_LandSurface.tif`).
3. **`PROTOTYPE_ASSUMPTION`**: Un-measured engineering/breach parameters (`PROTOTYPE_ASSUMPTIONS.md`).
4. **`DUMMY_FOR_PROTOTYPE`**: Geographically consistent channel centerline and bed invert profile generated for missing features after portal research (`models/mettur/prototype_assumptions/dummy_data/`).
5. **`SYNTHETIC_TEST_ONLY`**: Step 7 software pipeline testing assets (isolated, never mixed with Step 8 prototype data).

---

## ⚙️ 3. Backend Controller & PostGIS Integration

- **Backend Controller**: `backend/app/services/prototype_simulation_service.py`
- **PostGIS Table**: `simulation_prototype_results` (`EPSG:4326`) with GIST spatial index on `geom`.
- **API Endpoints**:
  - `POST /api/simulation/prototype/run`
  - `GET /api/simulation/prototype/status/{run_id}`
  - `GET /api/simulation/prototype/results/{run_id}`
  - `GET /api/simulation/prototype/results/{run_id}/timestep/{timestep}`
  - `GET /api/simulation/prototype/assumptions/{run_id}`
  - `GET /api/simulation/prototype/impacts/{run_id}/timestep/{timestep}`

---

## 🖼️ 4. Frontend UI & Transparency Overlay

- **Mettur Prototype Controls**: Scenario selector (Max Reservoir Level, Moderate Breach, Severe Breach, Custom Breach), breach width slider, initial water level input.
- **Data Provenance Panel**: Itemized badges (`[REAL]`, `[DERIVED_FROM_REAL]`, `[PROTOTYPE ASSUMPTION]`, `[DUMMY FOR PROTOTYPE]`).
- **Permanent Warning Banner**:
  `PROTOTYPE — REAL DATA + EXPLICIT ASSUMPTIONS — NOT SCIENTIFICALLY VALIDATED`
