import { BriefcaseBusiness } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-600">
        <BriefcaseBusiness className="size-8" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900">
        No applications found
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        Start tracking job opportunities to build your personal career pipeline.
      </p>
    </div>
  );
}
