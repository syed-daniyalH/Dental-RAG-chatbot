from fastapi import APIRouter, HTTPException

from ..schemas import ChatRequest, ChatResponse
from ..services.dummy_chat_service import generate_dummy_response

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
  try:
    return generate_dummy_response(request.message)
  except Exception as exc:  # pragma: no cover - safety net
    raise HTTPException(
      status_code=500,
      detail="Something went wrong while processing the message.",
    ) from exc
