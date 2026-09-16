from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any

class ScenarioCreateRequest(BaseModel):
    model_config = ConfigDict(extra="allow")

    dam_name: str = Field(default="Mettur Dam")
    scenario_type: str = Field(default="Maximum Reservoir Level Breach", description="Maximum Reservoir Level Breach | Prototype Moderate Breach | Severe Overtopping Breach | Custom Breach Scenario")
    scenario: Optional[str] = Field(default=None, description="Scenario title alias")
    reservoir_level_ft: float = Field(default=162.5, description="Reservoir water level in feet")
    initial_water_level_ft: Optional[float] = Field(default=None, description="Initial reservoir water level alias in feet")
    breach_width_m: float = Field(default=150.0, description="Breach width in meters")
    breach_width: Optional[float] = Field(default=None, description="Breach width alias in meters")
    breach_formation_time_min: float = Field(default=120.0, description="Breach formation time in minutes")
    breach_elevation_m: float = Field(default=45.0, description="Breach bottom elevation in meters")
    simulation_duration_hrs: float = Field(default=3.0, description="Simulation duration in hours")
    duration_hours: Optional[float] = Field(default=None, description="Simulation duration alias in hours")

class ScenarioResponse(BaseModel):
    model_config = ConfigDict(extra="allow")

    meta: Dict[str, Any]
    scenario_id: str
    status: str
    message: str
    inputs: Dict[str, Any]
