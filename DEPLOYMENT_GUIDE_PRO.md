# PACESETTERS Deployment Guide (Vercel & Render)

This guide provides step-by-step instructions for deploying the PACESETTERS application to a live production environment.

## 1. Prerequisites
- GitHub Repository: `makins18/pacesettersedu`
- Account on [Render.com](https://render.com) (for Backend & Redis)
- Account on [Vercel.com](https://vercel.com) (for Frontend)

## 2. Backend Deployment (Render.com)

### A. Redis Instance
1. Create a "New" > "Redis" on Render.
2. Note the **Internal Redis URL** (e.g., `redis://red-xxxx:6379`).

### B. Web Service (The API)
1. Create a "New" > "Web Service".
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Environment Variables**:
   - `DATABASE_URL`: `file:./prisma/dev.db` (For SQLite, this will reset on deploy. For persistent SQLite, use Render's "Disk" feature or switch to PostgreSQL).
   - `REDIS_URL`: Use the Internal Redis URL from Step A.
   - `JWT_SECRET`: A long random string.
   - `MONNIFY_API_KEY`: Your production API key.
   - `MONNIFY_SECRET_KEY`: Your production secret key.
   - `MONNIFY_CONTRACT_CODE`: Your production contract code.
5. Set **Start Command**: `npx prisma migrate deploy && npm start`.

## 3. Frontend Deployment (Vercel.com)

1. Create a "New Project" on Vercel.
2. Connect the same GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Set **Environment Variables**:
   - `NEXT_PUBLIC_BASE_URL`: The URL of your Render Web Service (e.g., `https://pacesetters-api.onrender.com`).
   - `NEXT_PUBLIC_MONNIFY_API_KEY`: Your production API key.
   - `NEXT_PUBLIC_MONNIFY_CONTRACT_CODE`: Your production contract code.
5. Vercel will automatically detect Next.js and deploy.

## 4. Persistent SQLite (Optional)
If you want to keep your data between deploys on Render:
1. Add a "Blueprints" `render.yaml` or use the "Disk" feature in the dashboard.
2. Mount a disk to `/app/prisma` in your Web Service.

## 5. Deployment with Docker (Render/DigitalOcean)
You can also use the `docker-compose.yml` and `Dockerfile` provided for platforms that support containerization (like Render's "Web Service" with Docker runtime).

## 6. Final 10-Step Launch Checklist

Follow these steps for a successful production launch:

1.  **Monnify Production**: Switch `MONNIFY_BASE_URL` to `https://api.monnify.com/api/v1` in Render environment variables.
2.  **API Keys**: Replace all `TEST` keys with `PROD` keys in both Vercel and Render.
3.  **Database Sync**: Run `npx prisma db push` on Render (via SSH or Shell) to ensure the DB is ready.
4.  **Redis Check**: Verify Render Redis is "Internal" or "Public" and the `REDIS_URL` matches exactly.
5.  **Environment Sync**: Ensure `NEXT_PUBLIC_BASE_URL` in Vercel points to your `xxx.onrender.com` backend.
6.  **CORS**: Verify backend `server.js` allows your Vercel domain.
7.  **Admin Update**: Log in to [your-site]/admin/login and delete all "Demo" books/events.
8.  **SMTP**: Test a "Contact Us" message to ensure `EMAIL_USER` can send mail.
9.  **SSL**: Wait for Vercel/Render to finish issuing SSL certificates.
10. **Done!**: Your site is live and professional.

---
*Created by Pacesetters Development Team*
