# بويا شوب (Boya Shop) DTC Branded Store

Welcome to the documentation for building the ultimate Moroccan DTC e-commerce store, fully branded and optimized for high conversion, trust, and authority. This documentation is structured to guide your AI coder through every step, from positioning and CRO to technical stack and deployment.

## Folder Structure
- `frontend/` — Next.js, React, Tailwind, web pixel integration, responsive UI
- `backend/` — FastAPI, PostgreSQL, CAPI, order processing, webhook integration
- `docs/` — All documentation for architecture, positioning, CRO, ICP, design, coding rules, and more

## Quick Start
1. Read all docs in this folder before coding.
2. Follow architecture and design guidelines.
3. Use provided env.example files for configuration.
4. Use Docker for local development and deployment.
5. All code must be production-ready, scalable, and secure.

---

## Brand Name
- Arabic: بويا شوب
- English: Boya Shop

## Domain
- Main: boyashop.store
- Backend API: api.boyashop.store

## Database
- Name: boyashop
- Connection: `postgres://boyashop:boyashop@boyashop_database:5432/boyashop?sslmode=disable`

## Product (Initial)
- باك ضد سخونية الطوموبيل (Double fan + umbrella for cars)
- Offers: 1 piece (199 dh), 2 pieces (279 dh)

## Target Audience (ICP)
- Moroccan men & women, car owners, 20-55, urban & peri-urban

## Key Requirements
- High trust, authority, and social proof
- Emotional, pain-driven copy in Darija
- Responsive, branded, and modern UI
- High AOV with offers, cross-sells, and upsells
- Facebook, TikTok, Snapchat web & CAPI pixels (with deduplication, deferred loading, and best practices)
- Order via COD only, with validation for Moroccan phone numbers
- Checkout with upsell popup
- Orders sent to Google Sheet via webhook
- Dockerized frontend & backend
- Ready for deployment on easypanel

---

Read all other docs for detailed instructions.