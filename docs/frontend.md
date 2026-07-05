# Frontend Implementation Guide

## Tech Stack
- Next.js (React)
- Tailwind CSS
- Headless UI
- Zustand (state)
- React Hook Form
- Framer Motion

## Key Features
- Responsive, branded UI
- Darija copy everywhere
- Header: shopping bag (circle, brand color), logo (BOYA bold, SHOP light), menu, cart
- Homepage: hero, proof, product, benefits, UGC, testimonials, CTA, footer
- Product page: offer cards, scarcity, cross-sell, CTA, reviews, FAQ
- Cart drawer: cross-sell, offers, checkout CTA
- Checkout popup: name, address, phone (Moroccan validation), order summary, social proof, scarcity, upsell (10-15s, 99dh)
- Thank you page
- Web pixels: Facebook, TikTok, Snapchat (deferred, dedup, best practices)
- CAPI: hashing for CAPI, + for TikTok phone, deduplication
- All pixel scripts loaded deferred for speed
- All forms validated
- All text/images easily replaceable

## Design
- Brand colors: #1A73E8, #F9A825, #222, #fff
- Font: Modern, bold for BOYA, lighter for SHOP
- Section alternation: text right/image left, then opposite
- Mobile-first, then desktop

## Coding Rules
- Use TypeScript
- All components reusable
- Use env variables for API endpoints, pixel IDs
- Use Docker for local/dev
- All code production-ready

## Libraries
- Next.js, React, Tailwind, Headless UI, Zustand, React Hook Form, Framer Motion

## Pixel Integration
- Facebook, TikTok, Snapchat web pixels (deferred)
- CAPI endpoints in backend
- Deduplication logic
- TikTok phone: add + before number
- Hashing for CAPI (SHA256)

## File Structure
- `/components` — UI components
- `/pages` — Next.js pages
- `/lib` — helpers
- `/public` — static assets
- `/styles` — Tailwind config
- `/env.example` — env vars

---

See `cro.md`, `design.md`, and `backend.md` for more.