# 📍 Mettur Dam Computational Domain Specification

## 1. Primary Reference Facility

* **Facility**: Mettur Dam (Stanley Reservoir), Salem District, Tamil Nadu
* **Reference Coordinates**: Latitude `11.8016° N`, Longitude `77.8016° E` (EPSG:4326)
* **Role**: Primary hydraulic origin and upstream breach release location.

---

## 2. Terrain & Spatial Bounds Coverage

Derived from raw SRTM 30m DEM (`d:/SIH2026/data/output_SRTMGL1.tif`):

```text
Spatial Reference System : EPSG:4326 (WGS 84 Geographic)
Computational Target CRS : EPSG:32644 (UTM Zone 44N)
Bounding Coordinates     :
  - North (Max Lat)      : 11.9501° N
  - South (Min Lat)      : 11.2001° N
  - West  (Min Lon)      : 77.5499° E
  - East  (Max Lon)      : 78.2499° E
Raster Resolution        : 2,520 columns × 2,700 rows (~30 meters per cell)
```

### Domain Extent Rationale
The selected DEM coverage encompasses:
1. **Stanley Reservoir**: Upstream storage envelope.
2. **Mettur Dam Site**: Structural boundary.
3. **Cauvery Main Stem**: Downstream reach through Salem, Erode, Namakkal, Karur, and Tiruchirappalli.

---

## 3. Upstream & Downstream Boundary Concepts

* **Upstream Boundary**: Defined at Mettur Dam spillway / breach location. Ingests breach discharge hydrograph $Q(t)$ or time-dependent water level $H(t)$.
* **Downstream Boundary**: Placed downstream along the Cauvery main stem (Tiruchirappalli / Grand Anicut reach) to allow unreflected discharge outflow.

---

## 4. Current Missing Data & Limitations

> [!WARNING]
> **Hydraulic river geometry pending acquisition.**
> The current SRTM DEM represents top-of-canopy / land-surface elevations and does not include measured underwater riverbed bathymetry or main-stem cross-sections.
> No artificial river centerline or fabricated bed levels have been inserted into this domain.
