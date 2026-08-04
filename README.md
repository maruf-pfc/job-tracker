# Job Tracker

A full-stack production-ready job application tracking platform built for structured career management, application workflow tracking, AI career coaching, and productivity-focused analytics.

Designed as a personal career operating system — not just a CRUD dashboard.

---

## Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Animations & Scrolling**: Framer Motion (`framer-motion`), Lenis Smooth Scroll (`lenis`), AutoAnimate (`@formkit/auto-animate`)
- **Package Manager & Tooling**: Bun, Vitest, React Testing Library
- **UI & State**: TailwindCSS v4, Recharts, Zustand, React Query, Lucide Icons

### Backend
- **Framework**: ASP.NET Core 10
- **Authentication**: ASP.NET Core Identity + JWT Tokens + Refresh Token Rotation + Rate Limiting
- **Database & ORM**: PostgreSQL (Neon Cloud / Local), Entity Framework Core 10
- **Logging & Security**: Serilog Request Logging, Security Headers (`nosniff`, `DENY`, `XSS-Protection`)
- **Testing**: xUnit, Moq, EF Core InMemory

---

## Features & Highlights

### 1. Gemini Pro AI Career Coach
- **Real-Time AI Analysis**: Integrates with Google Gemini API models (`gemini-1.5-pro`, `gemini-2.0-flash`) to generate personalized application velocity assessments, actionable DOs, and DON'Ts.
- **Environment & Key Management**: Automatically resolves `VITE_GEMINI_API_KEY` from `.env` or settings.

### 2. Granular Profile & Address Management
- **Personal Details**: Complete support for Name (English & Bangla), DOB, NID, Quota, Disability status.
- **Granular Address Fields**: Full PostgreSQL database synchronization for all 17 granular address fields (Present & Permanent Division, District, Upazila, Union, Police Station, Post Office, Post Code).

### 3. Smooth UI & Animation Suite
- **Lenis Inertia Smooth Scroll**: Fluid momentum scrolling across all app views.
- **Framer Motion Micro-Interactions**: Smooth page entrances, modal transitions, and interactive tabs.
- **Skeleton Pulse Loaders**: Non-blocking table and card loading states.

### 4. Kanban Board & Company/Role CRUD
- **Optimistic React Query Updates**: 0ms instant UI feedback on company, role, and application mutations.
- **Kanban Board**: Drag-and-drop / select status transition columns.

### 5. Automation & Webhooks
- **n8n Live Excel Sync**: Webhook event dispatching for automated spreadsheet backups.
- **Telegram & Discord Alerts**: Real-time notification webhooks when applications change status.

---

## Running Locally

### Prerequisites
- .NET 10 SDK
- Bun (`>= 1.1`)
- PostgreSQL database (or Neon PostgreSQL Cloud)

### 1. Backend

```bash
cd server/JobTracker.API
dotnet restore
dotnet ef database update
dotnet run
```

Run backend test suite (`14/14 Passing`):
```bash
cd server/JobTracker.API.Tests
dotnet test
```

### 2. Frontend

```bash
cd client
bun install
bun run dev
```

Run frontend test suite & production build (`7/7 Passing`):
```bash
cd client
bun run test
bun run build
```

---

## Docker Compose Deployment

To run the complete production stack (PostgreSQL, ASP.NET API, and Nginx Static Frontend):

```bash
docker compose up --build -d
```

- **Frontend App**: `http://localhost`
- **Backend API**: `http://localhost:8080`
- **PostgreSQL**: `localhost:5432`
