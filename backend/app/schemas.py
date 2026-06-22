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
