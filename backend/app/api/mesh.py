from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.mesh import MeshPacket, MeshPacketAck
from app.services.mesh_gateway import process_mesh_packet
from app.services.websocket_manager import ws_manager

router = APIRouter()

@router.post("/packet", response_model=MeshPacketAck)
async def receive_mesh_packet(packet: MeshPacket, db: Session = Depends(get_db)):
    result = process_mesh_packet(db, packet)
    
    if result["action_taken"] == "SOS_ENQUEUED" and result["associated_sos_code"]:
        await ws_manager.broadcast("NEW_SOS", {
            "sos_code": result["associated_sos_code"],
            "severity": packet.severity,
            "via_mesh": True
        })
        
    return MeshPacketAck(
        status=result["status"],
        message_id=result["message_id"],
        action_taken=result["action_taken"],
        associated_sos_code=result["associated_sos_code"]
    )
