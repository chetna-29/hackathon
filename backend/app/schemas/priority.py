from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PriorityQueueItem(BaseModel):
    sos_id: int
    sos_code: str
    household_code: Optional[str] = None
    rank: int
    priority_score: float
    severity: str
    severity_component: float
    vulnerability_component: float
    risk_component: float
    isolation_component: float
    latitude: float
    longitude: float
    emergency_type: str
    status: str
    elderly_count: int = 0
    disabled_count: int = 0
    medical_needs: Optional[str] = None
    created_at: datetime

class PriorityQueueResponse(BaseModel):
    total_active_sos: int
    queue: List[PriorityQueueItem]
