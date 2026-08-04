# 🛠 Troubleshooting, Resolved Bugs & Engineering Log

This document records key technical challenges encountered during development, along with their empirical root cause analysis and permanent fixes.

---

## 1. Foreign Key Constraint Violation (`23503`) on Company Deletion

### Symptom
Deleting a company via `DELETE /api/companies/{id}` failed with PostgreSQL error `23503: update or delete on table "Companies" violates foreign key constraint "FK_JobApplications_Companies_CompanyId"`.

### Root Cause
`JobApplications` held a non-nullable Foreign Key constraint `CompanyId` referencing `Companies.Id`. Default EF Core `Remove(company)` did not automatically remove linked `JobApplication` records.

### Fix Applied
Updated [`CompanyService.cs`](file:///home/maruf/Documents/GitHub/Resume%20Projects/job-tracker/server/JobTracker.API/Services/CompanyService.cs) to fetch all linked job applications and delete them via `RemoveRange()` before removing the company entity:

```csharp
var linkedApps = await _context.JobApplications
    .Where(j => j.CompanyId == id)
    .ToListAsync();

if (linkedApps.Any())
{
    _context.JobApplications.RemoveRange(linkedApps);
}

_context.Companies.Remove(company);
await _context.SaveChangesAsync();
```

---

## 2. PostgreSQL `DateTime Kind=Unspecified` Exception

### Symptom
Npgsql 10 threw `InvalidOperationException: Cannot write DateTime with Kind=Unspecified` when attempting to save entity timestamps to PostgreSQL `timestamptz` columns.

### Root Cause
PostgreSQL `timestamptz` requires `DateTime` objects with `DateTimeKind.Utc` explicitly set. Local un-specified `DateTime.Now` instances fail Npgsql type validation.

### Fix Applied
Configured `BaseEntity` timestamps with database-generated UTC defaults in `AppDbContext.cs`:

```csharp
modelBuilder.Entity<BaseEntity>(b => {
    b.Property(e => e.CreatedAt)
     .HasColumnType("timestamp with time zone")
     .HasDefaultValueSql("now()");
    b.Property(e => e.UpdatedAt)
     .HasColumnType("timestamp with time zone")
     .HasDefaultValueSql("now()");
});
```

---

## 3. Immediate JWT Expiry (`DurationInMinutes: 0`)

### Symptom
API requests immediately returned `401 Unauthorized` after successful user login.

### Root Cause
`appsettings.json` configured `"Jwt": { "DurationInMinutes": 0 }`, causing generated JWT tokens to expire at the exact millisecond of creation.

### Fix Applied
1. Updated `appsettings.json` `DurationInMinutes` to `10080` (7 days).
2. Updated [`JwtHelper.cs`](file:///home/maruf/Documents/GitHub/Resume%20Projects/job-tracker/server/JobTracker.API/Helpers/JwtHelper.cs) with defensive validation fallback:

```csharp
var durationInMinutes = int.TryParse(_config["Jwt:DurationInMinutes"], out var mins) && mins > 0
    ? mins
    : 10080; // 7 days fallback
```
3. Added an Axios response interceptor in [`api.ts`](file:///home/maruf/Documents/GitHub/Resume%20Projects/job-tracker/client/src/services/api.ts) to automatically clear invalid auth tokens on `401` and redirect to `/login`.

---

## 4. Seeder Case-Sensitivity Exception (`Sequence contains no matching element`)

### Symptom
`dotnet run` crashed on startup with `System.InvalidOperationException: Sequence contains no matching element` in `DbSeeder.cs` at `GetCompany(string name)`.

### Root Cause
`DbSeeder.cs` used `companies.First(c => c.Name == name)`. If existing company names in the database had different casing or missing entries, `.First()` threw an exception.

### Fix Applied
Updated all lookup helper functions in `DbSeeder.cs` to use case-insensitive comparison (`StringComparison.OrdinalIgnoreCase`) and safe fallback to `.First()`:

```csharp
Company GetCompany(string name) =>
    companies.FirstOrDefault(c => string.Equals(c.Name, name, StringComparison.OrdinalIgnoreCase))
    ?? companies.First();
```

---

## 5. TanStack Query 5-Minute Stale Cache

### Symptom
After seeding or updating companies/roles, navigating to `RolesPage` or `CompaniesPage` displayed "No roles found" for several minutes.

### Root Cause
`useQuery` hooks used `staleTime: 5 * 60 * 1000` (5 minutes). When an empty array was initially cached, React Query served the cached empty response without revalidating.

### Fix Applied
Updated `staleTime` across [`RolesPage.tsx`](file:///home/maruf/Documents/GitHub/Resume%20Projects/job-tracker/client/src/pages/RolesPage.tsx), [`CompaniesPage.tsx`](file:///home/maruf/Documents/GitHub/Resume%20Projects/job-tracker/client/src/pages/CompaniesPage.tsx), and [`ProfilePage.tsx`](file:///home/maruf/Documents/GitHub/Resume%20Projects/job-tracker/client/src/pages/ProfilePage.tsx) from 5 minutes to `10 * 1000` (10 seconds) for near-instant revalidation.
