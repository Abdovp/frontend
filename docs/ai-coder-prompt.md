# Prompt for AI Coder

You are tasked with building a DTC e-commerce store for Morocco, fully branded and optimized for high conversion, trust, and authority. All documentation is provided in the `docs/` folder. Follow every instruction and guideline strictly. The stack is Next.js (frontend), FastAPI (backend), PostgreSQL (boyashop), Docker, and all pixel integrations. The store is COD only, with a focus on Moroccan Darija, emotional selling, and social proof. All code must be production-ready, scalable, and secure.

## Steps
1. Read all docs in the `docs/` folder:
   - `README.md` — Overview
   - `architecture.md` — Tech stack & structure
   - `positioning.md` — Brand positioning & messaging
   - `icp.md` — Ideal customer profile
   - `cro.md` — Conversion optimization
   - `frontend.md` — Frontend implementation
   - `backend.md` — Backend implementation
   - `design.md` — Design system
   - `selling-with-emotion.md` — Emotional selling
   - `social-proof.md` — Social proof
   - `pixels.md` — Pixel integration
   - `database.md` — DB schema & migration
   - `skills.md` — Required skills
   - `coding-rules.md` — Coding rules
   - `env-frontend.example.md` — Frontend env vars
   - `env-backend.example.md` — Backend env vars
   - `pages.md` — Pages & structure
   - `sheet-template.csv` — Google Sheet columns
   - `deployment.md` — Deployment guide
   - `offer-pricing.md` — Offers & pricing
2. Build the frontend and backend in their respective folders, following all docs.
3. Use Docker for both frontend and backend.
4. Use env variables as per examples.
5. Integrate all pixels (web + CAPI) with deduplication and best practices.
6. Validate all forms, especially Moroccan phone numbers.
7. Orders must be sent to Google Sheet via webhook.
8. All code must be ready for GitHub and deployment on easypanel.
9. Use the provided sheet template for order export.

## Brand
- Name: بويا شوب / Boya Shop
- Domain: boyashop.store
- Backend: api.boyashop.store

## Database
- Name: boyashop
- Connection: postgres://boyashop:boyashop@boyashop_database:5432/boyashop?sslmode=disable

## Product
- باك ضد سخونية الطوموبيل (Double fan + umbrella for cars)
- Offers: 1 piece (199 dh), 2 pieces (279 dh)

---

**Start by reading all docs in the `docs/` folder. Build everything as specified.**
