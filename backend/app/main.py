from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import get_settings
from .routes.admin import router as admin_router
from .routes.chat import router as chat_router
from .routes.health import router as health_router

settings = get_settings()

app = FastAPI(
  title=settings.app_name,
  version=settings.api_version,
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.allowed_origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(admin_router)
app.include_router(chat_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
  detail = "Invalid request body."
  is_admin_request = request.url.path.startswith("/admin/")

  for error in exc.errors():
    location = error.get("loc", ())
    field_name = location[-1] if location else None

    if field_name == "message":
      error_type = error.get("type", "")
      if error_type == "string_too_long":
        detail = f"Message must be {settings.max_message_length} characters or fewer."
      else:
        detail = "Message is required."
      break

    if is_admin_request and field_name == "question":
      detail = "Question is required."
      break

    if is_admin_request and field_name == "answer":
      detail = "Answer is required."
      break

    if is_admin_request and field_name == "keywords":
      detail = "At least one dental keyword is required."
      break

  return JSONResponse(status_code=422, content={"detail": detail})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
  if request.url.path.startswith("/admin/"):
    detail = "Something went wrong while processing the admin request."
  else:
    detail = "Something went wrong while processing the message."

  return JSONResponse(
    status_code=500,
    content={"detail": detail},
  )
