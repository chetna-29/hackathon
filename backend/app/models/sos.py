from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from sqlalchemy import String
from app.database import Base
from geoalchemy2 import Geometry

class SOSRequest(Base):
    __tablename__ = "sos_requests"

    id = Column(Integer, primary_key=True, index=True)
    sos_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. SOS-1092
    household_code = Column(String(50), index=True, nullable=True)
    sender_device_id = Column(String(50), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location = Column(String, nullable=True)
    location_geom = Column(Geometry(geometry_type='POINT', srid=4326), nullable=True)
    source_type = Column(String(20), default="MOBILE") # MOBILE, HARDWARE, RESCUER
    emergency_type = Column(String(50), default="LANDSLIDE_TRAPPED") # MEDICAL, COLLAPSE, FLOOD, TRAPPED
    severity = Column(String(20), default="HIGH") # CRITICAL, HIGH, MEDIUM, LOW
    status = Column(String(20), default="PENDING") # PENDING, ASSIGNED, DISPATCHED, RESCUED, CANCELLED
    priority_score = Column(Float, default=50.0) # 0 to 100
    notes = Column(Text, nullable=True)
    assigned_team_id = Column(String(50), nullable=True)
    assigned_shelter_id = Column(String(50), nullable=True)
    via_mesh = Column(String(20), default="FALSE") # TRUE or FALSE
    hops_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
