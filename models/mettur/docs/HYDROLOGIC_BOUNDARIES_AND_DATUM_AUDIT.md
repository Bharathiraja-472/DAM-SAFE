# 🌊 Hydrologic Boundaries, Bathymetry, & Datum Audit Report

## 1. Reservoir / Water-Spread Polygon Status
* **Status**: `[PENDING REAL DATA]`
* **Audit Rule**: Satellite-derived water masks for single dates do not automatically represent maximum FRL reservoir envelopes. No artificial reservoir polygon has been drawn.

---

## 2. River Bathymetry & Cross-Sections Status
* **Status**: `[PENDING REAL DATA]`
* **Land DEM vs Bathymetry**: `d:/SIH2026/data/output_SRTMGL1.tif` is classified strictly as **Land-Surface Elevation**.
* **Sub-surface Channel Depth**: Underwater riverbed bathymetry and gauging-station cross-sections remain pending survey data acquisition. No synthetic channel beds were created.

---

## 3. Hydrological Boundary Observations & Rainfall Ingestion Status
* **Dataset 5 Full Source**: `mettur_cauvery_rainfall_dataset_5_complete.csv` (175,735 records, 145 rain stations).
* **Current Database Ingestion**: 1,000 prototype-loaded records in PostgreSQL `rainfall_observations`.
* **Telemetry Distinction**: API and UI explicitly report `FULL SOURCE: 175,735 rows` vs `CURRENT DB PROTOTYPE: 1,000 loaded records`.

---

## 4. DEM & Vertical Datum Reconciliation
* **Horizontal CRS**: `EPSG:4326` (WGS 84)
* **Vertical Datum**: `EGM96` (Orthometric Height in meters MSL)
* **Resolution**: 1 arc-second (~30 meters per cell)
* **Status**: `[PENDING VERTICAL DATUM RECONCILIATION]` (Future bathymetric survey datums must be reconciled against EGM96 MSL).
