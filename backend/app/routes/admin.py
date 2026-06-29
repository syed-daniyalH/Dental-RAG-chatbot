from fastapi import APIRouter, HTTPException

from ..schemas import KnowledgeSubmissionRequest, KnowledgeSubmissionResponse
from ..services.knowledge_submission_service import submit_knowledge_submission


router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/knowledge-submissions", response_model=KnowledgeSubmissionResponse)
async def create_knowledge_submission(
  request: KnowledgeSubmissionRequest,
) -> KnowledgeSubmissionResponse:
  try:
    return submit_knowledge_submission(request)
  except ValueError as exc:
    raise HTTPException(status_code=400, detail=str(exc)) from exc
