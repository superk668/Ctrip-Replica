# Ctrip Replica — Full‑Stack Travel Booking Demo

An educational, full‑stack replica of core Ctrip workflows. It includes a secure Node.js/Express backend with SQLite, and a modern React + Vite frontend that demonstrates login and registration, flight search, and order browsing with downloadable order receipts.

## Highlights
- Account/password login and SMS code login
- Two‑step registration with server‑side validation
- Flight search with filters (airline, time slot, model, cabin)
- Orders list, detail view, cancel, and TXT download
- Typed React components and modular CSS for UI
- Ready‑to‑run dev setup with a Vite proxy to the API

## Tech Stack
- Backend: `Node.js`, `Express`, `SQLite3`, `jsonwebtoken`, `bcrypt`, `express-validator`
- Frontend: `React 18`, `Vite`, `React Router`, `Axios`, `Vitest` + `Testing Library`

## Monorepo Structure
```
Ctrip-Replica/
  backend/                 # Express API server
    src/
      config/database.js   # SQLite init and connection
      routes/              # REST endpoints (auth, user, flights, airports, orders, payments)
      services/            # Domain services (users, orders, verification codes)
      utils/               # Response & validation helpers
      app.js               # App setup and route mounting
    test/                  # Jest + Supertest API tests
    package.json           # Scripts: start/dev/test
    database.sqlite        # Auto-created in dev (file DB)
  frontend/                # React application
    src/
      components/          # Reusable UI (Login/Register/Orders/etc.)
      pages/               # Page modules (Home, Flights, Login, Register)
      router.jsx           # SPA routes
    test/                  # Vitest setup and component tests
    vite.config.js         # Dev server and `/api` proxy -> `http://localhost:3000`
    package.json           # Scripts: dev/build/preview/test
```

## Getting Started
### Prerequisites
- Node.js 18+
- npm 9+

### Install dependencies
```
# Backend
cd Ctrip-Replica/backend
npm install

# Frontend
cd ../frontend
npm install
```

### Run in development
```
# Start API (port 3000)
cd Ctrip-Replica/backend
npm run dev

# Start Web (default port 5173)
cd ../frontend
npm run dev
```
The frontend dev server proxies `/api` requests to `http://localhost:3000`.

### Environment variables
- `PORT` (backend, default `3000`)
- `JWT_SECRET` (backend token signing; falls back to a local default for dev)
- `NODE_ENV` (`development` | `test`) — in test mode, verification codes are fixed (`123456`).

## Features & Flows
### Authentication
- Password login: `POST /api/auth/login`
- Send SMS code: `POST /api/auth/send-code` with `{ phone, type: 'login'|'register' }`
- Phone login (registered users): `POST /api/auth/phone-login`

### Registration (two steps)
1) `POST /api/user/register-step1` with `{ phone, code }` — validate phone and code
2) `POST /api/user/register-step2` with `{ phone, password }` — create user and return `{ token, user }`

### Flights
- Airport suggest: `GET /api/airports/suggest?query=...`
- Search flights: `GET /api/flights/search?trip=oneway&from=SHA&to=BJS&departDate=YYYY-MM-DD` with `Authorization: Bearer <token>`

### Orders
- List: `GET /api/orders?status=all&page=1&pageSize=10[&productType=flight|train|hotel]`
- Detail: `GET /api/orders/:orderId`
- Cancel: `POST /api/orders/:orderId/cancel`
- Download TXT: `GET /api/orders/:orderId/download`

## Testing
### Backend (Jest + Supertest)
```
cd Ctrip-Replica/backend
npm test
```

### Frontend (Vitest)
```
cd Ctrip-Replica/frontend
npm test
# or with UI
npm run test:ui
```

## How to Contribute?
Feel free to start an issue when you encounter any problem. To contribute, you may refer to `dev_log/README.md`
