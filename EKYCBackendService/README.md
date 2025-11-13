# EKYCBackendService

Node.js Express backend for the EKYC Suite.

- Default port: 3001
- Default host: 0.0.0.0
- Health endpoint: GET /health (also available at GET /)
- API Docs: GET /docs

## Quick start

1) Install dependencies
   npm install

2) Configure environment (optional)
   cp .env.example .env
   # edit .env to set PORT/HOST if needed

3) Run in dev (hot reload)
   npm run dev

   # You can pass flags; they will be forwarded to the app:
   npm run dev -- --port 3001 --host 0.0.0.0

4) Run in production mode
   npm start

   # You can also pass flags here if desired:
   npm start -- --port 3001 --host 0.0.0.0

The server respects the following configuration precedence:
- CLI flags: --port / --host (or -p / -H)
- Environment variables: PORT / HOST
- Defaults: PORT=3001, HOST=0.0.0.0

## Health check

- GET http://localhost:3001/health
- Response example:
  {
    "status": "ok",
    "message": "Service is healthy",
    "timestamp": "2025-01-01T00:00:00.000Z",
    "environment": "development"
  }

## Notes

- No Python/uvicorn is used; this container is a Node.js/Express app.
- Swagger UI is available at /docs with a dynamic server URL based on the incoming request.
