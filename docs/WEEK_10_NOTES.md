# Week 10 — Driver Performance & Admin Actions Module

**Branch:** `week-10/driver-performance-admin-actions`
**Date:** Mar 15, 2026
**Modules:** Driver Performance, Admin Actions (Audit Logging)

---

## What Was Done

### 1. Driver Performance Module (`/api/driver-performance`)

Track and monitor driver ratings, response times, total rides, and activity.

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/driver-performance` | ADMIN | List all driver performance records (sortable) |
| GET | `/api/driver-performance/me` | DRIVER | Get my performance stats |
| GET | `/api/driver-performance/:driverId` | ADMIN | Get specific driver's performance |
| PATCH | `/api/driver-performance/:driverId` | ADMIN | Update driver performance stats |

**Key Features:**
- Auto-creates performance record on first access (no manual setup needed)
- Running average rating calculation
- Sortable by: `rating`, `totalRides`, `averageResponseTime`
- Tracks `lastActive` timestamp
- `incrementRides()` and `addRating()` helper methods for internal use

---

### 2. Admin Actions Module (`/api/admin-actions`)

Audit logging for all admin operations — tracks who did what, when, and to which entity.

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/admin-actions` | ADMIN | Log an admin action |
| GET | `/api/admin-actions` | ADMIN | List all admin actions (filter by adminId, action keyword) |
| GET | `/api/admin-actions/:id` | ADMIN | Get specific admin action details |

**Key Features:**
- Stores action type (e.g., `DISABLE_USER`, `VERIFY_PARAMEDIC`, `REASSIGN_AMBULANCE`)
- Links to target entity via `targetId`
- JSON `metadata` field for additional context
- Filterable by admin and action keyword (case-insensitive search)

---

### 3. Admin Dashboard Fix

Updated `admin/dashboard.html` to match **only** what's in the ResQLink project document:

**Removed (not in document):**
- Users management page
- Hospitals page
- Admin Logs page

**Kept (from document):**
- Dashboard overview with live stats
- Ambulances management — "The organization manages all registered ambulances"
- Paramedic Profiles — "ADMIN CAN MANAGE THE PARAMEDIC PROFILE"
- Ride Requests — "pending requests, incoming emergency requests"
- Live Tracking — "User and admin can view live ambulance movement on the map"
- Dispatch — "reassign ambulances if required"
- Driver Performance — "Can monitor driver performance"

**Updated Stats Cards:**
- Active Ambulances (available count)
- Pending Requests (awaiting dispatch)
- Active Rides (currently in progress)
- Verified Paramedics

**Updated Tables:**
- Registered Ambulances (registration, type, status, organization, GPS)
- Pending Ride Requests (requester, type, status, pickup, time)

---

## Document Requirement Coverage

| Document Requirement | Covered By |
|---------------------|------------|
| "Can monitor driver performance" | Driver Performance module + dashboard sidebar |
| "Reassign ambulances if required" | Admin Actions audit log + Dispatch module |
| "Tracks active ambulances, pending requests" | Dashboard stats + tables |
| "Monitor driver/paramedic activity in real time" | Driver Performance + Tracking |

## How to Test

```bash
# Get all driver performance stats (sorted by rating)
curl "http://localhost:3001/api/driver-performance?orderBy=rating" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# Driver checks own stats
curl http://localhost:3001/api/driver-performance/me \
  -H "Authorization: Bearer <DRIVER_TOKEN>"

# Log an admin action
curl -X POST http://localhost:3001/api/admin-actions \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"action": "VERIFY_PARAMEDIC", "targetId": "<PROFILE_ID>", "metadata": {"reason": "Documents verified"}}'

# View admin audit log
curl http://localhost:3001/api/admin-actions \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```
