# Week 9 — Tracking & Chat Module (WebSocket)

**Branch:** `week-9/tracking-chat`
**Date:** Mar 8, 2026
**Modules:** Tracking (WebSocket + REST), Chat (WebSocket + REST)

---

## What Was Done

### 1. Tracking Module (`/api/tracking` + WebSocket `/tracking`)

Real-time ambulance location tracking via WebSocket with REST fallback endpoints.

#### REST Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/tracking/update` | DRIVER | Update ambulance location (REST fallback) |
| GET | `/api/tracking/live` | Authenticated | Get all ambulances with known locations |
| GET | `/api/tracking/:ambulanceId` | Authenticated | Get latest location of an ambulance |
| GET | `/api/tracking/:ambulanceId/history` | Authenticated | Get tracking history (optionally filter by ride) |

#### WebSocket Events (namespace: `/tracking`)

| Event | Direction | Description |
|-------|-----------|-------------|
| `updateLocation` | Client → Server | Driver sends GPS update `{ambulanceId, lat, lng, rideRequestId?}` |
| `subscribeToAmbulance` | Client → Server | Subscribe to a specific ambulance's location updates |
| `subscribeToRide` | Client → Server | Subscribe to location updates for a specific ride |
| `location:<ambulanceId>` | Server → Client | Broadcast ambulance location to subscribers |
| `ride:<rideRequestId>:location` | Server → Client | Broadcast location update for a specific ride |

**How it works:**
1. Driver's Flutter app connects via WebSocket to `/tracking` namespace
2. Driver emits `updateLocation` with GPS coordinates every few seconds
3. Server saves to DB (tracking log) + updates ambulance's `currentLat/currentLng`
4. Server broadcasts location to all subscribers on that ambulance/ride channel
5. User's Flutter app receives real-time location updates on the map

---

### 2. Chat Module (`/api/chats` + WebSocket `/chat`)

In-app messaging between paramedic and patient during a ride.

#### REST Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/chats` | Authenticated | Send a chat message (REST fallback) |
| GET | `/api/chats/ride/:rideRequestId` | Authenticated | Get all messages for a ride |
| GET | `/api/chats/ride/:rideRequestId/conversation?userId=` | Authenticated | Get conversation between two users |

#### WebSocket Events (namespace: `/chat`)

| Event | Direction | Description |
|-------|-----------|-------------|
| `joinRide` | Client → Server | Join a ride's chat room `{rideRequestId}` |
| `sendMessage` | Client → Server | Send message `{senderId, receiverId, rideRequestId, message}` |
| `newMessage` | Server → Client | Broadcast new message to ride chat room |

**Message Types:** `TEXT`, `IMAGE`, `SYSTEM`

**Document Requirement Coverage:**
- **"User and admin can view live ambulance movement on the map"** — Tracking WebSocket + REST live endpoint
- **"ETA updates dynamically"** — Location updates enable recalculating ETA on client
- **"App connects the assigned paramedic through in-app chat"** — Chat module with ride-based rooms
- **"Paramedic gives pre-arrival medical advice"** — Chat messaging between paramedic and patient
- **"Paramedic will get the option to chat with the patient"** — Chat via WebSocket or REST

---

## New Dependencies

```bash
npm install @nestjs/websockets  # Added in this branch
# @nestjs/platform-socket.io was already installed
```

## Flutter Integration

### Tracking (socket_io_client)
```dart
final socket = io('http://your-server/tracking', <String, dynamic>{
  'transports': ['websocket'],
});

// Subscribe to ambulance location
socket.emit('subscribeToRide', {'rideRequestId': rideId});

// Listen for location updates
socket.on('ride:$rideId:location', (data) {
  // Update map marker with data['lat'], data['lng']
});
```

### Chat (socket_io_client)
```dart
final chatSocket = io('http://your-server/chat', <String, dynamic>{
  'transports': ['websocket'],
});

// Join ride chat room
chatSocket.emit('joinRide', {'rideRequestId': rideId});

// Send message
chatSocket.emit('sendMessage', {
  'senderId': userId,
  'receiverId': paramedicId,
  'rideRequestId': rideId,
  'message': 'Patient is conscious',
});

// Listen for new messages
chatSocket.on('newMessage', (msg) {
  // Display in chat UI
});
```
