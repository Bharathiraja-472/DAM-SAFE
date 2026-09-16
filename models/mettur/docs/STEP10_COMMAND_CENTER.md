# DAM-SAFE Step 10 — Command & Control Dashboard Architecture Specification

## Executive Overview
The **DAM-SAFE Command & Control Dashboard** unifies all components of the real-data-driven Mettur Dam-Break Flood Simulation + HADR Decision Support Platform for Tamil Nadu.

It consolidates structural parameters, reservoir telemetry, SRTM 30m terrain, Step 8 Mettur Dam-Break Prototype simulation outputs, Step 9 HADR decision support metrics, evacuation zoning, transport corridor accessibility, relief staging shelters, and data provenance into a single, intuitive interface.

---

## 1. Main Navigation Architecture (9 Main Tabs)
1. **COMMAND CENTER** (`CommandCenterPage.tsx`): Main landing dashboard integrating live metrics, system health, current scenario, flood extent, HADR impact, evacuation status, prototype advisories, and embedded map.
2. **FLOOD MAP** (`InteractiveMap.tsx`): Interactive Leaflet map view with dynamic layer controls (DEM, Dam, Reservoir, River, Flood Extent, Depth, Velocity, Arrival, Villages, Population, Buildings, Roads, Infrastructure, Evacuation Zones, Routes, Shelters, Priority Areas).
3. **DAM & RESERVOIR** (`DamReservoirPage.tsx`): Specifications, storage history, and 175k rainfall telemetry records.
4. **SIMULATION** (`SimulationPage.tsx`): Step 8 Mettur Dam-Break Prototype controls & Delft3D-FM CLI status.
5. **FLOOD IMPACT** (`FloodImpactPage.tsx`): Inundation depth/velocity severity breakdown across settlements, building footprints, and infrastructure.
6. **HADR** (`HadrDashboardPage.tsx`): HADR priority score (0–100) and settlement risk ranking.
7. **EVACUATION** (`EvacuationPage.tsx`): Sector evacuation zoning (Zone 1 to Zone 4), road usability status, and staging shelters.
8. **DATA & PROVENANCE** (`DataProvenancePage.tsx`): Data provenance matrix across all 16 dataset categories.
9. **SYSTEM STATUS** (`SystemStatusPage.tsx`): Real-time component health monitor.

---

## 2. Strict Terminology & Governance Rules
- **Prohibition of "LIVE"**: The word "LIVE" is strictly forbidden from implying real-time emergency telemetry. All simulation outputs carry **"CURRENT STATUS"** or **"PROTOTYPE STATUS"**.
- **Provenance Badges**:
  - `REAL OBSERVATION`: SRTM DEM, Dam parameters, Reservoir telemetry, Rain gauge observations, Census 2011 demographics.
  - `PROTOTYPE SIMULATION`: Step 8 Mettur Dam-Break Prototype flood extent, depth, velocity, arrival time.
  - `DUMMY PROTOTYPE DATA`: Trapezoidal riverbed bathymetry, simplified centerline, relief shelter staging locations.
  - `SYNTHETIC SOFTWARE TEST`: Step 7 isolated software pipeline testing assets.
- **Permanent Warning Banners**:
  - `"PROTOTYPE — REAL DATA + EXPLICIT ASSUMPTIONS — NOT SCIENTIFICALLY VALIDATED"`
  - `"HADR DECISION SUPPORT PROTOTYPE — NOT AN OPERATIONAL EMERGENCY WARNING SYSTEM"`
  - `"SOFTWARE PIPELINE TEST — SYNTHETIC DATA — NOT A SCIENTIFIC FLOOD SIMULATION"`
  - `"PROTOTYPE ADVISORY — NOT AN OFFICIAL EMERGENCY ALERT"`

---

## 3. Backend API Integration (`/api/dashboard/*`, `/api/system/*`)
- `GET /api/dashboard/summary`: Aggregates real-time PostGIS data, current prototype run metrics, flood status, HADR results, evacuation zones, shelters, and data provenance.
- `GET /api/system/health`: Evaluates Backend, Database, GIS, Delft3D CLI, Prototype Model, and HADR engine health.
- `GET /api/system/components`: Itemized component status matrix.
- `GET /api/system/data-status`: Dataset provenance catalog.
- `POST /api/reports/generate`: Exports consolidated prototype report JSON file saved under `models/mettur/prototype/validation/final_reports/`.

---

## 4. Scientific Model Protection
The scientific Mettur hydraulic mesh file `models/mettur/geometry/mettur_cauvery_net.nc` remains **strictly UN-CREATED** (`[BLOCKED BY REAL DATA]`) pending real channel geometry and underwater bathymetry data.
