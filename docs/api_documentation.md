# 🔌 REST API Documentation

## Overview

The JobTracker API is built with ASP.NET Core 10 Web API. All endpoints (except Auth login/register) require Bearer JWT authentication via the `Authorization: Bearer <token>` header.

Base URL: `http://localhost:5104/api` (Local) / `https://jobtracker-api.vercel.app/api` (Production)

---

## 🔐 Authentication Endpoints (`/api/auth`)

### 1. Register User
- **HTTP Method**: `POST`
- **Path**: `/api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response (`200 OK`)**: Returns JWT auth token, refresh token, user ID, and profile summary.

### 2. Login User
- **HTTP Method**: `POST`
- **Path**: `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "demo@jobtracker.dev",
    "password": "Password123!"
  }
  ```

---

## 🤖 AI Career Advisor Endpoints (`/api/aiadvisor`)

### 1. Get Career Insights (Smart-Cached)
- **HTTP Method**: `GET`
- **Path**: `/api/aiadvisor/insights`
- **Query Parameters**:
  - `forceRefresh` (boolean, optional, default: `false`)
- **Headers**: `Authorization: Bearer <token>`
- **Behavior**: Computes a SHA-256 state signature of the user's applications and retrospectives. If the signature matches the database cache and `forceRefresh == false`, returns the cached insight immediately with `isCached: true`. Otherwise, invokes `gemini-3.6-flash`, persists the new insight, and returns with `isCached: false`.
- **Response (`200 OK`)**:
  ```json
  {
    "executiveSummary": "You are managing 12 applications across Corporate Tech and Govt tracks with a 33% interview shortlist rate...",
    "govtVsCorporateStrategy": "Maintain timed MCQ drills alongside modern fullstack architectural system design practice...",
    "keyStrengths": [
      "Consistent application momentum across senior backend roles",
      "High pass rate in preliminary screening rounds"
    ],
    "criticalGaps": [
      "Time management drop-off during technical written assessments",
      "Follow-up cadence lagging on applications older than 14 days"
    ],
    "actionPlan": [
      {
        "title": "Weekly Application Cadence",
        "description": "Submit 3-5 high-priority applications weekly to ensure continuous funnel momentum.",
        "priority": "High",
        "category": "Pipeline"
      },
      {
        "title": "MCQ Time Management Drills",
        "description": "Dedicate 30 mins daily to 50-question mock exams.",
        "priority": "High",
        "category": "Govt Exam"
      }
    ],
    "isCached": true,
    "generatedAt": "2026-08-18T10:45:00Z",
    "totalApplicationsAnalyzed": 12
  }
  ```

### 2. Force Refresh Career Insights
- **HTTP Method**: `POST`
- **Path**: `/api/aiadvisor/insights/refresh`
- **Headers**: `Authorization: Bearer <token>`
- **Response (`200 OK`)**: Forces regeneration from Gemini API and updates cached state.

---

## 💼 Job Applications Endpoints (`/api/job-applications`)

### 1. Get All Applications (User-Isolated)
- **HTTP Method**: `GET`
- **Path**: `/api/job-applications`
- **Headers**: `Authorization: Bearer <token>`
- **Response (`200 OK`)**: Returns array of job applications belonging strictly to the authenticated user.

### 2. Create Application
- **HTTP Method**: `POST`
- **Path**: `/api/job-applications`
- **Request Body**:
  ```json
  {
    "companyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "role": "Senior Full Stack Engineer",
    "jobUrl": "https://careers.google.com/jobs/123",
    "salaryRange": "$140,000 - $175,000",
    "notes": "System design focus on Web Vitals LCP",
    "priorityId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "jobTypeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "applicationStatusId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "sourcePlatformId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "workTypeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
  ```

---

## 🔬 Post-Mortem Retrospectives Endpoints (`/api/rejection-retrospectives`)

### 1. Get All Retrospectives
- **HTTP Method**: `GET`
- **Path**: `/api/rejection-retrospectives`

### 2. Get Failure Analytics & Remediations
- **HTTP Method**: `GET`
- **Path**: `/api/rejection-retrospectives/analytics`
- **Response (`200 OK`)**: Returns computed failure metrics:
  - `totalRetrospectives`
  - `avgDifficultyRating`, `avgTimePressureRating`, `avgConfidenceRating`
  - `stageBreakdown`, `rootCauseBreakdown`, `topTopicGaps`, `topExternalBlockers`
  - `preparationCorrelation`, `remediationActionPlan`

### 3. Create Retrospective Diagnostic Survey
- **HTTP Method**: `POST`
- **Path**: `/api/rejection-retrospectives`
- **Request Body**:
  ```json
  {
    "jobApplicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "jobDomain": "Govt & Bank",
    "failedStage": "Preliminary Exam (MCQ)",
    "primaryRootCause": "Time Management / Speed",
    "difficultyRating": 4.5,
    "timePressureRating": 5.0,
    "confidenceRating": 6.0,
    "preparationDuration": "2-4 Weeks",
    "subjectTopicGaps": ["Higher Math", "English Vocabulary"],
    "externalBlockers": ["Exam Hall Noise", "Fatigue"],
    "whatWentWell": "General knowledge and Bangladesh affairs questions were 100% correct.",
    "whatFailed": "Stuck on complex algebraic calculations during the last 15 minutes.",
    "actionablePlan": "Practice 30-second shortcut math methods for competitive exams."
  }
  ```

---

## 🏢 Companies & Roles Endpoints (`/api/companies`, `/api/job-roles`)

### 1. Get Companies (Isolated + Global Defaults)
- **HTTP Method**: `GET`
- **Path**: `/api/companies`

### 2. Create Company
- **HTTP Method**: `POST`
- **Path**: `/api/companies`
- **Behavior**: Sets `UserId = currentUser.UserId` automatically.

### 3. Get Job Roles (Isolated + Global Defaults)
- **HTTP Method**: `GET`
- **Path**: `/api/job-roles`
