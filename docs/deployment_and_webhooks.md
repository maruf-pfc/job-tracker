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

JobTracker supports real-time event dispatching for automated backups and notification alerts via [`webhookService.ts`](file:///home/maruf/Documents/GitHub/Resume%20Projects/job-tracker/client/src/services/webhookService.ts).

### Configuration Storage
Webhook credentials are configuration tokens managed securely in browser local storage and loaded in real-time:
- `n8n_webhook_url`: Webhook endpoint in n8n for automated Excel/Google Sheets workflow trigger.
- `discord_webhook_url`: Incoming Discord channel webhook URL.
- `telegram_token` & `telegram_chat_id`: Telegram Bot API token and target channel/group ID.

### Dispatched Events
1. **`application_created`**: Triggers when a new job application is submitted.
2. **`application_updated`**: Triggers when application details/notes/links are edited.
3. **`status_updated`**: Triggers when the application stage moves across the Kanban pipeline (e.g., `Applied` ➔ `Interview Scheduled` ➔ `Offer Received`).
4. **`test_event`**: Manual trigger from **Settings & Integrations** via the **Test Webhooks (Send Ping)** button to verify connectivity.

### A. n8n Live Excel Sync Webhook Payload
- **Trigger**: Application status update or new submission.
- **Payload Schema**:
  ```json
  {
    "event": "application_created",
    "eventLabel": "New Application Created",
    "timestamp": "2026-08-19T02:00:00.000Z",
    "application": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "company": "Google",
      "role": "Senior Full Stack Engineer",
      "status": "Applied",
      "jobUrl": "https://careers.google.com",
      "location": "Remote / Hybrid",
      "salaryRange": "$150,000 - $180,000",
      "appliedAt": "2026-08-19T02:00:00.000Z"
    }
  }
  ```

### B. Discord Embed Webhook Payload
- **Discord Bot Webhook**: Automatically formats rich embeds with dynamic color styling (Emerald for new applications, Indigo for stage progressions).
- **Payload Schema**:
  ```json
  {
    "username": "JobTracker Bot",
    "embeds": [
      {
        "title": "💼 New Application Created",
        "color": 1096065,
        "description": "**Senior Full Stack Engineer** at **Google**",
        "fields": [
          { "name": "Status", "value": "Applied", "inline": true },
          { "name": "Salary Range", "value": "$150,000 - $180,000", "inline": true },
          { "name": "Location", "value": "Remote / Hybrid", "inline": true }
        ],
        "footer": { "text": "JobTracker Automation Engine" },
        "timestamp": "2026-08-19T02:00:00.000Z"
      }
    ]
  }
  ```

### C. Telegram Bot Alerts
- Formats markdown messages and delivers directly via `https://api.telegram.org/bot<token>/sendMessage`.

