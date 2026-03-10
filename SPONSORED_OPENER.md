# Sponsored Prompt (Sponsored Opener)

Brand sponsors a conversation opener prompt. User sees it before any conversation starts; if they click it, the chatbot responds normally plus an appended brand message/CTA.

---

## User Experience

```
┌──────────────────────────────────────────────┐
│  Chatbot UI                                  │
│                                              │
│  💬 Suggested prompts:                       │
│  ┌────────────────────────────────────────┐  │
│  │ "What are the best running shoes       │  │
│  │  for marathons?"         Sponsored 🏃  │  │
│  └────────────────────────────────────────┘  │
│  ┌──────────────────────┐                    │
│  │ "Tell me about AI"   │  (organic)         │
│  └──────────────────────┘                    │
└──────────────────────────────────────────────┘
              │
              │ User clicks sponsored prompt
              ▼
┌──────────────────────────────────────────────┐
│  User: "What are the best running shoes      │
│         for marathons?"                      │
│                                              │
│  Assistant: "Great question! Here are..."    │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ 🏃 Sponsored by Nike                   │  │
│  │ Check out the Nike Air Zoom Alphafly   │  │
│  │                        [Shop Now →]    │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## What We Need to Measure

Two click rates:

1. **Prompt click rate** — how often users click the sponsored prompt (out of impressions)
2. **Ad click rate** — how often users click the CTA / product link (out of prompt clicks)

```
Prompt shown (impression)
  └─ User clicks prompt  →  "prompt_click" — publisher calls us
       └─ User clicks CTA  →  "redirect" (existing click tracking)
```

---

## Request / Response

### Request (Publisher → SSP)

```json
{
  "userId": "user_123",
  "production": true,
  "ad_format": "sponsored_prompt"
}
```

Minimal — no messages needed, this is a chat opener.

### Response (SSP → Publisher)

Returns 3–5 sponsor prompts:

```json
{
  "requestId": "api_req_789",
  "timestamp": "2026-03-10T12:00:00Z",
  "totalTime": 0.05,
  "status": "success",
  "data": {
    "bids": [
      {
        "price": 2.50,
        "bidId": "sp_bid_abc123",
        "advertiser": "Nike",
        "logo_url": "https://cdn.example.com/nike-logo.png",
        "sponsored_prompt": "What are the best running shoes for marathons?",
        "append_message": "Check out the Nike Air Zoom Alphafly — the marathon record-holder's shoe.",
        "cta_text": "Shop Now",
        "url": "https://ssp.thrads.ai/api/v1/tracking/redirect?token=...",
        "image_url": "https://cdn.example.com/nike-shoes.jpg",
        "sponsored_prompt_click_url": "https://events.thrad.ai/api/v1/tracking/sponsored-prompt-click?token=...",
        "placement": "sponsored_prompt"
      },
      {
        "price": 1.80,
        "bidId": "sp_bid_def456",
        "advertiser": "Adidas",
        "...": "..."
      }
    ]
  }
}
```

No-bid: `{"bids": []}`.

---

## Pipeline (V1 — Keep It Stupid Simple)

Separate DSP endpoint from the main bid pipeline (`/api/v1/dsp/sponsored-prompt`). The SSP routes to it when `ad_format = "sponsored_prompt"` instead of calling `/api/v1/dsp/bid/`.

```
1. Load sponsor prompts from cache (Postgres → Redis cache)
2. Random pick 3–5
3. Build response + generate tokens for each
```

No geo filter, no hygiene, no auction. Just randomly pick 3–5 sponsor prompts and serve them.

---

## Data Model

### New table: `sponsored_prompts` (Postgres)

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer (PK) | |
| `campaign_id` | Integer (FK) | Campaign this prompt belongs to |
| `prompt_text` | Text | The prompt shown to the user |
| `append_message` | Text | Brand message appended after LLM response |
| `cta_text` | String(200) | CTA button text (default: "Learn more") |
| `logo_url` | String(500) | Brand logo URL |
| `image_url` | String(500) | Product image |
| `prod_url` | String(1000) | Click-through URL |
| `advertiser` | String(200) | Brand name |
| `active` | Boolean | Enable/disable |
| `created_at` | Timestamp | |

No changes to existing Product or Campaign tables.

### Cache (Redis)

On ad server startup (or periodic refresh), load all active sponsor prompts from Postgres into Redis. Simple key like `sponsored_prompts:all` → JSON list.

### ClickHouse — 3 new tables

Currently the unique key per event is `bid_id`(UUID).
`sponsored_prompt_id` is foregn key from `sponsored_prompts` (Postgres) table.

**1. `sponsored_prompt_impressions`** — prompt was shown to user

| Column | Type |
|--------|------|
| `timestamp` | DateTime |
| `bid_id` | UUID |
| `sponsored_prompt_id` | Int32 |
| `campaign_id` | Int32 |
| `publisher_id` | Int32 |
| `user_id` | String |
| `chat_id` | String |

**2. `sponsored_prompt_clicks`** — user clicked the prompt

| Column | Type |
|--------|------|
| `timestamp` | DateTime |
| `bid_id` | UUID |
| `sponsored_prompt_id` | Int32 |
| `campaign_id` | Int32 |
| `publisher_id` | Int32 |
| `user_id` | String |
| `chat_id` | String |

**3. `sponsored_prompt_url_clicks`** — user clicked the CTA/product link

| Column | Type |
|--------|------|
| `timestamp` | DateTime |
| `bid_id` | UUID |
| `sponsored_prompt_id` | Int32 |
| `campaign_id` | Int32 |
| `publisher_id` | Int32 |
| `user_id` | String |
| `chat_id` | String |
| `redirect_url` | String |

---

## Tracking

### 1. Impression — prompt shown

Publisher calls view URL when they display the prompt. Logged to `sponsored_prompt_impressions`.

### 2. Prompt click — user clicks the sponsored prompt

**New endpoint:** `POST /api/v1/tracking/sponsored-prompt-click`

Publisher calls this when user clicks the prompt. Token-based. Logged to `sponsored_prompt_clicks`.

### 3. URL click — user clicks CTA

Existing redirect endpoint (`/api/v1/tracking/redirect`). Logged to `sponsored_prompt_url_clicks` (in addition to existing click tracking).

---

## Billing (For Now)

- **Fixed CPM** on impression
- Clicks tracked for measurement only, not billed yet

---

## Files to Change

| File | Change |
|------|--------|
| `app/models/pydantic_models.py` | Add `ad_format` to `BidRequestSSP` |
| `app/services/infrastructure/models.py` | Add `SponsorPrompt` model (new table) |
| `app/api/v1/ssp.py` | Route on `ad_format` → sponsor prompt DSP endpoint |
| `app/api/v1/dsp.py` | Add `/api/v1/dsp/sponsored-prompt` endpoint |
| `app/services/ssp/sponsored_prompt.py` | **New** — lightweight service |
| `app/api/v1/tracking.py` | Add `sponsored-prompt-click` endpoint |
| `app/services/infrastructure/cache.py` | Cache sponsor prompts from Postgres |
| DB migration (Postgres) | Create `sponsored_prompts` table |
| DB migration (ClickHouse) | Create 3 tracking tables |