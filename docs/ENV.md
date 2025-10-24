# Environment variables

This project uses `.env` files in both backend and frontend. `.env` files are ignored by git.

## Backend `.env`

Create `backend/.env` with:

```
PORT=3000
MONGODB_URL=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret

# Cloudinary (required for profile pic uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional
NODE_ENV=development
```

Notes:
- `JWT_SECRET` must be the same across server restarts for cookies to remain valid.
- `NODE_ENV !== 'development'` enables `secure: true` cookies.

## Frontend `.env`

Optional — if you prefer not to use a Vite dev proxy, you can configure a base URL:

```
VITE_API_BASE=http://localhost:3000
```

Then call APIs as:

```js
fetch(`${import.meta.env.VITE_API_BASE}/api/auth/check`, { credentials: 'include' })
```

## Examples

Example templates are provided:
- `backend/.env.example`
- `frontend/.env.example`
