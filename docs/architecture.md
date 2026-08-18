# 🏗 System Architecture & Design

## Overview

JobTracker follows **Clean Architecture** principles separating domain entities, data access persistence, business services, and presentation controllers.

```
┌─────────────────────────────────────────────────────────────┐
│                 React 19 Frontend (Vite 8)                  │
│       TailwindCSS v4 • Framer Motion • TanStack Query       │
└──────────────────────────────┬──────────────────────────────┘
                               │  REST API (JSON over HTTPS)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 ASP.NET Core 10 Web API                     │
│      JWT Auth • Rate Limiting • Controllers & Middleware     │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│      Business Services      │ │      AI Career Advisor      │
│ Applications, Retrospectives│ │ Gemini Flash + SHA256 Cache │
└──────────────┬──────────────┘ └──────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Entity Framework Core 10 (Npgsql)               │
│                  AppDbContext & Migrations                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               PostgreSQL Database (Neon Cloud)              │
│       UTC Timestamps • Multi-Tenant Foreign Keys & Indexes  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Career Advisor Smart Caching Architecture

To achieve sub-second response times and prevent unnecessary AI API costs, the AI Advisor implements a cryptographic pipeline state signature:

```mermaid
sequenceDiagram
    autonumber
    actor User as Client (Dashboard)
    participant API as AiAdvisorController
    participant Svc as AiAdvisorService
    participant DB as PostgreSQL (UserAiInsights)
    participant AI as Google Gemini 3.6 Flash

    User->>API: GET /api/aiadvisor/insights
    API->>Svc: GetCareerAdvisorInsightsAsync(forceRefresh=false)
    Svc->>Svc: Compute SHA-256 Hash of (Apps + Retrospectives)
    Svc->>DB: Query UserAiInsights where UserId & DataHash match
    alt Hash Matches (Cache Hit)
        DB-->>Svc: Return Cached UserAiInsight Entity
        Svc-->>API: Return AiCareerInsightDto (isCached: true)
        API-->>User: 200 OK (Instant Response)
    else Hash Differs or Force Refresh (Cache Miss)
        Svc->>AI: Request Structured JSON Diagnostic via REST
        AI-->>Svc: Return Candidate Diagnostic & Action Plan
        Svc->>DB: Upsert UserAiInsight (New DataHash + Timestamp)
        Svc-->>API: Return AiCareerInsightDto (isCached: false)
        API-->>User: 200 OK (Fresh Insight)
    end
```

---

## 🔒 Multi-Tenant Data Isolation

- **Per-User Entities**: `JobApplication`, `RejectionRetrospective`, `UserProfile`, and `UserAiInsight` strictly enforce `UserId == currentUser.UserId`.
- **Hybrid Lookups**: `Company`, `JobRole`, and `SourcePlatform` support a hybrid lookup model:
  - Global standard templates have `UserId == null` (visible to all users as defaults).
  - User-created custom records have `UserId == currentUser.UserId` (visible, editable, and deletable only by the creator).
