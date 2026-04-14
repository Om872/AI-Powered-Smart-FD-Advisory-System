# 🚀 Deployment Guide

This project is now fully configured for permanent and free deployment using **Render** (for the backend) and **Vercel** (for the frontend).

## 1️⃣ Backend Deployment (Render - Free)

We use **Render** Web Services for the Python/FastAPI backend. It natively supports Python and provides a free tier.
Since the ML models (`models/`) and datasets (`data/`) are large and dynamically built, the deployment is configured to automatically retrain the ML model during the build process, so it's always ready.

**Steps:**
1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com) and sign in with GitHub.
3. Click **New +** -> **Web Service**.
4. Important: Don't select the default repository connection. Instead, scroll down and look for **"Use existing render.yaml"** or just allow Render to detect the `render.yaml` file in the root of your repository. 
   - *(If you just connect the repo manually, ensure you set the **Root Directory** to `backend`, **Build Command** to `pip install -r requirements.txt && py train_model.py`, and **Start Command** to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.)*
5. Add your `OPENROUTER_API_KEY` to the **Environment Variables** in Render settings.
6. Click **Deploy**. Render will install requirements, train the AI model, and start the FastAPI server.
7. Note down your backend URL (e.g., `https://fd-advisory-backend.onrender.com`).

## 2️⃣ Frontend Deployment (Vercel - Free)

We use **Vercel** for the Vite/React frontend. It provides global CDN caching and is completely free for frontend hosting.

**Steps:**
1. Go to [Vercel](https://vercel.com) and sign in with GitHub.
2. Click **Add New** -> **Project** and select your repository.
3. In the project configuration:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
4. In the **Environment Variables** section, add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your Render URL (e.g., `https://fd-advisory-backend.onrender.com` — *no trailing slash*)
5. Click **Deploy**. Vercel will build and serve your frontend. 

## 🔄 Notes on Free Tier limitations
- **Render's Free Tier** spines down after 15 minutes of inactivity. When you visit it after an idle period, it can take ~50 seconds to wake up (your frontend might show loading during this time).
- The Render free tier uses an ephemeral disk. The internal SQLite database (`fd_advisory.db`) will start fresh whenever the server sleeps and wakes up. For a college presentation, this is completely fine. If you want a permanent database in the future, you can migrate to Supabase Postgres (also free).
