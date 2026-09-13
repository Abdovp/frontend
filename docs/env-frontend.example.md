# Frontend .env.example

# Backend API (orders + tracking events)
NEXT_PUBLIC_API_URL=https://api.boyashop.store

# Optional server-side order backup sink used by /api/orders when backend returns 5xx.
# Set this to your Google Apps Script webhook URL to avoid losing orders during DB/API incidents.
ORDER_FALLBACK_WEBHOOK_URL=

# Backward-compatible aliases also supported by the fallback capture:
GOOGLE_SHEETS_WEBHOOK_URL=
GOOGLE_SHEET_WEBHOOK_URL=

# Public storefront URL
NEXT_PUBLIC_SITE_URL=https://boyashop.store
NEXT_PUBLIC_DOMAIN=boyashop.store

# Web pixels (deferred): PageView, ViewContent, AddToCart, InitiateCheckout, Purchase
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=

# Brand tokens
NEXT_PUBLIC_BRAND_COLOR=#1A73E8
NEXT_PUBLIC_ACCENT_COLOR=#F9A825
