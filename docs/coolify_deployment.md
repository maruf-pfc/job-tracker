# 🚀 Deploying JobTracker on Coolify (with Neon DB or Docker)

This guide walks you through deploying **JobTracker** on **Coolify** (a self-hosted PaaS alternative to Heroku/Render/Vercel).

---

## 🛠️ Prerequisites

- A running **Coolify v4+** instance on your VPS/Server.
- A **Neon PostgreSQL Database** (or managed PostgreSQL database URL).
- Your GitHub repository connected to Coolify.

---

## ⚡ Method 1: Deploying via Dockerfile with Neon DB (Recommended)

Since you are using **Neon DB** (`DATABASE_URL`), deploying the **API Server** and **Web Client** directly via their respective **Dockerfiles** in Coolify is the cleanest and most reliable approach.

### Step 1: Deploy the ASP.NET Core 10 Web API (`server/JobTracker.API`)

1. Go to your Coolify Dashboard -> **Projects** -> **+ Add Resource**.
2. Select **Public / Private Repository**.
3. Repository URL: `https://github.com/maruf-pfc/job-tracker`.
4. Branch: `main`.
5. Build Pack: **Dockerfile**.
6. Set **Dockerfile Location**: `server/JobTracker.API/Dockerfile`.
7. Set **Base Directory**: `server/JobTracker.API` (or root `./`).
8. Port Mapping: `8080`.
9. **Environment Variables** (add under the Environment Variables tab):
   ```env
   DATABASE_URL=Host=your-neon-hostname.neon.tech; Database=neondb; Username=neondb_owner; Password=your_neon_password; SSL Mode=Require;
   JWT_KEY=your_at_least_32_characters_secret_jwt_key_here
   JWT_ISSUER=JobTrackerAPI
   JWT_AUDIENCE=JobTrackerClient
   ADMIN_EMAIL=demo@jobtracker.dev
   ADMIN_PASSWORD=Demo123!
   ```
10. Set Domain: `https://api-jobtracker.yourdomain.com`.
11. Click **Deploy**! Coolify will compile .NET 10, apply EF Core migrations, and seed showcase data into Neon DB automatically.

---

### Step 2: Deploy the React 19 SPA Frontend (`client`)

1. In Coolify, click **+ Add Resource** -> **Public / Private Repository**.
2. Select Repository: `maruf-pfc/job-tracker`.
3. Branch: `main`.
4. Build Pack: **Dockerfile**.
5. Set **Dockerfile Location**: `client/Dockerfile`.
6. Port Mapping: `80`.
7. Set Domain: `https://jobtracker.yourdomain.com`.
8. Click **Deploy**! Nginx will serve the React SPA with SPA client-side routing.

---

## 📦 Method 2: Deploying via Docker Compose

Coolify also supports deploying multi-container stacks directly from `docker-compose.yml`.

1. In Coolify, click **+ Add Resource** -> **Docker Compose**.
2. Point to repository `https://github.com/maruf-pfc/job-tracker` and `docker-compose.yml`.
3. Add your `DATABASE_URL` and `JWT_KEY` in Coolify's Environment Variables tab.
4. Click **Deploy**.

---

## ✅ Post-Deployment Verification

Once deployed:
- **Frontend App**: Visit `https://jobtracker.yourdomain.com`
- **Swagger API**: Visit `https://api-jobtracker.yourdomain.com/swagger`

Login with initial credentials:
- **Email**: `demo@jobtracker.dev`
- **Password**: `Demo123!`
