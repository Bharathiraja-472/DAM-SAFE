# 🔎 Step 8 Real Data Portal Research & Decision Audit Report

This report documents targeted searches across official Government of India, Tamil Nadu Water Resources Department, CWC, ISRO/Bhuvan, India-WRIS, IMD, NWDP, Survey of India, Copernicus, and NASA portals for missing spatial and hydraulic datasets prior to generating prototype dummy assets.

---

## 📊 Real Data Portal Search Audit Matrix

| Dataset Category | Required For | Sources & Portals Searched | Search Reference / URL | Real Data Found? | Download / Access Status | Final Classification | Prototype Action |
|---|---|---|---|---|---|---|---|
| **Cauvery River Centerline** | Main stem channel alignment | CWC India-WRIS, ISRO Bhuvan Hydrography, Tamil Nadu WRD, Survey of India NGP, OpenStreetMap Hydro, HydroRIVERS | `https://indiawris.gov.in/wris/#/Hydrography`<br>`https://bhuvan.nrsc.gov.in/` | `NO` (Vector shapefile requires interactive web session / login) | Pending institutional WFS login | **`REAL DATA NOT FOUND`** | Create `DUMMY_FOR_PROTOTYPE` channel vector in `prototype_assumptions/dummy_data/` |
| **Riverbed Bathymetry & Cross-Sections** | Main channel bed elevation & invert levels | CWC Hydrology Observations, Tamil Nadu Surface Water & Ground Water Dept, IIT/IISc Research Repositories, NASA/Copernicus SWOT | `https://cwc.gov.in/`<br>`https://www.wrd.tn.gov.in/`<br>`https://swot.jpl.nasa.gov/` | `NO` (Sub-surface bed invert levels unavailable in public downloads) | Public web downloads restricted | **`REAL DATA NOT FOUND`** | Create `DUMMY_FOR_PROTOTYPE` bed profile & cross-sections in `prototype_assumptions/dummy_data/` |
| **High-Frequency Gauge Hydrograph** | Downstream stage/discharge outflow boundary | CWC Telemetry, Tamil Nadu Daily Hydrology Bulletin, NWDP | `https://ffs.india-wris.gov.in/`<br>`https://www.wrd.tn.gov.in/` | `PARTIAL` (Daily levels available; 15-min hydrograph missing) | Daily telemetry ingested in DB | **`PARTIAL REAL DATA`** | Use daily observations for initial condition; create `PROTOTYPE_ASSUMPTION` breach release hydrograph |
| **LULC / Spatial Roughness** | Spatial Manning $n$ roughness grid | NRSC Bhuvan LULC 50k, Sentinel-2 10m LULC | `https://bhuvan-app1.nrsc.gov.in/thematic/`<br>`https://livingatlas.arcgis.com/landcover/` | `PARTIAL` (NRSC classification schema catalogued in Dataset 9) | Spatial raster grid pending local clip | **`PARTIAL REAL DATA`** | Use uniform Manning $n = 0.025\text{ s/m}^{1/3}$ as `PROTOTYPE_ASSUMPTION` |
| **Building Footprints / Exposure** | Flood risk exposure intersection | Microsoft Global ML Building Footprints, OpenStreetMap, Census 2011 | `https://github.com/microsoft/GlobalMLBuildingFootprints`<br>`https://download.geofabrik.de/` | `PARTIAL` (Census 2011 demographics catalogued in Dataset 12) | Footprint vectors catalogued | **`PARTIAL REAL DATA`** | Use Census 2011 settlement envelopes as `DERIVED_FROM_REAL`; create `DUMMY_FOR_PROTOTYPE` building sample |

---

## ⚖️ Governance & Prototype Rationale

1. **Research First Standard**: Real datasets are used wherever available (`output_SRTMGL1.tif`, `mettur_dam_dataset.csv`, daily telemetry CSVs, rainfall records).
2. **Controlled Dummy Creation**: `DUMMY_FOR_PROTOTYPE` assets are generated strictly for missing features (river centerline, bathymetry cross-sections) to allow the prototype model to function without stopping execution.
3. **Strict Data Tagging**: All created prototype files under `models/mettur/prototype_assumptions/dummy_data/` carry explicit headers:
   ```yaml
   data_status: DUMMY_FOR_PROTOTYPE
   scientific_use: FALSE
   source_type: DUMMY_FOR_PROTOTYPE
   warning: PROTOTYPE ASSUMPTION ONLY — NOT MEASURED OBSERVATION
   ```
