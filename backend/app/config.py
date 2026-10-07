import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FIRE-EYE Disaster Response Engine"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg2://fireuser:firepassword@127.0.0.1:5433/firedb")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "fire-eye-secret-key-for-hackathon-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    MESH_GATEWAY_NODE_ID: str = "GATEWAY-CENTRAL-01"
    DEFAULT_TTL: int = 8

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()
