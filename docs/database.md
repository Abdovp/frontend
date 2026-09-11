# Database Schema & Migration

## Database (PostgreSQL)

Use a managed PostgreSQL service or a private database instance that is reachable by the backend. Keep the database credentials in environment variables and avoid hardcoding them in the app.

### Recommended layout

- `backend` — FastAPI app, port 8000
- `frontend` — Next.js app on Vercel, port 3000
- `database` — PostgreSQL service

Use the connection string provided by your hosting or database provider.

Example:
`postgresql://postgres:YOUR_PASSWORD@host:5432/boya-shop?sslmode=disable`

## Tables
### products
- id (PK)
- name_ar
- name_en
- description_ar
- description_en
- price_1_piece
- price_2_pieces
- images (array)
- created_at

### orders
- id (PK)
- event_id (unique, for pixel dedup)
- customer_name, address, phone
- total, status, created_at

### order_items
- id (PK)
- order_id (FK → orders)
- product_id, product_name, offer, quantity, unit_price, line_total, is_upsell

### tracking_events
- id (PK)
- event_id, event_name
- order_id (FK, optional)
- event_data (JSON)
- platforms (CAPI channels sent)
- created_at

## API
- `POST /api/orders` — create order + order_items + CAPI Purchase
- `POST /api/events` — store PageView, ViewContent, AddToCart, InitiateCheckout
- `GET /health/db` — returns counts: orders, order_items, tracking_events

## Migration
- Use Alembic for migrations
- Run migration on backend start

---

See `backend.md` for more.