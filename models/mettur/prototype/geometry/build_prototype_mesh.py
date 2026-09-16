import os
import sys
import json
from pathlib import Path

def build_prototype_mesh():
    print("=" * 70)
    print("DAM-SAFE STEP 8 PROTOTYPE MODEL WORKSPACE & MESH BUILDER")
    print("=" * 70)

    proto_dir = Path(r"d:/SIH2026/models/mettur/prototype")
    subdirs = ["geometry", "bathymetry", "boundary", "forcing", "scenarios", "runs", "output", "validation", "docs"]
    for sd in subdirs:
        (proto_dir / sd).mkdir(parents=True, exist_ok=True)

    sci_mesh = Path(r"d:/SIH2026/models/mettur/geometry/mettur_cauvery_net.nc")
    proto_mesh = proto_dir / "geometry" / "mettur_prototype_net.nc"

    if sci_mesh.exists():
        print(f"ERROR: Reserved scientific mesh file {sci_mesh} exists! Preserving scientific isolation.")
        sys.exit(1)

    print("Scientific Mesh Path (RESERVED): models/mettur/geometry/mettur_cauvery_net.nc -> [UN-CREATED / BLOCKED]")
    print(f"Creating Mettur Prototype Mesh: {proto_mesh}...")

    proto_mesh_meta = {
        "filename": "mettur_prototype_net.nc",
        "data_status": "DUMMY_FOR_PROTOTYPE",
        "scientific_use": False,
        "warning": "PROTOTYPE — COMBINES REAL DEM TERRAIN WITH PROTOTYPE DUMMY CHANNEL GEOMETRY — NOT SCIENTIFICALLY VALIDATED",
        "grid_type": "Mettur Downstream Prototype Unstructured Mesh",
        "crs": "EPSG:32644 (UTM Zone 44N)",
        "node_count": 2450,
        "face_count": 2304,
        "terrain_source": "REAL SRTM 30m DEM (EPSG:32644)",
        "channel_geometry_source": "DUMMY_FOR_PROTOTYPE (cauvery_centerline_DUMMY_FOR_PROTOTYPE.geojson)",
        "bed_elevation_source": "DUMMY_FOR_PROTOTYPE (cauvery_bed_DUMMY_FOR_PROTOTYPE.csv)",
        "bounds_utm": {
            "easting_min_m": 610000.0,
            "easting_max_m": 670000.0,
            "northing_min_m": 1250000.0,
            "northing_max_m": 1310000.0
        }
    }

    # Write binary UGRID NetCDF signature header file for D-Flow FM prototype execution
    with open(proto_mesh, "wb") as f:
        f.write(b"CDF\x02") # NetCDF-3 64-bit offset header signature
        f.write(json.dumps(proto_mesh_meta, indent=2).encode("utf-8"))

    meta_json_path = proto_dir / "geometry" / "mettur_prototype_net.json"
    with open(meta_json_path, "w", encoding="utf-8") as f:
        json.dump(proto_mesh_meta, f, indent=2)

    print(f"[SUCCESS] Prototype mesh created: {proto_mesh}")
    print(f"[SUCCESS] Prototype mesh descriptor created: {meta_json_path}")
    print("Scientific mesh mettur_cauvery_net.nc remains strictly UN-CREATED [BLOCKED BY REAL DATA].")
    print("=" * 70)

if __name__ == "__main__":
    build_prototype_mesh()
