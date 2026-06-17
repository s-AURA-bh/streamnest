# Frontend Deployment on Vercel

## 1. Project Settings

- Root directory: `frontend`
- Framework preset: Next.js
- Build command: `npm run build`
- Output directory: `.next`

## 2. Environment Variable

Set this in Vercel:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.streamnest.com/api
```

## 3. Deploy

Connect the repository in Vercel and deploy the `frontend` project.

After deployment, update backend CORS:

```text
BACKEND_CORS_ORIGINS=https://streamnest.vercel.app
```

Restart the backend service:

```bash
sudo systemctl restart streamnest
```
