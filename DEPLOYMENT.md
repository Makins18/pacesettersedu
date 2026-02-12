# 🚀 Pacesetters Deployment Guide

Follow these steps to get your website live with fully functional Monnify payments.

## Prerequisites
1. A **GitHub** account.
2. A **Monnify** Live account (to get your production API keys).
3. Accounts on **Render.com** (for Backend) and **Vercel.com** (for Frontend).

---

## Step 1: Push Code to GitHub
Ensure all your changes are committed and pushed to your GitHub repository.
```bash
git add .
git commit -m "Production ready release"
git push origin main
```

---

## Step 2: Deploy Backend (Render.com)
1. Log in to [Render.com](https://render.com).
2. Create a **New Web Service**.
3. Connect your GitHub repository.
4. Select the `backend` folder as the **Root Directory**.
5. Set the **Build Command**: `npm install`
6. Set the **Start Command**: `npm start`
7. **Crucial**: Go to **Environment** and add the variables from `backend/.env.example`.
8. Once deployed, Render will give you a URL (e.g., `https://pacesetters-api.onrender.com`). **Copy this.**

---

## Step 3: Deploy Frontend (Vercel.com)
1. Log in to [Vercel.com](https://vercel.com).
2. Create a **New Project**.
3. Connect your GitHub repository.
4. Set the `frontend` folder as the **Root Directory**.
5. **Environment Variables**:
   - Add `NEXT_PUBLIC_BASE_URL`: (Paste your Render Backend URL).
   - Add `NEXT_PUBLIC_MONNIFY_API_KEY`: (Your Monnify Live Key).
   - Add `NEXT_PUBLIC_MONNIFY_CONTRACT_CODE`: (Your Monnify Contract Code).
6. Click **Deploy**.

---

## Step 4: Finalize Monnify Webhooks
1. Go to your **Monnify Dashboard**.
2. Go to **Settings -> Developers -> Webhook URL**.
3. Set the Webhook URL to: `https://your-backend-url.onrender.com/api/monnify/webhook`
4. Now, Monnify can send payment confirmation to your live site!

---

## 💡 Pro Tips for 1000+ Users
- **Database**: The app uses SQLite (`dev.db`). On Render/Railway, ensure you use a "Disk" to persist the database file, or switch `DATABASE_URL` to a PostgreSQL database for even better performance.
- **Images**: Your Cloudinary integration is production-ready and will handle high traffic perfectly.
