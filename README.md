# Dental RAG Chatbot

Public dental support chatbot project with a premium frontend, FastAPI backend, and Qdrant-ready RAG layer.

## What is in this repo

- `app/` - Next.js frontend for the chatbot demo
- `components/` - reusable chat UI components
- `backend/` - FastAPI backend with RAG services and Qdrant ingestion
- `Doc/` - approved public dental support documents for the knowledge base
- `lib/` - shared frontend utilities

## Current scope

- Module 1: polished frontend chatbot UI with safe public guidance
- Module 2: backend API foundation with `/health` and `/chat`
- Module 3: Qdrant-backed retrieval layer and PDF knowledge-base ingestion

## Local development

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --reload --port 8000
```

### Qdrant ingestion

Set `QDRANT_URL` in `backend/.env`, then ingest the public dental guide:

```bash
python -m backend.app.scripts.ingest_knowledge_base
```

To ingest the public FAQ Markdown document:

```bash
python -m backend.app.scripts.ingest_knowledge_base --document Doc/public_dental_chatbot_faq_v1.md --title "Public Dental Chatbot FAQ" --category dental_chatbot_faq
```

### Frontend to backend connection

Set this optional environment variable for the frontend:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## Notes

- Qdrant requires `QDRANT_URL`; the API key can be loaded from `QDRANT_API_KEY_FILE`.
- OpenAI is optional for local development. If `OPENAI_API_KEY` is missing, the backend uses local deterministic embeddings and extractive answers.
- The chatbot still blocks private claim-status requests and redirects users to human support.
