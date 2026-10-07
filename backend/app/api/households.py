from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.household import Household
from app.schemas.household import HouseholdResponse

router = APIRouter()

@router.get("/", response_model=List[HouseholdResponse])
def get_households(zone_id: str = None, min_vulnerability: float = 0.0, db: Session = Depends(get_db)):
    query = db.query(Household)
    if zone_id:
        query = query.filter(Household.zone_id == zone_id)
    if min_vulnerability > 0.0:
        query = query.filter(Household.vulnerability_score >= min_vulnerability)
    return query.all()
