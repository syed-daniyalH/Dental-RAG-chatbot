from typing import Literal

from pydantic import BaseModel, Field, field_validator


class SourceCitation(BaseModel):
  title: str
  category: str
  description: str | None = None


class ChatRequest(BaseModel):
  message: str = Field(..., max_length=1000)

  @field_validator("message")
  @classmethod
  def validate_message(cls, value: str) -> str:
    normalized = " ".join(value.split()).strip()
    if not normalized:
      raise ValueError("Message is required.")
    return normalized


class ChatResponse(BaseModel):
  answer: str
  sources: list[SourceCitation] = Field(default_factory=list)
  handoff_required: bool
  response_type: Literal["general_guidance", "safe_handoff", "error"]


KnowledgeSubmissionStatus = Literal["pending_review", "approved", "rejected", "indexed"]


class KnowledgeSubmissionRequest(BaseModel):
  question: str = Field(..., max_length=500)
  answer: str = Field(..., max_length=2000)
  keywords: list[str] = Field(default_factory=list)

  @field_validator("question", "answer")
  @classmethod
  def normalize_text_field(cls, value: str) -> str:
    normalized = " ".join(value.split()).strip()
    if not normalized:
      raise ValueError("This field is required.")
    return normalized

  @field_validator("keywords", mode="before")
  @classmethod
  def parse_keywords(cls, value):
    if value is None:
      return []

    if isinstance(value, str):
      raw_values = value.split(",")
    elif isinstance(value, (list, tuple, set)):
      raw_values = list(value)
    else:
      raise ValueError("Keywords must be a comma-separated string or list of strings.")

    normalized: list[str] = []
    seen: set[str] = set()
    for item in raw_values:
      keyword = " ".join(str(item).split()).strip().lower()
      if not keyword or keyword in seen:
        continue
      seen.add(keyword)
      normalized.append(keyword)

    return normalized

  @field_validator("keywords")
  @classmethod
  def validate_keywords(cls, value: list[str]) -> list[str]:
    if not value:
      raise ValueError("At least one dental keyword is required.")

    if len(value) > 8:
      raise ValueError("Use 8 dental keywords or fewer.")

    for keyword in value:
      if len(keyword) > 40:
        raise ValueError("Each keyword must be 40 characters or fewer.")

    return value


class KnowledgeSubmissionResponse(BaseModel):
  submission_id: str
  status: KnowledgeSubmissionStatus
  message: str
  indexed: bool
  source_title: str
  matched_keywords: list[str] = Field(default_factory=list)


class KnowledgeSubmissionRecord(BaseModel):
  submission_id: str
  status: KnowledgeSubmissionStatus
  submitted_at: str | None = None
  question: str
  answer: str
  keywords: list[str] = Field(default_factory=list)
  matched_keywords: list[str] = Field(default_factory=list)
