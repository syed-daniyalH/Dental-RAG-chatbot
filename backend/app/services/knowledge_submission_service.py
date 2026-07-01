from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import uuid

from ..config import PROJECT_ROOT
from ..schemas import KnowledgeSubmissionRequest, KnowledgeSubmissionResponse, KnowledgeSubmissionStatus
from ..utils.safety import is_private_request, normalize_text


SUBMISSION_SOURCE_TITLE = "User Submitted Dental Q&A"
SUBMISSION_DOCUMENT_PATH = PROJECT_ROOT / "Doc" / "public_dental_admin_submissions.md"
SUBMISSION_STATUS: KnowledgeSubmissionStatus = "pending_review"

SUPPORTED_DENTAL_TERMS = (
  "dental",
  "tooth",
  "teeth",
  "gum",
  "gums",
  "crown",
  "bridge",
  "filling",
  "root canal",
  "extraction",
  "implant",
  "cleaning",
  "prophylaxis",
  "claim",
  "claims",
  "dental claim",
  "dental claims",
  "denial",
  "denied",
  "rejection",
  "rejected",
  "insurance",
  "coverage",
  "benefit",
  "benefits",
  "deductible",
  "copay",
  "coinsurance",
  "pre-authorization",
  "pre authorization",
  "preauthorization",
  "prior authorization",
  "prior auth",
  "eob",
  "procedure code",
  "cdt",
  "periodontal",
  "orthodontic",
  "denture",
  "tooth number",
  "fluoride",
  "x-ray",
  "radiograph",
)


class KnowledgeSubmissionService:
  def submit(self, request: KnowledgeSubmissionRequest) -> KnowledgeSubmissionResponse:
    keywords = [keyword.lower() for keyword in request.keywords]
    content_text = normalize_text(f"{request.question} {request.answer}")
    keyword_text = normalize_text(" ".join(keywords))
    combined_text = normalize_text(f"{content_text} {keyword_text}")

    if is_private_request(combined_text):
      raise ValueError(
        "Private claim, insurance, or patient details cannot be uploaded to the knowledge base."
      )

    content_matches = _matched_dental_terms(content_text)
    if not content_matches:
      raise ValueError(
        "The question or answer must include dental terms such as claim, crown, tooth, gum, insurance, or pre-authorization."
      )

    keyword_matches = _matched_dental_terms(keyword_text)
    if not keyword_matches:
      raise ValueError(
        "Keywords must include dental terms such as claim, crown, tooth, gum, insurance, or pre-authorization."
      )

    matched_keywords = _dedupe_terms([*content_matches, *keyword_matches])

    submission_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")

    record_text = _format_submission_record(
      submission_id=submission_id,
      timestamp=timestamp,
      question=request.question,
      answer=request.answer,
      keywords=keywords,
      matched_keywords=matched_keywords,
    )

    _append_submission_record(SUBMISSION_DOCUMENT_PATH, record_text)

    return KnowledgeSubmissionResponse(
      submission_id=submission_id,
      status=SUBMISSION_STATUS,
      message="Knowledge submitted for review.",
      indexed=False,
      source_title=SUBMISSION_SOURCE_TITLE,
      matched_keywords=matched_keywords,
    )


def submit_knowledge_submission(request: KnowledgeSubmissionRequest) -> KnowledgeSubmissionResponse:
  return KnowledgeSubmissionService().submit(request)


def _matched_dental_terms(value: str) -> list[str]:
  matches: list[str] = []
  for term in SUPPORTED_DENTAL_TERMS:
    if term in value and term not in matches:
      matches.append(term)
  return matches


def _dedupe_terms(values: list[str]) -> list[str]:
  deduped: list[str] = []
  for value in values:
    if value not in deduped:
      deduped.append(value)
  return deduped


def _format_submission_record(
  *,
  submission_id: str,
  timestamp: str,
  question: str,
  answer: str,
  keywords: list[str],
  matched_keywords: list[str],
) -> str:
  keyword_text = ", ".join(keywords)
  matched_text = ", ".join(matched_keywords)
  return (
    f"## Submission {submission_id}\n\n"
    f"- Submitted at: {timestamp}\n"
    f"- Status: {SUBMISSION_STATUS}\n"
    f"- Question: {question}\n"
    f"- Answer: {answer}\n"
    f"- Keywords: {keyword_text}\n"
    f"- Matched dental terms: {matched_text}\n"
    f"- Review note: Submitted through the admin review queue.\n\n"
  )


def _append_submission_record(path: Path, record_text: str) -> None:
  path.parent.mkdir(parents=True, exist_ok=True)
  if not path.exists():
    path.write_text(
      (
        "# Public Dental Q&A Submissions\n"
        "This file stores admin-reviewed public dental Q&A submissions for later ingestion into the knowledge base.\n"
        "Pending review entries are kept here until they are approved for indexing.\n\n"
      ),
      encoding="utf-8",
    )

  with path.open("a", encoding="utf-8") as handle:
    handle.write(record_text)
