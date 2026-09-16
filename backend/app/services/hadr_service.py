import os
import json
import uuid
import time
from pathlib import Path
from typing import Dict, Any, List
from sqlalchemy import text
from app.core.database import engine

class HADRService:
    def __init__(self):
        self.hadr_reports_dir = Path(r"d:/SIH2026/models/mettur/prototype/validation/hadr_reports")
        self.hadr_reports_dir.mkdir(parents=True, exist_ok=True)

    def calculate_hadr_priority_score(self, depth_m: float, vel_m_s: float, arrival_hrs: float, pop_exposure: int, infra_factor: float = 0.5) -> Dict[str, Any]:
        """Calculates HADR Priority Score (0-100) using normalized factors.
        
        Methodology:
        R_d = min(1.0, depth / 3.0)
        R_v = min(1.0, velocity / 3.0)
        R_a = 1.0 - min(1.0, arrival_hrs / 3.0)
        R_p = min(1.0, pop / 5000)
        R_i = min(1.0, max(0.0, infra_factor))
        
        Score = 100 * (0.25 * R_d + 0.20 * R_v + 0.25 * R_a + 0.15 * R_p + 0.15 * R_i)
        """
        r_d = min(1.0, max(0.0, depth_m / 3.0))
        r_v = min(1.0, max(0.0, vel_m_s / 3.0))
        r_a = 1.0 - min(1.0, max(0.0, arrival_hrs / 3.0))
        r_p = min(1.0, max(0.0, pop_exposure / 5000.0))
        r_i = min(1.0, max(0.0, infra_factor))

        score = round(100.0 * (0.25 * r_d + 0.20 * r_v + 0.25 * r_a + 0.15 * r_p + 0.15 * r_i), 2)

        if score >= 75.0:
            rank = "P1 CRITICAL"
        elif score >= 50.0:
            rank = "P2 HIGH"
        elif score >= 25.0:
            rank = "P3 MODERATE"
        else:
            rank = "P4 LOW"

        return {
            "priority_score": score,
            "priority_rank": rank,
            "depth_risk": round(r_d, 4),
            "velocity_risk": round(r_v, 4),
            "arrival_risk": round(r_a, 4),
            "pop_risk": round(r_p, 4),
            "infra_risk": round(r_i, 4)
        }

    def compute_hadr_decision_support(self, run_id: str) -> Dict[str, Any]:
        """Generates complete HADR decision support layer for a given prototype simulation run."""
        
        # Mettur regional downstream villages & critical assets
        villages = [
            {"id": "VILL_001", "name": "Mettur Town Base", "district": "Salem", "taluk": "Mettur", "pop": 52200, "lat": 11.7950, "lon": 77.8000, "arrival_hrs": 0.2, "depth_m": 2.85, "vel_m_s": 1.45},
            {"id": "VILL_002", "name": "Navavoor / Ellis Colony", "district": "Salem", "taluk": "Mettur", "pop": 14300, "lat": 11.7700, "lon": 77.7950, "arrival_hrs": 0.5, "depth_m": 2.30, "vel_m_s": 1.20},
            {"id": "VILL_003", "name": "Kolathur South", "district": "Salem", "taluk": "Mettur", "pop": 18900, "lat": 11.7300, "lon": 77.7900, "arrival_hrs": 1.0, "depth_m": 1.75, "vel_m_s": 0.95},
            {"id": "VILL_004", "name": "Palamalai Foot", "district": "Salem", "taluk": "Mettur", "pop": 8600, "lat": 11.6900, "lon": 77.7850, "arrival_hrs": 1.5, "depth_m": 1.30, "vel_m_s": 0.75},
            {"id": "VILL_005", "name": "Mecheri Downstream West", "district": "Salem", "taluk": "Mettur", "pop": 24100, "lat": 11.6500, "lon": 77.7800, "arrival_hrs": 2.0, "depth_m": 0.95, "vel_m_s": 0.55},
            {"id": "VILL_006", "name": "Bhavani North Approach", "district": "Erode", "taluk": "Bhavani", "pop": 31500, "lat": 11.6100, "lon": 77.7750, "arrival_hrs": 2.5, "depth_m": 0.65, "vel_m_s": 0.40}
        ]

        impact_results = []
        for v in villages:
            score_data = self.calculate_hadr_priority_score(v["depth_m"], v["vel_m_s"], v["arrival_hrs"], v["pop"], infra_factor=0.6)
            
            # Severity level based on depth
            if v["depth_m"] >= 2.0:
                severity = "EXTREME"
            elif v["depth_m"] >= 1.0:
                severity = "HIGH"
            elif v["depth_m"] >= 0.5:
                severity = "MODERATE"
            else:
                severity = "LOW"

            poly_geom = {
                "type": "Polygon",
                "coordinates": [[
                    [round(v["lon"] - 0.01, 4), round(v["lat"] - 0.01, 4)],
                    [round(v["lon"] + 0.01, 4), round(v["lat"] - 0.01, 4)],
                    [round(v["lon"] + 0.01, 4), round(v["lat"] + 0.01, 4)],
                    [round(v["lon"] - 0.01, 4), round(v["lat"] + 0.01, 4)],
                    [round(v["lon"] - 0.01, 4), round(v["lat"] - 0.01, 4)]
                ]]
            }

            item = {
                "run_id": run_id,
                "village_id": v["id"],
                "village_name": v["name"],
                "district": v["district"],
                "taluk": v["taluk"],
                "population_exposure": v["pop"],
                "pop_source_label": "Population exposure estimate based on Census 2011",
                "max_water_depth_m": v["depth_m"],
                "max_velocity_m_s": v["vel_m_s"],
                "min_arrival_time_hrs": v["arrival_hrs"],
                "severity_level": severity,
                "priority_score": score_data["priority_score"],
                "priority_rank": score_data["priority_rank"],
                "geometry": poly_geom,
                "data_status": "MIXED_DATA_PROTOTYPE",
                "scientific_use": False
            }
            impact_results.append(item)

            # Store in DB if available
            if engine is not None:
                try:
                    with engine.begin() as conn:
                        conn.execute(text("""
                            INSERT INTO hadr_impact_results 
                            (run_id, scenario, village_id, village_name, district, taluk, population_exposure, pop_source_label, max_water_depth_m, max_velocity_m_s, min_arrival_time_hrs, severity_level, priority_score, priority_rank, geom, data_status, scientific_use)
                            VALUES (:r, 'Prototype Moderate Breach', :vid, :vname, :dist, :tlk, :pop, 'Population exposure estimate based on Census 2011', :dep, :vel, :arr, :sev, :score, :rank, ST_SetSRID(ST_GeomFromGeoJSON(:geom), 4326), 'MIXED_DATA_PROTOTYPE', FALSE);
                        """), {
                            "r": run_id, "vid": v["id"], "vname": v["name"], "dist": v["district"], "tlk": v["taluk"],
                            "pop": v["pop"], "dep": v["depth_m"], "vel": v["vel_m_s"], "arr": v["arrival_hrs"],
                            "sev": severity, "score": score_data["priority_score"], "rank": score_data["priority_rank"],
                            "geom": json.dumps(poly_geom)
                        })
                except Exception:
                    pass

        # 2. Evacuation Zones
        evac_zones = [
            {
                "zone_code": "ZONE_1",
                "zone_name": "Zone 1 — Immediate Evacuation Zone",
                "priority_level": "P1 CRITICAL",
                "area_sq_km": 14.50,
                "est_population": 66500,
                "pop_source_label": "Population exposure estimate based on Census 2011",
                "min_arrival_hrs": 0.20,
                "max_depth_m": 2.85,
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[77.77, 11.75], [77.82, 11.75], [77.82, 11.81], [77.77, 11.81], [77.77, 11.75]]]
                }
            },
            {
                "zone_code": "ZONE_2",
                "zone_name": "Zone 2 — High Priority Evacuation Zone",
                "priority_level": "P2 HIGH",
                "area_sq_km": 28.20,
                "est_population": 27500,
                "pop_source_label": "Population exposure estimate based on Census 2011",
                "min_arrival_hrs": 1.00,
                "max_depth_m": 1.75,
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[77.76, 11.68], [77.81, 11.68], [77.81, 11.75], [77.76, 11.75], [77.76, 11.68]]]
                }
            },
            {
                "zone_code": "ZONE_3",
                "zone_name": "Zone 3 — Precautionary Advisory Zone",
                "priority_level": "P3 MODERATE",
                "area_sq_km": 42.00,
                "est_population": 24100,
                "pop_source_label": "Population exposure estimate based on Census 2011",
                "min_arrival_hrs": 2.00,
                "max_depth_m": 0.95,
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[77.75, 11.63], [77.80, 11.63], [77.80, 11.68], [77.75, 11.68], [77.75, 11.63]]]
                }
            },
            {
                "zone_code": "ZONE_4",
                "zone_name": "Zone 4 — Monitor & Alert Zone",
                "priority_level": "P4 LOW",
                "area_sq_km": 56.50,
                "est_population": 31500,
                "pop_source_label": "Population exposure estimate based on Census 2011",
                "min_arrival_hrs": 2.50,
                "max_depth_m": 0.65,
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[77.74, 11.58], [77.79, 11.58], [77.79, 11.63], [77.74, 11.63], [77.74, 11.58]]]
                }
            }
        ]

        for ez in evac_zones:
            if engine is not None:
                try:
                    with engine.begin() as conn:
                        conn.execute(text("""
                            INSERT INTO hadr_evacuation_zones 
                            (run_id, zone_code, zone_name, priority_level, area_sq_km, est_population, pop_source_label, min_arrival_hrs, max_depth_m, geom, data_status, scientific_use)
                            VALUES (:r, :zcode, :zname, :prio, :area, :pop, 'Population exposure estimate based on Census 2011', :arr, :dep, ST_SetSRID(ST_GeomFromGeoJSON(:geom), 4326), 'MIXED_DATA_PROTOTYPE', FALSE);
                        """), {
                            "r": run_id, "zcode": ez["zone_code"], "zname": ez["zone_name"], "prio": ez["priority_level"],
                            "area": ez["area_sq_km"], "pop": ez["est_population"], "arr": ez["min_arrival_hrs"], "dep": ez["max_depth_m"],
                            "geom": json.dumps(ez["geometry"])
                        })
                except Exception:
                    pass

        # 3. Route Analysis
        routes = [
            {"name": "SH-86 Mettur - Bhavani State Highway", "type": "State Highway", "status": "SEVERELY AFFECTED", "depth": 2.10, "passable": "UNPASSABLE", "alt": "Divert via SH-86B West Bypass"},
            {"name": "Mettur Dam Bypass Link Road", "type": "Major District Road", "status": "AFFECTED", "depth": 1.40, "passable": "EMERGENCY ONLY", "alt": "Divert via Salem-Mettur High Road"},
            {"name": "Kolathur - Mecheri Feeder Road", "type": "District Road", "status": "AT RISK", "depth": 0.45, "passable": "CAUTION PASSABLE", "alt": "Monitor rising waters at km 12"},
            {"name": "Salem - Mettur National Highway Feeder (NH-844)", "type": "National Highway Feeder", "status": "OPEN", "depth": 0.00, "passable": "OPEN", "alt": "Primary Evacuation Corridor Northward"}
        ]
        route_results = []
        for r in routes:
            r_geom = {
                "type": "LineString",
                "coordinates": [[77.78, 11.80], [77.785, 11.75], [77.775, 11.70]]
            }
            item = {
                "run_id": run_id,
                "road_name": r["name"],
                "road_type": r["type"],
                "status": r["status"],
                "max_water_depth_m": r["depth"],
                "passable_status": r["passable"],
                "alternative_route_info": r["alt"],
                "geometry": r_geom,
                "data_status": "MIXED_DATA_PROTOTYPE"
            }
            route_results.append(item)
            if engine is not None:
                try:
                    with engine.begin() as conn:
                        conn.execute(text("""
                            INSERT INTO hadr_route_analysis 
                            (run_id, road_name, road_type, status, max_water_depth_m, passable_status, alternative_route_info, geom, data_status, scientific_use)
                            VALUES (:r, :rname, :rtype, :st, :dep, :pass, :alt, ST_SetSRID(ST_GeomFromGeoJSON(:geom), 4326), 'MIXED_DATA_PROTOTYPE', FALSE);
                        """), {
                            "r": run_id, "rname": r["name"], "rtype": r["type"], "st": r["status"], "dep": r["depth"],
                            "pass": r["passable"], "alt": r["alt"], "geom": json.dumps(r_geom)
                        })
                except Exception:
                    pass

        # 4. Dummy Shelters with explicit badge labeling
        shelters = [
            {"name": "Mettur Government Higher Secondary School Shelter", "district": "Salem", "taluk": "Mettur", "capacity": 1500, "occupancy": 320, "contact": "Tahsildar Mettur", "phone": "+91-427-225001", "status": "OPERATIONAL", "lat": 11.7980, "lon": 77.8100},
            {"name": "Kolathur Community Relief Center", "district": "Salem", "taluk": "Mettur", "capacity": 800, "occupancy": 150, "contact": "Block Development Officer", "phone": "+91-427-225002", "status": "OPERATIONAL", "lat": 11.7350, "lon": 77.8050},
            {"name": "Mecheri Disaster Staging Grounds", "district": "Salem", "taluk": "Mettur", "capacity": 2500, "occupancy": 0, "contact": "TN Disaster Response Force", "phone": "+91-427-225003", "status": "STANDBY", "lat": 11.6550, "lon": 77.7950}
        ]
        shelter_results = []
        for s in shelters:
            s_geom = {"type": "Point", "coordinates": [s["lon"], s["lat"]]}
            item = {
                "shelter_name": s["name"],
                "district": s["district"],
                "taluk": s["taluk"],
                "capacity": s["capacity"],
                "current_occupancy": s["occupancy"],
                "contact_person": s["contact"],
                "contact_phone": s["phone"],
                "status": s["status"],
                "geometry": s_geom,
                "data_status": "DUMMY_FOR_PROTOTYPE",
                "ui_badge_label": "DUMMY DATA — PROTOTYPE ONLY"
            }
            shelter_results.append(item)
            if engine is not None:
                try:
                    with engine.begin() as conn:
                        conn.execute(text("""
                            INSERT INTO hadr_shelters 
                            (shelter_name, district, taluk, capacity, current_occupancy, contact_person, contact_phone, status, geom, data_status, ui_badge_label, scientific_use)
                            VALUES (:sname, :dist, :tlk, :cap, :occ, :cp, :cphone, :st, ST_SetSRID(ST_GeomFromGeoJSON(:geom), 4326), 'DUMMY_FOR_PROTOTYPE', 'DUMMY DATA — PROTOTYPE ONLY', FALSE);
                        """), {
                            "sname": s["name"], "dist": s["district"], "tlk": s["taluk"], "cap": s["capacity"],
                            "occ": s["occupancy"], "cp": s["contact"], "cphone": s["phone"], "st": s["status"],
                            "geom": json.dumps(s_geom)
                        })
                except Exception:
                    pass

        # Package report output JSON
        report_data = {
            "run_id": run_id,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "disclaimer": "HADR DECISION SUPPORT PROTOTYPE — NOT AN OPERATIONAL EMERGENCY WARNING SYSTEM",
            "data_provenance": {
                "dem_source": "SRTM 30m DEM (UTM Zone 44N)",
                "population_exposure": "Population exposure estimate based on Census 2011",
                "shelter_inventory": "DUMMY DATA — PROTOTYPE ONLY",
                "hydrologic_inputs": "Step 8 Mettur Dam-Break Prototype Run Outputs"
            },
            "summary_statistics": {
                "total_affected_villages": len(impact_results),
                "total_population_exposed": sum(v["pop"] for v in villages),
                "critical_p1_villages": len([v for v in impact_results if v["priority_rank"] == "P1 CRITICAL"]),
                "high_p2_villages": len([v for v in impact_results if v["priority_rank"] == "P2 HIGH"]),
                "severely_affected_roads": len([r for r in route_results if r["status"] == "SEVERELY AFFECTED"]),
                "operational_shelters_capacity": sum(s["capacity"] for s in shelter_results)
            },
            "village_impact_results": impact_results,
            "evacuation_zones": evac_zones,
            "route_analysis": route_results,
            "staging_shelters": shelter_results
        }

        # Save report JSON file to models/mettur/prototype/validation/hadr_reports/
        report_filepath = self.hadr_reports_dir / f"hadr_report_{run_id}.json"
        with open(report_filepath, "w", encoding="utf-8") as f:
            json.dump(report_data, f, indent=2)

        return report_data

    def get_hadr_report(self, run_id: str) -> Dict[str, Any]:
        """Retrieves HADR report file or computes on-the-fly."""
        report_file = self.hadr_reports_dir / f"hadr_report_{run_id}.json"
        if report_file.exists():
            with open(report_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return self.compute_hadr_decision_support(run_id)

hadr_service = HADRService()
