# Job Tracker

A full-stack job application tracking platform built for structured career management, application workflow tracking, and productivity-focused analytics.

Designed as a personal career operating system - not just a CRUD dashboard.

## Overview

Job Tracker helps users:

- track job applications
- manage company pipelines
- organize career workflows
- analyze application progress
- monitor interview performance
- maintain structured job-search workflows

The application focuses on:

- operational clarity
- workflow management
- long-session usability
- analytics-driven decisions
- low-distraction UI/UX

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Query
- React Router DOM
- Zustand
- React Hook Form
- Zod
- TailwindCSS v4
- Axios
- Sonner
- React Markdown
- Lucide React

### Backend

- ASP.NET Core 10
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- BCrypt Password Hashing

## Features

### Authentication

- JWT-based authentication
- Login/Register system
- Password complexity validation
- Protected routes
- Persistent auth state with Zustand

### Dashboard

- KPI overview
- Application statistics
- Interview tracking
- Offer tracking
- Response rate tracking
- Analytics-ready architecture

### Job Application Management

Track:

- role
- company
- application status
- source platform
- work type
- salary range
- notes
- markdown notes
- follow-up dates
- resume links
- cover letters

### Company Management

Manage:

- company profiles
- career page URLs
- company websites
- company notes
- favorite companies
- archived companies

### Lookup System

Fully managed lookup entities:

- Priorities
- Job Types
- Work Types
- Source Platforms
- Application Statuses

Designed for:

- dropdowns
- filtering
- analytics
- workflow consistency

## Project Structure

### Frontend

```txt
src
├── components
├── pages
├── services
├── stores
├── routes
├── types
├── lib
├── styles
└── config
```

### Backend

```txt
JobTracker.API
├── Controllers
├── Services
├── Interfaces
├── DTOs
├── Models
├── Configs
├── Middlewares
├── Helpers
└── Common
```

## Architecture

The backend follows a layered architecture:

```txt
Controller
→ Service
→ DTO
→ Entity
→ Database
```

Key architectural decisions:

- explicit DTO mapping
- service abstraction
- relational entity modeling
- middleware-based exception handling
- lookup-driven workflows
- analytics-ready data structures

## Database Design

Main entities:

- User
- JobApplication
- Company
- Priority
- JobType
- WorkType
- SourcePlatform
- ApplicationStatus

Relationships are explicitly configured using Entity Framework Core.

## Authentication

Authentication uses:

- JWT access tokens
- BCrypt password hashing
- persisted frontend auth state

Password rules:

- minimum 8 characters
- uppercase letter
- lowercase letter
- number
- special character

## Environment Variables

### Frontend

```env
VITE_API_BASE_URL=http://localhost:5104/api
```

### Backend

```env
ConnectionStrings__DefaultConnection=YOUR_DATABASE_CONNECTION
Jwt__Key=YOUR_SECRET_KEY
Jwt__Issuer=JobTracker.API
Jwt__Audience=JobTracker.Client
```

## Running The Project

### Frontend

```bash
cd client

bun install

bun run dev
```

### Backend

```bash
cd JobTracker.API

dotnet restore

dotnet ef database update

dotnet run
```

## Database Migration

Create migration:

```bash
dotnet ef migrations add MigrationName
```

Apply migration:

```bash
dotnet ef database update
```

## API Features

### Current APIs

#### Auth

```txt
POST /api/auth/register
POST /api/auth/login
```

#### Dashboard

```txt
GET /api/dashboard/stats
```

#### Job Applications

```txt
GET    /api/jobapplications
GET    /api/jobapplications/{id}
POST   /api/jobapplications
PUT    /api/jobapplications/{id}
DELETE /api/jobapplications/{id}
```

#### Companies

```txt
GET    /api/companies
GET    /api/companies/{id}
POST   /api/companies
PUT    /api/companies/{id}
DELETE /api/companies/{id}
```

#### Lookups

```txt
/api/priorities
/api/jobtypes
/api/worktypes
/api/sourceplatforms
/api/applicationstatuses
```

## Future Roadmap

Planned features:

- advanced filtering
- search
- pagination
- analytics charts
- markdown preview
- interview tracking
- follow-up reminders
- archive workflow
- resume template system
- application insights
- platform performance analytics
- dark mode
- export/import system

This project is built for educational and portfolio purposes.
