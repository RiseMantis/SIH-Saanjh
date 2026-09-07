from pydantic import field_validator
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/artisan_db"
    DATABASE_URL_SYNC: str = "postgresql://postgres:postgres@localhost:5432/artisan_db"
    
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_BUCKET: str = "artisan-media"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_HOURS: int = 24
    
    LLM_API_KEY: str = ""
    LLM_PROVIDER: str = "openai"  # openai, gemini, groq
    
    WHISPER_MODEL: str = "base"
    
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def clean_async_database_url(cls, v: str) -> str:
        if not isinstance(v, str):
            return v
        v = v.strip().strip('"').strip("'")
        if v.startswith("postgres://"):
            v = "postgresql+asyncpg://" + v[len("postgres://"):]
        elif v.startswith("postgresql://"):
            v = "postgresql+asyncpg://" + v[len("postgresql://"):]
        
        # asyncpg cleanups (sslmode -> ssl, drop channel_binding)
        if "?" in v:
            base, qs = v.split("?", 1)
            params = qs.split("&")
            clean_params = []
            for p in params:
                if p.startswith("sslmode="):
                    val = p.split("=", 1)[1]
                    clean_params.append(f"ssl={val}")
                elif p.startswith("channel_binding="):
                    continue
                else:
                    clean_params.append(p)
            v = base + ("?" + "&".join(clean_params) if clean_params else "")
        return v

    @field_validator("DATABASE_URL_SYNC", mode="before")
    @classmethod
    def clean_sync_database_url(cls, v: str) -> str:
        if not isinstance(v, str):
            return v
        v = v.strip().strip('"').strip("'")
        if v.startswith("postgresql+asyncpg://"):
            v = "postgresql://" + v[len("postgresql+asyncpg://"):]
        return v

    model_config = {"env_file": [".env", "../.env"], "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
