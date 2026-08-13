# task-management-frontend

React client for the Team Task Management SaaS (Taskflow).

## Stack

- React 19 (Create React App)
- React Router
- Axios + JWT in `localStorage`
- `@dnd-kit` kanban drag-and-drop

## Features

- Signup / login / protected routes
- Team create, invite link accept, sidebar team list
- Kanban board (`TODO` / `DOING` / `DONE`) with drag-and-drop
- Task CRUD, assignee, due-date badges & alerts
- Comments on tasks
- Profile name update
- Admin-only task delete + invite creation

## Local setup

1. Backend running at `http://localhost:8080` (see backend README).
2. Install & start:

```bash
npm install
cp .env.example .env   # if needed
npm start
```

App: `http://localhost:3000`

### Environment

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend base URL (no trailing slash) |

`.env.example`:

```
REACT_APP_API_URL=http://localhost:8080
```

### Demo login (with backend seed)

```
admin@demo.com / password123
member@demo.com / password123
```

Enable seed on backend: `APP_SEED_ENABLED=true`

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server |
| `npm run build` | Production build → `build/` |
| `npm test` | CRA tests |

## Project structure

```
src/
  api/          Axios client + domain APIs
  auth/         AuthContext, route guards
  components/   Task modal, comments, kanban cards
  layout/       App shell (sidebar + topbar)
  pages/        Login, Signup, Overview, Board, Profile, Invite
  utils/        task form + due-date helpers
```

## Deploy (Vercel)

1. Import this repo in Vercel.
2. Framework preset: **Create React App**.
3. Environment variable:
   - `REACT_APP_API_URL` = your Render backend URL  
     e.g. `https://task-management-backend.onrender.com`
4. Deploy.
5. Copy the Vercel URL into backend `CORS_ALLOWED_ORIGINS`.

`vercel.json` rewrites SPA routes to `index.html`.

## Pairing with backend

Interview talking point:

> I built a team-based task management system with role-based access control and RESTful APIs using Spring Boot, and a React client with JWT auth and a drag-and-drop kanban board.
