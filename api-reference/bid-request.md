# Bid request endpoint

<Endpoint method="post" url="/api/v1/ssp/bid-request" />

Orchestrates a multi-bidder auction across multiple DSPs and returns the winning ad creative in a single request.

## Request body

This is the JSON payload you send to the Bid Request endpoint:

<RequestExample>

```json
{
  "userId": "user_123",
  "chatId": "chat_456",
  "messages": [
    {
      "role": "user",
      "content": "Looking for running shoes",
      "timestamp": "2024-11-23T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "What's your budget?",
      "timestamp": "2024-11-23T10:00:15Z"
    }
  ],
  "production": true,
  "turn_number": 4
}
```

</RequestExample>

**Request JSON fields**

- **`userId`**: Anonymous user identifier (UUID-style string, no PII).
- **`chatId`**: Conversation identifier that groups messages for a single chat session.
- **`messages`**: Ordered list of prior chat messages (alternating user/assistant).
- **`messages[].role`**: The role for each message (`"user"` or `"assistant"`).
- **`messages[].content`**: Text content of the message.
- **`messages[].timestamp`**: Optional ISO 8601 or Unix timestamp for the message.
- **`production`**: Boolean flag indicating whether this is a production request.
- **`turn_number`**: Integer turn counter for the conversation (0-based or 1-based, but consistent).

### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `thrad-api-key` | string | Yes | Your API key for authentication |
| `Content-Type` | string | Yes | Must be `application/json` |
| `Origin` | string | Yes* | Your domain (required for browser requests) |

*Required for browser-based requests. Server-to-server requests don't require origin validation.

### Path Parameters

This endpoint does not use path parameters.

### Request Body

<SchemaField path="userId" type="string" required>
  Unique user identifier. Use anonymous UUIDs (e.g., `user_a1b2c3d4-...`) stored in localStorage for logged-out users. Do not use email or name.
</SchemaField>

<SchemaField path="chatId" type="string" required>
  Conversation identifier. One unique ID per conversation, not per user. Reset when user starts a new chat. Store in sessionStorage.
</SchemaField>

<SchemaField path="messages" type="array" required>
  Conversation history. Must contain at least 2 messages (user and assistant). Messages must alternate between user and assistant roles, ending with a user message followed by an assistant message.
</SchemaField>

<SchemaField path="messages[].role" type="string" required>
  Message role. Must be either `"user"` or `"assistant"`.
</SchemaField>

<SchemaField path="messages[].content" type="string" required>
  Message text content.
</SchemaField>

<SchemaField path="messages[].timestamp" type="string">
  Optional ISO 8601 or Unix timestamp. Including timestamps enables time-in-chat analytics for better targeting.
</SchemaField>

<SchemaField path="production" type="boolean">
  Whether the request is for production. Defaults to `true`.
</SchemaField>

<SchemaField path="turn_number" type="integer">
  Turn number in the conversation (for analytics). Must be >= 0.
</SchemaField>

## Response

### Success Response (200 OK)

<ResponseExample>

```json
{
  "requestId": "api_req_123",
  "timestamp": "2025-11-24T21:51:52.240297Z",
  "totalTime": 0.123,
  "status": "success",
  "message": "Bid successful",
  "data": {
    "bid": {
      "price": 5.50,
      "advertiser": "Nike",
      "headline": "Premium Running Shoes",
      "description": "Perfect for marathon training. Lightweight and comfortable.",
      "cta_text": "Shop Now",
      "url": "https://ssp.thrads.ai/api/v1/dsp/redirect/abc123",
      "image_url": "https://cdn.example.com/nike-shoes.jpg",
      "dsp": "thrad_dsp",
      "bidId": "bid_abc123"
    }
  },
  "error": null
}
```

</ResponseExample>

**Response JSON fields**

- **`requestId`**: Unique ID for this request, used in logs and support.
- **`timestamp`**: ISO 8601 timestamp when the response was generated.
- **`totalTime`**: Total processing time for the auction, in seconds.
- **`status`**: High-level status (`"success"` or `"error"`).
- **`message`**: Human-readable message summarizing the result.
- **`data`**: Wrapper object that holds the bid payload.
- **`data.bid`**: Winning bid object, or `null` when there is no winning bid.
- **`data.bid.price`**: Clearing CPM price (what the publisher earns).
- **`data.bid.advertiser`**: Advertiser or brand name.
- **`data.bid.headline`**: Ad headline.
- **`data.bid.description`**: Ad body text / description.
- **`data.bid.cta_text`**: Call-to-action label (e.g. “Shop Now”).
- **`data.bid.url`**: Click tracking URL that redirects to the advertiser’s landing page.
- **`data.bid.image_url`**: Optional image asset for the ad.
- **`data.bid.dsp`**: Identifier for the winning DSP.
- **`data.bid.bidId`**: Unique bid identifier for analytics and debugging.
- **`error`**: `null` on success; populated with error details when `status = "error"`.

### No Bid Response (200 OK)

<ResponseExample>

```json
{
  "requestId": "api_req_124",
  "timestamp": "2025-11-24T21:51:52.240297Z",
  "totalTime": 0.095,
  "status": "success",
  "message": "No bids",
  "data": {
    "bid": null
  },
  "error": null
}
```

</ResponseExample>

<Note>
  A `200 OK` response with `"bid": null` is **not an error** - it means the auction ran successfully but no DSP submitted a winning bid. This is normal behavior.
</Note>

### Error Response (500 Internal Server Error)

<ResponseExample>

```json
{
  "requestId": "api_req_125",
  "timestamp": "2025-11-24T21:51:52.240297Z",
  "totalTime": 0.234,
  "status": "error",
  "message": "Render failed",
  "data": {
    "bid": null
  },
  "error": {
    "type": "HTTPException",
    "code": 500
  }
}
```

</ResponseExample>

### Response Fields

<ResponseField name="requestId" type="string">
  Unique request identifier used in logs and tracing.
</ResponseField>

<ResponseField name="timestamp" type="string">
  ISO 8601 timestamp of when the response was generated.
</ResponseField>

<ResponseField name="totalTime" type="float">
  Total processing time for this request in seconds.
</ResponseField>

<ResponseField name="status" type="string">
  Response status: `"success"` or `"error"`.
</ResponseField>

<ResponseField name="message" type="string">
  Human-readable message describing the result.
</ResponseField>

<ResponseField name="data" type="object">
  Response data payload.
</ResponseField>

<ResponseField name="data.bid" type="object|null">
  Winning bid object (null if no bids). Contains ad creative information when available.
</ResponseField>

<ResponseField name="data.bid.price" type="float">
  Clearing price (CPM) in dollars - what the publisher earns.
</ResponseField>

<ResponseField name="data.bid.advertiser" type="string">
  Advertiser/brand name (optional).
</ResponseField>

<ResponseField name="data.bid.headline" type="string">
  Ad headline text (optional).
</ResponseField>

<ResponseField name="data.bid.description" type="string">
  Ad body text/description.
</ResponseField>

<ResponseField name="data.bid.cta_text" type="string">
  Call-to-action text, e.g., "Shop Now", "Learn More" (optional).
</ResponseField>

<ResponseField name="data.bid.url" type="string">
  Click tracking URL. Use this URL for ad clicks - it tracks the click and redirects to the advertiser's landing page.
</ResponseField>

<ResponseField name="data.bid.image_url" type="string">
  Ad image URL (optional).
</ResponseField>

<ResponseField name="data.bid.dsp" type="string">
  Winning DSP identifier (e.g., "thrad_dsp").
</ResponseField>

<ResponseField name="data.bid.bidId" type="string">
  Bid identifier for tracking/debugging.
</ResponseField>

<ResponseField name="error" type="object|null">
  Error details when `status = "error"` (otherwise `null`).
</ResponseField>

## Status Codes

| Status Code | Meaning | Scenario |
|-------------|---------|----------|
| `200 OK` | Success | Auction ran successfully (with or without winning bid) |
| `400 Bad Request` | Invalid input | Malformed request body or missing required fields |
| `401 Unauthorized` | Authentication failed | Missing or invalid `thrad-api-key` |
| `403 Forbidden` | Origin not allowed | Request from non-whitelisted domain (browser integration only) |
| `429 Too Many Requests` | Rate limit exceeded | Publisher exceeded request quota |
| `500 Internal Server Error` | Server error | DSP render failed, validation error, or internal exception |
| `501 Not Implemented` | Feature unavailable | External DSP render not yet supported |

## Auction Flow

The endpoint orchestrates a multi-bidder auction:

1. **Validate Request**: Checks authentication, rate limits, and request format
2. **Fan Out to DSPs**: Sends bid requests to multiple DSPs in parallel (timeout: 3.0s)
3. **Run Auction**: Selects winner using first-price auction with floor price ($1.00 CPM minimum)
4. **Render Ad**: Calls winning DSP's render endpoint to get ad creative (timeout: 1.5s)
5. **Return Response**: Returns winning ad creative or no-bid response

## Timeouts

- **Bid requests**: 3.0 seconds per DSP
- **Render requests**: 1.5 seconds
- **Total**: ~4.5 seconds maximum

## Rate Limits

**100 requests per second** per API key (configurable).

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## CORS Support

The endpoint supports Cross-Origin Resource Sharing (CORS) for browser requests:

- **Allowed Methods**: `POST`, `OPTIONS`
- **Allowed Headers**: `thrad-api-key`, `Content-Type`, `Origin`, `Referer`
- **Credentials**: Not required
- **Max Age**: 86400 seconds (24 hours)

Contact us at contact@thrads.ai to register your domains for CORS support.

## Example integrations

### Python (server-side) example

```python
import uuid
import requests

BASE_URL = "https://ssp.thrads.ai/api/v1/ssp/bid-request"
API_KEY = "your-api-key"


def get_user_id():
    # Use your own anonymous, non-PII user identifier
    return f"user_{uuid.uuid4()}"


def get_chat_id():
    # One chat_id per conversation
    return f"chat_{uuid.uuid4()}"


def make_bid_request(conversation_messages, production=True, turn_number=0):
    payload = {
        "userId": get_user_id(),
        "chatId": get_chat_id(),
        "messages": conversation_messages,
        "production": production,
        "turn_number": turn_number,
    }

    headers = {
        "thrad-api-key": API_KEY,
        "Content-Type": "application/json",
    }

    response = requests.post(BASE_URL, json=payload, headers=headers, timeout=5)
    response.raise_for_status()
    data = response.json()

    bid = data.get("data", {}).get("bid")
    if bid:
        print("Got bid:", bid)
    else:
        print("No bid available")

    return data
```

### JavaScript (browser) example

```javascript
/**
 * Get or create persistent anonymous user ID
 * REQUIRED: You must implement this to track users across sessions
 */
function getUserId() {
  const STORAGE_KEY = 'thrad_user_id';
  let userId = localStorage.getItem(STORAGE_KEY);
  
  if (!userId) {
    // Generate new anonymous ID (no PII - just a random UUID)
    userId = 'user_' + crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, userId);
  }
  
  return userId;
}

/**
 * Get or create chat ID (one per conversation)
 * REQUIRED: You must implement this to track ads per conversation
 */
function getChatId() {
  const STORAGE_KEY = 'thrad_chat_id';
  let chatId = sessionStorage.getItem(STORAGE_KEY);
  
  if (!chatId) {
    chatId = 'chat_' + crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEY, chatId);
  }
  
  return chatId;
}

// Make bid request
const response = await fetch('https://ssp.thrads.ai/api/v1/ssp/bid-request', {
  method: 'POST',
  headers: {
    'thrad-api-key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: getUserId(),
    chatId: getChatId(),
    messages: conversationMessages,
    production: true,
    turn_number: currentTurn
  })
});

const data = await response.json();

if (data.data.bid) {
  // Display ad creative
  console.log('Ad:', data.data.bid);
} else {
  // No bid - continue without ad
  console.log('No ad available');
}
```
