# Week 6 — Organizations & Hospitals Module

**Branch:** `week-6/organizations-hospitals`
**Date:** Feb 15, 2026
**Modules:** Organizations, Hospitals

---

## What Was Done

### 1. Organizations Module (`/api/organizations`)

Full CRUD for managing organizations that operate ambulances and hospitals.

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/organizations` | ADMIN | Create new organization |
| GET | `/api/organizations` | Authenticated | List all organizations (searchable by name) |
| GET | `/api/organizations/:id` | Authenticated | Get organization by ID |
| PATCH | `/api/organizations/:id` | ADMIN | Update organization |
| DELETE | `/api/organizations/:id` | ADMIN | Delete organization |

**Files Created:**
- `src/modules/organizations/dto/create-organization.dto.ts` — Validation: name (required), address, contactEmail, contactPhone
- `src/modules/organizations/dto/update-organization.dto.ts` — All fields optional
- `src/modules/organizations/organizations.service.ts` — Prisma CRUD with search by name
- `src/modules/organizations/organizations.controller.ts` — JWT + RBAC guarded endpoints

---

### 2. Hospitals Module (`/api/hospitals`)

Full CRUD for managing hospitals linked to organizations.

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/hospitals` | ADMIN | Register new hospital |
| GET | `/api/hospitals` | Authenticated | List hospitals (filter by organizationId) |
| GET | `/api/hospitals/:id` | Authenticated | Get hospital by ID |
| PATCH | `/api/hospitals/:id` | ADMIN | Update hospital |
| DELETE | `/api/hospitals/:id` | ADMIN | Delete hospital |

**Files Created:**
- `src/modules/hospitals/dto/create-hospital.dto.ts` — Validation: name (required), organizationId (required), address, contactPhone, GPS coords
- `src/modules/hospitals/dto/update-hospital.dto.ts` — All fields optional
- `src/modules/hospitals/hospitals.service.ts` — Prisma CRUD with organization relation
- `src/modules/hospitals/hospitals.controller.ts` — JWT + RBAC guarded endpoints

---

## How to Test

```bash
# Start the server
npm run start:dev

# Create an organization (Admin token required)
curl -X POST http://localhost:3001/api/organizations \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name": "City Health Services", "contactEmail": "info@cityhealth.org"}'

# Create a hospital under that organization
curl -X POST http://localhost:3001/api/hospitals \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name": "City General Hospital", "organizationId": "<ORG_ID>", "locationLat": 24.86, "locationLng": 67.00}'
```

## Swagger

All endpoints are available at: `http://localhost:3001/api/docs`
