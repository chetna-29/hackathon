import uuid
from typing import Any

from app.models.mesh_message import MeshMessage
from app.models.sos import SOSRequest
from app.redis_client import redis_client
from app.schemas.mesh import MeshPacket
from app.services.ml_service import predict_risk_at_location
from app.services.priority_engine import calculate_priority_score
from sqlalchemy.orm import Session


def process_mesh_packet(db: Session, packet: MeshPacket) -> dict[str, Any]:
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
            "associated_sos_code": None,
        }

    # Cache for 24 hours
    redis_client.setex(redis_key, 86400, "seen")

    # 2. TTL Verification (though gateway is final stop)
    if packet.ttl < 0:
        return {
            "status": "TTL_EXPIRED",
            "message_id": packet.message_id,
            "action_taken": "Dropped",
            "associated_sos_code": None,
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
        raw_payload=packet.payload.model_dump_json() if packet.payload else None,
    )
    db.add(mesh_entry)
    db.flush()  # Use flush instead of commit to keep it in the same transaction

    # 4. Generate SOS Request if it's an SOS packet
    associated_sos_code = None
    if packet.type == "SOS":
        # Check if active SOS already exists for this household to avoid dups
        existing_sos = None
        if packet.household_id:
            existing_sos = (
                db.query(SOSRequest)
                .filter(
                    SOSRequest.household_code == packet.household_id,
                    SOSRequest.status.in_(["PENDING", "ASSIGNED", "DISPATCHED"]),
                )
                .first()
            )

        if not existing_sos:
            sos_code = f"SOS-MESH-{str(uuid.uuid4())[:6].upper()}"

            # Predict Risk & Calculate Priority
            ml_risk = predict_risk_at_location(packet.latitude, packet.longitude)

            # Medical urgency extraction from vulnerabilities
            medical_text = (
                ", ".join(packet.payload.vulnerabilities)
                if packet.payload and packet.payload.vulnerabilities
                else ""
            )

            # Use default vulnerability/isolation for unknown hardware nodes, can adjust if household found
            vuln_score = 0.5
            if packet.payload and packet.payload.vulnerabilities:
                vuln_score = (
                    0.8  # Boost vulnerability if specifically reported from hardware
                )

            scores = calculate_priority_score(
                severity=packet.severity,
                vulnerability_score=vuln_score,
                zone_risk_score=0.5,  # Default since we don't fetch zone here
                isolation_score=0.7,
                time_decay=0.0,  # Fresh
                medical_urgency=0.0,  # Handled by priority_engine queue run mostly, but we can try to pass some
                ml_risk=ml_risk,
            )

            new_sos = SOSRequest(
                sos_code=sos_code,
                household_code=packet.household_id,
                sender_device_id=packet.sender_id,
                latitude=packet.latitude,
                longitude=packet.longitude,
                location=f"SRID=4326;POINT({packet.longitude} {packet.latitude})",
                emergency_type="MESH_EMERGENCY",
                severity=packet.severity,
                status="PENDING",
                source_type="HARDWARE",
                priority_score=scores["total_score"],
                notes=f"Received via Offline Mesh. Hops: {len(packet.hops)}. Vulnerabilities: {medical_text or 'None'}. Battery: {packet.payload.battery_level if packet.payload else 'Unknown'}%",
                via_mesh="TRUE",
                hops_count=len(packet.hops),
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
        "associated_sos_code": associated_sos_code,
    }
