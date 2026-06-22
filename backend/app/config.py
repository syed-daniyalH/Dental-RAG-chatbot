from functools import lru_cache
from pathlib import Path
import os

from dotenv import load_dotenv
from pydantic import BaseModel, Field


BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")


def _split_origins(raw_value: str) -> list[str]:
  return [item.strip() for item in raw_value.split(",") if item.strip()]


class Settings(BaseModel):
  app_name: str = "Public Dental Support Chatbot API"
  app_env: str = "development"
  frontend_url: str = "http://localhost:3000"
  allowed_origins: list[str] = Field(default_factory=list)
  max_message_length: int = 1000
  api_version: str = "1.0.0"


@lru_cache
def get_settings() -> Settings:
  frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
  raw_allowed_origins = os.getenv("ALLOWED_ORIGINS", "")
  allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    frontend_url,
    *_split_origins(raw_allowed_origins),
  ]
  deduped_origins = list(dict.fromkeys(allowed_origins))

  return Settings(
    app_name=os.getenv("APP_NAME", "Public Dental Support Chatbot API"),
    app_env=os.getenv("APP_ENV", "development"),
    frontend_url=frontend_url,
    allowed_origins=deduped_origins,
  )
