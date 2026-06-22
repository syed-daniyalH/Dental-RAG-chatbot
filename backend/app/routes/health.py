from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict[str, str]:
  return {
    "status": "ok",
    "service": "Public Dental Support Chatbot API",
  }


@router.get("/")
async def root() -> dict[str, str]:
  return {
    "message": "Public Dental Support Chatbot Backend is running",
  }
