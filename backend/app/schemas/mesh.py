from pydantic import BaseModel
from typing import List, Optional, Any

class MeshPacket(BaseModel):
    message_id: str
    sender_id: str
    type: str = "SOS"
    household_id: Optional[str] = None
    latitude: float
    longitude: float
    severity: str = "CRITICAL"
    timestamp: int
    ttl: int = 8
    hops: List[str] = []
    payload: Optional[Any] = None

class MeshPacketAck(BaseModel):
    status: str # ACCEPTED, DUPLICATE_DROPPED, TTL_EXPIRED
    message_id: str
    action_taken: str
    associated_sos_code: Optional[str] = None
