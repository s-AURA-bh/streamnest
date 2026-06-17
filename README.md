# StreamNest

StreamNest is a complete full-stack video sharing website built with Next.js, FastAPI, PostgreSQL, SQLAlchemy, JWT authentication, Tailwind CSS, and local file uploads.

## Project Layout

- `frontend/`: Next.js TypeScript application.
- `backend/`: FastAPI REST API.
- `deployment/`: Vercel, Ubuntu VPS, and PostgreSQL deployment guides.
- `docker-compose.yml`: local PostgreSQL service.
- `ARCHITECTURE.md`: full folder structure and system overview.

## Local Backend

```bash
docker compose up -d postgres
cd backend
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.db.init_db
uvicorn app.main:app --reload
```

API docs run at:

```text
http://localhost:8000/docs
```

## Local Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The app runs at:

```text
http://localhost:3000
```

## Main Features

- JWT register/login/logout flow.
- Protected profile, upload, and dashboard pages.
- MP4 video upload with thumbnail image upload.
- Latest, trending, category-filtered, and related video lists.
- Search by title, description, and tags with pagination.
- User dashboard with uploaded videos, edits, deletes, and total views.
- PostgreSQL schema for users, videos, categories, tags, and views.
