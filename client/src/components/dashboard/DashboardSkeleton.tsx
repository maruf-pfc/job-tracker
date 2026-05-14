export default function DashboardSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
}
