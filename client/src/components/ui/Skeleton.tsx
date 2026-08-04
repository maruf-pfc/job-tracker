export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="px-5 py-4"><Skeleton className="h-4 w-36" /></td>
      <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
      <td className="px-5 py-4"><Skeleton className="h-4 w-28" /></td>
      <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
      <td className="px-5 py-4 text-right"><Skeleton className="h-7 w-16 ml-auto" /></td>
    </tr>
  );
}
