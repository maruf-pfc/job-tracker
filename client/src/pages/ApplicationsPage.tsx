import { useState, useMemo } from "react";
import ApplicationsHeader from "@/components/applications/ApplicationsHeader";
import ApplicationsFilters from "@/components/applications/ApplicationsFilters";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ApplicationForm from "@/components/applications/ApplicationForm";
import Button from "@/components/ui/Button";
import { useApplications } from "@/hooks/useApplications";
import { Plus } from "lucide-react";
import { ApplicationsSkeleton } from "@/components/common/Skeletons";

export default function ApplicationsPage() {
  const [open, setOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("");

  const { applications, isLoading } = useApplications();

  const filteredApplications = useMemo(() => {
    if (!applications) return [];

    return applications.filter((app) => {
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
  }, [applications, searchQuery, statusFilter, priorityFilter, workTypeFilter]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
    setWorkTypeFilter("");
  };

  if (isLoading) {
    return <ApplicationsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <ApplicationsHeader />

        <div className="flex items-center gap-3 self-start md:self-auto">
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

      {/* Applications Table View */}
      <ApplicationsTable
        applications={filteredApplications}
        isLoading={isLoading}
      />

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
