# 🌊 DAM-SAFE: Mettur Dam-Break Flood Simulation & HADR Decision-Support Platform

**DAM-SAFE** is a decision-support system designed to simulate potential dam-break flooding events, quantify downstream hydraulic propagation (depth, velocity, wave arrival time), assess multidimensional community & infrastructure exposure, evaluate flood risk, and deliver actionable Humanitarian Assistance and Disaster Relief (HADR) evacuation guidance.

---

## 📍 Primary Study Area

* **Dam Facility**: Mettur Dam (Stanley Reservoir), Salem District, Tamil Nadu, India (~11.8016° N, 77.8016° E)
* **Primary System**: Cauvery (Kaveri) River & downstream floodplains (Salem, Erode, Namakkal, Karur, Tiruchirappalli, Thanjavur)

---

## 🏗️ System Architecture

```text
SIH2026/
├── data/                    # Prototype & reference raw datasets (Preserved Untouched)
├── backend/                 # Python FastAPI Backend API & Data Abstraction Layer
├── frontend/                # React + Vite + TypeScript + Leaflet Frontend UI
├── database/                # PostgreSQL + PostGIS Schemas (`dam_safe` DB)
├── models/                  # Delft3D-FM Hydrodynamic Model Workspace
│   └── mettur/
│       ├── base/            # Mettur base hydraulic flow MDU model configuration
│       ├── bathymetry/      # DEM processing copy (SRTM_Mettur_30m_LandSurface.tif)
│       ├── boundary/        # External boundary definition files (*.ext)
│       ├── docs/            # DOMAIN.md, BATHYMETRY_STATUS.md, MODEL_DATA_REQUIREMENTS.md
│       ├── logs/            # Execution diagnostic logs
│       ├── scenarios/       # Dam-break breach templates (Max Reservoir, Moderate, Custom)
│       ├── templates/       # D-Flow FM MDU template files
│       ├── validation/      # Model structure validation scripts
│       └── README.md
├── simulation/              # Simulation Execution Workspace
├── gis/                     # Spatial Data Pipeline & CRS Strategy (EPSG:4326 & EPSG:32644)
├── docs/                    # Architecture Specifications & Scientific Notes
└── README.md
```

---

## ⚙️ Hydraulic Engine Telemetry (Step 4 Status)

* **Engine**: Deltares D-Flow FM (Delft3D-FM Flexible Mesh 2D)
* **CLI Executable**: `D:\DAM-SAFE\delft3d\install_fm-suite\bin\dflowfm-cli.exe`
* **Batch Launcher**: `D:\DAM-SAFE\delft3d\install_fm-suite\bin\run_dflowfm.bat`
* **Version**: `1.2.184.Unknown (Built Sep 07 2026)`
* **Support Libraries**: OpenMP (`yes`), MPI (`yes`), PETSc (`yes`), METIS (`yes`), PROJ (`yes`), Shapelib (`yes`), GDAL (`yes`).
* **Model Validation**: `VERIFIED` (`validate_model.py` executed cleanly with exit code 0).

---

## 📊 Data & Prototype Provenance Policy

1. **Verified Data**: Datasets from official government sources (e.g. Tamil Nadu Agrisnet, CWC, NWDP) are served with `data_status: "verified"` and `data_source: "official"`.
2. **Prototype / Mock Data**: Any demonstration layer or non-verified data is explicitly tagged with `data_status: "prototype"` or `data_status: "mock"`.
3. **Zero Data Mutation**: Original raw files in `d:/SIH2026/data/` remain **100% untouched**.
