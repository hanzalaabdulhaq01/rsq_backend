# Week 7 — Ambulances & Paramedic Profiles Module

**Branch:** `week-7/ambulances-paramedic-profiles`
**Date:** Feb 22, 2026
**Modules:** Ambulances, Paramedic Profiles

---

## What Was Done

### 1. Ambulances Module (`/api/ambulances`)

Full CRUD for managing ambulances linked to organizations. Supports GPS coordinates for real-time location and type/status filtering.

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/ambulances` | ADMIN | Register new ambulance |
| GET | `/api/ambulances` | Authenticated | List ambulances (filter by organizationId, status) |
| GET | `/api/ambulances/:id` | Authenticated | Get ambulance by ID |
| PATCH | `/api/ambulances/:id` | ADMIN, DRIVER | Update ambulance (status, location) |
| DELETE | `/api/ambulances/:id` | ADMIN | Delete ambulance |

**Key Features:**
- Ambulance types: `BASIC`, `WITH_DOCTOR`
- Status tracking: `AVAILABLE`, `BUSY`, `OFFLINE`, `MAINTENANCE`
- GPS coordinates (`currentLat`, `currentLng`) for live location
- `findAvailable()` method used by the Dispatch module later

**Files Created:**
- `src/modules/ambulances/dto/create-ambulance.dto.ts`
- `src/modules/ambulances/dto/update-ambulance.dto.ts`
- `src/modules/ambulances/ambulances.service.ts`
- `src/modules/ambulances/ambulances.controller.ts`

---

### 2. Paramedic Profiles Module (`/api/paramedic-profiles`)

Admin manages paramedic profiles — create, verify, reject. Linked to User model (1:1 relation with PARAMEDIC role users).

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/paramedic-profiles` | ADMIN | Create paramedic profile |
| GET | `/api/paramedic-profiles` | ADMIN | List profiles (filter by status) |
| GET | `/api/paramedic-profiles/:id` | Authenticated | Get profile by ID |
| GET | `/api/paramedic-profiles/user/:userId` | Authenticated | Get profile by user ID |
| PATCH | `/api/paramedic-profiles/:id` | ADMIN | Update profile (verify/reject) |
| DELETE | `/api/paramedic-profiles/:id` | ADMIN | Delete profile |

**Key Features:**
- Registration status: `PENDING` → `VERIFIED` / `REJECTED`
- Auto-sets `verifiedAt` timestamp when status changes to VERIFIED
- Conflict check — prevents duplicate profiles per user
- Linked to User model with user details included in responses

**Files Created:**
- `src/modules/paramedic-profiles/dto/create-paramedic-profile.dto.ts`
- `src/modules/paramedic-profiles/dto/update-paramedic-profile.dto.ts`
- `src/modules/paramedic-profiles/paramedic-profiles.service.ts`
- `src/modules/paramedic-profiles/paramedic-profiles.controller.ts`

---

## Document Requirement Coverage

From the ResQLink project document:
- **"ADMIN CAN MANAGE THE PARAMEDIC PROFILE"** — Covered by Paramedic Profiles module (create, verify, reject)
- **"The organization manages all registered ambulances"** — Covered by Ambulances module (CRUD linked to organizations)
- **"Selects ambulance type: With Doctor or Without Doctor"** — Covered by `AmbulanceType` enum (BASIC / WITH_DOCTOR)

## How to Test

```bash
# Register an ambulance
curl -X POST http://localhost:3001/api/ambulances \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"organizationId": "<ORG_ID>", "registrationNumber": "KHI-AMB-001", "type": "WITH_DOCTOR"}'

# Create a paramedic profile
curl -X POST http://localhost:3001/api/paramedic-profiles \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"userId": "<PARAMEDIC_USER_ID>", "experienceYears": 3}'

# Verify the paramedic
curl -X PATCH http://localhost:3001/api/paramedic-profiles/<PROFILE_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "VERIFIED"}'
```
