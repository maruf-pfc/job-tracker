import { BriefcaseBusiness } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dbe4d8] bg-white px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-[#f1f5ee] p-4 text-[#647768]">
        <BriefcaseBusiness className="size-8" />
      </div>

      <h3 className="text-lg font-semibold text-[#203629]">
        No applications found
      </h3>

      <p className="mt-2 max-w-md text-sm text-[#738478]">
        Start tracking job opportunities to build your personal career pipeline.
      </p>
    </div>
  );
}
