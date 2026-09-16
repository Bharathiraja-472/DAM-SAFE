# 🗺️ DAM-SAFE GIS Foundation & Spatial Data Pipeline

This module establishes the geospatial foundation, Coordinate Reference System (CRS) standards, PostGIS spatial indexing, and GeoJSON API services for **DAM-SAFE**.

---

## 📁 Directory Structure

```text
gis/
├── raw/         # Untouched raw spatial layers (SRTM DEM, shapefiles, GeoTIFFs)
├── processed/   # Reprojected, clipped, and standardized spatial vectors/rasters
├── exports/     # Exported GeoJSON / GeoPackage bundles for front-end & web mapping
└── README.md    # Spatial documentation & CRS specifications
```

---

## 🌐 Coordinate Reference System (CRS) Strategy

To ensure spatial compatibility between web map visualization, database spatial joins, and hydraulic modeling:

| Domain | Standard CRS | EPSG Code | Rationale |
|---|---|---|---|
| **Web Mapping (Leaflet / Mapbox)** | WGS 84 Geographic | `EPSG:4326` | Standard latitude/longitude coordinates for web maps |
| **Web Tile Display** | Pseudo-Mercator | `EPSG:3857` | Standard tile projection for OpenStreetMap basemaps |
| **PostgreSQL + PostGIS Storage** | WGS 84 2D | `EPSG:4326` | Native spatial indexing (`GIST`) and spherical distance metrics |
| **Delft3D-FM Computational Grid** | WGS 84 / UTM Zone 44N | `EPSG:32644` | **Projected Metric System**: Essential for Delft3D-FM 2D flexible mesh calculations to avoid metric distortion in flood wave velocity (m/s) and water depth (m) |

---

## 🏔️ Dataset 1 — SRTM 30m DEM Raster Specifications

* **File Location**: `d:/SIH2026/data/output_SRTMGL1.tif`
* **Format**: GeoTIFF (Single-band 16-bit Signed Integer elevation values)
* **Raster Dimensions**: 2,520 pixels (width) × 2,700 pixels (height) (6.8 million grid cells)
* **Pixel Resolution**: 1 arc-second (~30 meters per cell)
* **Native CRS**: `EPSG:4326` (WGS 84)
* **Geographic Bounds**:
  - `Min Longitude`: **77.5499° E**
  - `Min Latitude`: **11.2001° N**
  - `Max Longitude`: **78.2499° E**
  - `Max Latitude`: **11.9501° N**
* **Coverage**: Complete coverage of Mettur Dam, Stanley Reservoir, and downstream Cauvery floodplains (Salem, Erode, Namakkal, Karur, Tiruchirappalli).

---

## 🛡️ Spatial Integrity & Transparency Policy

In accordance with strict scientific requirements:
* **Zero Fabricated Geometry**: No fake river lines, building footprints, or village polygons are drawn on the map.
* **Explicit Layer Status Badges**:
  - `AVAILABLE`: Real georeferenced spatial data loaded in PostGIS & served via API.
  - `PARTIAL`: Inventory or tabular demographics present; spatial vector pending acquisition.
  - `PENDING ACQUISITION`: Authoritative spatial vector dataset required for future ingestion.
