# 📐 Vertical Datum Reconciliation Audit Report

This report documents the vertical reference frame, elevation units, and datum reconciliation requirements for all spatial elevation and bathymetric data sources in the Mettur Dam / Cauvery River model domain.

---

## 📊 Elevation Reference Specification

| Dataset | Current Source File | Horizontal CRS | Vertical Reference Datum | Vertical Units | Known Elevation Bounds | Status |
|---|---|---|---|---|---|---|
| **Land Surface Terrain (DEM)** | `output_SRTMGL1.tif` | `EPSG:4326` / `EPSG:32644` | **EGM96 Orthometric MSL** | meters | $+45.0\text{ m}$ to $+1250.0\text{ m}$ | `VERIFIED` |
| **Mettur Dam Elevation & FRL** | `mettur_dam_dataset.csv` | `EPSG:4326` | Sill Level Datum | feet / meters | FRL $= 165\text{ ft}$ ($50.29\text{ m}$) | `RECONCILED` |
| **Riverbed Bathymetry** | Pending Survey Target | `EPSG:32644` Target | Local Gauge Zero / MSL | meters | Unknown | `PENDING VERTICAL DATUM RECONCILIATION` |
| **Reservoir Bathymetry** | Pending Survey Target | `EPSG:4326` / `EPSG:32644` | Deepest Bed Invert MSL | meters | Unknown | `PENDING VERTICAL DATUM RECONCILIATION` |

---

## 🔍 Datum Reconciliation Rules

1. **Orthometric Height Standard**: All computational terrain elevations in Delft3D-FM are converted to meters above **Mean Sea Level (MSL)** referenced to **EGM96 Geoid**.
2. **Local River Gauge Datum Conversion**: When real cross-section data is acquired from CWC or TN WRD gauging stations, local gauge zero elevations (e.g. GTS MSL datum) must be converted explicitly before merging into the mesh terrain grid.
3. **No Blind Datum Shifts**: Shifts between ellipsoidal height (WGS 84 ellipsoid) and orthometric height (EGM96 MSL) must use standard EGM96 geoid undulation matrices ($H = h - N$). Arbitrary static offsets are prohibited.
4. **Current Status**: **`[PENDING VERTICAL DATUM RECONCILIATION]`** (Applies to future underwater riverbed cross-sections).
