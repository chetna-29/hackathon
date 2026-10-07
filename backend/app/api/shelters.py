from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.shelter import Shelter
from app.schemas.shelter import ShelterResponse

router = APIRouter()

@router.get("/", response_model=List[ShelterResponse])
def get_shelters(db: Session = Depends(get_db)):
    shelters = db.query(Shelter).all()
    # Add calculated field for UI convenience
    for s in shelters:
        s.available_beds = max(0, s.capacity - s.current_occupancy)
    return shelters
