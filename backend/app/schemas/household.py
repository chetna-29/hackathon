from pydantic import BaseModel
from typing import Optional

class HouseholdBase(BaseModel):
    household_code: str
    zone_id: str
    address: Optional[str] = None
    latitude: float
    longitude: float
    members_count: int = 1
    elderly_count: int = 0
    children_count: int = 0
    disabled_count: int = 0
    medical_needs: Optional[str] = None

class HouseholdCreate(HouseholdBase):
    pass

class HouseholdResponse(HouseholdBase):
    id: int
    vulnerability_score: float

    class Config:
        from_attributes = True
