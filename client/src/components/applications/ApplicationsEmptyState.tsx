import { BriefcaseBusiness } from "lucide-react";

export default function ApplicationsEmptyState() {
  return (
    <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
      <div className="rounded-full bg-slate-100 p-4">
        <BriefcaseBusiness size={28} className="text-slate-500" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-slate-900">
        No Applications Yet
      </h2>

      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Start tracking your opportunities by creating your first job
        application.
      </p>
    </div>
  );
}
