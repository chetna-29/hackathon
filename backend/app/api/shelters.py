from app.database import get_db
from app.models.shelter import Shelter
from app.schemas.shelter import ShelterResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=list[ShelterResponse])
def get_shelters(db: Session = Depends(get_db)):
    shelters = db.query(Shelter).all()

    for s in shelters:
        s.available_beds = max(0, s.capacity - s.current_occupancy)
    return shelters
