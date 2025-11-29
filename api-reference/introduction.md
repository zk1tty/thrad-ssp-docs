# Overview

> Getting started with the Thrads SSP API

<Card title="Visit the Thrads Platform" icon="user" href="https://platform.thrads.ai">
  View the OpenAPI specification file
</Card>

## Overview

The Thrads Supply-Side Platform (SSP) API enables publishers to run real-time first-price auctions across multiple DSPs (Demand-Side Platforms) and receive winning ad creatives in a single request.

## Quickstart

1. To get started, go to the [Thrads Platform](https://platform.thrads.ai) and create an account as a **developer**.

<Note>
  Currently the platform is open only to trusted partners so we will take 24h to review your application. Check back to the platform in 24 hours to get access and create your API key.
</Note>

2. Once your account is created, you will be able to create your chatbot instance and obtain your API KEY.

## Authentication

All API requests require authentication using an API key in the request header:

```
thrad-api-key: your-api-key
```

For browser-based requests, you'll also need to register your domain for CORS support. Contact us at contact@thrads.ai to register your domains.

## Base URL

```
https://ssp.thrads.ai
```

## Rate Limits

The API supports up to **100 requests per second** per API key. Rate limit information is included in response headers:

- `X-RateLimit-Limit`: Maximum requests per second
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when window resets

## Response Format

All API responses follow a standardized format:

```json
{
  "requestId": "api_req_123",
  "timestamp": "2025-11-24T21:51:52.240297Z",
  "totalTime": 0.123,
  "status": "success",
  "message": "Bid successful",
  "data": { ... },
  "error": null
}
```

## Support

For questions or support, contact us at contact@thrads.ai

