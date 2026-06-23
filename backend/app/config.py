from functools import lru_cache
from pathlib import Path
import os

from dotenv import load_dotenv
from pydantic import BaseModel, Field


BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parent
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
  qdrant_url: str | None = None
  qdrant_api_key: str | None = None
  qdrant_api_key_file: Path | None = None
  qdrant_collection: str = "dental_rag_chunks"
  qdrant_timeout_seconds: float = 10.0
  openai_api_key: str | None = None
  openai_chat_model: str = "gpt-4o-mini"
  openai_embedding_model: str = "text-embedding-3-small"
  embedding_dimensions: int = 1536
  rag_top_k: int = 4
  chunk_size: int = 800
  chunk_overlap: int = 120


def _optional_env(name: str) -> str | None:
  value = os.getenv(name)
  if value is None:
    return None
  stripped = value.strip()
  return stripped or None


def _resolve_path(raw_path: str | None) -> Path | None:
  if not raw_path:
    return None

  path = Path(raw_path).expanduser()
  if path.is_absolute():
    return path

  project_path = PROJECT_ROOT / path
  if project_path.exists():
    return project_path.resolve()

  return (BACKEND_DIR / path).resolve()


def _read_secret_file(path: Path | None) -> str | None:
  if path is None or not path.exists():
    return None
  value = path.read_text(encoding="utf-8").strip()
  return value or None


def _int_env(name: str, default: int) -> int:
  raw_value = _optional_env(name)
  if raw_value is None:
    return default
  return int(raw_value)


def _float_env(name: str, default: float) -> float:
  raw_value = _optional_env(name)
  if raw_value is None:
    return default
  return float(raw_value)


@lru_cache
def get_settings() -> Settings:
  frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
  raw_allowed_origins = os.getenv("ALLOWED_ORIGINS", "")
  qdrant_api_key_file = _resolve_path(_optional_env("QDRANT_API_KEY_FILE"))
  qdrant_api_key = _optional_env("QDRANT_API_KEY") or _read_secret_file(qdrant_api_key_file)

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
    qdrant_url=_optional_env("QDRANT_URL"),
    qdrant_api_key=qdrant_api_key,
    qdrant_api_key_file=qdrant_api_key_file,
    qdrant_collection=os.getenv("QDRANT_COLLECTION", "dental_rag_chunks"),
    qdrant_timeout_seconds=_float_env("QDRANT_TIMEOUT_SECONDS", 10.0),
    openai_api_key=_optional_env("OPENAI_API_KEY"),
    openai_chat_model=os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini"),
    openai_embedding_model=os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"),
    embedding_dimensions=_int_env("EMBEDDING_DIMENSIONS", 1536),
    rag_top_k=_int_env("RAG_TOP_K", 4),
    chunk_size=_int_env("CHUNK_SIZE", 800),
    chunk_overlap=_int_env("CHUNK_OVERLAP", 120),
  )
