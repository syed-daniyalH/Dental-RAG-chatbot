from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re
import uuid

from pypdf import PdfReader


WHITESPACE_PATTERN = re.compile(r"\s+")
SUBMISSION_BLOCK_PATTERN = re.compile(
  r"^## Submission (?P<submission_id>[^\n]+)\n(?P<body>.*?)(?=^## Submission |\Z)",
  re.MULTILINE | re.DOTALL,
)
SUBMISSION_FIELD_PATTERN = re.compile(r"^-\s*(?P<label>[^:]+):\s*(?P<value>.*)$")
SUBMISSION_APPROVED_STATUSES = {"approved", "indexed"}


@dataclass(frozen=True)
class DocumentChunk:
  id: str
  text: str
  payload: dict


@dataclass(frozen=True)
class SubmissionRecord:
  submission_id: str
  status: str
  submitted_at: str | None
  question: str
  answer: str
  keywords: list[str]
  matched_keywords: list[str]
  raw_text: str


def load_pdf_chunks(
  *,
  pdf_path: Path,
  source_title: str,
  category: str,
  chunk_size: int,
  chunk_overlap: int,
) -> list[DocumentChunk]:
  reader = PdfReader(str(pdf_path))
  chunks: list[DocumentChunk] = []

  for page_index, page in enumerate(reader.pages, start=1):
    text = _normalize_text(page.extract_text() or "")
    for chunk_index, chunk_text in enumerate(_split_text(text, chunk_size, chunk_overlap)):
      chunk_id = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{pdf_path}:{page_index}:{chunk_index}:{chunk_text[:80]}"))
      chunks.append(
        DocumentChunk(
          id=chunk_id,
          text=chunk_text,
          payload={
            "text": chunk_text,
            "source_title": source_title,
            "source_path": str(pdf_path),
            "category": category,
            "page": page_index,
            "chunk_index": chunk_index,
          },
        )
      )

  return chunks


def load_markdown_chunks(
  *,
  markdown_path: Path,
  source_title: str,
  category: str,
  chunk_size: int,
  chunk_overlap: int,
) -> list[DocumentChunk]:
  text = _normalize_text(markdown_path.read_text(encoding="utf-8"))
  chunks: list[DocumentChunk] = []

  for chunk_index, chunk_text in enumerate(_split_text(text, chunk_size, chunk_overlap)):
    chunk_id = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{markdown_path}:{chunk_index}:{chunk_text[:80]}"))
    chunks.append(
      DocumentChunk(
        id=chunk_id,
        text=chunk_text,
        payload={
          "text": chunk_text,
          "source_title": source_title,
          "source_path": str(markdown_path),
          "category": category,
          "chunk_index": chunk_index,
        },
      )
    )

  return chunks


def load_document_chunks(
  *,
  document_path: Path,
  source_title: str,
  category: str,
  chunk_size: int,
  chunk_overlap: int,
) -> list[DocumentChunk]:
  suffix = document_path.suffix.lower()

  if suffix == ".pdf":
    return load_pdf_chunks(
      pdf_path=document_path,
      source_title=source_title,
      category=category,
      chunk_size=chunk_size,
      chunk_overlap=chunk_overlap,
    )

  if suffix in {".md", ".txt"} and document_path.name == "public_dental_admin_submissions.md":
    return load_submission_markdown_chunks(
      markdown_path=document_path,
      source_title=source_title,
      category=category,
      chunk_size=chunk_size,
      chunk_overlap=chunk_overlap,
    )

  if suffix in {".md", ".txt"}:
    return load_markdown_chunks(
      markdown_path=document_path,
      source_title=source_title,
      category=category,
      chunk_size=chunk_size,
      chunk_overlap=chunk_overlap,
    )

  raise ValueError(f"Unsupported document type: {document_path.suffix}")


def load_submission_markdown_chunks(
  *,
  markdown_path: Path,
  source_title: str,
  category: str,
  chunk_size: int,
  chunk_overlap: int,
  allowed_statuses: set[str] | None = None,
) -> list[DocumentChunk]:
  text = markdown_path.read_text(encoding="utf-8")
  records = parse_submission_records(text)
  normalized_allowed_statuses = {
    status.lower() for status in (allowed_statuses or SUBMISSION_APPROVED_STATUSES)
  }
  chunks: list[DocumentChunk] = []

  for record in records:
    if record.status not in normalized_allowed_statuses:
      continue

    normalized_text = _normalize_text(record.raw_text)
    if not normalized_text:
      continue

    for chunk_index, chunk_text in enumerate(_split_text(normalized_text, chunk_size, chunk_overlap)):
      chunk_id = str(
        uuid.uuid5(
          uuid.NAMESPACE_URL,
          f"{markdown_path}:{record.submission_id}:{record.status}:{chunk_index}:{chunk_text[:80]}",
        )
      )
      chunks.append(
        DocumentChunk(
          id=chunk_id,
          text=chunk_text,
          payload={
            "text": chunk_text,
            "source_title": source_title,
            "source_path": str(markdown_path),
            "category": category,
            "submission_id": record.submission_id,
            "submitted_at": record.submitted_at,
            "question": record.question,
            "answer": record.answer,
            "keywords": record.keywords,
            "matched_keywords": record.matched_keywords,
            "status": record.status,
            "chunk_index": chunk_index,
          },
        )
      )

  return chunks


def _normalize_text(value: str) -> str:
  return WHITESPACE_PATTERN.sub(" ", value).strip()


def parse_submission_records(text: str) -> list[SubmissionRecord]:
  records: list[SubmissionRecord] = []

  for match in SUBMISSION_BLOCK_PATTERN.finditer(text):
    submission_id = match.group("submission_id").strip()
    body = match.group("body").strip()
    fields = _parse_submission_fields(body)
    status = _normalize_submission_status(fields.get("status"))

    if not submission_id or not status:
      continue

    records.append(
      SubmissionRecord(
        submission_id=submission_id,
        status=status,
        submitted_at=fields.get("submitted at") or None,
        question=fields.get("question", ""),
        answer=fields.get("answer", ""),
        keywords=_parse_csv_field(fields.get("keywords", "")),
        matched_keywords=_parse_csv_field(fields.get("matched dental terms", "")),
        raw_text=f"## Submission {submission_id}\n\n{body}".strip(),
      )
    )

  return records


def update_submission_record_status(
  *,
  markdown_path: Path,
  submission_id: str,
  status: str,
  review_note: str | None = None,
) -> SubmissionRecord | None:
  text = markdown_path.read_text(encoding="utf-8")
  block_pattern = re.compile(
    rf"(^## Submission {re.escape(submission_id)}\n.*?)(?=^## Submission |\Z)",
    re.MULTILINE | re.DOTALL,
  )
  match = block_pattern.search(text)

  if not match:
    return None

  block_text = match.group(1)
  updated_block = _replace_submission_field(block_text, "Status", status)
  if review_note is not None:
    updated_block = _replace_submission_field(
      updated_block,
      "Review note",
      review_note,
      append_if_missing=True,
    )

  updated_text = text[:match.start(1)] + updated_block + text[match.end(1):]
  markdown_path.write_text(updated_text, encoding="utf-8")

  for record in parse_submission_records(updated_text):
    if record.submission_id == submission_id:
      return record

  return None


def _parse_submission_fields(body: str) -> dict[str, str]:
  fields: dict[str, str] = {}

  for line in body.splitlines():
    match = SUBMISSION_FIELD_PATTERN.match(line.strip())
    if not match:
      continue

    fields[match.group("label").strip().lower()] = match.group("value").strip()

  return fields


def _normalize_submission_status(value: str | None) -> str:
  if not value:
    return ""

  normalized = value.strip().lower()
  return normalized.split()[0]


def _replace_submission_field(
  block_text: str,
  label: str,
  value: str,
  *,
  append_if_missing: bool = False,
) -> str:
  field_pattern = re.compile(rf"(?m)^- {re.escape(label)}: .*$")
  replacement = f"- {label}: {value}"

  if field_pattern.search(block_text):
    return field_pattern.sub(replacement, block_text, count=1)

  if append_if_missing:
    trimmed = block_text.rstrip()
    return f"{trimmed}\n{replacement}\n\n"

  return block_text


def _parse_csv_field(value: str) -> list[str]:
  if not value:
    return []

  items = []
  for entry in value.split(","):
    item = " ".join(entry.split()).strip().lower()
    if item:
      items.append(item)
  return items


def _split_text(text: str, chunk_size: int, chunk_overlap: int) -> list[str]:
  if not text:
    return []

  words = text.split()
  chunks: list[str] = []
  start = 0

  while start < len(words):
    end = min(start + chunk_size, len(words))
    chunks.append(" ".join(words[start:end]))
    if end == len(words):
      break
    start = max(end - chunk_overlap, start + 1)

  return chunks
