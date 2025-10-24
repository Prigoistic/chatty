# Whisp — Real‑time Chat (Express + React + Socket.IO)

Whisp is a simple, clean, real‑time chat app. Backend is Node/Express with MongoDB and JWT cookie auth; frontend is Vite + React with Socket.IO for live updates. The UI is styled to feel iMessage‑like and stays theme‑aware via DaisyUI.

Deep‑dive docs live in `docs/`:

- `docs/API.md` — API reference with request/response examples
- `docs/ARCHITECTURE.md` — Folder structure and internal flow
- `docs/ENV.md` — Environment variables and .env templates

## Tech stack

- Backend: Node.js, Express 5, Mongoose (MongoDB), JWT, bcryptjs, Cloudinary, Socket.IO
- Frontend: Vite + React, Zustand, Tailwind + DaisyUI, Socket.IO Client

## Repository structure

```
backend/
	package.json            # Backend scripts/deps
	src/
		index.js              # Express entrypoint (serves frontend in production)
		controllers/          # Route handlers
		lib/                  # DB connect, utils, cloudinary, socket server
		middleware/           # Auth middleware (JWT cookie)
		models/               # Mongoose models
		routes/               # Express routers
frontend/
	package.json            # Frontend scripts/deps
	src/                    # React app
	vite.config.js          # Dev proxy /api -> backend:3000
```

## Quick start (local)

1) Backend

- Create `backend/.env` (see `docs/ENV.md`). Required: `PORT`, `MONGODB_URL`, `JWT_SECRET`, Cloudinary keys.
- Start:

```bash
cd backend
npm install
npm run dev
```

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Notes
- Frontend uses a Vite proxy so any request to `/api` goes to `http://localhost:3000`. Axios is configured with `withCredentials: true` to send the JWT cookie.
- Socket.IO in dev connects to `http://localhost:3000`; in production it uses same‑origin by default.

## How real‑time works (Socket.IO)

When a user logs in, we open a Socket.IO connection and attach `userId` in the connection query. The server tracks online users and emits updates; when you send a message via REST, the server pushes it live to the receiver if they’re online.

```mermaid
sequenceDiagram
	autonumber
	participant UI as React UI
	participant API as Express REST (/api)
	participant WS as Socket.IO Server
	participant DB as MongoDB

	UI->>API: POST /api/auth/login (email, password)
	API-->>UI: Set-Cookie: jwt=...; HttpOnly; SameSite=Strict
	UI->>WS: io.connect(query: { userId })
	WS->>WS: userSocketMap[userId] = socket.id
	WS-->>UI: emit("getOnlineUsers", [userIds])

	UI->>API: POST /api/message/send/:id { text, image? }
	API->>DB: save Message
	API->>WS: io.to(receiverSocketId).emit("newMessage", message)
	WS-->>UI: UI of receiver gets "newMessage"
```

Server keeps a simple `userSocketMap` and emits `getOnlineUsers` whenever someone connects/disconnects. The REST send endpoint persists the message, then emits `newMessage` to the receiver’s socket if online.

Socket events
- Server → Client: `getOnlineUsers` (string[] of userIds), `newMessage` (Message)
- Client → Server: connection lifecycle (Socket.IO handles it)

## API quick reference

Base URL (dev): `http://localhost:3000`

Auth
- POST `/api/auth/signup` — Create account (sets `jwt` cookie)
- POST `/api/auth/login` — Login (sets `jwt` cookie)
- POST `/api/auth/logout` — Logout (clears cookie)
- GET `/api/auth/check` — Return current user (protected)
- PUT `/api/auth/update-profile` — Update profile picture (protected)

Messages
- GET `/api/message/users` — List other users (protected)
- GET `/api/message/:id` — Conversation with user `:id` (protected)
- POST `/api/message/send/:id` — Send message to user `:id` (protected)

Example (curl)

```bash
# Login and persist cookie
curl -i -c /tmp/cjar -b /tmp/cjar \
	-X POST http://localhost:3000/api/auth/login \
	-H 'Content-Type: application/json' \
	-d '{"email":"you@example.com","password":"secret123"}'

# Check current user using cookie
curl -i -b /tmp/cjar http://localhost:3000/api/auth/check
```

## Environment variables

Backend (required)
- `PORT` — e.g., 3000 (Render sets this automatically)
- `MONGODB_URL` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWT
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Optional: `CLIENT_ORIGIN` — allow CORS from a separate frontend origin (only needed if not serving frontend from backend)

Frontend (optional for custom hosting)
- `VITE_API_BASE` — Override REST base (default: `/api`)
- `VITE_SOCKET_URL` — Override Socket.IO URL (default: dev → `http://localhost:3000`, prod → same‑origin)

## Deployment (Render)

Single Web Service (backend serves the built frontend)

1) Create a Web Service from this repository (root)
2) Set Build Command:

```bash
npm run build
```

3) Set Start Command:

```bash
npm start
```

4) Add env vars listed above (Backend section).

What the scripts do
- Root `package.json`:
	- `build`: installs backend + frontend deps, then builds the frontend
	- `start`: starts the backend (which serves `frontend/dist` in production)

After deploy
- Load your Render URL; the server will serve the SPA and expose REST under `/api` and Socket.IO under the same origin.
- If you host the frontend separately, set `CLIENT_ORIGIN` on the backend and configure `VITE_API_BASE` and `VITE_SOCKET_URL` on the frontend host. For cross‑site cookies, switch to `SameSite: "none"` and keep `secure: true` (ask us to adjust if you choose this route).

## Notes

- Auth uses an HttpOnly JWT cookie named `jwt` with `SameSite=Strict` (secure in production). This is ideal when backend serves the frontend (same origin).
- Protected routes require sending credentials; Axios is already configured with `withCredentials: true`.
- Express 5 is used; controllers use async/await with early returns.


