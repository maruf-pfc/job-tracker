# Job Tracker

A full-stack job application tracking platform built for structured career management, application workflow tracking, and productivity-focused analytics.

Designed as a personal career operating system — not just a CRUD dashboard.

## Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Package Manager & Tooling**: Bun, Vitest, React Testing Library
- **UI & State**: TailwindCSS v4, Recharts, Zustand, React Query, Lucide Icons

### Backend
- **Framework**: ASP.NET Core 10
- **Authentication**: ASP.NET Core Identity + JWT Tokens + Refresh Token Rotation + Rate Limiting
- **Database & ORM**: PostgreSQL, Entity Framework Core 10
- **Testing**: xUnit, Moq, EF Core InMemory

---

## Features

### 1. Authentication & Security
- **ASP.NET Core Identity**: User management, password hashing, and security policies.
- **JWT & Refresh Tokens**: Secure token rotation.
- **Endpoint Rate Limiting**: Fixed-window rate limiter protecting `/api/auth/*`.

### 2. Job Applications & Kanban Board
- **Full CRUD & Filtering**: Search, filter by status, platform, and company.
- **Kanban Board**: Drag-and-drop / select status transition columns with optimistic UI updates.
- **PATCH Status Endpoint**: `PATCH /api/jobapplications/{id}/status`.

### 3. Interview Rounds Domain
- **Sub-resource Tracking**: Round type (Technical, HR, System Design), scheduled date, interviewer notes, and outcome.
- **Visual Timeline**: Dedicated timeline sub-component rendered per application.

### 4. Analytics & Visualization
- **KPI Metrics**: Response rate, interview conversion rate, total offers.
- **Recharts Integration**: Weekly application velocity bar charts and status distribution stats.

### 5. Data Import & Export
- **CSV Stream Export**: Download complete job application history via `GET /api/export/csv`.
- **Bulk CSV Import**: Import application records via `POST /api/import/csv`.

---

## Running locally

### Prerequisites
- .NET 10 SDK
- Bun (`>= 1.1`)
- PostgreSQL database

### 1. Backend

```bash
cd server/JobTracker.API
dotnet restore
dotnet ef database update
dotnet run
```

Run test suite:
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

Run test suite & production build:
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
