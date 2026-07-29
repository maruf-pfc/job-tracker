import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ApplicationsHeader from "@/components/applications/ApplicationsHeader";
import ApplicationsFilters from "@/components/applications/ApplicationsFilters";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import { KanbanBoard } from "@/components/applications/KanbanBoard";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ApplicationForm from "@/components/applications/ApplicationForm";
import { getApplications } from "@/services/jobApplicationService";
import { LayoutGrid, List } from "lucide-react";

export default function ApplicationsPage() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  const { data } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ApplicationsHeader onCreate={() => setOpen(true)} />
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              viewMode === "table"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <List className="w-3.5 h-3.5" /> Table
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              viewMode === "kanban"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Kanban
          </button>
        </div>
      </div>

      <ApplicationsFilters />

      {viewMode === "table" ? (
        <ApplicationsTable />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <KanbanBoard applications={data?.items ?? []} />
        </div>
      )}

      <ApplicationModal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Application"
      >
        <ApplicationForm onSuccess={() => setOpen(false)} />
      </ApplicationModal>
    </div>
  );
}
