from app.database import Base, SessionLocal, engine
from app.models.household import Household
from app.models.risk_zone import RiskZone
from app.models.shelter import Shelter
from app.models.user import User
from sqlalchemy.orm import Session


def seed_hackathon_demo_data(db: Session):
    print("Seeding database with FIRE-EYE Uttarakhand Demo Scenario...")

    # 1. Clear existing data
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # 2. Add Users
    admin = User(
        username="commander",
        hashed_password="hashed_pwd",
        role="ADMIN",
        full_name="Rescue Commander",
    )
    db.add(admin)

    # 3. Add Risk Zones
    zone_4 = RiskZone(
        zone_code="ZONE-04-NORTH",
        name="Rudraprayag Sector 4 Hill Range",
        risk_level="LOW",
        risk_score=0.12,
        rainfall_24h=25.0,
        slope=38.0,
        elevation=1250.0,
        population=1240,
        vulnerable_population=87,
        center_lat=30.2844,
        center_lng=78.9811,
        polygon=f"SRID=4326;POLYGON(({78.9811 - 0.01} {30.2844 - 0.01}, {78.9811 + 0.01} {30.2844 - 0.01}, {78.9811 + 0.01} {30.2844 + 0.01}, {78.9811 - 0.01} {30.2844 + 0.01}, {78.9811 - 0.01} {30.2844 - 0.01}))",
    )
    zone_2 = RiskZone(
        zone_code="ZONE-02-VALLEY",
        name="Kedarnath Valley Sector",
        risk_level="LOW",
        risk_score=0.08,
        rainfall_24h=25.0,
        slope=15.0,
        elevation=800.0,
        population=3050,
        vulnerable_population=210,
        center_lat=30.7352,
        center_lng=79.0669,
        polygon=f"SRID=4326;POLYGON(({79.0669 - 0.01} {30.7352 - 0.01}, {79.0669 + 0.01} {30.7352 - 0.01}, {79.0669 + 0.01} {30.7352 + 0.01}, {79.0669 - 0.01} {30.7352 + 0.01}, {79.0669 - 0.01} {30.7352 - 0.01}))",
    )
    db.add_all([zone_4, zone_2])

    # 4. Add Households
    h101 = Household(
        household_code="H101",
        zone_id="ZONE-04-NORTH",
        address="42 Hilltop Ridge, Rudraprayag",
        latitude=30.2846,
        longitude=78.9815,
        location="SRID=4326;POINT(78.9815 30.2846)",
        elevation=1260.0,
        members_count=4,
        elderly_count=2,
        children_count=0,
        disabled_count=1,
        medical_needs="Oxygen Concentrator",
    )
    h101.vulnerability_score = h101.calculate_vulnerability()

    h102 = Household(
        household_code="H102",
        zone_id="ZONE-04-NORTH",
        address="15 Ridge View",
        latitude=30.2840,
        longitude=78.9805,
        location="SRID=4326;POINT(78.9805 30.2840)",
        elevation=1255.0,
        members_count=3,
        elderly_count=0,
        children_count=2,
        disabled_count=0,
        medical_needs=None,
    )
    h102.vulnerability_score = h102.calculate_vulnerability()
    db.add_all([h101, h102])

    # 5. Add Shelters
    s1 = Shelter(
        shelter_code="SHELTER-ST-MARY",
        name="Rudraprayag District Shelter",
        facility_type="SHELTER",
        latitude=30.2900,
        longitude=78.9900,
        location="SRID=4326;POINT(78.9900 30.2900)",
        capacity=100,
        current_occupancy=58,
        has_medical_staff=True,
        has_power_backup=True,
        has_oxygen=True,
        is_safe=True,
    )
    db.add(s1)

    db.commit()
    print("Database seeding completed successfully.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_hackathon_demo_data(db)
    finally:
        db.close()
