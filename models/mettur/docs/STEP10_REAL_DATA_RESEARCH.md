# DAM-SAFE Step 10 — Real Data Research & Provenance Audit

## Executive Summary
This document records the search audit conducted across official portals for real hydraulic data to support Step 10 Command & Control integration.

---

## 1. Portals Searched & Outcomes

| Target Dataset | Authoritative Source / Portal | Status | Audit Findings & Access Details |
| :--- | :--- | :--- | :--- |
| **Mettur DEM Elevation** | NASA SRTM / USGS EarthExplorer | ✅ AVAILABLE | Acquired 30m SRTM DEM (`output_SRTMGL1.tif`) & reprojected to UTM 44N (`EPSG:32644`). |
| **Mettur Dam Geometry** | Government of Tamil Nadu WRD | ✅ AVAILABLE | Verified structural height (214 ft), length (5300 ft), FRL (165 ft), total capacity (95.66 TMC). |
| **Reservoir Telemetry** | TNSDMA / TN Water Resources Dept | ✅ AVAILABLE | Verified daily storage & water level history (`mettur_reservoir_dataset_3.csv`). |
| **Rainfall Telemetry** | TN SW/GW & NWDP Network | ✅ AVAILABLE | Acquired 175,735 daily rainfall records across 145 stations (`mettur_cauvery_rainfall_dataset_5_complete.csv`). |
| **Cauvery River Centerline** | CWC / Bhuvan / OpenStreetMap | ⚠️ PARTIAL | Global river vector available; high-resolution hydraulic channel bank lines pending official GIS export. Used `DUMMY_FOR_PROTOTYPE` for software pipeline. |
| **Riverbed Bathymetry** | CWC / TN WRD Hydrographic Survey | 🔴 NOT AVAILABLE | Sub-surface riverbed bathymetry profiles not published in open portals. Explicitly labeled `DUMMY_FOR_PROTOTYPE`. |
| **Census Demographics** | Census of India 2011 | ✅ AVAILABLE | Population exposure attributed as `"Population exposure estimate based on Census 2011"`. |
| **Staging Shelters** | TN Fire & Rescue / Salem District Admin | ⚠️ PROTOTYPE DUMMY | Official shelter GIS layer not publicly accessible via open API. Labeled `DUMMY DATA — PROTOTYPE ONLY`. |

---

## 2. Governance Declaration
- All dummy assets carry explicit tags: `DUMMY_FOR_PROTOTYPE` or `DUMMY DATA — PROTOTYPE ONLY`.
- Zero dummy data is presented as real hydraulic observations.
- Scientific Delft3D mesh remains **UN-CREATED** (`[BLOCKED BY REAL DATA]`).
