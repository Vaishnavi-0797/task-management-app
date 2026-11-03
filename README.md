# TaskFlow - Task Management Application

Live demo: https://task-management-app-1-ktn0.onrender.com

A full-stack task manager. Users register, log in, and manage their own tasks
(create, read, update, delete), track progress on a dashboard, and search,
filter and sort their work. The layout is responsive and uses a dark theme.

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React 18, Vite, React Router, Axios, Lucide icons, plain CSS |
| Backend | Node.js, Express |
| Database | SQLite (via `better-sqlite3`) |
| Security | `bcryptjs` password hashing, JWT authentication, Helmet, CORS, rate limiting |

Real-time updates (Socket.IO) are optional in the assignment and are **not**
included. The app updates its screens instantly after every action you take.

## Folder structure

```
task-management-app/
├── backend/
│   ├── config/env.js              reads .env settings
│   ├── controllers/               authController.js, taskController.js
│   ├── database/                  db.js (connection), init.js (creates tables)
│   ├── middleware/                auth.js (JWT check), errorHandler.js
│   ├── routes/                    authRoutes.js, taskRoutes.js
│   ├── utils/                     validators.js, httpError.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/            reusable UI pieces
│   │   ├── context/               AuthContext, ToastContext
│   │   ├── hooks/useTasks.js      loads and changes tasks
│   │   ├── layouts/AppLayout.jsx  sidebar + page area
│   │   ├── pages/                 Landing, Login, Register, Dashboard, Tasks, Profile
│   │   ├── services/api.js        Axios setup
│   │   ├── utils/
│   │   ├── App.jsx, main.jsx, index.css
│   ├── index.html, vite.config.js, package.json
├── .gitignore
└── README.md
```

## Requirements

- Node.js 20 or newer (LTS recommended): https://nodejs.org
- VS Code (or any editor)

Check with `node -v` and `npm -v` in a terminal.

## Setup and run

You need **two terminals** (VS Code: Terminal > New Terminal, then use the
`+` / split button for a second one).

**Terminal 1 - backend**

```bash
cd backend
npm install
```

Create the settings file:

- Windows (PowerShell): `copy .env.example .env`
- macOS / Linux: `cp .env.example .env`

Open `backend/.env` and replace `JWT_SECRET` with a long random string. You can
generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the API:

```bash
npm run dev
```

You should see `API running on http://localhost:5000`. The database file
`backend/database/taskmanager.db` is created automatically on first start.

**Terminal 2 - frontend**

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Environment variables (`backend/.env`)

| Name | Purpose | Default |
| --- | --- | --- |
| `PORT` | API port | 5000 |
| `JWT_SECRET` | Secret used to sign login tokens (required) | none |
| `JWT_EXPIRES_IN` | Token lifetime | 7d |
| `CLIENT_ORIGIN` | Frontend address allowed by CORS | http://localhost:5173 |
| `DB_PATH` | SQLite file location (relative to `backend/`) | database/taskmanager.db |

The frontend needs no settings in development: Vite forwards `/api` requests to
port 5000 (see `frontend/vite.config.js`).

## Database

```
users(id PK, name, email UNIQUE, password [bcrypt hash], created_at)
tasks(id PK, user_id FK -> users.id, title, description,
      status [todo | in_progress | completed],
      priority [low | medium | high],
      due_date, created_at, updated_at)
```

## API

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | no | Create account, returns token + user |
| POST | `/api/auth/login` | no | Log in, returns token + user |
| GET | `/api/auth/me` | yes | Current user |
| GET | `/api/tasks` | yes | List my tasks |
| GET | `/api/tasks/:id` | yes | One of my tasks |
| POST | `/api/tasks` | yes | Create a task |
| PUT | `/api/tasks/:id` | yes | Update a task (send any fields to change) |
| DELETE | `/api/tasks/:id` | yes | Delete a task |

Authenticated requests send the header `Authorization: Bearer <token>`.
Every task query filters by the logged-in user's id, so another user's task
returns `404 Not found`.

## Manual test checklist

Authentication
- [ ] Register a new account (try mismatched passwords and a weak password to see errors)
- [ ] Register again with the same email: "already exists" error
- [ ] Log out, then log in; wrong password shows "Incorrect email or password"
- [ ] Visit http://localhost:5173/dashboard while logged out: redirected to login
- [ ] Open `backend/database/taskmanager.db` in a SQLite viewer: the password column is a `$2a$...` hash

Tasks
- [ ] Create, view details (click a title), edit, change status from the card, delete (confirm dialog appears)
- [ ] Dashboard numbers and the completion bar change after each action
- [ ] Search, filter by status, filter by priority, sort by due date

Authorization (two accounts, A and B)
- [ ] Create a task as A and note its id from the API. Log in as B and request it:
      `GET /api/tasks/<id>` with B's token returns 404; PUT and DELETE also return 404

Responsive
- [ ] Press F12, toggle the device toolbar, try a phone width: the menu button opens the sidebar; forms stay usable

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `JWT_SECRET is missing` | Create `backend/.env` from `.env.example` and set `JWT_SECRET` |
| `npm install` fails on `better-sqlite3` | Use Node LTS (20, 22 or 24). On Windows you may need "Desktop development with C++" from the Visual Studio Build Tools if no prebuilt file exists for your Node version |
| "Cannot reach the server" in the browser | Backend is not running, or is not on port 5000 |
| CORS error in the console | `CLIENT_ORIGIN` in `.env` must match the address in your browser; restart the backend |
| `EADDRINUSE` | Port is taken. Change `PORT` in `.env` and the proxy target in `vite.config.js` |
| `npm` not recognized | Install Node.js, then close and reopen VS Code |
| Blank page | Open the browser console (F12) and read the first red error |
| Want a fresh database | Stop the backend and delete `backend/database/taskmanager.db*` |

## Production build (optional)

```bash
cd frontend
npm run build
```

This creates `frontend/dist`. To deploy, host `dist` on a static host, run the
backend on a Node host, and set `VITE_API_URL` to the backend's `/api` URL
before building.
