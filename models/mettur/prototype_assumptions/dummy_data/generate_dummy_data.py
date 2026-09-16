import os
import json
import csv
from pathlib import Path

def generate_dummy_data():
    print("=" * 70)
    print("DAM-SAFE DUMMY FOR PROTOTYPE DATA GENERATOR")
    print("=" * 70)

    dummy_dir = Path(r"d:/SIH2026/models/mettur/prototype_assumptions/dummy_data")
    dummy_dir.mkdir(parents=True, exist_ok=True)

    header_meta = {
        "data_status": "DUMMY_FOR_PROTOTYPE",
        "scientific_use": False,
        "source_type": "DUMMY_FOR_PROTOTYPE",
        "warning": "PROTOTYPE ASSUMPTION ONLY — NOT MEASURED OBSERVATION"
    }

    # 1. Geographically Consistent Cauvery River Centerline (Following SRTM DEM valley from Mettur 11.8016 N, 77.8016 E to Erode 11.3400 N, 77.7170 E)
    centerline_file = dummy_dir / "cauvery_centerline_DUMMY_FOR_PROTOTYPE.geojson"
    centerline_geojson = {
        "type": "FeatureCollection",
        "meta": header_meta,
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Cauvery Main Stem River Centerline (PROTOTYPE ASSUMPTION)",
                    "reach": "Mettur Dam to Erode Reach",
                    "data_status": "DUMMY_FOR_PROTOTYPE",
                    "source_type": "DUMMY_FOR_PROTOTYPE"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [77.8016, 11.8016], # Mettur Dam Sill
                        [77.7950, 11.7500],
                        [77.7850, 11.7000],
                        [77.7750, 11.6500],
                        [77.7650, 11.6000],
                        [77.7550, 11.5500],
                        [77.7450, 11.5000],
                        [77.7350, 11.4500],
                        [77.7250, 11.4000],
                        [77.7170, 11.3400]  # Erode Reach
                    ]
                }
            }
        ]
    }
    centerline_file.write_text(json.dumps(centerline_geojson, indent=2), encoding="utf-8")
    print(f"[CREATED] {centerline_file}")

    # 2. Geographically Consistent Cauvery Riverbed Bathymetry Profile
    bed_file = dummy_dir / "cauvery_bed_DUMMY_FOR_PROTOTYPE.csv"
    with open(bed_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["# DATA_STATUS=DUMMY_FOR_PROTOTYPE | SCIENTIFIC_USE=FALSE | PROTOTYPE BED PROFILE ASSUMPTION"])
        writer.writerow(["chainage_m", "longitude", "latitude", "dem_elevation_m_msl", "bed_invert_m_msl", "channel_depth_m", "data_status"])
        for i in range(10):
            ch = i * 6000
            lon = 77.8016 - i * 0.0094
            lat = 11.8016 - i * 0.0512
            dem_elev = 150.0 - (i * 7.5) # SRTM land surface valley elevation
            bed_invert = dem_elev - 8.0  # Assumed 8m channel depth below land surface
            writer.writerow([ch, round(lon, 4), round(lat, 4), round(dem_elev, 2), round(bed_invert, 2), 8.0, "DUMMY_FOR_PROTOTYPE"])
    print(f"[CREATED] {bed_file}")

    # 3. Geographically Consistent Channel Cross-Sections
    xs_file = dummy_dir / "cauvery_cross_sections_DUMMY_FOR_PROTOTYPE.geojson"
    xs_features = []
    for i in range(6):
        lon = 77.8016 - i * 0.015
        lat = 11.8016 - i * 0.08
        xs_features.append({
            "type": "Feature",
            "properties": {
                "section_id": f"PROTO_XS_{i+1:02d}",
                "chainage_km": i * 10,
                "bank_width_m": 250.0,
                "channel_depth_m": 8.0,
                "bed_invert_m_msl": round(142.0 - (i * 12.0), 2),
                "data_status": "DUMMY_FOR_PROTOTYPE"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [[round(lon - 0.005, 4), round(lat + 0.002, 4)], [round(lon + 0.005, 4), round(lat - 0.002, 4)]]
            }
        })
    xs_geojson = {"type": "FeatureCollection", "meta": header_meta, "features": xs_features}
    xs_file.write_text(json.dumps(xs_geojson, indent=2), encoding="utf-8")
    print(f"[CREATED] {xs_file}")

    # 4. Prototype Hydrograph
    hyd_file = dummy_dir / "mettur_prototype_hydrograph_DUMMY_FOR_PROTOTYPE.csv"
    with open(hyd_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["# DATA_STATUS=DUMMY_FOR_PROTOTYPE | SCIENTIFIC_USE=FALSE | PROTOTYPE BREACH HYDROGRAPH"])
        writer.writerow(["time_hours", "discharge_cumecs", "water_level_m_msl", "data_status"])
        for h in range(13):
            t_hrs = h * 0.5
            if t_hrs <= 1.0:
                q = 2000.0 + t_hrs * 3000.0
            elif t_hrs <= 3.0:
                q = 5000.0 + (t_hrs - 1.0) * 12500.0
            else:
                q = max(2000.0, 30000.0 - (t_hrs - 3.0) * 8000.0)
            wl = 49.5 + (q / 3000.0) * 0.6
            writer.writerow([t_hrs, round(q, 1), round(wl, 2), "DUMMY_FOR_PROTOTYPE"])
    print(f"[CREATED] {hyd_file}")

    print("=" * 70)
    print("ALL DUMMY FOR PROTOTYPE ASSETS GENERATED CLEANLY.")
    print("=" * 70)

if __name__ == "__main__":
    generate_dummy_data()
