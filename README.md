# Rinjani

A web application for **remittance agents** (Artha Sejahtera Utama / Arsema) to send and receive money through the **MoneyGram API**, with a daily transaction dashboard and a *maker–approver* approval workflow.

## Features

| Feature | Description |
|---|---|
| **Dashboard** | Today's transaction summary: Send (Created / Need Approval) and Receive (Created / Need Approval) |
| **Send** | Select a destination country, enter an amount, choose a quote method (*Include Fee*, *Exclude Fee*, *Receive Amount*), pick a delivery option from the MoneyGram quote, then continue to the transaction form (`/gfpp`) |
| **Receive** | Look up a transaction by reference number, view sender, receiver, status, and amounts, then continue to the payout process (`/gfpp`) |
| **Change Password** | Change the user's password |
| **Authentication & Roles** | JWT-based login. The `maker` role creates transactions and the `approver` role approves them |

## Tech Stack

**Frontend** (`agentv3-react-rinjani`)
- Next.js + React (TypeScript)
- Tailwind CSS
- axios, react-select, react-number-format
- SweetAlert2, js-cookie, jwt-decode, moment

**Backend** (`arsema-backend-rinjani`)
- Node.js (Express)
- PostgreSQL
- JWT (`accessToken`)
- MoneyGram API integration

## Repository Structure

```
rinjani/
├── agentv3-react-rinjani/     # Frontend (Next.js), port 4000
├── arsema-backend-rinjani/    # Backend (Node.js), port 5000
│   ├── controllers/
│   ├── middleware/
│   ├── models/                # Data access models (Postgres)
│   ├── mail/
│   ├── logs/
│   └── server.js
└── README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- PostgreSQL (database `last_arsema`)
- MoneyGram API credentials (required for Send and Receive)

## Installation and Running

### 1. Backend

```bash
cd arsema-backend-rinjani
npm install
cp .env.example .env     # then fill in the values
npm run dev              # or: node server.js
```

The backend runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd agentv3-react-rinjani
npm install
cp .env.example .env.local   # then fill in the values
npm run dev -- -p 4000
```

The frontend runs at `http://localhost:4000`.

> Script names (`dev`, `start`) follow each folder's `package.json`. Adjust them if they differ.

## Environment Configuration

### Backend (`arsema-backend-rinjani/.env`)

```env
PORT=5000
NODE_ENV=development

# PostgreSQL
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=last_arsema
DB_USER=<your_db_user>
DB_PASSWORD=<your_db_password>
DB_SCHEMA=public

# Auth (login uses JWT: response.data.accessToken)
TOKEN_SECRET=<long_random_secret>
JWT_EXPIRES_IN=1d

# Allow the frontend to access the backend (CORS)
CORS_ORIGIN=http://localhost:4000
```

### Frontend (`agentv3-react-rinjani/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> **Important:** never commit the `.env` file or share its contents (database password and `TOKEN_SECRET`). Make sure `.env` is listed in `.gitignore` and keep only an `.env.example` without secret values in the repository. If a secret has ever been committed or shared, rotate it immediately.

## API Endpoints Used by the Frontend

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/country-info` | List of destination countries |
| POST | `/api/send` | MoneyGram fee inquiry (quote and exchange rate) |
| POST | `/api/receive` | Look up a transaction by reference number |

All requests (except login) must include the header `Authorization: Bearer <token>`.

## Workflow

1. **Login** → the backend returns a JWT, stored in the `token` cookie.
2. **Maker** creates transactions:
   - *Send*: choose country, amount, and quote method → pick a quote option → fill in sender and receiver details at `/gfpp`.
   - *Receive*: enter the reference number → check the status (`AVAIL`, `okForAgent`, `okForPickup`) → continue to `/gfpp`.
3. **Approver** approves transactions with the *Need Approval* status.
4. **Dashboard** shows today's transaction counts by status.

The Send page can only be opened by users with the `maker` role. Temporary data between pages is kept in `sessionStorage` (`gfpp` for Send, `rcvgfpp` for Receive).

## Database

Main transaction tables (PostgreSQL) include:

- `transaksi_send_clients`, `transaksi_send_temp_clients`
- `transaksi_receive_clients`, `transaksi_receive_temp_clients`
- `transaksi_cancel`, `transaksi_reject`, `transaksi_log`

Key columns in `transaksi_send_clients`: `no` (PK, auto-increment), `id_transaksi`, `maker`, `approver`, `status_cta`, `agent_id`, `tanggal`, `created_at`.

### Data notes

- `id_transaksi` uses the format `YYYYMMDDHH24MISS` in WIB (UTC+7).
- `tanggal` is `timestamp without time zone` and is stored in **UTC**, while `created_at` is `timestamptz` (WIB, +07). Keep the 7-hour offset in mind when creating test data.
- The dashboard shows **today's transactions**. Test data must be dated today for the counts to appear, and the `maker` column must match the email of the logged-in user.

## Troubleshooting

| Problem | What to check |
|---|---|
| Dashboard shows 0 | Test data is not dated today, `maker` does not match the logged-in user, or the `status_cta` value is wrong |
| CORS error in the browser | `CORS_ORIGIN` in the backend must exactly match the frontend address (`http://localhost:4000`) |
| 401 Unauthorized | The token has expired (`JWT_EXPIRES_IN`) or the `token` cookie is missing; log in again |
| Send page redirects to the dashboard | The user does not have the required `maker` role |
| Backend cannot connect to the database | Check the `DB_*` values in `.env` and make sure PostgreSQL is running |

## Security

- Keep all secrets in `.env`, never in code.
- Use a long, random `TOKEN_SECRET` that differs per environment.
- Do not use the production database for test data.
- This repository should be **private**.

## License

Proprietary. Copyright Artha Sejahtera Utama (Arsema). All rights reserved.
