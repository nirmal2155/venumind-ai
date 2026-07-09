# 📡 VenueMind AI — API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently uses open access for hackathon demo. Production deployment should implement JWT Bearer tokens.

---

## Endpoints

### 🏥 Health Check

```http
GET /api/health
```

**Response** `200 OK`
```json
{
  "status": "OK",
  "uptime": 1234.567,
  "timestamp": "2026-07-09T10:00:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

---

### 📊 Crowd Density Telemetry

```http
GET /api/crowd/density
```

Returns real-time crowd density data from stadium CCTV edge-computing nodes.

**Response** `200 OK`
```json
{
  "timestamp": "2026-07-09T10:00:00.000Z",
  "zones": [
    { "id": "zone-a-fan-zone", "status": "CROWDED", "density": 0.92 },
    { "id": "zone-b-entry", "status": "CLEAR", "density": 0.14 },
    { "id": "zone-c-concessions", "status": "MODERATE", "density": 0.65 }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `zones[].id` | `string` | Unique zone identifier |
| `zones[].status` | `enum` | `CLEAR` \| `MODERATE` \| `CROWDED` \| `CRITICAL` |
| `zones[].density` | `float` | 0.0 (empty) to 1.0 (full capacity) |

---

### 📡 Operations Telemetry

```http
GET /api/ops/telemetry
```

Returns operational intelligence including gate flow rates, active staff, and AI-generated alerts.

**Response** `200 OK`
```json
{
  "gateFlow": { "gateId": 4, "ratePerMinute": 142, "status": "HIGH" },
  "activeStaff": { "sector": "A", "count": 18 },
  "alerts": [
    {
      "id": "alert-1",
      "type": "LOGISTICS",
      "title": "Reroute Gate 4 Overflow",
      "description": "AI recommends opening auxiliary Gate 4B...",
      "confidence": 0.96
    }
  ]
}
```

---

### 💬 AI Concierge Chat

```http
POST /api/chat
Content-Type: application/json
```

**Request Body**
```json
{
  "message": "Where is the nearest food court?"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `message` | `string` | ✅ Yes | 1–1000 characters, trimmed |

**Response** `200 OK`
```json
{
  "reply": "🍽️ Food courts on Level 2 (Gates B & C). Halal, vegetarian & vegan options available."
}
```

**Error Responses**

| Status | Condition | Response |
|--------|-----------|----------|
| `400` | Missing message | `{ "error": "Message must be a valid string" }` |
| `400` | Empty message | `{ "error": "Message cannot be empty" }` |
| `400` | Message > 1000 chars | `{ "error": "Message exceeds maximum length" }` |
| `500` | Server error | `{ "error": "Internal Server Error" }` |

---

## Security Headers

All responses include the following OWASP-recommended headers:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(self), geolocation=(self)` |

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/chat` | 30 requests | per minute per IP |
| `GET /api/*` | 120 requests | per minute per IP |
