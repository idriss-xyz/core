# API Documentation

## Authentication

### Request Wallet Authentication

Initiates the authentication process by requesting a nonce and message for wallet signing.

**Endpoint:** `POST /auth/wallet-address`

**Request Body:**

```json
{
  "walletAddress": "string",
  "chainId": "string",
  "domain": "string"
}
```

**Response:**

```json
{
  "nonce": "string",
  "message": "string"
}
```

### Login

Completes the authentication process using the signed message.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "signature": "string",
  "walletAddress": "string",
  "message": "string"
}
```

**Response:**

```json
{
  "token": "string"
  // Valid for 7 days
}
```

### Get Subscriber List

Retrieves the list of subscribers for a specific wallet account.

**Endpoint:** `GET /subscriptions/:subscriber`

**Parameters:**

- `subscriber`: Wallet account address

## Protected Endpoints

The following endpoints require authentication. Include the token in the request header:

```
Authorization: Bearer {token}
```

### Subscribe to User

Subscribes to updates from a specific wallet address.

**Endpoint:** `POST /subscribe`

**Request Body:**

```json
{
  "subscriberId": "string",
  // Subscriber's wallet address
  "address": "string"
  // Target wallet address to subscribe to
}
```

### Unsubscribe from User

Unsubscribes from updates of a specific wallet address. Uses the same request format as the subscribe endpoint.

**Endpoint:** `POST /unsubscribe`

**Request Body:**

```json
{
  "subscriberId": "string",
  // Subscriber's wallet address
  "address": "string"
  // Target wallet address to unsubscribe from
}
```

### Get Quote

Retrieves a quote for token swap.

**Endpoint:** `POST /get-quote`

**Request Body:**

```json
{
  "fromAddress": "string",
  "originChain": "string",
  "destinationChain": "string",
  "originToken": "string",
  "destinationToken": "string",
  "amount": "string"
}
```

## WebSocket Events

When a client is connected to the WebSocket, they will receive the following events after successful subscription:

### Example of Connection to websocket

```javascript
import { io } from 'socket.io-client';

const socket = io(SERVER_URL, { transports: ['websocket'] });
socket.on('swapEvent', (swapData) => {
  //do something with swapData from API
});
```

### Swap Event

**Event Name:** `swapEvent`

The API will emit this event with relevant swap data when activities occur for subscribed addresses.
