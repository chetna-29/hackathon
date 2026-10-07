from pydantic import BaseModel
from typing import Optional, List, Any

class LandslidePredictRequest(BaseModel):
    rainfall_24h: float
    cumulative_rainfall_7d: Optional[float] = None
    slope: float = 35.0
    elevation: float = 1200.0
    soil_type: Optional[str] = "clay_loam"
    historical_disasters: Optional[int] = 1

class LandslidePredictResponse(BaseModel):
    risk_level: str
    risk_score: float
    model_used: str

class RiskZoneResponse(BaseModel):
    zone_code: str
    name: str
    risk_level: str
    risk_score: float
    rainfall_24h: float
    slope: float
    elevation: float
    population: int
    vulnerable_population: int
    center_lat: float
    center_lng: float
    polygon_geojson: Optional[str] = None
