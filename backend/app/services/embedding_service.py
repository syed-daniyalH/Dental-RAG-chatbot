from __future__ import annotations

import hashlib
import math
import re

from ..config import Settings


TOKEN_PATTERN = re.compile(r"[a-z0-9]+")


class EmbeddingService:
  def __init__(self, settings: Settings):
    self.settings = settings
    self._client = None

  def embed_query(self, text: str) -> list[float]:
    return self._embed(text)

  def embed_documents(self, texts: list[str]) -> list[list[float]]:
    if not texts:
      return []

    if self.settings.openai_api_key:
      return self._embed_with_openai(texts)

    return [self._hash_embedding(text) for text in texts]

  def _embed(self, text: str) -> list[float]:
    return self.embed_documents([text])[0]

  def _embed_with_openai(self, texts: list[str]) -> list[list[float]]:
    from openai import OpenAI

    if self._client is None:
      self._client = OpenAI(api_key=self.settings.openai_api_key)

    request = {
      "model": self.settings.openai_embedding_model,
      "input": texts,
    }

    if self.settings.embedding_dimensions:
      request["dimensions"] = self.settings.embedding_dimensions

    response = self._client.embeddings.create(**request)
    return [item.embedding for item in response.data]

  def _hash_embedding(self, text: str) -> list[float]:
    vector = [0.0] * self.settings.embedding_dimensions
    tokens = TOKEN_PATTERN.findall(text.lower())

    for token in tokens:
      digest = hashlib.sha256(token.encode("utf-8")).digest()
      index = int.from_bytes(digest[:4], "big") % self.settings.embedding_dimensions
      sign = 1.0 if digest[4] % 2 == 0 else -1.0
      vector[index] += sign

    magnitude = math.sqrt(sum(value * value for value in vector))
    if magnitude == 0:
      return vector

    return [value / magnitude for value in vector]
