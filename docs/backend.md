# Backend Implementation Guide

## Tech Stack
- FastAPI (Python)
- PostgreSQL (boyashop)
- SQLAlchemy, Pydantic
- Uvicorn
- Google Sheets API (webhook)
- Docker

## Key Features
- API for orders, products, offers
- Order validation (Moroccan phone, required fields)
- Store orders in DB
- Webhook to Google Sheet (send all order info)
- CAPI endpoints for Facebook, TikTok, Snapchat (with hashing, dedup, + for TikTok phone)
- Database migration on start
- Env variables for secrets, DB, pixel IDs
- Docker for local/dev
- Ready for deployment on easypanel

## Coding Rules
- Use Python 3.11+
- All endpoints documented (OpenAPI)
- Use env variables for all secrets
- Validate all inputs
- Hashing for CAPI (SHA256)
- Deduplication logic for pixels
- Logging for all events

## File Structure
- `/app` — FastAPI app
- `/models` — SQLAlchemy models
- `/schemas` — Pydantic schemas
- `/api` — endpoints
- `/services` — business logic
- `/migrations` — Alembic
- `/env.example` — env vars

## Database
- Name: boyashop
- Connection: `postgres://boyashop:boyashop@boyashop_database:5432/boyashop?sslmode=disable`

---

See `architecture.md` and `frontend.md` for more.