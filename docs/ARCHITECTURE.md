# Architecture and Internals

This document explains how the backend and frontend are structured and how requests flow through the system.

## Backend

- Entry: `backend/index.js`
  - Loads env with `dotenv`
  - Creates Express app
  - Registers JSON body parser and `cookie-parser`
  - Mounts routers:
    - `/api/auth` -> `src/routes/auth.route.js`
    - `/api/message` -> `src/routes/message.route.js`
  - Connects to MongoDB via `src/lib/db.js`

- Database: `src/lib/db.js`
  - Uses `mongoose.connect(process.env.MONGODB_URL)`
  - Logs the connected host

- Models
  - `src/models/user.model.js`
    - Fields: `email`, `fullname`, `password`, `profilepic`
    - Method: `comparePassword(candidate)` wraps `bcrypt.compare`
    - Alias: `comparePasswords` -> `comparePassword`
  - `src/models/message.model.js`
    - Fields: `senderId`, `receiverId`, `text`, `image`, timestamps

- Utils
  - `src/lib/utils.js`
    - `generateToken(userId, res)`
      - Signs JWT with `JWT_SECRET` and 7d expiry
      - Sets HttpOnly cookie `token` with `SameSite=Strict` and `secure` in non-dev
  - `src/lib/cloudinary.js`
    - Configures Cloudinary v2 using env variables

- Middleware
  - `src/middleware/auth.middleware.js`
    - `protectedRoute(req, res, next)`
      - Reads JWT from `req.cookies.token`
      - Verifies JWT using `JWT_SECRET`
      - Loads user (excluding password) and attaches to `req.user`
      - Returns 401 on missing/invalid token or missing user

- Controllers
  - `src/controllers/auth.controller.js`
    - `signup(req, res)`
      - Validates required fields and password length
      - Checks for existing email
      - Hashes password with bcrypt
      - Creates user, sets JWT cookie via `generateToken`, responds with user fields
    - `login(req, res)`
      - Finds user by email, compares password using `user.comparePassword`
      - Sets JWT cookie via `generateToken`, responds with user fields
    - `logout(req, res)`
      - Clears the `token` cookie
    - `updateProfile(req, res)` (protected)
      - Expects `profilepic` (string/base64/url), uploads to Cloudinary
      - Updates user `profilepic` and returns updated user (without password)
    - `checkAuth(req, res)` (protected)
      - Returns the `req.user` loaded by `protectedRoute`
  - `src/controllers/message.controller.js`
    - `getUsersForSidebar(req, res)` (protected)
      - Returns all users except the logged-in user
    - `getMessages(req, res)` (protected)
      - Fetches a specific user by `:id` (placeholder for actual messaging logic)

- Routes
  - `src/routes/auth.route.js`
    - POST `/signup`, POST `/login`, POST `/logout`
    - PUT `/update-profile` (protected)
    - GET `/check` (protected)
  - `src/routes/message.route.js`
    - GET `/users` (protected) — list users (excluding self)
    - GET `/users/:id` (protected) — get a specific user

### Request Flow (protected route example)
1. Client sends request with `Cookie: token=...` to `/api/auth/check`
2. Express routes request to `auth.route.js`
3. `protectedRoute` middleware runs:
   - Reads and verifies JWT, loads user, attaches `req.user`
4. `checkAuth` controller responds with `req.user`

### Auth Model
- Cookie-based JWT auth
- HttpOnly + SameSite=Strict cookie for CSRF protection in same-site dev
- For cross-site scenarios, you may need to adjust `SameSite` and CORS

## Frontend

- Vite + React scaffold located in `frontend/`
- Configure a dev proxy in `vite.config.js` to forward `/api` requests to the backend:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

- When calling protected routes, ensure `credentials: 'include'` is set so the browser sends the HttpOnly cookie.
