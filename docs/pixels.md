# Web & CAPI Pixel Integration

## Pixels to Integrate
- Facebook Pixel (web + CAPI)
- TikTok Pixel (web + CAPI)
- Snapchat Pixel (web + CAPI)

## Best Practices
- Load all web pixels deferred (after main content)
- Deduplicate events (web + CAPI)
- Use env variables for pixel IDs
- CAPI: hash all PII (SHA256)
- TikTok CAPI: normalize phone to +212… then SHA256-hash before sending
- Validate Moroccan phone numbers
- No hashing for web, only for CAPI
- Use server-side events for CAPI

## Implementation
- Web pixels: load via Next.js _document or _app, defer script
- CAPI: backend endpoints, send hashed data
- Deduplication: use event_id
- Test all events in Facebook/TikTok/Snapchat dashboards

## Example Payloads
- Facebook: {event_id, event_name, user_data (hashed)}
- TikTok: {event_id, event_name, phone: '+212...', hashed}
- Snapchat: {event_id, event_name, hashed user_data}

---

See `frontend.md` and `backend.md` for code details.