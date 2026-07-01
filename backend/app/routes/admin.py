from fastapi import APIRouter, Depends, HTTPException

from ..schemas import (
  KnowledgeSubmissionRecord,
  KnowledgeSubmissionRequest,
  KnowledgeSubmissionResponse,
  KnowledgeSubmissionStatus,
)
from ..dependencies.auth import require_admin_api_key
from ..services.submission_review_service import (
  approve_knowledge_submission,
  list_knowledge_submissions,
  reject_knowledge_submission,
)
from ..services.knowledge_submission_service import submit_knowledge_submission


router = APIRouter(
  prefix="/admin",
  tags=["admin"],
  dependencies=[Depends(require_admin_api_key)],
)


@router.post("/submit-knowledge", response_model=KnowledgeSubmissionResponse)
@router.post("/knowledge-submissions", response_model=KnowledgeSubmissionResponse, include_in_schema=False)
async def create_knowledge_submission(
  request: KnowledgeSubmissionRequest,
) -> KnowledgeSubmissionResponse:
  try:
    return submit_knowledge_submission(request)
  except ValueError as exc:
    raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/submissions", response_model=list[KnowledgeSubmissionRecord])
async def get_knowledge_submissions(
  submission_status: KnowledgeSubmissionStatus | None = None,
) -> list[KnowledgeSubmissionRecord]:
  return list_knowledge_submissions(status=submission_status)


@router.post("/submissions/{submission_id}/approve", response_model=KnowledgeSubmissionRecord)
async def approve_submission(
  submission_id: str,
) -> KnowledgeSubmissionRecord:
  try:
    return approve_knowledge_submission(submission_id)
  except ValueError as exc:
    raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/submissions/{submission_id}/reject", response_model=KnowledgeSubmissionRecord)
async def reject_submission(
  submission_id: str,
) -> KnowledgeSubmissionRecord:
  try:
    return reject_knowledge_submission(submission_id)
  except ValueError as exc:
    raise HTTPException(status_code=404, detail=str(exc)) from exc
