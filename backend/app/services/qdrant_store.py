from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from ..config import Settings
from .document_ingestion import DocumentChunk


@dataclass(frozen=True)
class RetrievedChunk:
  text: str
  score: float
  title: str
  category: str
  page: int | None
  source_path: str | None


class QdrantStore:
  def __init__(self, settings: Settings):
    self.settings = settings
    self._client = None

  @property
  def is_configured(self) -> bool:
    return bool(self.settings.qdrant_url)

  def ensure_collection(self) -> None:
    if not self.is_configured:
      raise RuntimeError("QDRANT_URL is not configured.")

    from qdrant_client.http.models import Distance, VectorParams

    client = self._get_client()
    if client.collection_exists(self.settings.qdrant_collection):
      return

    client.create_collection(
      collection_name=self.settings.qdrant_collection,
      vectors_config=VectorParams(size=self.settings.embedding_dimensions, distance=Distance.COSINE),
    )

  def upsert_chunks(self, chunks: list[DocumentChunk], vectors: list[list[float]]) -> None:
    if len(chunks) != len(vectors):
      raise ValueError("Chunks and vectors must have the same length.")

    from qdrant_client.http.models import PointStruct

    self.ensure_collection()
    points = [
      PointStruct(id=chunk.id, vector=vector, payload=chunk.payload)
      for chunk, vector in zip(chunks, vectors)
    ]

    self._get_client().upsert(
      collection_name=self.settings.qdrant_collection,
      points=points,
      wait=True,
    )

  def search(self, query_vector: list[float], limit: int) -> list[RetrievedChunk]:
    if not self.is_configured:
      return []

    self.ensure_collection()
    client = self._get_client()

    try:
      result = client.query_points(
        collection_name=self.settings.qdrant_collection,
        query=query_vector,
        limit=limit,
        with_payload=True,
      )
      points = result.points
    except AttributeError:
      points = client.search(
        collection_name=self.settings.qdrant_collection,
        query_vector=query_vector,
        limit=limit,
        with_payload=True,
      )

    return [self._to_retrieved_chunk(point) for point in points]

  def _get_client(self):
    if self._client is not None:
      return self._client

    from qdrant_client import QdrantClient

    if self.settings.qdrant_url == ":memory:":
      self._client = QdrantClient(location=":memory:")
      return self._client

    self._client = QdrantClient(
      url=self.settings.qdrant_url,
      api_key=self.settings.qdrant_api_key,
      timeout=self.settings.qdrant_timeout_seconds,
    )
    return self._client

  def _to_retrieved_chunk(self, point: Any) -> RetrievedChunk:
    payload = point.payload or {}
    return RetrievedChunk(
      text=str(payload.get("text", "")),
      score=float(getattr(point, "score", 0.0)),
      title=str(payload.get("source_title", "Dental Support Knowledge Base")),
      category=str(payload.get("category", "dental_claims_support")),
      page=_optional_int(payload.get("page")),
      source_path=_optional_str(payload.get("source_path")),
    )


def _optional_int(value: Any) -> int | None:
  try:
    return int(value)
  except (TypeError, ValueError):
    return None


def _optional_str(value: Any) -> str | None:
  if value is None:
    return None
  text = str(value).strip()
  return text or None
