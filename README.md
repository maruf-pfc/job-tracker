# 💼 JobTracker — Open-Source Career Operations & Failure Analytics OS

[![Build & Server Tests](https://github.com/maruf-pfc/job-tracker/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/maruf-pfc/job-tracker/actions/workflows/backend-ci.yml)
[![Client CI](https://github.com/maruf-pfc/job-tracker/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/maruf-pfc/job-tracker/actions/workflows/frontend-ci.yml)
[![Docker Compose CI](https://github.com/maruf-pfc/job-tracker/actions/workflows/docker-ci.yml/badge.svg)](https://github.com/maruf-pfc/job-tracker/actions/workflows/docker-ci.yml)
[![CodeQL Advanced](https://github.com/maruf-pfc/job-tracker/actions/workflows/codeql.yml/badge.svg)](https://github.com/maruf-pfc/job-tracker/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![.NET 10.0](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-job--trackerr.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://job-trackerr.vercel.app)

An enterprise-grade, open-source **Career Operations OS and Recruitment Intelligence Engine** built for modern tech professionals and government/bank candidates. Features Kanban pipeline workflows, multi-variable post-mortem failure analytics, full account isolation, and an **AI Strategic Career Advisor** with intelligent SHA-256 state caching.

🌐 **Live Production App**: [https://job-trackerr.vercel.app](https://job-trackerr.vercel.app)

---

## 🌟 Key Highlights & Advanced Features

### 1. 🤖 AI Strategic Career Advisor (Gemini Flash + Smart State Caching)
- **Executive Diagnostics**: High-level synthesis of your pipeline momentum, interview conversion ratios, and bottlenecks.
- **Govt vs. Corporate Strategy**: Dual-track recommendations tailored to Bangladesh Govt/Bank recruitment exams (BPSC, Combined Bank) and Corporate Software Engineering roles.
- **Tactical Strengths & Critical Gaps**: Actionable SWOT-style insights identifying stage drop-offs and weak technical areas.
- **Prioritized Action Plan**: Concrete weekly tasks tagged by priority and category.
- **⚡ SHA-256 State-Hash Caching**: If no application or post-mortem data has changed, cached insights are returned instantly with **zero redundant AI API calls**. Automatically invalidates when new data is logged.

### 2. 🔬 Google-Form Post-Mortem & Senior Remediation Engine
- Comprehensive post-interview & exam diagnostic survey covering Corporate Tech stages (Coding, System Design, Behavioral) and Govt/Bank stages (Preliminary MCQ, Written, Viva, Practical).
- Quantifies exam difficulty, time pressure, and self-confidence indices.
- Subject topic gap frequency heatmap, environmental blocker tracking, and preparation duration correlation matrix.
- Prescribed remediation roadmaps with targeted practice strategies.

### 3. 🔒 Multi-Tenant Data Isolation & Security
- Complete tenant data isolation: user-created companies, custom job roles, circulars, applications, and post-mortems belong strictly to the authenticated `UserId`.
- Shared global templates for standard roles and organizations.
- Role-based JWT security with refresh token rotation and rate-limited endpoints.

### 4. 📊 Real-Time Pipeline Analytics & Interactive Funnel
- 6 Key Performance Indicator (KPI) metrics cards.
- Conversion velocity funnel with drop-off analytics.
- Recharts visualizations: Weekly Application Velocity, Pipeline Status Donut, Application Portals Breakdown, and Target Role Priorities.
- Graceful empty states with zero dummy placeholders for new accounts.

---

## 📸 UI Showcase & Architecture

### 1. Analytics Dashboard & AI Career Strategist
![Dashboard](assets/Dashboard.png)

### 2. Application Pipeline (Kanban Board)
![Applications Kanban Board](assets/Applications%20Kanban%20Board.png)

### 3. Applications Table with Responsive Scrolling
![Applications Table](assets/Applications%20Table.png)

### 4. Target Companies Management (User Isolated + Global)
![Company](assets/Company.png)

### 5. Target Job Roles & Career Titles
![Roles](assets/Roles.png)

### 6. User Profile & Academic Credentials
![Profile](assets/Profile.png)

### 7. Integrations, Webhooks & Diagnostics Settings
![Settings](assets/Settings.png)

---

## ⚡ Tech Stack Architecture

### Frontend (Client)
- **Core Framework**: React 19 + TypeScript + Vite 8
- **Styling & Motion**: TailwindCSS v4, Framer Motion (`framer-motion`), Lenis Smooth Scroll, Lucide Icons
- **State & Data**: React Query (TanStack Query v5), Zustand, Axios
- **Visualization**: Recharts Data Visualization Suite
- **Tooling & Test Runner**: Vitest, React Testing Library, ESLint

### Backend (Server)
- **Core Framework**: ASP.NET Core 10.0 Web API
- **AI Engine**: Google Gemini API (`gemini-3.6-flash`) with SHA-256 data signature caching
- **Database & ORM**: PostgreSQL (Local / Neon Cloud) via Entity Framework Core 10
- **Security & Auth**: ASP.NET Core Identity, JWT Bearer Tokens, Rate Limiting, Security Headers
- **Testing**: xUnit, Moq, EF Core InMemory Provider (27 unit tests)

---

## 🚀 Quickstart & Local Setup Guide

### Prerequisites
- [.NET 10.0 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js](https://nodejs.org/) (`>= 20.0`) or [Bun](https://bun.sh/) (`>= 1.1`)
- [PostgreSQL](https://www.postgresql.org/) (or use Docker / Neon Cloud)
- Google Gemini API Key (Optional for AI Advisor)

---

### Step 1: Clone Repository & Configure Environment
```bash
git clone https://github.com/maruf-pfc/job-tracker.git
cd job-tracker
cp .env.example .env
```
Edit `.env` to configure your `DATABASE_URL`, `JWT_KEY`, and `GEMINI_API_KEY`.

---

### Step 2: Run the Backend Server
```bash
cd server/JobTracker.API
dotnet restore
dotnet run
```
- **Swagger API Docs**: `http://localhost:5104/swagger`
- Entity Framework automatically applies pending migrations on startup!

---

### Step 3: Run the Frontend Client
```bash
cd client
npm install   # or bun install
npm run dev   # or bun run dev
```
- Open `http://localhost:5173` in your browser!

---

## 🧪 Running Unit Tests

### Backend Unit Tests (27 / 27 Passing)
```bash
cd server/JobTracker.API.Tests
dotnet test
```

### Frontend Unit Tests (18 / 18 Passing)
```bash
cd client
npm run test
```

### Production Build Verification
```bash
cd client
npm run build
```

---

## 🐳 Docker & Docker Compose Setup

Run the full production stack with one command:
```bash
docker compose up --build -d
```
- **Frontend Web App**: `http://localhost`
- **Backend Web API**: `http://localhost:8080`
- **PostgreSQL Database**: `localhost:5432`

---

## 📚 Technical Documentation

- 🏗 **[System Architecture & Design](docs/architecture.md)**: Clean architecture, AI caching subsystem, multi-tenant isolation.
- 🗄 **[Database Model & Schema](docs/database_schema.md)**: PostgreSQL ER Diagram, table constraints, indices, and UTC timestamp mappings.
- 🔌 **[REST API Specifications](docs/api_documentation.md)**: Endpoints reference, AI Advisor endpoints, request/response DTO schemas.
- 🛠 **[Troubleshooting & Bug Fixes](docs/troubleshooting_and_bugfixes.md)**: Resolution log (React hook ordering, state caching, user isolation).
- 🚀 **[Deployment & Webhooks Guide](docs/deployment_and_webhooks.md)**: Docker Compose orchestration, Vercel monorepo settings, n8n integrations.
- ⚡ **[Coolify Deployment Guide](docs/coolify_deployment.md)**: Self-hosting setup on Coolify v4.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
