export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-64 bg-slate-200 rounded-lg" />
        <div className="h-4 w-96 bg-slate-100 rounded-md" />
      </div>

      {/* 4 KPI Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3.5 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-16 bg-slate-300 rounded-lg" />
            </div>
            <div className="h-12 w-12 bg-slate-100 rounded-2xl shrink-0" />
          </div>
        ))}
      </div>

      {/* 2 Analytics Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="h-5 w-56 bg-slate-200 rounded-md" />
          <div className="h-64 bg-slate-100 rounded-xl w-full" />
        </div>
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="h-5 w-56 bg-slate-200 rounded-md" />
          <div className="h-64 bg-slate-100 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

export function ApplicationsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header & Controls Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-80 bg-slate-100 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-36 bg-indigo-200/70 rounded-xl" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="h-10 bg-slate-100 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex justify-between">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded hidden md:block" />
          <div className="h-4 w-28 bg-slate-200 rounded hidden md:block" />
          <div className="h-4 w-24 bg-slate-200 rounded hidden lg:block" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
        <div className="divide-y divide-slate-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-slate-200 rounded" />
                  <div className="h-3 w-28 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-6 w-20 bg-indigo-100 rounded-lg hidden md:block" />
              <div className="h-6 w-24 bg-slate-100 rounded-lg hidden md:block" />
              <div className="h-4 w-24 bg-slate-100 rounded hidden lg:block" />
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                <div className="w-8 h-8 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CompaniesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-slate-200 rounded-lg" />
          <div className="h-4 w-80 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-36 bg-indigo-200/70 rounded-xl" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-11 w-full sm:w-80 bg-slate-100 rounded-xl" />

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex justify-between">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-28 bg-slate-200 rounded hidden md:block" />
          <div className="h-4 w-36 bg-slate-200 rounded hidden lg:block" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
        <div className="divide-y divide-slate-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-36 bg-slate-200 rounded" />
                  <div className="h-3 w-28 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-4 w-32 bg-slate-100 rounded hidden md:block" />
              <div className="h-6 w-36 bg-slate-100 rounded-lg hidden lg:block" />
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                <div className="w-8 h-8 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Footer Skeleton */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-slate-200 rounded-lg" />
            <div className="h-8 w-20 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function RolesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-44 bg-slate-200 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-32 bg-indigo-200/70 rounded-xl" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-11 w-full sm:w-72 bg-slate-100 rounded-xl" />

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex justify-between">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
        <div className="divide-y divide-slate-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-200 rounded-xl shrink-0" />
                <div className="h-4 w-48 bg-slate-200 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                <div className="w-8 h-8 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Footer Skeleton */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-slate-200 rounded-lg" />
            <div className="h-8 w-20 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-44 bg-slate-200 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-32 bg-indigo-200/70 rounded-xl" />
      </div>

      {/* Navigation Tabs Bar Skeleton */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <div className="h-9 w-36 bg-slate-200 rounded-xl" />
        <div className="h-9 w-32 bg-slate-100 rounded-xl" />
        <div className="h-9 w-40 bg-slate-100 rounded-xl" />
        <div className="h-9 w-36 bg-slate-100 rounded-xl" />
      </div>

      {/* Main Profile Info Card Skeleton */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-slate-200 rounded-full shrink-0" />
          <div className="space-y-2">
            <div className="h-5 w-44 bg-slate-200 rounded" />
            <div className="h-3.5 w-64 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="h-3 w-28 bg-slate-200 rounded" />
              <div className="h-4 w-44 bg-slate-300 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
