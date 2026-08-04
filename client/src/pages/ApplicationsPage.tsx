import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ApplicationsHeader from "@/components/applications/ApplicationsHeader";
import ApplicationsFilters from "@/components/applications/ApplicationsFilters";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import { KanbanBoard } from "@/components/applications/KanbanBoard";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ApplicationForm from "@/components/applications/ApplicationForm";
import Button from "@/components/ui/Button";
import { getApplications } from "@/services/jobApplicationService";
import { LayoutGrid, List, Plus } from "lucide-react";

export default function ApplicationsPage() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const filteredApplications = useMemo(() => {
    if (!data?.items) return [];

    return data.items.filter((app) => {
      const matchesSearch =
        !searchQuery ||
        app.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        !statusFilter ||
        app.applicationStatus?.toLowerCase() === statusFilter.toLowerCase();

      const matchesPriority =
        !priorityFilter ||
        app.priority?.toLowerCase() === priorityFilter.toLowerCase();

      const matchesWorkType =
        !workTypeFilter ||
        app.workType?.toLowerCase() === workTypeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority && matchesWorkType;
    });
  }, [data?.items, searchQuery, statusFilter, priorityFilter, workTypeFilter]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
    setWorkTypeFilter("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <ApplicationsHeader />

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Segmented View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" /> Table
            </button>

            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban
            </button>
          </div>

          {/* Primary Add Application Button */}
          <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Application
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <ApplicationsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        workTypeFilter={workTypeFilter}
        onWorkTypeChange={setWorkTypeFilter}
        onReset={handleResetFilters}
      />

      {/* Content Area: Table vs Kanban View */}
      {viewMode === "table" ? (
        <ApplicationsTable
          applications={filteredApplications}
          isLoading={isLoading}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <KanbanBoard applications={filteredApplications} />
        </div>
      )}

      {/* Application Creation Modal */}
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
