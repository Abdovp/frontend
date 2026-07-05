# Architecture Overview

## Tech Stack
- **Frontend:** Next.js (React), Tailwind CSS, Headless UI, Zustand (state), React Hook Form, Framer Motion (animations)
- **Backend:** FastAPI (Python), PostgreSQL, SQLAlchemy, Pydantic, Uvicorn, Google Sheets API (webhook)
- **DevOps:** Docker, GitHub Actions, Easypanel

## Structure
- `frontend/` — All UI, pixel scripts, cart logic, checkout, responsive design
- `backend/` — API, DB, order processing, webhook, CAPI endpoints
- `docs/` — Documentation

## Data Flow
1. User browses products, adds to cart (frontend)
2. Cart drawer shows cross-sells, offers
3. Checkout popup collects info, validates Moroccan phone
4. Order sent to backend API
5. Backend stores order, triggers webhook to Google Sheet
6. CAPI events sent to Facebook/TikTok/Snapchat

## Security & Performance
- Use HTTPS everywhere
- Defer pixel scripts for speed
- Validate all inputs (especially phone)
- Use env variables for secrets
- Dockerize for easy deployment

---

See `frontend.md` and `backend.md` for implementation details.