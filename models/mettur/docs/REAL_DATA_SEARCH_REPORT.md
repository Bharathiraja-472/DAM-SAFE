# 🔎 Real Spatial & Hydraulic Data Search Audit Report

**Generated Date**: 2026-09-07
**Search Policy**: Real data search attempted across official Government of India, CWC, ISRO/Bhuvan, Tamil Nadu WRD, and academic portals prior to generating any synthetic test assets.
**Connectivity Note**: Python programmatic checks document attempted access without assuming unrestricted web downloads.

---

## 📊 Target Dataset Search Audit Matrix

### Cauvery River Centerline
- **Search Terms**: `Cauvery river centerline vector shapefile geojson CWC WRIS Bhuvan`
- **Final Classification**: **`REAL DATA NOT FOUND / PENDING ACCESS`**
- **Findings**: Web portal endpoints require authenticated registration or interactive web sessions. Downloadable vector shapefile for Cauvery main-stem reach downstream of Mettur Dam was not auto-ingested programmatically.
- **Portals Searched**:
  - **India-WRIS / CWC** (WFS/GIS Web Portal): `https://indiawris.gov.in/wris/#/Hydrography` — *Status*: `Attempted Access (Network/Auth Limit: <urlopen error timed out>)`
  - **NRSC / ISRO Bhuvan** (OGC Web Service): `https://bhuvan.nrsc.gov.in/` — *Status*: `Accessible (HTTP 200)`
  - **HydroRIVERS (WWF)** (Open Hydrography Vector): `https://www.hydrosheds.org/products/hydrorivers` — *Status*: `Accessible (HTTP 200)`
  - **OpenStreetMap Waterway** (Open Data API): `https://overpass-api.de/api/interpreter` — *Status*: `Attempted Access (Network/Auth Limit: HTTP Error 406: Not Acceptable)`

### Mettur / Stanley Reservoir Boundary
- **Search Terms**: `Mettur Dam Stanley Reservoir water spread polygon GIS boundary shapefile`
- **Final Classification**: **`REAL DATA NOT FOUND / PENDING ACCESS`**
- **Findings**: Single-date satellite water masks catalogued in Dataset 7/8; official FRL maximum water spread polygon vector remains pending institutional download.
- **Portals Searched**:
  - **India-WRIS Waterbodies** (Government GIS Portal): `https://indiawris.gov.in/` — *Status*: `Attempted Access (Network/Auth Limit: <urlopen error timed out>)`
  - **NRSC Bhuvan Water Bodies** (Satellite Remote Sensing Portal): `https://bhuvan-app1.nrsc.gov.in/bhuvan2d/` — *Status*: `Accessible (HTTP 200)`
  - **Tamil Nadu WRD GIS** (State Irrigation Dept): `https://www.wrd.tn.gov.in/` — *Status*: `Attempted Access (Network/Auth Limit: <urlopen error [SSL: CERTIFICATE_VERIFY_)`

### Riverbed Bathymetry & Cross-Sections
- **Search Terms**: `Cauvery river cross section bathymetry bed elevation CWC TN WRD sounding survey`
- **Final Classification**: **`REAL DATA NOT FOUND`**
- **Findings**: Sub-surface channel cross-sections and bed invert levels are unavailable in open public web downloads. SRTM GL1 DEM is strictly land-surface elevation.
- **Portals Searched**:
  - **CWC Hydro-observation Network** (Government Hydrology Portal): `https://cwc.gov.in/` — *Status*: `Accessible (HTTP 200)`
  - **Tamil Nadu Surface Water Department** (State Water Resources Dept): `http://www.tn.gov.in/` — *Status*: `Accessible (HTTP 200)`
  - **Academic Repositories (IIT/IISc)** (Research Data Publications): `https://eprint.iisc.ac.in/` — *Status*: `Attempted Access (Network/Auth Limit: <urlopen error [Errno 11001] getaddrinfo)`

### Hydrological Boundary Observations
- **Search Terms**: `Mettur reservoir inflow outflow discharge water level hourly CWC telemetry`
- **Final Classification**: **`PARTIAL REAL DATA AVAILABLE`**
- **Findings**: Daily reservoir stage, storage, inflow, and outflow records are verified in Dataset 3 & historical CSVs. Hourly telemetry hydrographs for downstream gauge stations remain pending.
- **Portals Searched**:
  - **Dataset 6 Registry** (Project Dataset Registry): `d:/SIH2026/data/Dataset_6_Mettur_Cauvery_Hydrology_Source_and_Verified_Observations.csv` — *Status*: `Local Dataset Verified`
  - **Tamil Nadu Daily Reservoir Bulletin** (State Hydrology Records): `https://www.wrd.tn.gov.in/` — *Status*: `Attempted Access (Network/Auth Limit: <urlopen error [SSL: CERTIFICATE_VERIFY_)`

### LULC / Roughness Map
- **Search Terms**: `NRSC Bhuvan LULC Cauvery basin land use land cover 10m 50k`
- **Final Classification**: **`PARTIAL REAL DATA AVAILABLE`**
- **Findings**: Dataset 9 catalogued NRSC Bhuvan 50K land cover classification schema. Spatial raster grid pending local clipping.
- **Portals Searched**:
  - **NRSC Bhuvan LULC 50K** (Thematic GIS Portal): `https://bhuvan-app1.nrsc.gov.in/thematic/` — *Status*: `Accessible (HTTP 200)`
  - **ESRI / Sentinel-2 LULC** (Global Satellite Land Cover): `https://livingatlas.arcgis.com/landcover/` — *Status*: `Accessible (HTTP 200)`

### Buildings / Transport / Settlements
- **Search Terms**: `Tamil Nadu building footprints Microsoft ML OSM highways Census 2011 villages`
- **Final Classification**: **`PARTIAL REAL DATA AVAILABLE`**
- **Findings**: Census 2011 settlement demographics & road dataset specifications catalogued in Dataset 11/12/13/14.
- **Portals Searched**:
  - **Microsoft Global ML Buildings** (Open AI GIS Dataset): `https://github.com/microsoft/GlobalMLBuildingFootprints` — *Status*: `Accessible (HTTP 200)`
  - **OpenStreetMap Transport** (Geofabrik OSM Extracts): `https://download.geofabrik.de/asia/india.html` — *Status*: `Accessible (HTTP 200)`
  - **Census 2011 Demographics** (Project Dataset Registry): `d:/SIH2026/data/Dataset_12_Population_Settlement_Mettur_Cauvery_Census2011.csv` — *Status*: `Local Dataset Verified`

---

## 🛡️ Governance Summary

> [!IMPORTANT]
> **Scientific Isolation Rule:**
> - Real missing spatial datasets are marked **`[REAL DATA NOT FOUND]`** or **`[PENDING REAL DATA]`**.
> - The scientific model & computational mesh status remains strictly **`[PENDING REAL DATA / BLOCKED BY REAL DATA]`**.
> - Synthetic test data generated for software testing will **NEVER** overwrite real data or be presented as a scientific flood prediction.
