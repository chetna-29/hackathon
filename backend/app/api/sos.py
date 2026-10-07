from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.sos import SOSRequest
from app.schemas.sos import SOSCreate, SOSStatusUpdate, SOSResponse
from app.services.websocket_manager import ws_manager

router = APIRouter()

@router.post("/", response_model=SOSResponse)
async def create_sos(sos_in: SOSCreate, db: Session = Depends(get_db)):
    sos_code = f"SOS-WEB-{str(uuid.uuid4())[:6].upper()}"
    new_sos = SOSRequest(
        sos_code=sos_code,
        household_code=sos_in.household_code,
        sender_device_id=sos_in.sender_device_id,
        latitude=sos_in.latitude,
        longitude=sos_in.longitude,
        emergency_type=sos_in.emergency_type,
        severity=sos_in.severity,
        status="PENDING",
        notes=sos_in.notes,
        via_mesh=sos_in.via_mesh
    )
    db.add(new_sos)
    db.commit()
    db.refresh(new_sos)

    await ws_manager.broadcast("NEW_SOS", {"sos_code": new_sos.sos_code, "severity": new_sos.severity})
    return new_sos

@router.get("/active", response_model=List[SOSResponse])
def get_active_sos(db: Session = Depends(get_db)):
    return db.query(SOSRequest).filter(SOSRequest.status.in_(["PENDING", "ASSIGNED", "DISPATCHED"])).all()

@router.patch("/{sos_id}/status", response_model=SOSResponse)
async def update_sos_status(sos_id: int, status_update: SOSStatusUpdate, db: Session = Depends(get_db)):
    sos = db.query(SOSRequest).filter(SOSRequest.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS not found")
    
    sos.status = status_update.status
    if status_update.assigned_team_id:
        sos.assigned_team_id = status_update.assigned_team_id
    if status_update.assigned_shelter_id:
        sos.assigned_shelter_id = status_update.assigned_shelter_id

    db.commit()
    db.refresh(sos)
    await ws_manager.broadcast("SOS_STATUS_UPDATED", {"sos_id": sos.id, "status": sos.status})
    return sos
