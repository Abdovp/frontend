# Database Schema & Migration

## Database (EasyPanel)

**Important:** PostgreSQL must be in the **same project** as the backend (`boya-shop`).  
Each project has its own Docker network — `boya_database` is **not** reachable from `boya-shop` backend.

### Recommended layout (one project)

Project **`boya-shop`**:
- `database` — PostgreSQL
- `backend` — App, port 8000
- `frontend` — App, port 3000

Internal host: `boya-shop_database`  
Copy **Internal Connection URL** from EasyPanel → `boya-shop` → `database` → Credentials.

Example:
`postgresql://postgres:YOUR_PASSWORD@boya-shop_database:5432/boya-shop?sslmode=disable`

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