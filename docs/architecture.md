# DAM-SAFE System Architecture Specification

## 1. Data Abstraction Layer Architecture

The DAM-SAFE application enforces a strict separation between UI view rendering and data storage mechanisms:

```text
┌─────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                       │
│  Overview | Dam/Reservoir | Map | Scenarios | HADR      │
└────────────────────────────┬────────────────────────────┘
                             │ Native fetch() API
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 FASTAPI BACKEND SERVICE                 │
│  Routers: /api/dam, /api/reservoir, /api/datasets, etc. │
└────────────────────────────┬────────────────────────────┘
                             │ Data Service Ingestion Interface
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  DATA SERVICE LAYER                     │
│  Resolves requests to available data providers:         │
│  - Prototype Data Provider (d:/SIH2026/data CSVs)       │
│  - Future PostGIS Database Provider                     │
│  - Delft3D-FM GIS Output Raster Provider                │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Metadata Provenance Schema

All API JSON responses are wrapped in a standard metadata envelope:

```json
{
  "meta": {
    "dataset": "mettur_dam_geometry",
    "data_status": "verified",
    "data_source": "official",
    "is_realtime": false,
    "last_updated": "2026-09-07"
  },
  "data": { ... }
}
```

Allowed Status Values:
* `data_status`: `"verified"`, `"partial"`, `"prototype"`, `"mock"`, `"simulated"`
* `data_source`: `"official"`, `"inventory"`, `"prototype"`

---

## 3. Delft3D-FM Execution Workflow

```text
User Submits Breach Scenario (Width, Formation Time, Elevation)
                             │
                             ▼
FastAPI Backend Scenario Endpoint (/api/scenarios/run)
                             │
                             ▼
Simulation Manager Generates .mdu Configuration File
                             │
                             ▼
Executes `dflowfm-cli.exe --mdu <config_path>` asynchronously
                             │
                             ▼
Output Parser converts NetCDF / Map outputs into GeoTIFF & GeoJSON
                             │
                             ▼
Frontend Time Slider requests raster tiles per time step
```
