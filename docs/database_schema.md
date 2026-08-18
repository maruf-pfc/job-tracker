# 🗄 Database Model & Entity Schema

## Overview

JobTracker utilizes PostgreSQL as its relational database management system, managed via Entity Framework Core 10. All timestamps are strictly stored in `timestamp with time zone` (UTC) with database-generated `now()` default values.

---

## 📊 Entity Relationship (ER) Diagram

```mermaid
erDiagram
    AspNetUsers ||--o| UserProfiles : "has profile"
    AspNetUsers ||--o{ JobApplications : "owns applications"
    AspNetUsers ||--o{ Companies : "creates custom"
    AspNetUsers ||--o{ JobRoles : "creates custom"
    AspNetUsers ||--o{ RejectionRetrospectives : "records post-mortems"
    AspNetUsers ||--o| UserAiInsights : "receives AI insights"

    Companies ||--o{ JobApplications : "has applications"
    Priorities ||--o{ JobApplications : "categorizes"
    JobTypes ||--o{ JobApplications : "categorizes"
    ApplicationStatuses ||--o{ JobApplications : "tracks status"
    SourcePlatforms ||--o{ JobApplications : "originates from"
    WorkTypes ||--o{ JobApplications : "classifies"
    JobApplications ||--o| RejectionRetrospectives : "diagnosed by"

    AspNetUsers {
        Guid Id PK
        string Email
        string Name
        string PasswordHash
        DateTimeOffset CreatedAt
    }

    UserAiInsights {
        Guid Id PK
        Guid UserId FK
        string DataHash "SHA-256 state signature"
        string ExecutiveSummary
        string GovtVsCorporateStrategy
        string KeyStrengthsJson
        string CriticalGapsJson
        string ActionPlanJson
        int TotalApplicationsAnalyzed
        DateTime CreatedAt
        DateTime UpdatedAt
    }

    RejectionRetrospectives {
        Guid Id PK
        Guid UserId FK
        Guid JobApplicationId FK
        string JobDomain "Corporate Tech / Govt & Bank"
        string FailedStage
        string PrimaryRootCause
        double DifficultyRating
        double TimePressureRating
        double ConfidenceRating
        string PreparationDuration
        string SubjectTopicGapsJson
        string ExternalBlockersJson
        string WhatWentWell
        string WhatFailed
        string ActionablePlan
        DateTime CreatedAt
        DateTime UpdatedAt
    }

    UserProfiles {
        Guid Id PK
        Guid UserId FK
        string BioSummary
        DateOnly DateOfBirth
        string MobileNumber
        string PresentAddress
        string PermanentAddress
        string EducationDetailsJson
        string CodingProfilesJson
    }

    Companies {
        Guid Id PK
        Guid UserId FK "Nullable for shared templates"
        string Name
        string Location
        string WebsiteUrl
        string CareerPageUrl
        string Notes
        bool IsFavorite
    }

    JobRoles {
        Guid Id PK
        Guid UserId FK "Nullable for shared templates"
        string Name
        string Description
    }

    JobApplications {
        Guid Id PK
        Guid UserId FK
        Guid CompanyId FK
        string Role
        string JobUrl
        string SalaryRange
        string Notes
        DateTime AppliedAt
        DateTime FollowUpDate
        Guid PriorityId FK
        Guid JobTypeId FK
        Guid ApplicationStatusId FK
        Guid SourcePlatformId FK
        Guid WorkTypeId FK
    }

    Priorities {
        Guid Id PK
        string Name
        string Color
    }

    ApplicationStatuses {
        Guid Id PK
        string Name
        int StepOrder
    }
```

---

## 🔑 Database Indexes & Constraints

| Table | Index Name | Columns | Purpose |
| :--- | :--- | :--- | :--- |
| **`UserAiInsights`** | `IX_UserAiInsights_UserId_DataHash` | `(UserId, DataHash)` | O(1) Instant Cache Lookup by Pipeline State |
| **`RejectionRetrospectives`** | `IX_RejectionRetrospectives_JobApplicationId` | `JobApplicationId` (Unique) | Enforce 1 post-mortem survey per application |
| **`RejectionRetrospectives`** | `IX_RejectionRetrospectives_UserId_CreatedAt` | `(UserId, CreatedAt)` | Fast user-specific failure analytics queries |
| **`Companies`** | `IX_Companies_UserId_Name` | `(UserId, Name)` | Fast multi-tenant company lookup & uniqueness |
| **`JobRoles`** | `IX_JobRoles_UserId_Name` | `(UserId, Name)` | Fast multi-tenant role lookup & uniqueness |
| **`UserProfiles`** | `IX_UserProfiles_UserId` | `UserId` (Unique) | 1-to-1 Profile Mapping |
| **`JobApplications`** | `IX_JobApplications_UserId_AppliedAt` | `(UserId, AppliedAt)` | Chronological pipeline indexing |
