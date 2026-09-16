# 📋 Mettur Delft3D-FM Model Data Requirements Catalog

This catalog details the 17 hydraulic model data inputs, current data sources, verification status, units, and coordinate reference systems.

---

## 📊 Hydraulic Data Requirements Matrix

| Parameter | Required For | Current Source | Status | Units | CRS | Notes |
|---|---|---|---|---|---|---|
| **DEM / Terrain** | Floodplain 2D grid elevation | `output_SRTMGL1.tif` | `AVAILABLE` | meters | `EPSG:4326` | 30m SRTM GL1 Land Surface Elevation |
| **River Centerline** | Channel alignment & mesh generation | `Dataset_4` | `PENDING` | Vector | `EPSG:4326` | Main stem centerline pending acquisition |
| **River Bathymetry** | Main channel bed conveyance | Survey Target | `NOT AVAILABLE` | meters | `EPSG:32644` | Sub-surface riverbed bathymetry pending |
| **Reservoir Bathymetry** | Storage-elevation curve | `mettur_dam_dataset.csv` | `PARTIAL` | Mcft / ft | `EPSG:4326` | Verified capacity & FRL limits |
| **Dam Geometry** | Breach origin boundary | `mettur_dam_dataset.csv` | `AVAILABLE` | ft / Mcft | `EPSG:4326` | Height 214ft, Length 5300ft, Capacity 95.66k Mcft |
| **Dam Crest Elevation** | Overtopping threshold | `mettur_dam_dataset.csv` | `AVAILABLE` | ft | N/A | Maximum crest elevation 214 ft |
| **Reservoir Water Level** | Initial hydraulic condition | `mettur_reservoir_dataset_3.csv` | `AVAILABLE` | ft | N/A | Daily telemetry stage observations |
| **Reservoir Storage** | Released water volume | `mettur_reservoir_dataset_3.csv` | `AVAILABLE` | Mcft | N/A | Daily storage telemetry observations |
| **Reservoir Inflow** | Upstream inflow boundary | `mettur_reservoir_dataset_3.csv` | `AVAILABLE` | cusecs | N/A | Daily inflow telemetry observations |
| **Reservoir Outflow** | Spillway release boundary | `mettur_reservoir_dataset_3.csv` | `AVAILABLE` | cusecs | N/A | Daily outflow telemetry observations |
| **Downstream Discharge** | Calibration & outflow boundary | `Dataset_6` | `PARTIAL` | cusecs / m³/s | N/A | Hourly CWC telemetry extraction pending |
| **Downstream Water Level** | Stage outflow boundary | `Dataset_6` | `PARTIAL` | meters / ft | N/A | Gauge stage telemetry extraction pending |
| **Land Use / Roughness** | Manning's friction $n$ | `Dataset_9` | `PARTIAL` | Manning $n$ | `EPSG:4326` | Bhuvan LULC classification inventory |
| **Floodplain Terrain** | Inundation spreading | `output_SRTMGL1.tif` | `AVAILABLE` | meters | `EPSG:4326` | 2,520 x 2,700 30m SRTM grid |
| **Boundary Conditions** | D-Flow FM `.ext` | `boundary/mettur_boundary.ext` | `PENDING REAL HYDROGRAPH` | $\text{m}^3/\text{s}$ | N/A | External boundary definition file |
| **Initial Conditions** | D-Flow FM `.mdu` | `base/mettur_base.mdu` | `AVAILABLE` | meters | `EPSG:4326` | Initial water level $H_0 = 0.0\text{ m}$ |

---

## 🔑 Status Legend
* **`AVAILABLE`**: Verified real-world dataset ingested in database/models.
* **`PARTIAL`**: Metadata or daily telemetry present; high-frequency extraction pending.
* **`PENDING` / `NOT AVAILABLE`**: Authoritative spatial vector dataset required for future ingestion.
