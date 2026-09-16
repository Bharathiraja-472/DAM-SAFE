import os
import json
import csv
import math
from pathlib import Path

def generate_test_suite():
    print("=" * 70)
    print("DAM-SAFE SYNTHETIC TEST SUITE GENERATOR")
    print("=" * 70)

    base_dir = Path(r"d:/SIH2026/models/mettur/synthetic_test")
    subdirs = ["river", "reservoir", "bathymetry", "cross_sections", "hydrograph", "roughness", "buildings", "roads", "villages", "flood_outputs"]
    for sd in subdirs:
        (base_dir / sd).mkdir(parents=True, exist_ok=True)

    header_meta = {
        "data_status": "SYNTHETIC_TEST_ONLY",
        "scientific_use": False,
        "source_type": "GENERATED_FOR_SOFTWARE_TESTING",
        "warning": "NOT A SCIENTIFIC FLOOD SIMULATION OR REAL OBSERVATION"
    }

    # 1. River Centerline
    river_file = base_dir / "river" / "cauvery_centerline_SYNTHETIC_TEST_ONLY.geojson"
    river_geojson = {
        "type": "FeatureCollection",
        "meta": header_meta,
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Cauvery River Centerline (SYNTHETIC TEST ONLY)",
                    "reach": "Mettur Dam to Erode Test Reach",
                    "data_status": "SYNTHETIC_TEST_ONLY"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [77.8016, 11.8016],
                        [77.8100, 11.7500],
                        [77.8200, 11.7000],
                        [77.8300, 11.6500],
                        [77.8400, 11.6000],
                        [77.8500, 11.5500],
                        [77.8600, 11.5000],
                        [77.8700, 11.4500],
                        [77.8800, 11.4000],
                        [77.8900, 11.3500],
                        [77.9000, 11.3000]
                    ]
                }
            }
        ]
    }
    river_file.write_text(json.dumps(river_geojson, indent=2), encoding="utf-8")
    print(f"[CREATED] {river_file}")

    # 2. Reservoir Polygon
    res_file = base_dir / "reservoir" / "mettur_reservoir_SYNTHETIC_TEST_ONLY.geojson"
    res_geojson = {
        "type": "FeatureCollection",
        "meta": header_meta,
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Stanley Reservoir Boundary (SYNTHETIC TEST ONLY)",
                    "data_status": "SYNTHETIC_TEST_ONLY"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [77.7500, 11.8000],
                        [77.7800, 11.8500],
                        [77.8200, 11.8800],
                        [77.8500, 11.8500],
                        [77.8200, 11.8000],
                        [77.8000, 11.7800],
                        [77.7500, 11.8000]
                    ]]
                }
            }
        ]
    }
    res_file.write_text(json.dumps(res_geojson, indent=2), encoding="utf-8")
    print(f"[CREATED] {res_file}")

    # 3. Riverbed Bathymetry CSV
    bath_file = base_dir / "bathymetry" / "cauvery_bed_SYNTHETIC_TEST_ONLY.csv"
    with open(bath_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["# DATA_STATUS=SYNTHETIC_TEST_ONLY | SCIENTIFIC_USE=FALSE | NOT REAL OBSERVATION"])
        writer.writerow(["chainage_m", "longitude", "latitude", "bed_elevation_m_msl", "bank_width_m", "data_status"])
        for i in range(11):
            ch = i * 5000
            lon = 77.8016 + i * 0.0100
            lat = 11.8016 - i * 0.0500
            elev = 75.0 - (i * 1.5)
            writer.writerow([ch, round(lon, 4), round(lat, 4), round(elev, 2), 250.0, "SYNTHETIC_TEST_ONLY"])
    print(f"[CREATED] {bath_file}")

    # 4. Cross Sections GeoJSON
    xs_file = base_dir / "cross_sections" / "cauvery_cross_sections_SYNTHETIC_TEST_ONLY.geojson"
    xs_features = []
    for i in range(5):
        lon = 77.8016 + i * 0.02
        lat = 11.8016 - i * 0.10
        xs_features.append({
            "type": "Feature",
            "properties": {
                "section_id": f"XS_TEST_{i+1:02d}",
                "chainage_km": i * 10,
                "invert_elevation_m": round(75.0 - (i * 3.0), 2),
                "data_status": "SYNTHETIC_TEST_ONLY"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [[lon - 0.005, lat + 0.002], [lon + 0.005, lat - 0.002]]
            }
        })
    xs_geojson = {"type": "FeatureCollection", "meta": header_meta, "features": xs_features}
    xs_file.write_text(json.dumps(xs_geojson, indent=2), encoding="utf-8")
    print(f"[CREATED] {xs_file}")

    # 5. Breach Hydrograph CSV
    hyd_file = base_dir / "hydrograph" / "mettur_breach_hydrograph_SYNTHETIC_TEST_ONLY.csv"
    with open(hyd_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["# DATA_STATUS=SYNTHETIC_TEST_ONLY | SCIENTIFIC_USE=FALSE | NOT OBSERVED DAM BREAK"])
        writer.writerow(["time_hours", "discharge_cumecs", "water_level_m_msl", "data_status"])
        for h in range(25):
            if h <= 2:
                q = 1500.0 + h * 500.0
            elif h <= 6:
                q = 2500.0 + (h - 2) * 4500.0
            else:
                q = max(1500.0, 20500.0 - (h - 6) * 1000.0)
            wl = 50.0 + (q / 500.0) * 0.5
            writer.writerow([h, round(q, 1), round(wl, 2), "SYNTHETIC_TEST_ONLY"])
    print(f"[CREATED] {hyd_file}")

    # 6. LULC Roughness GeoJSON
    rough_file = base_dir / "roughness" / "cauvery_lulc_roughness_SYNTHETIC_TEST_ONLY.geojson"
    rough_geojson = {
        "type": "FeatureCollection",
        "meta": header_meta,
        "features": [
            {
                "type": "Feature",
                "properties": {"lulc_class": "Waterway Channel", "manning_n": 0.025, "data_status": "SYNTHETIC_TEST_ONLY"},
                "geometry": {"type": "Polygon", "coordinates": [[[77.80, 11.75], [77.82, 11.75], [77.82, 11.80], [77.80, 11.80], [77.80, 11.75]]]}
            },
            {
                "type": "Feature",
                "properties": {"lulc_class": "Agricultural Floodplain", "manning_n": 0.040, "data_status": "SYNTHETIC_TEST_ONLY"},
                "geometry": {"type": "Polygon", "coordinates": [[[77.82, 11.75], [77.88, 11.75], [77.88, 11.80], [77.82, 11.80], [77.82, 11.75]]]}
            }
        ]
    }
    rough_file.write_text(json.dumps(rough_geojson, indent=2), encoding="utf-8")
    print(f"[CREATED] {rough_file}")

    # 7. Buildings GeoJSON
    bldg_file = base_dir / "buildings" / "downstream_buildings_SYNTHETIC_TEST_ONLY.geojson"
    bldg_features = []
    for i in range(15):
        lon = 77.810 + (i % 5) * 0.015
        lat = 11.760 - (i // 5) * 0.015
        bldg_features.append({
            "type": "Feature",
            "properties": {"building_id": f"BLDG_TEST_{i+1:03d}", "structure": "Residential", "data_status": "SYNTHETIC_TEST_ONLY"},
            "geometry": {"type": "Polygon", "coordinates": [[[lon, lat], [lon + 0.002, lat], [lon + 0.002, lat + 0.002], [lon, lat + 0.002], [lon, lat]]]}
        })
    bldg_geojson = {"type": "FeatureCollection", "meta": header_meta, "features": bldg_features}
    bldg_file.write_text(json.dumps(bldg_geojson, indent=2), encoding="utf-8")
    print(f"[CREATED] {bldg_file}")

    # 8. Roads GeoJSON
    road_file = base_dir / "roads" / "floodplain_roads_SYNTHETIC_TEST_ONLY.geojson"
    road_geojson = {
        "type": "FeatureCollection",
        "meta": header_meta,
        "features": [
            {
                "type": "Feature",
                "properties": {"road_name": "State Highway SH-20 (SYNTHETIC TEST)", "type": "State Highway", "data_status": "SYNTHETIC_TEST_ONLY"},
                "geometry": {"type": "LineString", "coordinates": [[77.78, 11.80], [77.82, 11.75], [77.86, 11.70], [77.90, 11.65]]}
            }
        ]
    }
    road_file.write_text(json.dumps(road_geojson, indent=2), encoding="utf-8")
    print(f"[CREATED] {road_file}")

    # 9. Villages GeoJSON
    vil_file = base_dir / "villages" / "floodplain_villages_SYNTHETIC_TEST_ONLY.geojson"
    vil_features = [
        {"name": "Mettur Downstream Settlement (TEST)", "pop": 12500, "coords": [77.805, 11.785]},
        {"name": "Bhavani Confluence Village (TEST)", "pop": 8400, "coords": [77.835, 11.715]},
        {"name": "Erode Floodplain Settlement (TEST)", "pop": 24000, "coords": [77.875, 11.645]}
    ]
    vil_feat_objs = []
    for v in vil_features:
        lon, lat = v["coords"]
        vil_feat_objs.append({
            "type": "Feature",
            "properties": {"village_name": v["name"], "population_2011": v["pop"], "data_status": "SYNTHETIC_TEST_ONLY"},
            "geometry": {"type": "Polygon", "coordinates": [[[lon - 0.005, lat - 0.005], [lon + 0.005, lat - 0.005], [lon + 0.005, lat + 0.005], [lon - 0.005, lat + 0.005], [lon - 0.005, lat - 0.005]]]}
        })
    vil_geojson = {"type": "FeatureCollection", "meta": header_meta, "features": vil_feat_objs}
    vil_file.write_text(json.dumps(vil_geojson, indent=2), encoding="utf-8")
    print(f"[CREATED] {vil_file}")

    # 10. Flood Output Timesteps JSON
    flood_file = base_dir / "flood_outputs" / "flood_timesteps_SYNTHETIC_TEST_ONLY.json"
    timesteps = []
    for step in range(1, 7):
        time_hrs = step * 2
        polygons = []
        center_lat = 11.80 - (step * 0.04)
        center_lon = 77.80 + (step * 0.01)
        depth = round(0.5 + (step * 0.75), 2)
        polygons.append({
            "step": step,
            "time_hours": time_hrs,
            "max_depth_m": depth,
            "max_velocity_m_s": round(0.4 + (step * 0.3), 2),
            "data_status": "SYNTHETIC_TEST_ONLY",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[center_lon - 0.02, center_lat - 0.02], [center_lon + 0.02, center_lat - 0.02], [center_lon + 0.02, center_lat + 0.02], [center_lon - 0.02, center_lat + 0.02], [center_lon - 0.02, center_lat - 0.02]]]
            }
        })
        timesteps.append({
            "timestep": step,
            "time_hours": time_hrs,
            "label": f"T+{time_hrs} Hours (SOFTWARE PIPELINE TEST)",
            "water_spread": polygons
        })
    flood_output_data = {
        "meta": header_meta,
        "warning_banner": "SOFTWARE PIPELINE TEST — SYNTHETIC DATA — NOT A SCIENTIFIC FLOOD SIMULATION",
        "timesteps": timesteps
    }
    flood_file.write_text(json.dumps(flood_output_data, indent=2), encoding="utf-8")
    print(f"[CREATED] {flood_file}")

    print("=" * 70)
    print("ALL SYNTHETIC TEST ASSETS GENERATED CLEANLY.")
    print("=" * 70)

if __name__ == "__main__":
    generate_test_suite()
