from __future__ import annotations

from typing import cast

from ..config import PROJECT_ROOT
from ..schemas import KnowledgeSubmissionRecord, KnowledgeSubmissionStatus
from .document_ingestion import (
  SubmissionRecord,
  parse_submission_records,
  update_submission_record_status,
)


SUBMISSION_DOCUMENT_PATH = PROJECT_ROOT / "Doc" / "public_dental_admin_submissions.md"


class SubmissionReviewService:
  def list_submissions(
    self,
    *,
    status: KnowledgeSubmissionStatus | None = None,
  ) -> list[KnowledgeSubmissionRecord]:
    records = parse_submission_records(self._read_document())
    if status is not None:
      records = [record for record in records if record.status == status]

    return [self._to_schema(record) for record in records]

  def approve_submission(self, submission_id: str) -> KnowledgeSubmissionRecord:
    return self._update_status(
      submission_id=submission_id,
      status="approved",
      review_note="Approved by admin review.",
    )

  def reject_submission(self, submission_id: str) -> KnowledgeSubmissionRecord:
    return self._update_status(
      submission_id=submission_id,
      status="rejected",
      review_note="Rejected by admin review.",
    )

  def _update_status(
    self,
    *,
    submission_id: str,
    status: KnowledgeSubmissionStatus,
    review_note: str,
  ) -> KnowledgeSubmissionRecord:
    record = update_submission_record_status(
      markdown_path=SUBMISSION_DOCUMENT_PATH,
      submission_id=submission_id,
      status=status,
      review_note=review_note,
    )

    if record is None:
      raise ValueError("Submission not found.")

    return self._to_schema(record)

  def _read_document(self) -> str:
    if not SUBMISSION_DOCUMENT_PATH.exists():
      return ""
    return SUBMISSION_DOCUMENT_PATH.read_text(encoding="utf-8")

  def _to_schema(self, record: SubmissionRecord) -> KnowledgeSubmissionRecord:
    return KnowledgeSubmissionRecord(
      submission_id=record.submission_id,
      status=cast(KnowledgeSubmissionStatus, record.status),
      submitted_at=record.submitted_at,
      question=record.question,
      answer=record.answer,
      keywords=record.keywords,
      matched_keywords=record.matched_keywords,
    )


def list_knowledge_submissions(
  *,
  status: KnowledgeSubmissionStatus | None = None,
) -> list[KnowledgeSubmissionRecord]:
  return SubmissionReviewService().list_submissions(status=status)


def approve_knowledge_submission(submission_id: str) -> KnowledgeSubmissionRecord:
  return SubmissionReviewService().approve_submission(submission_id)


def reject_knowledge_submission(submission_id: str) -> KnowledgeSubmissionRecord:
  return SubmissionReviewService().reject_submission(submission_id)
