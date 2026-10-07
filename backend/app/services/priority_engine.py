from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.sos import SOSRequest
from app.models.household import Household
from app.models.risk_zone import RiskZone

SEVERITY_WEIGHTS = {
    "CRITICAL": 1.0,
    "HIGH": 0.75,
    "MEDIUM": 0.50,
    "LOW": 0.25
}

def calculate_priority_score(
    severity: str,
    vulnerability_score: float,
    zone_risk_score: float,
    isolation_score: float = 0.7
) -> Dict[str, float]:
    """
    Computes priority based on the FIRE-EYE multi-factor priority formula:
    Priority = Severity * 40 + Vulnerability * 30 + Risk * 20 + Isolation * 10
    Max score: 100.0
    """
    sev_factor = SEVERITY_WEIGHTS.get(severity.upper(), 0.5)
    
    comp_severity = round(sev_factor * 40.0, 1)
    comp_vulnerability = round(min(max(vulnerability_score, 0.0), 1.0) * 30.0, 1)
    comp_risk = round(min(max(zone_risk_score, 0.0), 1.0) * 20.0, 1)
    comp_isolation = round(min(max(isolation_score, 0.0), 1.0) * 10.0, 1)

    total_score = round(comp_severity + comp_vulnerability + comp_risk + comp_isolation, 1)

    return {
        "total_score": total_score,
        "comp_severity": comp_severity,
        "comp_vulnerability": comp_vulnerability,
        "comp_risk": comp_risk,
        "comp_isolation": comp_isolation
    }


def compute_ranked_rescue_queue(db: Session) -> List[Dict[str, Any]]:
    """
    Fetches all active (PENDING / ASSIGNED / DISPATCHED) SOS calls,
    evaluates live priority scores against current household & risk zone state,
    and returns sorted queue ranked #1 to #N.
    """
    active_sos = db.query(SOSRequest).filter(
        SOSRequest.status.in_(["PENDING", "ASSIGNED", "DISPATCHED"])
    ).all()

    queue_items = []

    for sos in active_sos:
        # Fetch associated household if present
        household = None
        if sos.household_code:
            household = db.query(Household).filter(Household.household_code == sos.household_code).first()

        vuln_score = household.vulnerability_score if household else 0.5
        
        # Check if located inside a risk zone
        zone = None
        if household:
            zone = db.query(RiskZone).filter(RiskZone.zone_code == household.zone_id).first()
        
        risk_score = zone.risk_score if zone else 0.4
        isolation = 0.85 if (household and household.elevation > 1100) else 0.60

        scores = calculate_priority_score(
            severity=sos.severity,
            vulnerability_score=vuln_score,
            zone_risk_score=risk_score,
            isolation_score=isolation
        )

        # Update in-memory / db priority score
        sos.priority_score = scores["total_score"]

        queue_items.append({
            "sos_id": sos.id,
            "sos_code": sos.sos_code,
            "household_code": sos.household_code,
            "priority_score": scores["total_score"],
            "severity": sos.severity,
            "severity_component": scores["comp_severity"],
            "vulnerability_component": scores["comp_vulnerability"],
            "risk_component": scores["comp_risk"],
            "isolation_component": scores["comp_isolation"],
            "latitude": sos.latitude,
            "longitude": sos.longitude,
            "emergency_type": sos.emergency_type,
            "status": sos.status,
            "elderly_count": household.elderly_count if household else 0,
            "disabled_count": household.disabled_count if household else 0,
            "medical_needs": household.medical_needs if household else None,
            "created_at": sos.created_at
        })

    # Sort descending by priority score
    queue_items.sort(key=lambda x: x["priority_score"], reverse=True)

    # Assign ranks 1 to N
    for index, item in enumerate(queue_items, start=1):
        item["rank"] = index

    db.commit()
    return queue_items
