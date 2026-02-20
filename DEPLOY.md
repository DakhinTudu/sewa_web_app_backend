# Deploy SEWA Backend: Render + Neon (Free MVP)

**Architecture:** Render (Docker) → Neon (Serverless PostgreSQL)

- **Backend:** Render Free Web Service (Docker)
- **Database:** Neon Free PostgreSQL (persistent, SSL)
- **Cost:** $0 for early stage

---

## STEP 1 — Create PostgreSQL on Neon

1. Go to [Neon](https://neon.tech) and sign up (e.g. with GitHub).
2. **Create a new project**
   - Region: choose one close to India (e.g. **Singapore** or **Mumbai** if listed).
   - Database name: keep default or use `sewa`.
3. After creation, open **Connection details** and copy:
   - **Connection string** (looks like):
     ```text
     postgresql://USER:PASSWORD@ep-xxxx.neon.tech/neondb?sslmode=require
     ```
   - Or note **Host**, **User**, **Password**, **Database** separately.

**Convert to JDBC URL for Spring Boot:**

- Neon gives: `postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require`
- Spring Boot needs: `jdbc:postgresql://ep-xxx.neon.tech:5432/neondb?sslmode=require`
- So change the scheme to `jdbc:postgresql://`, add `:5432` after the host, and **keep `?sslmode=require`** (Neon requires SSL).

Example:

```text
jdbc:postgresql://ep-xxxx.neon.tech:5432/neondb?sslmode=require
```

Keep the username and password for Step 3.

---

## STEP 2 — Prepare Repo (Already Done)

- **No DB credentials in code** — use environment variables only.
- **Dockerfile** — multistage, uses `PORT` from Render.
- **Production config** — `application-prod.properties` uses env vars and Hikari pool size 5 for Neon.

---

## STEP 3 — Create Web Service on Render

1. Go to [Render](https://render.com) and sign in (e.g. GitHub).
2. **Dashboard → New → Web Service**
3. Connect your **GitHub** account and select the repo **Santal-Engineers-Welfare-Association**.
4. Configure:
   - **Name:** e.g. `sewa-backend`
   - **Region:** choose closest to your users (e.g. Singapore).
   - **Runtime:** **Docker** (Render will use the repo’s `Dockerfile`).
   - **Branch:** `main` (or your default).

---

## STEP 4 — Environment Variables on Render

In the Web Service → **Environment** tab, add:

| Key | Value | Required |
|-----|--------|----------|
| `SPRING_PROFILES_ACTIVE` | `prod` | Yes |
| `SPRING_DATASOURCE_URL` | See below (your Neon JDBC URL) | Yes |
| `SPRING_DATASOURCE_USERNAME` | Your Neon user (e.g. `neondb_owner`) | Yes |
| `SPRING_DATASOURCE_PASSWORD` | Your Neon password (from Neon dashboard) | Yes |
| `SEWA_JWT_SECRET` | Long random string (e.g. 64+ chars) | Yes |
| `SEWA_JWT_EXPIRATION_MS` | `86400000` (optional; 24h default) | No |

**Your Neon JDBC URL (ap-southeast-1):**

Use this exact URL in `SPRING_DATASOURCE_URL` (password goes in the separate env var below, not in the URL):

```text
jdbc:postgresql://ep-flat-darkness-a14qa7ow-pooler.ap-southeast-1.aws.neon.tech:5432/neondb?sslmode=require
```

Then set:

- `SPRING_DATASOURCE_USERNAME` = `neondb_owner`
- `SPRING_DATASOURCE_PASSWORD` = your Neon database password (from Neon dashboard → Connection details; never commit this).

**Security:** If you ever pasted your Neon password in chat or in a file, rotate it in the Neon dashboard (Database → Reset password) and update `SPRING_DATASOURCE_PASSWORD` on Render.

**Bulk paste:** The repo has `env.for-render.txt` with all keys (and placeholders for password and JWT). Fill in the two placeholders, then in Render → Environment use **“Add from .env”** or paste the lines as key/value. Do not commit the file after adding real secrets; for local use you can rename a copy to `.env` (`.env` is in `.gitignore`).

**Generate a safe JWT secret (one option):**

```bash
openssl rand -hex 32
```

Paste the result as `SEWA_JWT_SECRET`. **Do not commit this value to Git.**

---

## STEP 5 — Deploy

1. Click **Create Web Service**.
2. Render will:
   - Clone the repo
   - Build the Docker image (Maven build then JRE stage)
   - Start the container with `PORT` set
3. Wait for the first deploy to finish (build can take a few minutes).
4. Your API will be at: **`https://<your-service-name>.onrender.com`**

Test:

```bash
curl https://<your-service-name>.onrender.com/api/v1/notices
```

(or any public endpoint you have)

---

## Troubleshooting

- **"No open ports detected" / deploy exits:** The app must listen on the port Render provides (`PORT` env var, often 10000). The Dockerfile and `application-prod.properties` are set so the app binds to `0.0.0.0:${PORT}`. If you still see this, confirm in Render that no build or run override is changing the port.
- **App exits during "HikariPool-1 - Starting...":** Usually a DB connection problem. Check Neon credentials (`SPRING_DATASOURCE_URL`, `USERNAME`, `PASSWORD`), that the URL includes `?sslmode=require`, and that Neon project is not paused. Connection timeouts are set to 30s in prod so Neon cold start can complete.

---

## Free Tier Behaviour

| | Render Free | Neon Free |
|--|-------------|-----------|
| **Sleep** | Service sleeps after ~15 min inactivity | Compute can scale to zero; data persists |
| **Cold start** | First request after sleep: ~30–60 s | Connection may be slightly slower on first use |
| **Data** | Stateless; no local storage | **Database is persistent** |

For an MVP this is fine: data is safe, and cold starts are acceptable.

---

## What Not To Do

- Do **not** run PostgreSQL in Docker on Render (use Neon instead).
- Do **not** put DB or JWT secrets in `application.properties` or in Git.
- Do **not** rely on the default JWT secret in production; always set `SEWA_JWT_SECRET` on Render.

---

## Optional: Blueprint

The repo includes `render.yaml` as a blueprint. You can use **New → Blueprint** in Render and point it at this repo to create the Web Service from the spec; then add the environment variables in the dashboard as in Step 4.

---

## Frontend (Later)

Point your frontend (e.g. Vite app on Vercel/Netlify or same Render) to:

```text
https://<your-service-name>.onrender.com
```

Configure CORS on the backend if your frontend is on a different domain (already common in Spring Boot + React setups).
