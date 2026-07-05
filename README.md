# BOYA SHOP (بويا شوب)

Moroccan DTC e-commerce store for car accessories — RTL Arabic storefront with Next.js frontend and FastAPI backend.

## Project structure

| Folder | Stack |
|--------|--------|
| `frontend/` | Next.js 14, React, TypeScript, Tailwind, Zustand |
| `backend/` | FastAPI, PostgreSQL, order webhooks |
| `docs/` | Architecture, CRO, deployment, and product docs |

## Quick start (frontend)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quick start (backend)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Copy `backend/.env.example` to `backend/.env` and adjust values.

## Documentation

See [`docs/README.md`](docs/README.md) for full setup, deployment, and brand guidelines.

## License

Private — all rights reserved.
