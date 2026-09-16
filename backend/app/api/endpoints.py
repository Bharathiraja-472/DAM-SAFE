from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any
from app.core.config import PROJECT_NAME, STUDY_AREA, PROTOTYPE_MODE
from app.core.database import check_db_connection
from app.schemas.scenario import ScenarioCreateRequest, ScenarioResponse
from app.services.data_service import data_service
from app.services.ingestion_service import ingestion_service
from app.services.gis_service import gis_service
from app.services.simulation_service import simulation_service
from app.services.flood_postprocessor import flood_postprocessor
from app.services.prototype_simulation_service import prototype_simulation_service
from app.services.hadr_service import hadr_service
from app.services.dashboard_service import dashboard_service
from app.services.system_service import system_service
from app.services.report_service import report_service

router = APIRouter()

@router.get("/health")
def get_health() -> Dict[str, Any]:
    db_status = check_db_connection()
    return {
        "status": "ok",
        "project": PROJECT_NAME,
        "study_area": STUDY_AREA,
        "mode": "prototype" if PROTOTYPE_MODE else "production",
        "database": db_status,
        "delft3d_status": "installed_pending_integration"
    }

# --- DATASET CATALOGUE ENDPOINTS ---
@router.get("/datasets")
def list_datasets():
    """Returns the 16 Project Dataset Categories from PostgreSQL dataset_catalogue."""
    return data_service.list_dataset_catalogue()

@router.get("/datasets/ingest")
def trigger_ingestion():
    """Triggers the backend ETL pipeline to scan d:/SIH2026/data and populate PostgreSQL tables."""
    return ingestion_service.run_full_etl()

@router.get("/datasets/{category_number}")
def get_dataset_detail(category_number: int):
    """Returns detailed metadata for a specific dataset category (1-16)."""
    catalogue = data_service.list_dataset_catalogue()
    for cat in catalogue.get("catalogue", []):
        if cat.get("category_number") == category_number:
            return {
                "meta": {
                    "dataset": f"category_{category_number}",
                    "data_status": cat.get("data_status"),
                    "data_source": cat.get("data_source"),
                    "database_table": "dataset_catalogue"
                },
                "category": cat
            }
    raise HTTPException(status_code=404, detail=f"Category {category_number} not found in catalogue")

@router.get("/dam")
def get_dam_info():
    """Returns Mettur Dam geometry and structural parameters from PostgreSQL dams table."""
    return data_service.get_dam_parameters()

@router.get("/reservoir")
def get_reservoir_info(limit: int = Query(default=50, ge=1, le=1000)):
    """Returns Mettur Reservoir history and verified storage records from PostgreSQL hydro_observations table."""
    return data_service.get_reservoir_history(limit=limit)

@router.get("/rainfall")
def get_rainfall_info(limit: int = Query(default=100, ge=1, le=2000)):
    """Returns rainfall telemetry records from PostgreSQL rainfall_observations table."""
    return data_service.get_rainfall_records(limit=limit)

# --- GIS SPATIAL ENDPOINTS ---
@router.get("/gis/layers")
def get_gis_layers():
    """Returns spatial status, CRS, geometry_type, and database table for all GIS layers."""
    return gis_service.get_gis_layers_status()

@router.get("/gis/dem/metadata")
def get_dem_metadata():
    """Returns SRTM 30m DEM resolution, dimensions, CRS, and geographic bounds."""
    return gis_service.get_dem_metadata()

@router.get("/gis/dam")
def get_gis_dam():
    """Returns Mettur Dam GeoJSON Feature from PostGIS dams table."""
    return gis_service.get_dam_geojson()

@router.get("/gis/rainfall-stations")
def get_gis_rainfall_stations():
    """Returns GeoJSON FeatureCollection for rain gauge stations in PostGIS."""
    return gis_service.get_rainfall_stations_geojson()

@router.get("/gis/mesh/status")
def get_mesh_status():
    """Returns scientific mesh status (BLOCKED BY REAL DATA) vs synthetic software test mesh (mettur_software_test_net.nc)."""
    return gis_service.get_mesh_status()

@router.get("/simulation/test-timesteps")
def get_simulation_test_timesteps():
    """Returns synthetic flood propagation timesteps strictly for map time-slider software testing."""
    return gis_service.get_test_timesteps()

@router.get("/gis/river")
def get_gis_river():
    """Returns Cauvery River spatial centerline GeoJSON or PENDING status."""
    return {
        "meta": {
            "layer": "river_centerlines",
            "status": "PENDING_ACQUISITION",
            "crs": "EPSG:4326",
            "notes": "Cauvery River centerline vector pending acquisition. Zero fabricated geometry introduced."
        },
        "type": "FeatureCollection",
        "features": []
    }

@router.get("/gis/reservoir")
def get_gis_reservoir():
    """Returns Mettur Reservoir water spread polygon GeoJSON or PENDING status."""
    return {
        "meta": {
            "layer": "reservoirs",
            "status": "PENDING_ACQUISITION",
            "crs": "EPSG:4326",
            "notes": "Reservoir water spread polygon pending acquisition. Zero fabricated geometry introduced."
        },
        "type": "FeatureCollection",
        "features": []
    }

@router.get("/gis/admin-boundaries")
def get_gis_admin_boundaries():
    return {
        "meta": {
            "layer": "admin_boundaries",
            "status": "PARTIAL",
            "crs": "EPSG:4326",
            "notes": "District & Taluk inventory catalogued; spatial vectors pending import."
        },
        "type": "FeatureCollection",
        "features": []
    }

@router.get("/gis/villages")
def get_gis_villages():
    return {
        "meta": {
            "layer": "villages",
            "status": "PARTIAL",
            "crs": "EPSG:4326",
            "notes": "Census 2011 demographics catalogued; village polygon envelopes pending."
        },
        "type": "FeatureCollection",
        "features": []
    }

@router.get("/gis/roads")
def get_gis_roads():
    return {
        "meta": {
            "layer": "roads",
            "status": "PARTIAL",
            "crs": "EPSG:4326",
            "notes": "Highway transport network catalogued; vector lines pending."
        },
        "type": "FeatureCollection",
        "features": []
    }

@router.get("/gis/buildings")
def get_gis_buildings():
    return {
        "meta": {
            "layer": "buildings",
            "status": "NOT_AVAILABLE",
            "crs": "EPSG:4326",
            "notes": "Building footprint vectors pending acquisition."
        },
        "type": "FeatureCollection",
        "features": []
    }

@router.get("/gis/infrastructure")
def get_gis_infrastructure():
    return {
        "meta": {
            "layer": "infrastructure",
            "status": "PARTIAL",
            "crs": "EPSG:4326",
            "notes": "Critical infrastructure facilities inventory catalogued."
        },
        "type": "FeatureCollection",
        "features": []
    }

# --- SCENARIO & SIMULATION ENDPOINTS ---
@router.post("/scenarios/run", response_model=ScenarioResponse)
def submit_scenario(scenario: ScenarioCreateRequest):
    """Submits a breach scenario configuration in Prototype Mode."""
    inputs_dict = scenario.model_dump() if hasattr(scenario, "model_dump") else scenario.dict()
    return {
        "meta": {
            "data_status": "prototype",
            "data_source": "prototype",
            "engine": "Delft3D-FM CLI (Wrapper Ready)"
        },
        "scenario_id": "SCEN-METTUR-PROTOTYPE-001",
        "status": "configured",
        "message": "Breach scenario successfully registered in PROTOTYPE MODE. Delft3D-FM live execution pending connection.",
        "inputs": inputs_dict
    }

@router.get("/simulation/status")
def get_simulation_status():
    return {
        "engine": "Delft3D-FM",
        "cli_binary": "dflowfm-cli.exe",
        "integration_status": "Pending",
        "current_mode": "Prototype Mode",
        "supported_outputs": ["Flood Depth (m)", "Velocity (m/s)", "Arrival Time (hrs)", "Inundation Polygons"]
    }

@router.post("/simulation/run")
def trigger_simulation_run(request_data: Dict[str, Any]):
    """Triggers simulation test run. Rejects scientific runs if blocked by real data."""
    return simulation_service.run_simulation(request_data)

@router.get("/simulation/status/{run_id}")
def get_simulation_run_status(run_id: str):
    """Returns simulation status for a given run_id."""
    return simulation_service.get_run_status(run_id)

@router.get("/simulation/results/{run_id}")
def get_simulation_run_results(run_id: str):
    """Returns full simulation results summary and timestep list."""
    return simulation_service.get_run_results(run_id)

@router.get("/simulation/results/{run_id}/timestep/{timestep}")
def get_simulation_timestep_geojson(run_id: str, timestep: int):
    """Returns GeoJSON FeatureCollection for a specific timestep of a run_id."""
    return simulation_service.get_timestep_geojson(run_id, timestep)

@router.get("/simulation/impact/{run_id}/timestep/{timestep}")
def get_simulation_impact_analysis(run_id: str, timestep: int):
    """Returns spatial exposure impact intersection results for a specific timestep."""
    return flood_postprocessor.calculate_impact_analysis(run_id, timestep)

# --- STEP 8 METTUR PROTOTYPE SIMULATION ENDPOINTS ---
@router.post("/simulation/prototype/run")
def trigger_prototype_simulation_run(request_data: Dict[str, Any]):
    """Triggers Mettur Prototype Simulation combining Real DEM + Daily Telemetry + Explicit Dummy Bathymetry."""
    return prototype_simulation_service.run_prototype_simulation(request_data)

@router.get("/simulation/prototype/status/{run_id}")
def get_prototype_simulation_status(run_id: str):
    """Returns run metadata and status for a prototype run_id."""
    return prototype_simulation_service.get_prototype_status(run_id)

@router.get("/simulation/prototype/results/{run_id}")
def get_prototype_simulation_results(run_id: str):
    """Returns summary prototype results and timestep list."""
    return prototype_simulation_service.get_prototype_results(run_id)

@router.get("/simulation/prototype/results/{run_id}/timestep/{timestep}")
def get_prototype_simulation_timestep_geojson(run_id: str, timestep: int):
    """Returns GeoJSON FeatureCollection for a specific prototype timestep."""
    return prototype_simulation_service.get_prototype_timestep_geojson(run_id, timestep)

@router.get("/simulation/prototype/assumptions/{run_id}")
def get_prototype_simulation_assumptions(run_id: str):
    """Returns parameter-level itemized data provenance for a prototype run."""
    return prototype_simulation_service.get_prototype_assumptions(run_id)

@router.get("/simulation/prototype/impacts/{run_id}/timestep/{timestep}")
def get_prototype_simulation_impacts(run_id: str, timestep: int):
    """Returns exposure impact analysis for a prototype timestep."""
    return flood_postprocessor.calculate_impact_analysis(run_id, timestep)

# --- STEP 9 HADR DECISION SUPPORT ENDPOINTS ---
@router.get("/hadr/report/{run_id}")
def get_hadr_report(run_id: str):
    """Returns complete HADR Decision Support Report for a given prototype simulation run."""
    return hadr_service.get_hadr_report(run_id)

@router.post("/hadr/compute/{run_id}")
def compute_hadr_report(run_id: str):
    """Triggers HADR impact, priority scoring, evacuation zoning, route analysis, and shelter routing."""
    return hadr_service.compute_hadr_decision_support(run_id)

@router.get("/hadr/priority-scoring/methodology")
def get_hadr_scoring_methodology():
    """Returns the transparent mathematical formula and weighting parameters for HADR priority scoring."""
    return {
        "title": "HADR Priority Score Methodology (0–100)",
        "formula": "Score = 100 * (0.25 * R_d + 0.20 * R_v + 0.25 * R_a + 0.15 * R_p + 0.15 * R_i)",
        "arrival_time_factor": "R_a = 1.0 - min(1.0, arrival_hrs / 3.0)",
        "weights": {
            "depth_weight": 0.25,
            "velocity_weight": 0.20,
            "arrival_time_weight": 0.25,
            "population_weight": 0.15,
            "infrastructure_weight": 0.15
        },
        "ranks": {
            "P1_CRITICAL": "75.0 – 100.0 (Immediate Evacuation)",
            "P2_HIGH": "50.0 – 74.9 (High Priority Evacuation)",
            "P3_MODERATE": "25.0 – 49.9 (Precautionary Advisory)",
            "P4_LOW": "0.0 – 24.9 (Monitoring / Alert)"
        },
        "governance_note": "Documented in models/mettur/docs/HADR_PRIORITY_METHODOLOGY.md",
        "scientific_use": False
    }

@router.get("/hadr/shelters")
def get_hadr_shelters():
    """Returns HADR relief staging shelters with explicit dummy data badge."""
    report = hadr_service.get_hadr_report("default_proto")
    return {
        "disclaimer": "DUMMY DATA — PROTOTYPE ONLY",
        "shelters": report.get("staging_shelters", [])
    }

# --- STEP 10 COMMAND & CONTROL ENDPOINTS ---
@router.get("/dashboard/summary")
def get_dashboard_summary(run_id: str = Query(default="default_proto")):
    """Returns consolidated Command & Control metrics combining PostGIS data, prototype simulation, HADR results, and evacuation status."""
    return dashboard_service.get_dashboard_summary(run_id=run_id)

@router.get("/system/health")
def get_system_health():
    """Returns comprehensive system health status for Backend, Database, GIS, Delft3D CLI, Prototype Model, and HADR engine."""
    return system_service.get_system_health()

@router.get("/system/components")
def get_system_components():
    """Returns itemized health matrix across all system components."""
    return system_service.get_system_components()

@router.get("/system/data-status")
def get_system_data_status():
    """Returns data provenance matrix across all 16 dataset categories."""
    return system_service.get_system_data_status()

@router.post("/reports/generate")
def generate_consolidated_report(run_id: str = Query(default="default_proto")):
    """Generates consolidated prototype decision-support report JSON file and saves to disk."""
    return report_service.generate_final_report(run_id=run_id)


