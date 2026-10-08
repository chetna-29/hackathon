from datetime import datetime

from pydantic import BaseModel


class SOSCreate(BaseModel):
    household_code: str | None = None
    sender_device_id: str | None = "BROWSER-CLIENT"
    latitude: float
    longitude: float
    emergency_type: str = "LANDSLIDE_TRAPPED"
    severity: str = "HIGH"
    notes: str | None = None
    via_mesh: str | None = "FALSE"


class SOSStatusUpdate(BaseModel):
    status: str
    assigned_team_id: str | None = None
    assigned_shelter_id: str | None = None


class SOSResponse(BaseModel):
    id: int
    sos_code: str
    household_code: str | None = None
    latitude: float
    longitude: float
    emergency_type: str
    severity: str
    status: str
    priority_score: float
    notes: str | None = None
    via_mesh: str | None = "FALSE"
    hops_count: int | None = 0
    created_at: datetime

    class Config:
        from_attributes = True
