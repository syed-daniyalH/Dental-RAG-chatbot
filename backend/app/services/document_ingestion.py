from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re
import uuid

from pypdf import PdfReader


WHITESPACE_PATTERN = re.compile(r"\s+")


@dataclass(frozen=True)
class DocumentChunk:
  id: str
  text: str
  payload: dict


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

  if suffix in {".md", ".txt"}:
    return load_markdown_chunks(
      markdown_path=document_path,
      source_title=source_title,
      category=category,
      chunk_size=chunk_size,
      chunk_overlap=chunk_overlap,
    )

  raise ValueError(f"Unsupported document type: {document_path.suffix}")


def _normalize_text(value: str) -> str:
  return WHITESPACE_PATTERN.sub(" ", value).strip()


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
