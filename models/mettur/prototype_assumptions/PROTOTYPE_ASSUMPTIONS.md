# 📋 Mettur Prototype Model Assumptions Catalog

This document records all assumed engineering, breach, and hydraulic parameters used in the Step 8 Mettur Dam-Break Prototype model.

---

## 📊 Prototype Model Parameters & Provenance Matrix

| Parameter Name | Prototype Value | Units | Data Status | Original Source / Provenance | Reason for Assumption | Scientific Use |
|---|---|---|---|---|---|---|
| **Structural Dam Height** | `214` | ft | `REAL` | Dataset 2 (`mettur_dam_dataset.csv`) | Measured physical masonry wall height | `VALID PARAMETER` |
| **Full Reservoir Level (FRL)** | `165` | ft | `REAL` | Dataset 2 (`mettur_dam_dataset.csv`) | Legal maximum reservoir water height | `VALID PARAMETER` |
| **Usable Storage Depth** | `120` | ft | `REAL` | Dataset 2 (`mettur_dam_dataset.csv`) | Operational live storage column height | `VALID PARAMETER` |
| **Gross Storage Capacity** | `95,660` | Mcft | `REAL` | Dataset 2 (`mettur_dam_dataset.csv`) | Measured total volume at FRL | `VALID PARAMETER` |
| **Initial Water Level ($H_0$)** | `162.5` | ft | `REAL` | Dataset 3 (`mettur_reservoir_dataset_3.csv`) | Initial water level from daily telemetry | `VALID INITIAL CONDITION` |
| **Land Surface Elevation** | DEM Grid | meters MSL | `REAL` | Dataset 1 (`output_SRTMGL1.tif`) | SRTM 30m terrain elevation grid | `VALID TERRAIN` |
| **Projected Terrain Grid** | DEM Grid | meters MSL | `DERIVED_FROM_REAL` | `SRTM_Mettur_30m_UTM44N_LandSurface.tif` | Reprojected metric DEM in EPSG:32644 | `VALID TERRAIN` |
| **Breach Bottom Elevation** | `45.0` | meters MSL | `PROTOTYPE_ASSUMPTION` | Prototype Model Assumption | Deep sill level assumed as breach invert | `FALSE — PROTOTYPE ONLY` |
| **Breach Width (Moderate)** | `150.0` | meters | `PROTOTYPE_ASSUMPTION` | Prototype Model Assumption | Standard breach width for prototype simulation | `FALSE — PROTOTYPE ONLY` |
| **Breach Width (Severe)** | `300.0` | meters | `PROTOTYPE_ASSUMPTION` | Prototype Model Assumption | Extended breach width for extreme prototype scenario | `FALSE — PROTOTYPE ONLY` |
| **Breach Formation Time** | `2.0` | hours | `PROTOTYPE_ASSUMPTION` | Prototype Model Assumption | Typical masonry dam breach formation time | `FALSE — PROTOTYPE ONLY` |
| **River Centerline Vector** | Geographically aligned line | LineString | `DUMMY_FOR_PROTOTYPE` | `dummy_data/cauvery_centerline_DUMMY_FOR_PROTOTYPE.geojson` | Channel vector generated along SRTM DEM valley | `FALSE — PROTOTYPE ONLY` |
| **Riverbed Bathymetry Profile** | Sub-surface bed invert | CSV Table | `DUMMY_FOR_PROTOTYPE` | `dummy_data/cauvery_bed_DUMMY_FOR_PROTOTYPE.csv` | Bed invert profile derived by subtracting 8m depth from DEM valley bottom | `FALSE — PROTOTYPE ONLY` |
| **Channel Cross-Sections** | Trapezoidal geometry | GeoJSON | `DUMMY_FOR_PROTOTYPE` | `dummy_data/cauvery_cross_sections_DUMMY_FOR_PROTOTYPE.geojson` | 250m width, 8m depth trapezoidal cross-sections | `FALSE — PROTOTYPE ONLY` |
| **Uniform Manning Roughness** | `0.025` | $\text{s/m}^{1/3}$ | `PROTOTYPE_ASSUMPTION` | MDU Baseline Template | Alluvial riverbed friction placeholder | `PROVISIONAL` |

---

## 🔑 Provenance Summary Rules
- **`REAL` / `DERIVED_FROM_REAL`**: Used directly for Mettur Dam height, FRL, capacity, reservoir telemetry, and land terrain.
- **`PROTOTYPE_ASSUMPTION` / `DUMMY_FOR_PROTOTYPE`**: Used strictly for missing channel vector, riverbed bathymetry, and breach formation parameters to enable prototype software operation.
- **Scientific Validation**: None of the prototype assumptions or dummy files claim scientific validation.
