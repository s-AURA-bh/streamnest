# PostgreSQL Setup

## Local Docker

```bash
docker compose up -d postgres
```

Use this connection string in `backend/.env`:

```text
DATABASE_URL=postgresql+psycopg://videohub:videohub_password@localhost:5432/videohub
```

Initialize tables and seed categories:

```bash
cd backend
python -m app.db.init_db
```

## Ubuntu PostgreSQL

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql
```

Inside `psql`:

Generate a strong password:

```bash
openssl rand -base64 32
```

Inside `psql`, using the generated password:

```sql
CREATE USER videohub WITH PASSWORD 'c3RyZWFtbmVzdF9kZW1vX3Bhc3N3b3JkXzIwMjY=';
CREATE DATABASE videohub OWNER videohub;
GRANT ALL PRIVILEGES ON DATABASE videohub TO videohub;
\q
```

Use:

```text
DATABASE_URL=postgresql+psycopg://videohub:c3RyZWFtbmVzdF9kZW1vX3Bhc3N3b3JkXzIwMjY=@127.0.0.1:5432/videohub
```
