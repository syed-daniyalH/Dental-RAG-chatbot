# Module 2 Backend API Foundation

This folder contains the FastAPI backend foundation for the Public Dental Support Chatbot.

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

## Notes

- No OpenAI integration in this module.
- No Qdrant integration in this module.
- The backend returns structured dummy responses and safe handoff responses only.
