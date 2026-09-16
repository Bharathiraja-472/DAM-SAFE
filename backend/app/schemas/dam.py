from pydantic import BaseModel
from typing import Dict, Any, List, Optional

class MetadataEnvelope(BaseModel):
    dataset: str
    data_status: str  # "verified" | "partial" | "prototype" | "mock" | "simulated"
    data_source: str  # "official" | "inventory" | "prototype"
    is_realtime: bool = False
    last_updated: Optional[str] = None

class DamParametersResponse(BaseModel):
    meta: MetadataEnvelope
    parameters: Dict[str, Any]

class ReservoirRecord(BaseModel):
    date: str
    reservoir: str
    river: str
    full_depth_ft: float
    full_capacity_Mcft: float
    current_level_ft: float
    current_storage_Mcft: float
    current_inflow_cusecs: float
    current_outflow_cusecs: float
    source: Optional[str] = None

class ReservoirHistoryResponse(BaseModel):
    meta: MetadataEnvelope
    records: List[Dict[str, Any]]

class DatasetInventoryItem(BaseModel):
    id: str
    name: str
    status: str
    source_type: str
    file_name: Optional[str] = None
    description: str
