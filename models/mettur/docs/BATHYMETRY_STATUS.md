# 🌊 Mettur Dam & Cauvery River Bathymetry Status Matrix

This document tracks the verification, processing, and scientific status of land surface terrain and channel bathymetry data for the Delft3D-FM model.

---

## 📊 Bathymetry & Elevation Status Matrix

| Component | File / Asset Path | CRS | Vertical Datum | Status | Scientific Use | Notes |
|---|---|---|---|---|---|---|
| **Land Surface Elevation** | `bathymetry/SRTM_Mettur_30m_LandSurface.tif` | `EPSG:4326` | EGM96 MSL | **`AVAILABLE`** | `VALID TERRAIN` | 30m SRTM GL1 DEM covering Mettur & downstream floodplains |
| **Projected Metric Terrain** | `bathymetry/SRTM_Mettur_30m_UTM44N_LandSurface.tif` | `EPSG:32644` | EGM96 MSL | **`AVAILABLE`** | `VALID TERRAIN` | Derived UTM Zone 44N projected metric elevation grid |
| **Riverbed Bathymetry** | Survey Target | `EPSG:32644` | MSL | **`PENDING REAL DATA`** | `BLOCKED` | Underwater bed invert elevations & cross-sections pending survey data |
| **Reservoir Bathymetry** | Survey Target | `EPSG:4326` | MSL | **`PENDING REAL DATA`** | `BLOCKED` | 3D underwater reservoir storage bathymetry pending survey data |
| **Synthetic Test Bathymetry** | `synthetic_test/bathymetry/cauvery_bed_SYNTHETIC_TEST_ONLY.csv` | `EPSG:32644` | Relative | **`SYNTHETIC TEST`** | `SOFTWARE TEST ONLY` | Synthetic riverbed profile generated exclusively for pipeline testing |

---

## 🔑 Key Rules
1. **SRTM is LAND-SURFACE ONLY**: `output_SRTMGL1.tif` must **NEVER** be treated as underwater channel bed bathymetry.
2. **Zero Synthetic Physical Claim**: Synthetic bathymetry assets are isolated under `synthetic_test/` and tagged `data_status = SYNTHETIC_TEST_ONLY`.
