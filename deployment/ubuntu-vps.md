# Backend Deployment on Ubuntu VPS

## 1. Install System Packages

```bash
sudo apt update
sudo apt install -y python3.12 python3.12-venv python3-pip nginx postgresql-client
```

## 2. Copy Backend

Place the `backend/` directory at:

```text
/opt/streamnest/backend
```

## 3. Configure Environment

```bash
cd /opt/streamnest/backend
cp .env.example .env
nano .env
```

Set:

```text
ENVIRONMENT=production
SECRET_KEY=9f7d2e5f40c14470993711c3412b8db23e85d1b219ee28f7d7924766535f3c19
DATABASE_URL=postgresql+psycopg://videohub:c3RyZWFtbmVzdF9kZW1vX3Bhc3N3b3JkXzIwMjY=@127.0.0.1:5432/videohub
BACKEND_CORS_ORIGINS=https://streamnest.vercel.app
MEDIA_BASE_URL=https://api.streamnest.com/media
```

Generate a unique production secret with `openssl rand -hex 32` before real deployment.

## 4. Install Python Dependencies

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python -m app.db.init_db
```

## 5. Systemd Service

Create `/etc/systemd/system/streamnest.service`:

```ini
[Unit]
Description=StreamNest FastAPI backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/streamnest/backend
EnvironmentFile=/opt/streamnest/backend/.env
ExecStart=/opt/streamnest/backend/.venv/bin/gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000 --workers 3
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo chown -R www-data:www-data /opt/streamnest/backend
sudo systemctl daemon-reload
sudo systemctl enable --now streamnest
```

## 6. Nginx Reverse Proxy

Create `/etc/nginx/sites-available/streamnest`:

```nginx
server {
    listen 80;
    server_name api.streamnest.com;

    client_max_body_size 600M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/streamnest /etc/nginx/sites-enabled/streamnest
sudo nginx -t
sudo systemctl reload nginx
```

Add TLS with Certbot before production traffic.
