# Deploy SEWA Frontend on Netlify (Free)

**Stack:** Vite + React → Netlify static hosting. API calls go to your **Render** backend.

---

## Prerequisites

- Backend already deployed on Render (you have a URL like `https://sewa-backend.onrender.com`).
- Repo pushed to GitHub (Netlify will build from it).

---

## Step 1 — Connect repo to Netlify

1. Go to [Netlify](https://netlify.com) and sign in (e.g. with GitHub).
2. **Add new site** → **Import an existing project**.
3. Choose **GitHub** and select the repo **Santal-Engineers-Welfare-Association**.
4. Configure:
   - **Branch:** `main` (or your default).
   - **Base directory:** `sewa-frontend` ← **important** (so Netlify builds the frontend only).
   - **Build command:** `npm run build` (or leave blank; `netlify.toml` sets it).
   - **Publish directory:** `dist` (or leave blank; `netlify.toml` sets it).

---

## Step 2 — Set environment variable

In the same screen (or later: **Site settings → Environment variables**):

| Key | Value |
|-----|--------|
| `VITE_API_BASE_URL` | `https://YOUR-RENDER-APP.onrender.com/api/v1` |

Replace `YOUR-RENDER-APP` with your actual Render service name (e.g. `sewa-backend` → `https://sewa-backend.onrender.com/api/v1`).

You can use `env.for-netlify.txt` as a template: set `VITE_API_BASE_URL` to your full Render API base URL including `/api/v1`.

---

## Step 3 — Deploy

Click **Deploy site**. Netlify will:

- Install dependencies (`npm install`)
- Run `npm run build` (from `netlify.toml` or the UI)
- Publish the `dist` folder

Your site will be at `https://random-name-12345.netlify.app` (or a custom domain you add).

---

## SPA routing

`netlify.toml` includes a redirect so all routes (e.g. `/dashboard`, `/login`) serve `index.html`; React Router then handles the path. No extra config needed.

---

## Summary

| Item | Value |
|------|--------|
| Base directory | `sewa-frontend` |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Env var | `VITE_API_BASE_URL` = your Render URL + `/api/v1` |

Backend CORS is already set to allow any origin, so your Netlify URL will work with the Render API.
