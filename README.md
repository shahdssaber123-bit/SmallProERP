# Small Pro ERP React Frontend

Backend-connected React + Vite frontend for the Small Pro .NET API.

## Backend configuration

The project reads API routes from .env. Current default:

```
VITE_API_BASE_URL=https://localhost:7057/api
```

Run the backend first, then install dependencies and start the frontend:

```bash
npm install
npm run dev
```

This corrected build removes the legacy app plugin and uses backend/SQL data only.
