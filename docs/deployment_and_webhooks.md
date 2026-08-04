# 🚀 Deployment & Webhooks Integration Guide

## 1. Docker Compose Deployment Architecture

JobTracker provides a production-ready `docker-compose.yml` for multi-container orchestration.

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Host                            │
│                                                             │
│  ┌─────────────────┐   ┌─────────────────┐   ┌───────────┐  │
│  │   Nginx Client  │   │  ASP.NET API    │   │ PostgreSQL│  │
│  │   (Port 80)     │──>│  (Port 8080)    │──>│ (Port 5432│  │
│  └─────────────────┘   └─────────────────┘   └───────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Launching with Docker Compose
```bash
docker compose up --build -d
```

---

## 2. Vercel Monorepo Deployment Configuration

For hosting the static React frontend on Vercel:

Root [`vercel.json`](file:///home/maruf/Documents/GitHub/Resume%20Projects/job-tracker/vercel.json):
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

> 📌 **Key Monorepo Rule**: When Vercel sets the Root Directory to `client`, build scripts execute inside `client/`. Never include `cd client` in Vercel build commands.

---

## 3. Webhook Integration Suite

JobTracker supports real-time event dispatching for automated backups and notification alerts.

### A. n8n Live Excel Sync Webhook
- **Trigger**: Application status update or new submission.
- **Payload**:
  ```json
  {
    "event": "application_updated",
    "applicationId": "...",
    "company": "Google",
    "role": "Senior Frontend Engineer",
    "status": "Interview Scheduled",
    "timestamp": "2026-08-04T12:00:00Z"
  }
  ```

### B. Discord & Telegram Alert Webhooks
- **Discord Bot Webhook**: Receives rich markdown embeds whenever application status transitions (e.g. `Applied` -> `Interview` -> `Offer`).
- **Telegram Bot Webhook**: Sends real-time chat notifications for upcoming follow-up reminders.
