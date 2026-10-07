from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from geoalchemy2 import Geometry
from app.database import Base

class RiskZone(Base):
    __tablename__ = "risk_zones"

    id = Column(Integer, primary_key=True, index=True)
    zone_code = Column(String(50), unique=True, index=True, nullable=False) # e.g., ZONE-04-NORTH
    name = Column(String(100), nullable=False)
    risk_level = Column(String(20), default="LOW") # LOW, MEDIUM, HIGH
    risk_score = Column(Float, default=0.15)       # 0.0 to 1.0
    rainfall_24h = Column(Float, default=20.0)
    cumulative_rainfall_7d = Column(Float, default=50.0)
    slope = Column(Float, default=30.0)
    elevation = Column(Float, default=1100.0)
    soil_type = Column(String(50), default="clay_loam")
    historical_disasters = Column(Integer, default=1)
    population = Column(Integer, default=500)
    vulnerable_population = Column(Integer, default=40)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    polygon = Column(Geometry(geometry_type='POLYGON', srid=4326), nullable=True)
    polygon_geojson = Column(Text, nullable=True) # JSON coordinates polygon
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
