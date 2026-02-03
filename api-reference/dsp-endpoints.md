---
title: "DSP Endpoints"
description: "Endpoints that DSPs must implement to participate in Thrad auctions"
---

These endpoints must be implemented by DSPs to receive bid requests from the Thrad SSP and render winning ads.

## Authentication

The SSP authenticates to DSPs using Bearer token authentication:

```
Authorization: Bearer <dsp-api-key>
```

---

## Bid Endpoint

<Card title="POST /api/v1/dsp/bid/" icon="gavel">
  Receives bid requests from the SSP during an auction.
</Card>

### Request

```json
{
  "userId": "user_123",
  "chatId": "chat_456",
  "messages": [
    {"role": "user", "content": "Looking for running shoes", "timestamp": "2024-11-23T10:00:00Z"},
    {"role": "assistant", "content": "What's your budget?", "timestamp": "2024-11-23T10:00:15Z"}
  ],
  "production": true,
  "nAdsBefore": 2,
  "request_id": "req_abc123",
  "country_code": "US",
  "region": "California",
  "city": "San Francisco",
  "device": "mobile",
  "timezone": "America/Los_Angeles"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ✅ | Anonymous user identifier |
| chatId | string | ✅ | Conversation identifier |
| messages | array | ✅ | Conversation history |
| production | boolean | ❌ | Whether this is a production request (default: `true`) |
| nAdsBefore | integer | ❌ | Number of ads already shown in this conversation |
| request_id | string | ❌ | Client-generated request identifier for tracking |
| country_code | string | ❌ | ISO 3166-1 alpha-2 country code |
| region | string | ❌ | State/region name |
| city | string | ❌ | City name |
| device | string | ❌ | Device type: `"mobile"` or `"desktop"` |
| timezone | string | ❌ | IANA timezone identifier |

### Response

```json
{
  "status": "success",
  "data": {
    "bid": 2.50,
    "bidId": "bid_xyz789"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| bid | float | ✅ | CPM bid amount in dollars |
| bidId | string | ✅ | Unique ID to fetch ad if auction won |

### Timeout

DSPs must respond within **2.0 seconds** or the bid will be discarded.

---

## Render Endpoint

<Card title="POST /api/v1/dsp/render-ad" icon="image">
  Called after a DSP wins the auction to retrieve the ad creative.
</Card>

### Request

```json
{
  "bidId": "bid_xyz789",
  "realizedPrice": 1.80,
  "production": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| bidId | string | ✅ | The bidId from the winning bid |
| realizedPrice | float | ✅ | Clearing price (2nd price auction) |
| production | boolean | ❌ | Whether this is production (default: `true`) |

### Response

```json
{
  "status": "success",
  "data": {
    "advertiser": "Nike",
    "headline": "Run Faster",
    "description": "Premium running shoes for every terrain",
    "cta_text": "Shop Now",
    "url": "https://api.thrads.ai/api/v1/tracking/redirect/...",
    "image_url": "https://cdn.example.com/shoe.jpg"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| advertiser | string | ❌ | Advertiser name |
| headline | string | ❌ | Ad headline |
| description | string | ✅ | Ad body text |
| cta_text | string | ❌ | CTA button text |
| url | string | ✅ | Click tracking URL |
| image_url | string | ❌ | Ad image URL |

### Timeout

DSPs must respond within **1.5 seconds** or the render will fail.
