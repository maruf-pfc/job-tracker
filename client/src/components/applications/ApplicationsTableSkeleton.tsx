export default function ApplicationsTableSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <div
            key={index}
            className="h-14 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    </div>
  );
}
