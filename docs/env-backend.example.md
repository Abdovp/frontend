# Backend .env.example

APP_ENV=production
APP_NAME=Boya Shop API
API_BASE_URL=https://api.boyashop.store
FRONTEND_URL=https://boyashop.store

DATABASE_URL=postgres://postgres:YOUR_PASSWORD@boya-shop_database:5432/boya-shop?sslmode=disable

# Leave false on serverless/Vercel so root and health routes still work even if DB is slow/down.
# Enable only on environments where startup migrations/init are expected.
ENABLE_DB_INIT_ON_STARTUP=false

CORS_ORIGINS=https://boyashop.store,https://www.boyashop.store,http://localhost:3000

GOOGLE_SHEETS_WEBHOOK_URL=

# Customer WhatsApp notification after an order is created.
# Required only when WHATSAPP_ENABLED=true.
WHATSAPP_ENABLED=false
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_API_VERSION=v20.0

META_PIXEL_ID=
META_ACCESS_TOKEN=
META_API_VERSION=v20.0

TIKTOK_PIXEL_CODE=
TIKTOK_ACCESS_TOKEN=
TIKTOK_API_VERSION=v1.3

SNAP_PIXEL_ID=
SNAP_ACCESS_TOKEN=

ENABLE_CAPI=true
ENABLE_META_CAPI=true
ENABLE_TIKTOK_CAPI=true
ENABLE_SNAP_CAPI=true

# Admin dashboard login (required for /api/admin/*)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-to-a-strong-password
ADMIN_JWT_SECRET=change-me-to-a-long-random-secret-key
ADMIN_JWT_EXPIRE_HOURS=24
