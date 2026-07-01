# Module 2/3 Backend API Foundation

This folder contains the FastAPI backend foundation and Qdrant-ready RAG services for the Public Dental Support Chatbot.

## Run

From the repository root:

```bash
python -m uvicorn backend.app.main:app --reload --port 8000
```

If you prefer to run it from inside `backend/`, use:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

## Endpoints

- `GET /`
- `GET /health`
- `POST /chat`
- `POST /admin/submit-knowledge`
- `POST /admin/knowledge-submissions` (legacy alias)
- `GET /admin/submissions`
- `POST /admin/submissions/{submission_id}/approve`
- `POST /admin/submissions/{submission_id}/reject`

## Environment

The backend reads these values from `backend/.env`:

- `APP_NAME`
- `APP_ENV`
- `FRONTEND_URL`
- `QDRANT_URL`
- `QDRANT_API_KEY` or `QDRANT_API_KEY_FILE`
- `QDRANT_COLLECTION`
- `OPENAI_API_KEY`
- `OPENAI_CHAT_MODEL`
- `OPENAI_EMBEDDING_MODEL`
- `RAG_TOP_K`
- `CHUNK_SIZE`
- `CHUNK_OVERLAP`
- `ADMIN_API_KEY`
- `BACKEND_URL`

Use `backend/.env.example` as the template.

## Ingest Knowledge Base

After setting `QDRANT_URL`, run this from the repository root:

```bash
python -m backend.app.scripts.ingest_knowledge_base
```

By default, this indexes:

```text
Doc/Common Dental Claims Support Guide.pdf
```

To index the public FAQ Markdown document, run:

```bash
python -m backend.app.scripts.ingest_knowledge_base --document Doc/public_dental_chatbot_faq_v1.md --title "Public Dental Chatbot FAQ" --category dental_chatbot_faq
```

User-submitted public dental Q&A entries are appended to:

```text
Doc/public_dental_admin_submissions.md
```

If you want to index that file manually, run:

```bash
python -m backend.app.scripts.ingest_knowledge_base --document Doc/public_dental_admin_submissions.md --title "User Submitted Dental Q&A" --category dental_user_submission
```

Only entries marked `approved` or `indexed` are eligible during ingestion; `pending_review` records stay out of Qdrant.

## Notes

- The `/chat` endpoint uses Qdrant retrieval when `QDRANT_URL` is configured.
- Admin routes require `x-admin-api-key` and are not publicly writable without a valid key.
- The `/admin/submit-knowledge` endpoint validates dental keywords, blocks private claim data, and stores new entries as `pending_review`.
- The `/admin/submissions` endpoint lets internal admins review pending items and mark them approved or rejected.
- Only approved or indexed submission records are eligible for later ingestion into Qdrant.
- If Qdrant is not configured, the endpoint falls back to the structured dummy responses.
- If OpenAI is not configured, the backend can still use local deterministic embeddings and extractive answers for development.
- The private-information safety handoff remains active before retrieval.
