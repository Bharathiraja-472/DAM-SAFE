import os
import json
import uuid
import time
from pathlib import Path
from typing import Dict, Any, List
from fastapi import HTTPException
from sqlalchemy import text
from app.core.config import METTUR_DAM_COORDS
from app.core.database import engine

class SimulationService:
    def __init__(self):
        self.runs_base_dir = Path(r"d:/SIH2026/models/mettur/runs")
        self.runs_base_dir.mkdir(parents=True, exist_ok=True)
        self.sci_mesh_path = Path(r"d:/SIH2026/models/mettur/geometry/mettur_cauvery_net.nc")

    def run_simulation(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handles simulation run requests. Rejects scientific runs if blocked."""
        mode = request_data.get("mode", "software_test")
        is_scientific = request_data.get("is_scientific", False)

        # RULE 1: Scientific Model Protection Gate
        if is_scientific or mode == "scientific" or not request_data.get("is_test", True):
            if not self.sci_mesh_path.exists():
                raise HTTPException(
                    status_code=400,
                    detail="Scientific Mettur Delft3D-FM simulation is currently unavailable because required real hydraulic data is pending."
                )

        # Proceed with Software Pipeline Test Run
        run_id = f"test_run_{int(time.time())}_{str(uuid.uuid4())[:6]}"
        run_dir = self.runs_base_dir / f"software_test_{run_id}"
        run_dir.mkdir(parents=True, exist_ok=True)

        scenario_name = request_data.get("scenario", "Scenario Moderate Breach (Test Parameters)")
        initial_wl_m = request_data.get("initial_water_level_m", 45.0)
        breach_width_m = request_data.get("breach_width_m", 150.0)
        duration_hrs = request_data.get("duration_hours", 3.0)
        interval_mins = request_data.get("output_interval_mins", 30)

        timesteps_data = []
        num_steps = int((duration_hrs * 60) / interval_mins) + 1

        # Generate deterministic synthetic timesteps for software testing
        for step in range(num_steps):
            t_mins = step * interval_mins
            t_hrs = round(t_mins / 60.0, 2)
            
            # Deterministic expanding geometry downstream of Mettur Dam (11.8016° N, 77.8016° E)
            center_lat = 11.8016 - (step * 0.04)
            center_lon = 77.8016 + (step * 0.012)
            max_depth = round(0.5 + (step * 0.75), 2)
            max_vel = round(0.4 + (step * 0.35), 2)
            wse = round(initial_wl_m + max_depth, 2)

            poly_coords = [[
                [round(center_lon - 0.015 - (step * 0.005), 4), round(center_lat - 0.015, 4)],
                [round(center_lon + 0.015 + (step * 0.005), 4), round(center_lat - 0.015, 4)],
                [round(center_lon + 0.015 + (step * 0.005), 4), round(center_lat + 0.015, 4)],
                [round(center_lon - 0.015 - (step * 0.005), 4), round(center_lat + 0.015, 4)],
                [round(center_lon - 0.015 - (step * 0.005), 4), round(center_lat - 0.015, 4)]
            ]]

            timestep_obj = {
                "step": step,
                "time_minutes": t_mins,
                "time_hours": t_hrs,
                "label": f"T+{t_hrs:04.2f} Hours",
                "max_depth_m": max_depth,
                "max_velocity_m_s": max_vel,
                "water_surface_elevation_m": wse,
                "geometry": {
                    "type": "Polygon",
                    "coordinates": poly_coords
                },
                "data_status": "SYNTHETIC_TEST_ONLY",
                "scientific_use": False
            }
            timesteps_data.append(timestep_obj)

            # Write GeoJSON per timestep
            ts_geojson = {
                "type": "FeatureCollection",
                "meta": {
                    "run_id": run_id,
                    "timestep": step,
                    "time_hours": t_hrs,
                    "data_status": "SYNTHETIC_TEST_ONLY",
                    "scientific_use": False,
                    "warning_banner": "SOFTWARE PIPELINE TEST — SYNTHETIC DATA — NOT A SCIENTIFIC FLOOD SIMULATION"
                },
                "features": [{
                    "type": "Feature",
                    "properties": {
                        "run_id": run_id,
                        "timestep": step,
                        "time_hours": t_hrs,
                        "max_depth_m": max_depth,
                        "max_velocity_m_s": max_vel,
                        "wse_m": wse,
                        "data_status": "SYNTHETIC_TEST_ONLY"
                    },
                    "geometry": timestep_obj["geometry"]
                }]
            }
            ts_file = run_dir / f"timestep_{step:03d}.geojson"
            with open(ts_file, "w", encoding="utf-8") as f:
                json.dump(ts_geojson, f, indent=2)

            # Store in PostGIS simulation_test_results table
            if engine is not None:
                try:
                    geom_json = json.dumps(timestep_obj["geometry"])
                    with engine.begin() as conn:
                        conn.execute(text("""
                            INSERT INTO simulation_test_results 
                            (run_id, timestep, time_hours, label, max_depth_m, max_velocity_m_s, water_surface_elevation_m, geom, data_status, scientific_use)
                            VALUES (:run_id, :ts, :t_hrs, :lbl, :depth, :vel, :wse, ST_SetSRID(ST_GeomFromGeoJSON(:geom), 4326), 'SYNTHETIC_TEST_ONLY', FALSE);
                        """), {
                            "run_id": run_id,
                            "ts": step,
                            "t_hrs": t_hrs,
                            "lbl": f"T+{t_hrs:04.2f}h Test Step",
                            "depth": max_depth,
                            "vel": max_vel,
                            "wse": wse,
                            "geom": geom_json
                        })
                except Exception:
                    pass

        # Write run_metadata.json
        meta_dict = {
            "run_id": run_id,
            "status": "COMPLETED",
            "simulation_type": "SOFTWARE_PIPELINE_TEST",
            "data_status": "SYNTHETIC_TEST_ONLY",
            "scientific_use": False,
            "scenario": scenario_name,
            "test_parameters": {
                "initial_water_level_m": initial_wl_m,
                "breach_width_m": breach_width_m,
                "duration_hours": duration_hrs,
                "interval_mins": interval_mins
            },
            "timesteps_count": num_steps,
            "warning": "TEST PARAMETERS AND SYNTHETIC RESULTS — NOT ENGINEERING/OBSERVED VALUES"
        }
        with open(run_dir / "run_metadata.json", "w", encoding="utf-8") as f:
            json.dump(meta_dict, f, indent=2)

        with open(run_dir / "timesteps.json", "w", encoding="utf-8") as f:
            json.dump(timesteps_data, f, indent=2)

        return meta_dict

    def get_run_status(self, run_id: str) -> Dict[str, Any]:
        """Returns run status for a given run_id."""
        run_dir = self.runs_base_dir / f"software_test_{run_id}"
        meta_file = run_dir / "run_metadata.json"
        if meta_file.exists():
            with open(meta_file, "r", encoding="utf-8") as f:
                return json.load(f)

        return {
            "run_id": run_id,
            "status": "COMPLETED",
            "simulation_type": "SOFTWARE_PIPELINE_TEST",
            "data_status": "SYNTHETIC_TEST_ONLY",
            "scientific_use": False,
            "timesteps_count": 7
        }

    def get_run_results(self, run_id: str) -> Dict[str, Any]:
        """Returns summary run results and timestep list."""
        run_dir = self.runs_base_dir / f"software_test_{run_id}"
        ts_file = run_dir / "timesteps.json"
        if ts_file.exists():
            with open(ts_file, "r", encoding="utf-8") as f:
                ts_list = json.load(f)
                return {
                    "run_id": run_id,
                    "simulation_type": "SOFTWARE_PIPELINE_TEST",
                    "data_status": "SYNTHETIC_TEST_ONLY",
                    "scientific_use": False,
                    "warning_banner": "SOFTWARE PIPELINE TEST — SYNTHETIC DATA — NOT A SCIENTIFIC FLOOD SIMULATION",
                    "timesteps": ts_list
                }

        # Fallback to test timesteps file
        synth_file = Path(r"d:/SIH2026/models/mettur/synthetic_test/flood_outputs/flood_timesteps_SYNTHETIC_TEST_ONLY.json")
        if synth_file.exists():
            with open(synth_file, "r", encoding="utf-8") as f:
                return json.load(f)

        return {"run_id": run_id, "status": "NOT_FOUND"}

    def get_timestep_geojson(self, run_id: str, timestep: int) -> Dict[str, Any]:
        """Returns GeoJSON FeatureCollection for a specific run_id and timestep."""
        run_dir = self.runs_base_dir / f"software_test_{run_id}"
        ts_file = run_dir / f"timestep_{timestep:03d}.geojson"
        if ts_file.exists():
            with open(ts_file, "r", encoding="utf-8") as f:
                return json.load(f)

        # Fallback PostGIS query
        if engine is not None:
            try:
                with engine.connect() as conn:
                    res = conn.execute(text("""
                        SELECT run_id, timestep, time_hours, max_depth_m, max_velocity_m_s, ST_AsGeoJSON(geom)
                        FROM simulation_test_results
                        WHERE run_id = :r AND timestep = :t LIMIT 1;
                    """), {"r": run_id, "t": timestep}).fetchone()
                    if res and res[5]:
                        geom_obj = json.loads(res[5])
                        return {
                            "type": "FeatureCollection",
                            "meta": {
                                "run_id": res[0],
                                "timestep": res[1],
                                "time_hours": float(res[2]),
                                "data_status": "SYNTHETIC_TEST_ONLY",
                                "scientific_use": False,
                                "warning_banner": "SOFTWARE PIPELINE TEST — SYNTHETIC DATA — NOT A SCIENTIFIC FLOOD SIMULATION"
                            },
                            "features": [{
                                "type": "Feature",
                                "properties": {
                                    "run_id": res[0],
                                    "timestep": res[1],
                                    "time_hours": float(res[2]),
                                    "max_depth_m": float(res[3]),
                                    "max_velocity_m_s": float(res[4]),
                                    "data_status": "SYNTHETIC_TEST_ONLY"
                                },
                                "geometry": geom_obj
                            }]
                        }
            except Exception:
                pass

        # Return default synthetic test geometry
        return {
            "type": "FeatureCollection",
            "meta": {
                "run_id": run_id,
                "timestep": timestep,
                "data_status": "SYNTHETIC_TEST_ONLY",
                "scientific_use": False,
                "warning_banner": "SOFTWARE PIPELINE TEST — SYNTHETIC DATA — NOT A SCIENTIFIC FLOOD SIMULATION"
            },
            "features": [{
                "type": "Feature",
                "properties": {
                    "timestep": timestep,
                    "max_depth_m": 1.25,
                    "data_status": "SYNTHETIC_TEST_ONLY"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[77.80, 11.75], [77.83, 11.75], [77.83, 11.78], [77.80, 11.78], [77.80, 11.75]]]
                }
            }]
        }

simulation_service = SimulationService()
