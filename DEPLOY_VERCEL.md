# ⚡ Vercel Deployment Guide (Full Stack)

To host both your Frontend and Backend on Vercel, follow these steps.

## 1. Prepare your Database (Vercel Postgres)
Vercel does not support SQLite files. You must use a database like **Vercel Postgres**.
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Storage** -> **Create Database** -> **Postgres**.
3. Create a new store (e.g., `pacesetters-db`).
4. Once created, click **Connect** to your project (you'll do this after Step 2).

---

## 2. Deploy the Backend (Project 1)
1. Click **Add New** -> **Project** in Vercel.
2. Select your GitHub repository.
3. In the "Configure Project" screen, click **Edit** next to **Root Directory**.
4. Select the `backend` folder.
5. **Environment Variables**:
   - Vercel will automatically add `POSTGRES_URL` if you connected the storage.
   - Set `DATABASE_URL` to the value of `POSTGRES_PRISMA_URL` or `POSTGRES_URL`.
   - Add all other keys from `backend/.env.example` (JWT_SECRET, CLOUDINARY, MONNIFY, etc.).
6. Click **Deploy**.
7. Once finished, you will get a URL like `https://backend-xxx.vercel.app`. **Copy this.**

---

## 3. Deploy the Frontend (Project 2)
1. In Vercel, click **Add New** -> **Project** again.
2. Select the same GitHub repository.
3. For **Root Directory**, select the `frontend` folder.
4. **Environment Variables**:
   - Add `NEXT_PUBLIC_BASE_URL`: (Paste your Backend URL from Step 2).
   - Add `NEXT_PUBLIC_MONNIFY_API_KEY`: (Your Monnify Live Key).
   - Add `NEXT_PUBLIC_MONNIFY_CONTRACT_CODE`: (Your Monnify Contract Code).
5. Click **Deploy**.

---

## 4. Final Monnify Config
Update your Monnify Dashboard (Settings -> Webhook URL) to point to your new backend:
`https://your-backend-vercel-url.vercel.app/api/monnify/webhook`

---

## 5. Sync Database
Once the backend is live, run this command from your local computer in the `backend` folder to set up the tables in Vercel Postgres:
```bash
npx prisma db push
```
*(Make sure your local .env temporarily points to the Vercel DATABASE_URL to run this)*
