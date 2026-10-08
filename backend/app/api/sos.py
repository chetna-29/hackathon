import uuid

from app.database import get_db
from app.models.sos import SOSRequest
from app.schemas.mesh import MeshPacket, MeshPacketAck
from app.schemas.sos import SOSCreate, SOSResponse, SOSStatusUpdate
from app.services.mesh_gateway import process_mesh_packet
from app.services.websocket_manager import publish_event
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/", response_model=SOSResponse)
async def create_sos(sos_in: SOSCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
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
        via_mesh=sos_in.via_mesh,
        source_type="MOBILE",
    )
    db.add(new_sos)
    db.commit()
    db.refresh(new_sos)

    publish_event(
        "NEW_SOS", {"sos_code": new_sos.sos_code, "severity": new_sos.severity}
    )


    from app.services.alerts_service import dispatch_emergency_alerts

    background_tasks.add_task(
        dispatch_emergency_alerts,
        sos_code=new_sos.sos_code,
        severity=new_sos.severity,
        location_str=f"{new_sos.latitude}, {new_sos.longitude}",
        message="Online SOS received",
    )

    return new_sos


@router.get("/active", response_model=list[SOSResponse])
def get_active_sos(db: Session = Depends(get_db)):
    return (
        db.query(SOSRequest)
        .filter(SOSRequest.status.in_(["PENDING", "ASSIGNED", "DISPATCHED"]))
        .all()
    )


@router.patch("/{sos_id}/status", response_model=SOSResponse)
async def update_sos_status(
    sos_id: int, status_update: SOSStatusUpdate, db: Session = Depends(get_db)
):
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
    publish_event("SOS_STATUS_UPDATED", {"sos_id": sos.id, "status": sos.status})
    return sos


@router.post("/mesh", response_model=MeshPacketAck)
async def receive_mesh_packet_sos(packet: MeshPacket, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    result = process_mesh_packet(db, packet)

    if result["action_taken"] == "SOS_ENQUEUED" and result["associated_sos_code"]:
        publish_event(
            "NEW_SOS",
            {
                "sos_code": result["associated_sos_code"],
                "severity": packet.severity,
                "via_mesh": True,
            },
        )


        from app.services.alerts_service import dispatch_emergency_alerts

        background_tasks.add_task(
            dispatch_emergency_alerts,
            sos_code=result["associated_sos_code"],
            severity=packet.severity,
            location_str=f"{packet.latitude}, {packet.longitude}",
            message=f"Mesh Packet received from Household {packet.household_code} with vulnerabilities: {packet.payload.vulnerabilities}",
        )

    return MeshPacketAck(
        status=result["status"],
        message_id=result["message_id"],
        action_taken=result["action_taken"],
        associated_sos_code=result["associated_sos_code"],
    )
