# Video Sharing Platform Architecture

This repository is a production-oriented full-stack video sharing application, similar to a simplified YouTube.

## Tech Stack

- Frontend: Next.js 16, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Pydantic, JWT authentication
- Database: PostgreSQL
- Upload storage: Local filesystem, with paths stored in PostgreSQL
- API style: REST

## Folder Structure

```text
.
├── frontend/
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   ├── .env.example
│   └── src/
│       ├── app/
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── login/page.tsx
│       │   ├── register/page.tsx
│       │   ├── profile/page.tsx
│       │   ├── dashboard/page.tsx
│       │   ├── upload/page.tsx
│       │   ├── search/page.tsx
│       │   └── watch/[id]/page.tsx
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── VideoCard.tsx
│       │   ├── VideoForm.tsx
│       │   ├── ProtectedRoute.tsx
│       │   ├── Loading.tsx
│       │   └── EmptyState.tsx
│       ├── lib/
│       │   ├── api.ts
│       │   ├── auth.tsx
│       │   └── constants.ts
│       └── types/
│           └── index.ts
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   ├── app/
│   │   ├── main.py
│   │   ├── db/
│   │   │   ├── init_db.py
│   │   │   └── session.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── category.py
│   │   │   ├── tag.py
│   │   │   ├── video.py
│   │   │   └── view.py
│   │   ├── schemas/
│   │   │   ├── token.py
│   │   │   ├── user.py
│   │   │   ├── category.py
│   │   │   └── video.py
│   │   ├── crud/
│   │   │   ├── users.py
│   │   │   ├── categories.py
│   │   │   └── videos.py
│   │   ├── services/
│   │   │   └── storage.py
│   │   └── api/
│   │       ├── deps.py
│   │       └── routers/
│   │           ├── auth.py
│   │           ├── users.py
│   │           ├── categories.py
│   │           ├── videos.py
│   │           └── health.py
│   └── uploads/
│       ├── videos/
│       └── thumbnails/
├── deployment/
│   ├── ubuntu-vps.md
│   ├── vercel.md
│   └── postgresql.md
└── docker-compose.yml
```

## Backend Boundaries

- `models`: SQLAlchemy database tables and relationships.
- `schemas`: Pydantic request and response contracts.
- `crud`: Database queries and mutations.
- `api/routers`: REST endpoints grouped by feature.
- `services/storage.py`: Local upload validation and persistence.
- `core/security.py`: Password hashing and JWT creation/validation.

## Database Design

- `users`: account identity, password hash, profile metadata.
- `categories`: fixed upload categories.
- `videos`: video metadata, file paths, owner, category, view count.
- `tags`: normalized tags linked to videos through `video_tags`.
- `views`: per-view records with optional user and IP tracking.

## REST API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/categories`
- `GET /api/videos`
- `GET /api/videos/latest`
- `GET /api/videos/trending`
- `GET /api/videos/search`
- `GET /api/videos/{video_id}`
- `POST /api/videos/{video_id}/view`
- `POST /api/videos`
- `PUT /api/videos/{video_id}`
- `DELETE /api/videos/{video_id}`
- `GET /api/videos/me/dashboard`

## Frontend Routes

- `/`: homepage with latest, trending, and category filtering.
- `/login`: login form.
- `/register`: registration form.
- `/profile`: protected user profile.
- `/dashboard`: protected video dashboard.
- `/upload`: protected upload/edit form.
- `/watch/[id]`: video player and related videos.
- `/search`: search results with pagination.

## Deployment Model

- Frontend deploys to Vercel with `NEXT_PUBLIC_API_BASE_URL` pointing to the backend.
- Backend deploys to an Ubuntu VPS using Gunicorn/Uvicorn behind Nginx.
- PostgreSQL runs on the VPS or managed Postgres.
- Local uploads are served by FastAPI during the initial storage phase and can later be migrated to S3-compatible storage without changing the public API contract.
