import os
from typing import List
from pydantic import BaseSettings

class Settings(BaseSettings):
    # API Settings
    API_PREFIX: str = "/api"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # Next.js frontend in development
        "https://aicontentpilot.com",  # Production domain
    ]
    
    # Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # AI API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 10
    
    # Content Generation Defaults
    DEFAULT_MAX_TOKENS: int = 1000
    DEFAULT_TEMPERATURE: float = 0.7
    
    # Image Generation
    IMAGE_GENERATION_MODEL: str = "dall-e-3"
    DEFAULT_IMAGE_SIZE: str = "1024x1024"
    
    class Config:
        env_file = ".env"

settings = Settings()
