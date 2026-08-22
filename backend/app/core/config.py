import json
from typing import List, Union, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SLA AI Enterprise Platform"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_PORT: int = 8000
    
    # Database & Cache
    DATABASE_URL: str = "sqlite:///./sla_ai.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT Authentication & Cryptography
    JWT_SECRET_KEY: str = "sla_ai_super_secret_jwt_key_2026_enterprise_production_grade"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 Hours
    
    # OAuth Provider Client Credentials
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    MICROSOFT_CLIENT_ID: Optional[str] = None
    MICROSOFT_CLIENT_SECRET: Optional[str] = None
    
    # 2FA / MFA
    MFA_ISSUER_NAME: str = "SLA AI Platform"
    
    # AI Engine Configuration
    OPENAI_API_KEY: Optional[str] = None
    AI_RISK_THRESHOLD: float = 60.0  # Selectively trigger deep AI diagnostics only for risk > 60%
    AI_COST_OPTIMIZED_MODE: bool = True
    
    # CORS Origins
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5000",
        "http://localhost:3000",
        "http://localhost:80",
        "http://localhost",
        "http://127.0.0.1:5000",
        "http://127.0.0.1:8000"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str) and v.startswith("["):
            try:
                return json.loads(v)
            except Exception:
                return [v]
        return v

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
