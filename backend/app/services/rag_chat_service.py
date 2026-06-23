from __future__ import annotations

from ..config import Settings, get_settings
from ..schemas import ChatResponse, SourceCitation
from ..utils.safety import is_private_request
from .dummy_chat_service import generate_dummy_response
from .embedding_service import EmbeddingService
from .qdrant_store import QdrantStore, RetrievedChunk


SAFE_HANDOFF_RESPONSE = (
  "I'm sorry, but I can't check personal claim status or access private insurance records. "
  "For exact claim details, please contact your dental office, billing team, or insurance carrier. "
  "I can still explain general reasons why a dental claim may be delayed, rejected, or denied."
)


class RagChatService:
  def __init__(self, settings: Settings):
    self.settings = settings
    self.embeddings = EmbeddingService(settings)
    self.store = QdrantStore(settings)
    self._openai_client = None

  def generate_response(self, message: str) -> ChatResponse:
    if is_private_request(message):
      return ChatResponse(
        answer=SAFE_HANDOFF_RESPONSE,
        sources=[],
        handoff_required=True,
        response_type="safe_handoff",
      )

    if not self.store.is_configured:
      return generate_dummy_response(message)

    chunks = self.store.search(
      query_vector=self.embeddings.embed_query(message),
      limit=self.settings.rag_top_k,
    )

    if not chunks:
      return generate_dummy_response(message)

    if self.settings.openai_api_key:
      answer = self._generate_openai_answer(message, chunks)
    else:
      answer = self._generate_extractive_answer(message, chunks)

    return ChatResponse(
      answer=answer,
      sources=self._source_citations(chunks),
      handoff_required=False,
      response_type="general_guidance",
    )

  def _generate_openai_answer(self, message: str, chunks: list[RetrievedChunk]) -> str:
    from openai import OpenAI

    if self._openai_client is None:
      self._openai_client = OpenAI(api_key=self.settings.openai_api_key)

    prompt = (
      "You are Dental Support Assistant, a public dental claims support chatbot. "
      "Use only the provided public knowledge-base context. Give general guidance only. "
      "Do not ask for private patient, subscriber, insurance, claim, or medical information. "
      "If exact claim status, coverage, coding decisions, or private account details are needed, "
      "direct the user to their dental office, billing team, or insurance carrier.\n\n"
      f"User question:\n{message}\n\n"
      f"Knowledge-base context:\n{self._format_context(chunks)}\n\n"
      "Write a calm, professional answer with practical next steps."
    )

    response = self._openai_client.responses.create(
      model=self.settings.openai_chat_model,
      input=prompt,
    )
    return response.output_text.strip()

  def _generate_extractive_answer(self, message: str, chunks: list[RetrievedChunk]) -> str:
    best_chunk = chunks[0]
    return (
      "Based on the public dental claims support guide, here is the most relevant general guidance:\n\n"
      f"{best_chunk.text}\n\n"
      "For exact claim details, benefit decisions, or account-specific status, contact your dental office, "
      "billing team, or insurance carrier."
    )

  def _format_context(self, chunks: list[RetrievedChunk]) -> str:
    sections = []
    for index, chunk in enumerate(chunks, start=1):
      page_label = f", page {chunk.page}" if chunk.page else ""
      sections.append(f"[Source {index}: {chunk.title}{page_label}]\n{chunk.text}")
    return "\n\n".join(sections)

  def _source_citations(self, chunks: list[RetrievedChunk]) -> list[SourceCitation]:
    citations: list[SourceCitation] = []
    seen: set[tuple[str, str, int | None]] = set()

    for chunk in chunks:
      key = (chunk.title, chunk.category, chunk.page)
      if key in seen:
        continue
      seen.add(key)
      page_label = f"Page {chunk.page}." if chunk.page else None
      citations.append(
        SourceCitation(
          title=chunk.title,
          category=chunk.category,
          description=page_label or "Retrieved from the approved public dental knowledge base.",
        )
      )

    return citations


def generate_rag_response(message: str) -> ChatResponse:
  return RagChatService(get_settings()).generate_response(message)
