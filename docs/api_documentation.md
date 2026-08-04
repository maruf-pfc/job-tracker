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
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      "refreshToken": "d8aef291-...",
      "email": "jane@example.com",
      "name": "Jane Doe"
    }
  }
  ```

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

## 💼 Job Applications Endpoints (`/api/job-applications`)

### 1. Get All Applications
- **HTTP Method**: `GET`
- **Path**: `/api/job-applications`
- **Headers**: `Authorization: Bearer <token>`
- **Response (`200 OK`)**: Returns array of job applications owned by authenticated user.

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
    "priorityId": "...",
    "jobTypeId": "...",
    "applicationStatusId": "...",
    "sourcePlatformId": "...",
    "workTypeId": "..."
  }
  ```

---

## 🏢 Companies Endpoints (`/api/companies`)

### 1. Get All Companies
- **HTTP Method**: `GET`
- **Path**: `/api/companies`

### 2. Create Company
- **HTTP Method**: `POST`
- **Path**: `/api/companies`
- **Request Body**:
  ```json
  {
    "name": "Vercel",
    "location": "San Francisco, CA",
    "websiteUrl": "https://vercel.com",
    "careerPageUrl": "https://vercel.com/careers"
  }
  ```

### 3. Delete Company
- **HTTP Method**: `DELETE`
- **Path**: `/api/companies/{id}`
- **Behavior**: Cascade removes linked job applications prior to removing company entity to prevent FK `23503` constraint errors.

---

## 🎯 Target Job Roles Endpoints (`/api/job-roles`)

### 1. Get All Job Roles
- **HTTP Method**: `GET`
- **Path**: `/api/job-roles`

### 2. Create Job Role
- **HTTP Method**: `POST`
- **Path**: `/api/job-roles`
- **Request Body**: `{ "name": "Site Reliability Engineer" }`

---

## 👤 User Profile Endpoints (`/api/user-profiles`)

### 1. Get Current Profile
- **HTTP Method**: `GET`
- **Path**: `/api/user-profiles/me`

### 2. Update Profile
- **HTTP Method**: `PUT`
- **Path**: `/api/user-profiles/me`
