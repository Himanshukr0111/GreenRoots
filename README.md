# GreenRoots — Hyperlocal Gardening Marketplace (MERN Stack)

GreenRoots connects local home gardeners, terrace growers, and plant enthusiasts across Indian neighbourhoods to buy, sell, and exchange healthy plants, cuttings, organic compost, and garden essentials.

---

## Architecture Overview

- **Frontend**: React 19, Vite, Tailwind-styled components, Lucide icons.
- **Backend**: Node.js, Express 5, Mongoose ODM, JWT Authentication, bcrypt password hashing.
- **Database**: MongoDB Atlas (Collection: `greenroots`).
- **Cloud Media**: Cloudinary image storage with automatic optimization and size validation.
- **AI Assistant**: Google Gemini AI (`@google/genai` using `gemini-3.7-flash`) for hyperlocal plant identification and care guidance.

---

## Local Development

### 1. Backend Setup
```bash
cd Backend
npm install
npm run dev
```
Runs Express on `http://localhost:5000`.

### 2. Frontend Setup
```bash
# In the project root (GreenRoots)
npm install
npm run dev
```
Runs Vite on `http://localhost:5173` with automatic proxy to the Express backend.

---

## Production Deployment Guide

### A. Deploy Backend to Render

1. Create a **New Web Service** on [Render](https://dashboard.render.com).
2. Connect your GitHub repository `GreenRoots`.
3. Configure the service settings:
   - **Root Directory**: `Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Health Check Path**: `/api/health`
4. In **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = *(Your MongoDB Atlas connection string)*
   - `JWT_SECRET` = *(Your secure JWT secret string)*
   - `CLIENT_URL` = *(Your Vercel frontend URL, e.g. `https://your-app.vercel.app`)*
   - `CLOUDINARY_CLOUD_NAME` = *(Your Cloudinary Cloud Name)*
   - `CLOUDINARY_API_KEY` = *(Your Cloudinary API Key)*
   - `CLOUDINARY_API_SECRET` = *(Your Cloudinary API Secret)*
   - `GEMINI_API_KEY` = *(Your Google AI Studio Gemini API Key)*
5. In **MongoDB Atlas**:
   - Go to **Security** &rarr; **Network Access**.
   - Click **Add IP Address** &rarr; **Allow Access from Anywhere** (`0.0.0.0/0`) so Render's cloud servers can connect to your database cluster.

---

### B. Deploy Frontend to Vercel

1. Create a **New Project** on [Vercel](https://vercel.com/new).
2. Import your GitHub repository `GreenRoots`.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (or leave default root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-backend-service.onrender.com` *(your deployed Render backend URL, without trailing slash)*
5. Click **Deploy**.
