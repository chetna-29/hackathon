import asyncio

from app.database import get_db
from app.schemas.mesh import MeshPacket, MeshPacketAck
from app.services.alerts_service import dispatch_emergency_alerts
from app.services.mesh_gateway import process_mesh_packet
from app.services.websocket_manager import publish_event
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/packet", response_model=MeshPacketAck)
async def receive_mesh_packet(packet: MeshPacket, db: Session = Depends(get_db)):
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


        asyncio.create_task(
            dispatch_emergency_alerts(
                sos_code=result["associated_sos_code"],
                severity=packet.severity,
                location_str=f"{packet.latitude}, {packet.longitude}",
                message=f"Mesh Packet received from Household {packet.household_id} with vulnerabilities: {packet.payload.vulnerabilities if packet.payload else 'None'}",
            )
        )

    return MeshPacketAck(
        status=result["status"],
        message_id=result["message_id"],
        action_taken=result["action_taken"],
        associated_sos_code=result["associated_sos_code"],
    )
