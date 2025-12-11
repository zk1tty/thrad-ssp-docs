---
title: "Bid Request"
api: "POST /api/v1/ssp/bid-request"
description: "Orchestrates a multi-bidder auction across multiple DSPs and returns the winning ad creative in a single request"
---

## Authorizations

<ParamField header="thrad-api-key" type="string" required>
  Your API key for authentication
</ParamField>

<ParamField header="Content-Type" type="string" required>
  Must be `application/json`
</ParamField>

<ParamField header="Origin" type="string">
  Your domain (required for browser-based requests). Server-to-server requests don't require origin validation.
</ParamField>

## Body

<ParamField body="userId" type="string" required>
  Unique user identifier. Use anonymous UUIDs (e.g., `user_a1b2c3d4-...`) stored in localStorage for logged-out users. Do not use email or name.
</ParamField>

<ParamField body="chatId" type="string" required>
  Conversation identifier. One unique ID per conversation, not per user. Reset when user starts a new chat. Store in sessionStorage.
</ParamField>

<ParamField body="messages" type="array" required>
  Conversation history. Must contain at least 2 messages (user and assistant). Messages must alternate between user and assistant roles, ending with a user message followed by an assistant message.
  
  <Expandable title="messages properties">
    <ParamField body="role" type="string" required>
      Message role. Must be either `"user"` or `"assistant"`.
    </ParamField>
    
    <ParamField body="content" type="string" required>
      Message text content.
    </ParamField>
    
    <ParamField body="timestamp" type="string">
      Optional ISO 8601 or Unix timestamp. Including timestamps enables time-in-chat analytics for better targeting.
    </ParamField>
  </Expandable>
</ParamField>

<ParamField body="production" type="boolean" default="true">
  Whether the request is for production. Defaults to `true`.
</ParamField>

<ParamField body="turn_number" type="integer">
  Turn number in the conversation (for analytics). Must be >= 0.
</ParamField>

<ParamField body="adtype" type="string">
  Ad type identifier. Optional field that specifies when and how the ad should be displayed. 
  
  - If **empty or not provided**: Treated as a **native in-chat ad** (ad appears naturally within the conversation flow after user interaction)
  - If set to **`"opener"`**: Indicates a **non-prompted ad** that displays before the conversation starts (pre-conversation ad placement)
</ParamField>

<RequestExample>

```json Example Request
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
  "turn_number": 4,
  "adtype": ""
}
```

</RequestExample>

<ResponseExample>

```json 200 - Success
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

```json 200 - No Bid
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

```json 500 - Error
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

<Note>
  A `200 OK` response with `"bid": null` is **not an error** - it means the auction ran successfully but no DSP submitted a winning bid. This is normal behavior.
</Note>

## Response

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
  
  <Expandable title="data properties">
    <ResponseField name="bid" type="object|null">
      Winning bid object (null if no bids). Contains ad creative information when available.
      
      <Expandable title="bid properties">
        <ResponseField name="price" type="float">
          Clearing price (CPM) in dollars - what the publisher earns.
        </ResponseField>
        
        <ResponseField name="advertiser" type="string">
          Advertiser/brand name (optional).
        </ResponseField>
        
        <ResponseField name="headline" type="string">
          Ad headline text (optional).
        </ResponseField>
        
        <ResponseField name="description" type="string">
          Ad body text/description.
        </ResponseField>
        
        <ResponseField name="cta_text" type="string">
          Call-to-action text, e.g., "Shop Now", "Learn More" (optional).
        </ResponseField>
        
        <ResponseField name="url" type="string">
          Click tracking URL. Use this URL for ad clicks - it tracks the click and redirects to the advertiser's landing page.
        </ResponseField>
        
        <ResponseField name="image_url" type="string">
          Ad image URL (optional).
        </ResponseField>
        
        <ResponseField name="dsp" type="string">
          Winning DSP identifier (e.g., "thrad_dsp").
        </ResponseField>
        
        <ResponseField name="bidId" type="string">
          Bid identifier for tracking/debugging.
        </ResponseField>
      </Expandable>
    </ResponseField>
  </Expandable>
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

## Example Integrations

### Python (Server-Side)

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

### JavaScript (Browser)

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
