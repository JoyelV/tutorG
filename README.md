# E-Learning Platform

Full-stack e-learning platform with a TypeScript React frontend and an Express + TypeScript backend.

## Project Overview
- Purpose: A multi-role learning platform for admins, instructors, and students. Features include courses, lessons, quizzes, reviews, cart & orders, and media uploads.
- Structure: Monorepo with two main apps — `client/` (React) and `server/` (Express API).

## Tech Stack
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, TypeScript, Express, Mongoose (MongoDB)
- Media: Cloudinary + Multer for uploads
- Auth: JWT-based authentication
- Utilities: Email/OTP helpers, password hashing, role-based guards

## Repository Layout
- `client/` — React app source in `src/`, production build in `build/`.
- `server/` — API code: `controllers/`, `services/`, `repositories/`, `models/`, `routes/`.
- Config & utilities: `server/config/`, `server/utils/`.

## Prerequisites
- Node.js v16+ (or compatible LTS)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account for media uploads (optional; can be swapped)

## Quick Start

1. Start MongoDB or ensure Atlas access.

2. Install and run the server

```bash
cd server
npm install
# create or update .env with required variables (see below)
npm run dev
```

3. Install and run the client

```bash
cd client
npm install
# set client env vars if needed (e.g. API base URL)
npm start
```

Open the frontend in your browser (usually `http://localhost:3000`) and the API on the server port (commonly `5000` or as set in `.env`).

## Environment Variables

Add a `.env` file in `server/` with (example names used in project):

- `MONGO_URI` — MongoDB connection string
- `PORT` — Server port
- `JWT_SECRET` — Secret for JWT signing
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary credentials
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` — Email server creds (if used)
- `CLIENT_URL` — Frontend URL for CORS or redirects

Client environment (if used):
- `REACT_APP_API_URL` or similar base URL used by `client/src/Constants/BaseUrl.ts`.

## Scripts & Helpful Files
- Frontend entry: [client/src/index.tsx](client/src/index.tsx)
- Backend entry: [server/server.ts](server/server.ts)
- API routes: [server/routes](server/routes)
- Client API config: [client/src/Constants/BaseUrl.ts](client/src/Constants/BaseUrl.ts) and [client/src/infrastructure/api](client/src/infrastructure/api)

## Development Notes
- Routes are separated by role: admin, instructor, user (see `server/routes/`).
- Business logic resides in `server/services/`, data access in `server/repositories/`.
- If media uploads fail, verify Cloudinary credentials in `server/config/cloudinary.ts`.

## Build & Deploy
- Build client: `cd client && npm run build` — serve the `build/` folder from a static host or from the server.
- Deploy server: provide env vars, connect to a production MongoDB, and run compiled Node app or run via a process manager/container.

## Troubleshooting
- CORS issues: confirm `CLIENT_URL` and server CORS whitelist.
- Auth / JWT errors: ensure `JWT_SECRET` matches across environments and tokens are not expired.
- DB connection errors: confirm `MONGO_URI` and network access.

## Contributing
- Fork → feature branch → open PR against `main` with description and testing notes.
- Keep changes scoped to `client/` or `server/` and run local dev servers when testing.

## License
Add a `LICENSE` file at the repository root with your chosen license (for example, MIT).

## Contact
Joyel Varghese
Email: Varghesejoyel71@gmail.com

---
