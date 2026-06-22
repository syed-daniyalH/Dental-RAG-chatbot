# Dental RAG Chatbot

Public dental support chatbot project with a premium frontend and a FastAPI backend foundation.

## What is in this repo

- `app/` - Next.js frontend for the chatbot demo
- `components/` - reusable chat UI components
- `backend/` - FastAPI backend foundation for Module 2
- `lib/` - shared frontend utilities

## Current scope

- Module 1: polished frontend chatbot UI with safe public guidance
- Module 2: backend API foundation with `/health` and `/chat`

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

### Frontend to backend connection

Set this optional environment variable for the frontend:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## Notes

- No OpenAI integration in the current modules.
- No Qdrant integration in the current modules.
- The backend returns structured dummy responses and safe handoff responses only.
