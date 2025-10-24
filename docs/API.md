# API Reference

Base URL: `http://localhost:3000`

Authentication uses an HttpOnly cookie named `token`. After signup/login, the cookie is set. For protected routes, ensure the cookie is sent (browser: `credentials: 'include'`; Postman: use cookie jar).

## Auth

### POST /api/auth/signup
Create a new user and set a JWT cookie.

Request body:
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

Responses:
- 201
```json
{
  "_id": "...",
  "fullname": "John Doe",
  "email": "john@example.com",
  "profilepic": ""
}
```
- 400 — validation errors (missing fields, short password, email exists)
- 500 — server error

### POST /api/auth/login
Log in and set a JWT cookie.

Request body:
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Responses:
- 200
```json
{
  "_id": "...",
  "fullname": "John Doe",
  "email": "john@example.com",
  "profilepic": ""
}
```
- 400 — user not found / invalid credentials
- 500 — server error

### POST /api/auth/logout
Clears the `token` cookie.

Responses:
- 200 { "message": "Logout successful." }
- 500 — server error

### PUT /api/auth/update-profile (protected)
Updates the user's profile picture.

Headers:
- Cookie: `token=...`

Body:
```json
{ "profilepic": "<base64 or url>" }
```

Responses:
- 200 — Updated user object (without password)
- 400 — Missing `profilepic`
- 401 — Unauthorized (no/invalid token)
- 500 — server error

### GET /api/auth/check (protected)
Returns the authenticated user's data.

Headers:
- Cookie: `token=...`

Responses:
- 200 — User object (without password)
- 401 — Unauthorized (no/invalid token)

## Message

### GET /api/message/users (protected)
List all users except the logged-in user.

Responses:
- 200 — Array of user objects (without password)
- 401 — Unauthorized
- 500 — server error

### GET /api/message/users/:id (protected)
Fetch a single user by ID. (Placeholder for future message thread retrieval.)

Responses:
- 200 — User object (without password)
- 401 — Unauthorized
- 404 — User not found
- 500 — server error

## Curl examples

```bash
# Signup
curl -i -c /tmp/c.jar -b /tmp/c.jar \
  -X POST http://localhost:3000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"fullname":"John Doe","email":"john@example.com","password":"secret123"}'

# Login
curl -i -c /tmp/c.jar -b /tmp/c.jar \
  -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"john@example.com","password":"secret123"}'

# Check auth
curl -i -b /tmp/c.jar http://localhost:3000/api/auth/check

# Update profile
curl -i -b /tmp/c.jar \
  -X PUT http://localhost:3000/api/auth/update-profile \
  -H 'Content-Type: application/json' \
  -d '{"profilepic":"https://example.com/image.jpg"}'

# List users (message sidebar)
curl -i -b /tmp/c.jar http://localhost:3000/api/message/users
```
