# Chat Application (Express + React)

A simple chat application starter with a Node/Express backend and a Vite + React frontend. The backend provides authentication, user listing, and profile update endpoints. The frontend is a Vite scaffold ready to integrate with the APIs.

This README gives you a quick overview. Deep-dive docs live in `docs/`:

- docs/API.md — API reference with request/response examples
- docs/ARCHITECTURE.md — Folder structure and internal flow
- docs/ENV.md — Environment variables and .env templates

## Tech stack

- Backend: Node.js, Express 5, Mongoose (MongoDB), JWT, bcryptjs, Cloudinary
- Frontend: Vite + React

## Repository structure

```
backend/
	index.js                 # Express entrypoint
	package.json             # Backend dependencies
	src/
		controllers/           # Route handlers
		lib/                   # DB connection, utils, cloudinary config
		middleware/            # Auth middleware (JWT cookie)
		models/                # Mongoose models
		routes/                # Express routers
frontend/
	package.json             # Frontend dependencies
	src/                     # React app scaffold
```

## Quick start

1) Backend setup

- Create `backend/.env` (see `docs/ENV.md` or `backend/.env.example`).
- Install deps and run:

```bash
cd backend
npm install
# Development (watches for changes if you use nodemon):
npx nodemon index.js
# or run directly:
node index.js
```

2) Frontend setup (optional for now)

```bash
cd frontend
npm install
npm run dev
```

Tip: When calling the backend from the frontend, add a Vite dev proxy in `vite.config.js` and use `credentials: 'include'` to send JWT cookies. See `docs/API.md` for details.

## API quick reference

Base URL: `http://localhost:3000`

- POST `/api/auth/signup` — Create account (sets `token` cookie)
- POST `/api/auth/login` — Login (sets `token` cookie)
- POST `/api/auth/logout` — Logout (clears cookie)
- PUT `/api/auth/update-profile` — Update profile picture (protected)
- GET `/api/auth/check` — Returns current user from token (protected)

- GET `/api/message/users` — List other users (protected)
- GET `/api/message/users/:id` — Get a specific user (protected)

For example, in a terminal:

```bash
# Login and persist cookie
curl -i -c /tmp/c.jar -b /tmp/c.jar \
	-X POST http://localhost:3000/api/auth/login \
	-H 'Content-Type: application/json' \
	-d '{"email":"you@example.com","password":"secret123"}'

# Check current user with cookie
curl -i -b /tmp/c.jar http://localhost:3000/api/auth/check
```

See `docs/API.md` for complete request/response bodies, status codes, and auth requirements.

## Environment variables

Back end requires: `PORT`, `MONGODB_URL`, `JWT_SECRET`, `CLOUDINARY_*`. Front end can optionally define `VITE_API_BASE` if you don’t use a dev proxy. See `docs/ENV.md` and the `.env.example` files.

## Notes

- Auth uses an HttpOnly JWT cookie named `token` with `SameSite=Strict`.
- Protected routes require the cookie to be sent. In browsers, add `credentials: 'include'` to fetch/axios. In Postman, ensure the cookie jar includes `token` for `localhost:3000`.
- Express 5 is used; route/middleware signatures follow async/await patterns with try/catch and early returns.

