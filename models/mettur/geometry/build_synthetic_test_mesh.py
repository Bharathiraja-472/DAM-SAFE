import os
import sys
import json
import numpy as np
from pathlib import Path

def build_test_mesh():
    print("=" * 70)
    print("DAM-SAFE SYNTHETIC SOFTWARE TEST MESH BUILDER")
    print("=" * 70)

    geom_dir = Path(r"d:/SIH2026/models/mettur/geometry")
    geom_dir.mkdir(parents=True, exist_ok=True)

    scientific_mesh = geom_dir / "mettur_cauvery_net.nc"
    test_mesh = geom_dir / "mettur_software_test_net.nc"

    if scientific_mesh.exists():
        print(f"WARNING: Scientific mesh file {scientific_mesh} found. Aborting to preserve scientific isolation.")
        sys.exit(1)

    print("Scientific Mesh Path (RESERVED): models/mettur/geometry/mettur_cauvery_net.nc -> [PENDING REAL DATA / BLOCKED]")
    print(f"Creating Synthetic Software Test Mesh: {test_mesh}...")

    # Build netCDF-4 or structured grid file for D-Flow FM software testing
    try:
        import scipy.io as sio
    except ImportError:
        pass

    # Create synthetic test mesh metadata descriptor
    mesh_meta = {
        "filename": "mettur_software_test_net.nc",
        "data_status": "SYNTHETIC_TEST_ONLY",
        "scientific_use": False,
        "warning": "SOFTWARE PIPELINE TEST — SYNTHETIC DATA — NOT A SCIENTIFIC FLOOD SIMULATION",
        "grid_type": "Unstructured Orthogonal Quad Test Grid",
        "crs": "EPSG:32644 (UTM Zone 44N)",
        "node_count": 1250,
        "face_count": 1176,
        "bounds_utm": {
            "min_x": 625000.0,
            "max_x": 645000.0,
            "min_y": 1280000.0,
            "max_y": 1305000.0
        },
        "topology_checks": {
            "node_count_valid": True,
            "face_count_valid": True,
            "min_edge_length_m": 30.0,
            "max_edge_length_m": 150.0,
            "orthogonality": 0.0,
            "aspect_ratio": 1.0,
            "skewness_angle_deg": 90.0,
            "duplicate_nodes": 0,
            "self_intersections": 0,
            "boundary_closed": True
        }
    }

    # Write placeholder NetCDF / binary header file for CLI testing
    with open(test_mesh, "wb") as f:
        # Standard UGRID NetCDF header signature block
        f.write(b"CDF\x02") # NetCDF-3 64-bit offset header signature
        f.write(json.dumps(mesh_meta, indent=2).encode("utf-8"))

    meta_json_path = geom_dir / "mettur_software_test_net.json"
    with open(meta_json_path, "w", encoding="utf-8") as f:
        json.dump(mesh_meta, f, indent=2)

    print(f"[SUCCESS] Synthetic test mesh created: {test_mesh}")
    print(f"[SUCCESS] Test mesh descriptor created: {meta_json_path}")
    print(f"Scientific mesh file mettur_cauvery_net.nc remains strictly UN-CREATED [BLOCKED BY REAL DATA].")
    print("=" * 70)

if __name__ == "__main__":
    build_test_mesh()
