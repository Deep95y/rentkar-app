# Rentkar Booking & Partner Verification System

Tech: Next.js (App Router, TS, Tailwind), MongoDB, Redis, Docker.

## Quick start (Docker Compose)

1. Copy env (optional; compose sets defaults)

```
cp .env.example .env.local
```

2. Start stack

```
docker-compose up --build
```

3. Seed sample data

```
curl -X POST http://localhost:3000/api/seed
```

4. Open UI

- http://localhost:3000

## Local dev

```
cd rentkar-app
npm install
npm run dev
```

Set environment in `.env.local`:

```
MONGODB_URI=mongodb://localhost:27017/rentkar
MONGODB_DB=rentkar
REDIS_URL=redis://localhost:6379
```

Run dependencies locally (optional):

```
docker run --name rentkar-mongo -p 27017:27017 -d mongo:7
docker run --name rentkar-redis -p 6379:6379 -d redis:7-alpine
```

## API Overview

- POST `/api/seed` – loads sample bookings and partners
- GET `/api/bookings` – list bookings
- POST `/api/bookings/:id/assign` – concurrency-safe partner assignment
- POST `/api/bookings/:id/confirm` – concurrency-safe confirmation; publishes `booking:confirmed`
- GET `/api/partners` – list partners
- POST `/api/partners/:id/gps` – update GPS, rate limited (6/min/partner), publishes `partner:gps`
- GET `/api/events` – Server-Sent Events stream of Redis pub/sub

## Concurrency & Redis

- Locks: simple Redis `SET NX PX` with token + Lua compare-and-del for release.
- Rate limit: window key with `INCR` + `EXPIRE`.
- Pub/Sub: Redis channels `booking:confirmed` and `partner:gps`.

## Notes

- Mongo indexes (2dsphere on `partners.location`) are created on startup in `src/lib/db.ts` via `ensureIndexes()` if you call it; optional for this test but recommended.
- Partner selection: nearest online partner by haversine distance to booking address.
- UI: minimal table with Assign/Confirm actions and live GPS updates via SSE.
