from __future__ import annotations

import argparse
from pathlib import Path

from ..config import PROJECT_ROOT, get_settings
from ..services.document_ingestion import load_pdf_chunks
from ..services.embedding_service import EmbeddingService
from ..services.qdrant_store import QdrantStore


DEFAULT_PDF_PATH = PROJECT_ROOT / "Doc" / "Common Dental Claims Support Guide.pdf"


def main() -> None:
  parser = argparse.ArgumentParser(description="Ingest the public dental support PDF into Qdrant.")
  parser.add_argument("--pdf", type=Path, default=DEFAULT_PDF_PATH)
  parser.add_argument("--title", default="Common Dental Claims Support Guide")
  parser.add_argument("--category", default="dental_claims_support")
  parser.add_argument("--batch-size", type=int, default=32)
  args = parser.parse_args()

  settings = get_settings()
  if not settings.qdrant_url:
    raise SystemExit("QDRANT_URL is required before ingesting documents into Qdrant.")

  pdf_path = args.pdf if args.pdf.is_absolute() else PROJECT_ROOT / args.pdf
  if not pdf_path.exists():
    raise SystemExit(f"PDF not found: {pdf_path}")

  chunks = load_pdf_chunks(
    pdf_path=pdf_path,
    source_title=args.title,
    category=args.category,
    chunk_size=settings.chunk_size,
    chunk_overlap=settings.chunk_overlap,
  )

  embeddings = EmbeddingService(settings)
  store = QdrantStore(settings)

  for start in range(0, len(chunks), args.batch_size):
    batch = chunks[start : start + args.batch_size]
    vectors = embeddings.embed_documents([chunk.text for chunk in batch])
    store.upsert_chunks(batch, vectors)
    print(f"Indexed {min(start + len(batch), len(chunks))}/{len(chunks)} chunks")

  print(
    f"Finished indexing {len(chunks)} chunks into collection "
    f"'{settings.qdrant_collection}'."
  )


if __name__ == "__main__":
  main()
