import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

type Props = {
  onCreate: () => void;
};

export default function ApplicationsHeader({ onCreate }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Applications
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Track your job pipeline, follow-ups, and interview progress.
        </p>
      </div>

      <Button onClick={onCreate} className="flex items-center gap-2 self-start sm:self-auto">
        <Plus className="w-4 h-4" /> Add Application
      </Button>
    </div>
  );
}
