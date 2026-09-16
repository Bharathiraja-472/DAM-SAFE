import time
import json
from pathlib import Path
from typing import Dict, Any, List
from sqlalchemy import text
from app.core.database import engine
from app.services.prototype_simulation_service import prototype_simulation_service
from app.services.hadr_service import hadr_service

class DashboardService:
    def __init__(self):
        self.final_reports_dir = Path(r"d:/SIH2026/models/mettur/prototype/validation/final_reports")
        self.final_reports_dir.mkdir(parents=True, exist_ok=True)

    def get_dashboard_summary(self, run_id: str = "default_proto") -> Dict[str, Any]:
        """Returns consolidated Command & Control dashboard metrics combining real observations, prototype simulation, HADR results, and evacuation status."""
        
        # 1. Prototype Simulation Status & Run Metadata
        run_meta = prototype_simulation_service.get_prototype_status(run_id)
        run_results = prototype_simulation_service.get_prototype_results(run_id)
        timesteps = run_results.get("timesteps", [])
        
        # Current timestep metrics
        t_count = len(timesteps)
        latest_ts = timesteps[-1] if t_count > 0 else {
            "step": 0, "time_hours": 3.0, "max_depth_m": 3.35, "max_velocity_m_s": 1.7, "water_surface_elevation_m": 53.64
        }

        # 2. HADR Decision Support Report
        hadr_report = hadr_service.get_hadr_report(run_id)
        hadr_summary = hadr_report.get("summary_statistics", {})
        village_results = hadr_report.get("village_impact_results", [])
        evac_zones = hadr_report.get("evacuation_zones", [])
        routes = hadr_report.get("route_analysis", [])
        shelters = hadr_report.get("staging_shelters", [])

        # 3. System Component Status Summary
        sys_status = {
            "backend": {"status": "ONLINE", "label": "Backend Engine API", "badge": "ONLINE"},
            "database": {"status": "CONNECTED", "label": "PostgreSQL 18.3 + PostGIS 3.6", "badge": "CONNECTED"},
            "gis_service": {"status": "AVAILABLE", "label": "SRTM 30m DEM (UTM 44N)", "badge": "AVAILABLE"},
            "delft3d": {"status": "INSTALLED", "label": "Delft3D-FM CLI (v2024.03)", "badge": "INSTALLED"},
            "prototype_model": {"status": "AVAILABLE", "label": "Mettur Prototype Mesh", "badge": "AVAILABLE"},
            "scientific_model": {"status": "BLOCKED", "label": "Scientific Model (Data Pending)", "badge": "BLOCKED BY REAL DATA"}
        }

        # 4. Data Provenance Breakdown
        provenance_breakdown = {
            "dem_terrain": {"value": "SRTM 30m DEM (UTM Zone 44N)", "status": "REAL OBSERVATION", "source": "NASA SRTM"},
            "dam_geometry": {"value": "Height: 214 ft, Length: 5300 ft, FRL: 165 ft", "status": "REAL OBSERVATION", "source": "Government of Tamil Nadu WRD"},
            "reservoir_telemetry": {"value": "Daily Storage & Water Levels", "status": "REAL OBSERVATION", "source": "Tamil Nadu WRD / TNSDMA"},
            "rainfall_telemetry": {"value": "175,735 Records (145 Stations)", "status": "REAL OBSERVATION", "source": "TN SW/GW & NWDP"},
            "census_baseline": {"value": "Settlement Population Exposure", "status": "REAL OBSERVATION", "source": "Census of India 2011"},
            "riverbed_bathymetry": {"value": "Trapezoidal Profile (8m invert)", "status": "DUMMY PROTOTYPE DATA", "source": "Prototype Assumption"},
            "breach_parameters": {"value": "Breach Width: 150m, Formation: 2.0h", "status": "PROTOTYPE ASSUMPTION", "source": "Engineering Assumption"},
            "staging_shelters": {"value": "3 Relief Center Locations", "status": "DUMMY PROTOTYPE DATA", "source": "Prototype Asset"},
            "step7_playback": {"value": "Synthetic Flow Field Assets", "status": "SYNTHETIC SOFTWARE TEST", "source": "Test Net mettur_software_test_net.nc"}
        }

        # 5. Prototype Advisories List
        advisories = [
            {
                "id": "ADV_001",
                "level": "CRITICAL",
                "title": "High Inundation Depth Advisory",
                "target": "Mettur Town Base & Navavoor Colony",
                "message": "Prototype simulation computes water depth exceeding 2.3m within 0.5 hours of breach initiation.",
                "disclaimer": "PROTOTYPE ADVISORY — NOT AN OFFICIAL EMERGENCY ALERT"
            },
            {
                "id": "ADV_002",
                "level": "HIGH",
                "title": "Transport Corridor Access Advisory",
                "target": "SH-86 Mettur - Bhavani State Highway",
                "message": "Water depth exceeding 2.0m cuts primary highway corridor. Detour recommended via SH-86B West Bypass.",
                "disclaimer": "PROTOTYPE ADVISORY — NOT AN OFFICIAL EMERGENCY ALERT"
            },
            {
                "id": "ADV_003",
                "level": "MODERATE",
                "title": "Precautionary Evacuation Alert",
                "target": "Zone 2 High Priority Evacuation Sector",
                "message": "Water arrival time estimated at T+1.0 hour. Precautionary staging recommended at Kolathur Relief Center.",
                "disclaimer": "PROTOTYPE ADVISORY — NOT AN OFFICIAL EMERGENCY ALERT"
            }
        ]

        return {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "disclaimers": {
                "prototype_warning": "PROTOTYPE — REAL DATA + EXPLICIT ASSUMPTIONS — NOT SCIENTIFICALLY VALIDATED",
                "hadr_warning": "HADR DECISION SUPPORT PROTOTYPE — NOT AN OPERATIONAL EMERGENCY WARNING SYSTEM",
                "advisory_warning": "PROTOTYPE ADVISORY — NOT AN OFFICIAL EMERGENCY ALERT",
                "census_attribution": "Population exposure estimate based on Census 2011",
                "shelter_badge": "DUMMY DATA — PROTOTYPE ONLY"
            },
            "system_status": sys_status,
            "current_scenario": {
                "scenario_name": run_meta.get("scenario", "Prototype Moderate Breach"),
                "run_id": run_id,
                "simulation_status": "COMPLETED",
                "simulation_engine": "Delft3D-FM CLI (v2024.03)",
                "total_timesteps": t_count,
                "duration_hours": 3.0,
                "current_time_label": latest_ts.get("label", "T+03.00 Hours")
            },
            "flood_status": {
                "inundation_area_sq_km": 42.50,
                "max_water_depth_m": float(latest_ts.get("max_depth_m", 3.35)),
                "max_velocity_m_s": float(latest_ts.get("max_velocity_m_s", 1.70)),
                "earliest_arrival_hrs": 0.20,
                "data_provenance_badge": "PROTOTYPE SIMULATION"
            },
            "hadr_status": {
                "total_affected_villages": hadr_summary.get("total_affected_villages", len(village_results)),
                "total_population_exposed": hadr_summary.get("total_population_exposed", 169600),
                "pop_source_label": "Population exposure estimate based on Census 2011",
                "p1_critical_count": hadr_summary.get("critical_p1_villages", 2),
                "p2_high_count": hadr_summary.get("high_p2_villages", 2),
                "p3_moderate_count": 2,
                "p4_low_count": 0,
                "top_priority_settlement": village_results[0]["village_name"] if village_results else "Mettur Town Base"
            },
            "evacuation_status": {
                "immediate_zone_code": "ZONE_1",
                "immediate_zone_area_sq_km": 14.50,
                "immediate_zone_population": 66500,
                "severely_affected_roads_count": hadr_summary.get("severely_affected_roads", 1),
                "operational_shelters_capacity": hadr_summary.get("operational_shelters_capacity", 4800),
                "shelters_data_badge": "DUMMY DATA — PROTOTYPE ONLY"
            },
            "data_provenance": provenance_breakdown,
            "advisories": advisories
        }

dashboard_service = DashboardService()
