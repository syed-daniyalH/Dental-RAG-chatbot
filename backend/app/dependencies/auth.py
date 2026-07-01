from __future__ import annotations

from secrets import compare_digest

from fastapi import Header, HTTPException, status

from ..config import get_settings


def require_admin_api_key(x_admin_api_key: str | None = Header(default=None)) -> None:
  settings = get_settings()
  expected_api_key = settings.admin_api_key or ""
  provided_api_key = x_admin_api_key or ""

  if not expected_api_key or not provided_api_key:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Admin access required.",
    )

  if not compare_digest(provided_api_key, expected_api_key):
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Admin access required.",
    )
