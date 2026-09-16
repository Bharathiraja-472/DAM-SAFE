import time
import json
from pathlib import Path
from typing import Dict, Any
from app.services.dashboard_service import dashboard_service
from app.services.hadr_service import hadr_service
from app.services.prototype_simulation_service import prototype_simulation_service

class ReportService:
    def __init__(self):
        self.final_reports_dir = Path(r"d:/SIH2026/models/mettur/prototype/validation/final_reports")
        self.final_reports_dir.mkdir(parents=True, exist_ok=True)

    def generate_final_report(self, run_id: str = "default_proto") -> Dict[str, Any]:
        """Consolidates complete decision-support metrics and exports final report JSON file."""
        dash_summary = dashboard_service.get_dashboard_summary(run_id)
        hadr_report = hadr_service.get_hadr_report(run_id)
        run_meta = prototype_simulation_service.get_prototype_status(run_id)
        assumptions = prototype_simulation_service.get_prototype_assumptions(run_id)

        report_payload = {
            "title": "DAM-SAFE Consolidated Prototype Decision-Support Report",
            "report_id": f"REP_{int(time.time())}_{run_id}",
            "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "disclaimers": [
                "PROTOTYPE — REAL DATA + EXPLICIT ASSUMPTIONS — NOT SCIENTIFICALLY VALIDATED",
                "HADR DECISION SUPPORT PROTOTYPE — NOT AN OPERATIONAL EMERGENCY WARNING SYSTEM",
                "PROTOTYPE ADVISORY — NOT AN OFFICIAL EMERGENCY ALERT",
                "Population exposure estimate based on Census 2011",
                "DUMMY DATA — PROTOTYPE ONLY"
            ],
            "study_area": "Mettur Dam - Cauvery River Floodplain, Tamil Nadu",
            "scenario": {
                "run_id": run_id,
                "name": run_meta.get("scenario", "Prototype Moderate Breach"),
                "status": "COMPLETED",
                "dflowfm_cli_status": run_meta.get("dflowfm_cli_status", "DFLOWFM_EXECUTABLE_VALIDATED")
            },
            "hydraulic_summary": dash_summary.get("flood_status", {}),
            "hadr_summary": dash_summary.get("hadr_status", {}),
            "evacuation_summary": dash_summary.get("evacuation_status", {}),
            "settlements_impact": hadr_report.get("village_impact_results", []),
            "evacuation_zones": hadr_report.get("evacuation_zones", []),
            "route_analysis": hadr_report.get("route_analysis", []),
            "staging_shelters": hadr_report.get("staging_shelters", []),
            "data_provenance": assumptions,
            "system_status": dash_summary.get("system_status", {}),
            "limitations": [
                "Scientific Mettur model mettur_cauvery_net.nc remains BLOCKED BY REAL DATA pending real channel geometry & bathymetry.",
                "Simulated inundation depths and velocity vectors are prototype outputs for pipeline software verification.",
                "Evacuation routing and shelter capacities are decision-support demonstrations only."
            ]
        }

        # Save to disk
        out_filepath = self.final_reports_dir / f"final_report_{run_id}.json"
        with open(out_filepath, "w", encoding="utf-8") as f:
            json.dump(report_payload, f, indent=2)

        report_payload["saved_file"] = str(out_filepath)
        return report_payload

report_service = ReportService()
