# 🔍 DAM-SAFE Step 9 Initial HADR Architecture Audit

This audit evaluates the existing codebase, PostGIS database tables, Step 8 prototype simulation outputs, and available spatial exposure datasets before implementing the HADR (Humanitarian Assistance and Disaster Response) decision-support layer.

---

## 📊 1. Available Spatial Exposure Datasets & Registries

| Dataset Category | Source File / Table | Horizontal CRS | Data Status Category | Provenance / Attribute Details | Reusability in Step 9 HADR Layer |
|---|---|---|---|---|---|
| **Land Terrain DEM** | `output_SRTMGL1.tif` | `EPSG:4326` / `EPSG:32644` | `REAL` | 30m SRTM GL1 Land Surface Elevation | Flood depth & elevation reference |
| **Mettur Dam Geometry** | `mettur_dam_dataset.csv` | `EPSG:4326` | `REAL` | Height 214ft, FRL 165ft, Capacity 95,660 Mcft | Upstream breach origin point |
| **Daily Reservoir Level** | `mettur_reservoir_dataset_3.csv` | N/A | `REAL` | Level 162.5ft daily telemetry | Initial hydraulic boundary condition |
| **Settlement Demographics** | `Dataset_12_Population_Settlement_Mettur_Cauvery_Census2011.csv` | `EPSG:4326` | `REAL` | Census 2011 village demographics | Primary village population exposure source |
| **Road Transport Network** | `Dataset_11_Road_Transportation_Mettur_Cauvery.csv` | `EPSG:4326` | `PARTIAL` | State Highway SH-20 corridor specs | Primary road usability analysis source |
| **Critical Infrastructure** | `Dataset_13_Critical_Infrastructure_Mettur_Cauvery.csv` | `EPSG:4326` | `PARTIAL` | Hospitals, schools, police, power stations | Primary facility priority ranking source |
| **Administrative Boundaries** | `Dataset_14_Administrative_Boundaries_Mettur_Cauvery.csv` | `EPSG:4326` | `PARTIAL` | District & Taluk hierarchy specs | Administrative unit reference source |

---

## 🚫 2. Missing HADR Exposure Layers & Fallback Strategy

| Missing Component | Current Status | Portal Research Target | Strategy for Step 9 HADR Layer |
|---|---|---|---|
| **Verified Emergency Staging Shelters** | `REAL DATA NOT FOUND` | TNSDMA, Salem District Admin, TN Fire & Rescue | Portal research; create `DUMMY_FOR_PROTOTYPE` shelter points tagged `[DUMMY SHELTER — PROTOTYPE ONLY]` |
| **Building Footprint Polygons** | `PARTIAL` | Microsoft ML Building Footprints, OpenStreetMap | Use Census 2011 settlement envelopes (`DERIVED_FROM_REAL`); generate sample building footprints (`DUMMY_FOR_PROTOTYPE`) |
| **Operational Evacuation Corridors** | `NOT AVAILABLE` | Highways Dept, Police Traffic Control | Implement network graph analysis (`PROTOTYPE_ASSUMPTION`); display `"PROTOTYPE EVACUATION ROUTE — REQUIRES FIELD VALIDATION"` |

---

## 🏛️ 3. Reusable Architecture & Migration Strategy

### Reusable Infrastructure (Preserved 100% Intact)
- **Step 7 Synthetic Pipeline**: Software pipeline test assets (`SYNTHETIC_TEST_ONLY`) preserved intact under `models/mettur/synthetic_test/`.
- **Step 8 Mettur Prototype**: Prototype workspace (`models/mettur/prototype/`), `mettur_prototype_net.nc`, and PostGIS table `simulation_prototype_results` preserved intact.
- **Scientific Model Isolation**: Reserved scientific mesh `models/mettur/geometry/mettur_cauvery_net.nc` remains **un-created** (`BLOCKED BY REAL DATA`).

### New Step 9 Extensions Created
- **Database Migration**: `005_hadr_decision_support.sql` (6 PostGIS tables: `hadr_impact_results`, `hadr_evacuation_zones`, `hadr_route_analysis`, `hadr_priority_areas`, `hadr_shelters`, `hadr_alert_zones`).
- **HADR Decision-Support Engine**: `hadr_service.py` performing village impact, building severity, road usability, evacuation zoning, route analysis, shelter management, and 0-100 priority scoring.
- **FastAPI Endpoints**: `/api/hadr/*` endpoints.
- **Frontend Dashboard**: `HadrDashboardPage.tsx` and interactive map layer controls in `InteractiveMap.tsx`.
