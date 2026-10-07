from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.mesh_message import MeshMessage
from app.models.sos import SOSRequest
from app.schemas.mesh import MeshPacket
from app.redis_client import redis_client
import uuid
import json

def process_mesh_packet(db: Session, packet: MeshPacket) -> Dict[str, Any]:
    """
    Ingests an offline mesh packet received by the gateway.
    Implements duplicate detection, store, and forwarding logic to the main SOS table.
    """
    # 1. Duplicate Detection using Redis (High Performance)
    redis_key = f"mesh_seen:{packet.message_id}"
    if redis_client.exists(redis_key):
        return {
            "status": "DUPLICATE_DROPPED",
            "message_id": packet.message_id,
            "action_taken": "Ignored",
            "associated_sos_code": None
        }

    # Cache for 24 hours
    redis_client.setex(redis_key, 86400, "seen")

    # 2. TTL Verification (though gateway is final stop)
    if packet.ttl < 0:
        return {
            "status": "TTL_EXPIRED",
            "message_id": packet.message_id,
            "action_taken": "Dropped",
            "associated_sos_code": None
        }

    # 3. Store Packet
    mesh_entry = MeshMessage(
        message_id=packet.message_id,
        sender_id=packet.sender_id,
        message_type=packet.type,
        household_code=packet.household_id,
        latitude=packet.latitude,
        longitude=packet.longitude,
        severity=packet.severity,
        ttl=packet.ttl,
        hops_trail=str(packet.hops),
        raw_payload=packet.payload.model_dump_json() if packet.payload else None
    )
    db.add(mesh_entry)
    db.flush()  # Use flush instead of commit to keep it in the same transaction

    # 4. Generate SOS Request if it's an SOS packet
    associated_sos_code = None
    if packet.type == "SOS":
        # Check if active SOS already exists for this household to avoid dups
        existing_sos = None
        if packet.household_id:
            existing_sos = db.query(SOSRequest).filter(
                SOSRequest.household_code == packet.household_id,
                SOSRequest.status.in_(["PENDING", "ASSIGNED", "DISPATCHED"])
            ).first()

        if not existing_sos:
            sos_code = f"SOS-MESH-{str(uuid.uuid4())[:6].upper()}"
            new_sos = SOSRequest(
                sos_code=sos_code,
                household_code=packet.household_id,
                sender_device_id=packet.sender_id,
                latitude=packet.latitude,
                longitude=packet.longitude,
                emergency_type="MESH_EMERGENCY",
                severity=packet.severity,
                status="PENDING",
                notes=f"Received via Offline Mesh. Hops: {len(packet.hops)}. Vulnerabilities: {', '.join(packet.payload.vulnerabilities) if packet.payload and packet.payload.vulnerabilities else 'None'}. Battery: {packet.payload.battery_level if packet.payload else 'Unknown'}%",
                via_mesh="TRUE",
                hops_count=len(packet.hops)
            )
            db.add(new_sos)
            associated_sos_code = sos_code
        else:
            associated_sos_code = existing_sos.sos_code

    db.commit()

    return {
        "status": "ACCEPTED",
        "message_id": packet.message_id,
        "action_taken": "SOS_ENQUEUED" if associated_sos_code else "STORED",
        "associated_sos_code": associated_sos_code
    }
