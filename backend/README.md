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

## Notes

- The `/chat` endpoint uses Qdrant retrieval when `QDRANT_URL` is configured.
- If Qdrant is not configured, the endpoint falls back to the structured dummy responses.
- If OpenAI is not configured, the backend can still use local deterministic embeddings and extractive answers for development.
- The private-information safety handoff remains active before retrieval.
