from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid

from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserLogin, UserCreate, TokenResponse
from app.config import settings

router = APIRouter()

# Simplified hackathon dummy auth
@router.post("/login", response_model=TokenResponse)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    # For hackathon MVP, just accept credentials and return a token
    # In production, this would hash and verify passwords
    user = db.query(User).filter(User.username == user_credentials.username).first()
    
    if not user:
        # Auto-create for demo ease
        user = User(
            username=user_credentials.username,
            hashed_password="dummy_hash",
            role="RESCUE" if "commander" in user_credentials.username.lower() else "USER"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {
        "access_token": f"hackathon-token-{uuid.uuid4()}",
        "token_type": "bearer",
        "role": user.role,
        "username": user.username
    }
