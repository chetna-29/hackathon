from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SOSCreate(BaseModel):
    household_code: Optional[str] = None
    sender_device_id: Optional[str] = "BROWSER-CLIENT"
    latitude: float
    longitude: float
    emergency_type: str = "LANDSLIDE_TRAPPED"
    severity: str = "HIGH" # CRITICAL, HIGH, MEDIUM, LOW
    notes: Optional[str] = None
    via_mesh: Optional[str] = "FALSE"

class SOSStatusUpdate(BaseModel):
    status: str # PENDING, ASSIGNED, DISPATCHED, RESCUED, CANCELLED
    assigned_team_id: Optional[str] = None
    assigned_shelter_id: Optional[str] = None

class SOSResponse(BaseModel):
    id: int
    sos_code: str
    household_code: Optional[str] = None
    latitude: float
    longitude: float
    emergency_type: str
    severity: str
    status: str
    priority_score: float
    notes: Optional[str] = None
    via_mesh: Optional[str] = "FALSE"
    hops_count: Optional[int] = 0
    created_at: datetime

    class Config:
        from_attributes = True
