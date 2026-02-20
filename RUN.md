# How to Run SEWA (Frontend + Backend)

Use these ports when running locally:

| App      | Port | URL                      |
|----------|------|--------------------------|
| Backend  | 8080 | http://localhost:8080    |
| Frontend | 5173 | http://localhost:5173    |

The frontend talks to the API at `http://localhost:8080/api/v1` by default.

---

## 1. Run the Backend (port 8080)

From the **project root** (where `pom.xml` is):

```bash
# Optional: compile first
mvn clean compile

# Run Spring Boot (starts on port 8080)
mvn spring-boot:run
```

- API base: **http://localhost:8080**
- API v1: **http://localhost:8080/api/v1**
- Ensure PostgreSQL is running (see `src/main/resources/application.properties` for DB URL).

---

## 2. Run the Frontend (port 5173)

From the **sewa-frontend** folder:

```bash
cd sewa-frontend

# Install dependencies (first time only)
npm install

# Start dev server (starts on port 5173)
npm run dev
```

- App: **http://localhost:5173**
- To point at another backend, create `sewa-frontend/.env.local`:
  ```env
  VITE_API_BASE_URL=http://localhost:8080/api/v1
  ```

---

## 3. Run Both

1. Start **backend** in one terminal: `mvn spring-boot:run` (from project root).
2. Start **frontend** in another: `cd sewa-frontend` then `npm run dev`.
3. Open **http://localhost:5173** in your browser.

---

## Port summary

- **Backend:** `8080` (set in `src/main/resources/application.properties` → `server.port=8080`).
- **Frontend:** `5173` (set in `sewa-frontend/vite.config.ts` → `server.port: 5173`).
