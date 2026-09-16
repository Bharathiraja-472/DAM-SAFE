# 🛡️ DAM-SAFE Data Quality Gate Framework

All datasets must pass 14 scientific quality control criteria before being ingested into PostGIS or applied in Delft3D-FM computational grids.

---

## 📋 14 Quality Control Criteria

1. **File Integrity**: File opens cleanly without corruption.
2. **Geometry Validity**: Valid OGC spatial geometry (no self-intersecting polygons).
3. **CRS Validation**: Known horizontal Coordinate Reference System (e.g. `EPSG:4326` or `EPSG:32644`).
4. **Bounding-Box Validation**: Overlaps with Mettur Dam / Cauvery model domain.
5. **Mettur Relevance**: Directly applicable to study area hydrodynamics or exposure.
6. **Attribute Inspection**: Clean schema and recognized column names.
7. **Units Validation**: Explicit metric or documented imperial units.
8. **Temporal Coverage**: Valid date ranges (no out-of-bounds years).
9. **Duplicate Check**: Low or zero duplicate record percentage.
10. **Missing-Value Check**: Missing cell percentage within tolerable limits (< 10%).
11. **Source Verification**: Institutional or official government agency source.
12. **Vertical Datum Check**: Documented orthometric/geoid height datum (e.g. EGM96 MSL).
13. **Resolution / Scale Assessment**: Resolution appropriate for 2D hydrodynamic modeling.
14. **Licensing / Access Documentation**: Clear access conditions and usage terms.

---

## 📊 Quality Gate Status Summary (All 16 Categories)

| # | Dataset Category | Quality Gate Status | Reason / Notes |
|---|---|---|---|
| 1 | **DEM / Terrain** | `PASS WITH LIMITATIONS` | Valid SRTM GL1 30m GeoTIFF; Land-surface elevation only (no riverbed bathymetry) |
| 2 | **Mettur Dam Parameters** | `PASS` | Verified structural & capacity parameters from Dataset 2 |
| 3 | **Reservoir History** | `PASS` | Verified daily level & storage telemetry records |
| 4 | **Cauvery River Centerline** | `PENDING` | Vector centerline pending acquisition |
| 5 | **Rainfall Telemetry** | `PASS WITH LIMITATIONS` | 175,735 rows full source; 1,000 records loaded in DB prototype |
| 6 | **River Discharge / Level** | `PASS WITH LIMITATIONS` | Verified source registry; hourly raw time-series pending |
| 7 | **Sentinel-1 SAR Imagery** | `PASS WITH LIMITATIONS` | Acquisition inventory catalogued; SAR masks pending |
| 8 | **Sentinel-2 MSI Imagery** | `PASS WITH LIMITATIONS` | Optical multispectral inventory catalogued |
| 9 | **LULC** | `PASS WITH LIMITATIONS` | NRSC Bhuvan classification inventory catalogued |
| 10 | **Building Footprints** | `PENDING` | Vector footprint shapefiles pending acquisition |
| 11 | **Roads / Transportation** | `PASS WITH LIMITATIONS` | Highway network specification catalogued |
| 12 | **Population / Settlements** | `PASS WITH LIMITATIONS` | Census 2011 demographics catalogued |
| 13 | **Critical Infrastructure** | `PASS WITH LIMITATIONS` | Essential facility inventory catalogued |
| 14 | **Administrative Boundaries** | `PASS WITH LIMITATIONS` | District & Taluk hierarchy catalogued |
| 15 | **Historical Flood Validation** | `PASS WITH LIMITATIONS` | Disaster report inventory catalogued |
| 16 | **Supporting Hydrometeorology** | `PASS WITH LIMITATIONS` | ERA5 meteorological inventory catalogued |
