# Backend Design Changes (Summary)

Date: Oct 28

## Overview
The backend exposes three concepts via a REST-like API served by `src/concept_server.ts` at base `/api` using Hono and dynamic concept loading.

- Concepts implemented:
  - FormConcept (`/api/Form/...`)
  - NotificationConcept (`/api/Notification/...`)
  - TimelineConcept (`/api/Timeline/...`)
- Dynamic router scans `src/concepts/*/*Concept.ts` and exposes all public methods as POST endpoints; methods prefixed with `_` act as queries (array responses in spec).

## Changes since last checkpoint
- Documented the full API in `API_SPECIFICATION.md` for frontend integration
- Verified server task `deno task concepts` (port 8000; overridable via `--port`); benign warning for missing `conceptsConcept.ts` is ignored
- Frontend integration via Vite dev proxy (`/api` → `http://localhost:8000`) to avoid CORS

## Environment / Ops
- Requires `.env` variables loaded via `jsr:@std/dotenv/load` in `src/utils/database.ts`:
  - `MONGODB_URL`
  - `DB_NAME`
- Test DB path available via `testDb()` which isolates collections

## Potential next changes
- Add list/count endpoints for Forms/Timelines to support Dashboard metrics
- Add validation messages for Notification time format
- Harden error shapes to a consistent `{ error: string, code?: string }`
