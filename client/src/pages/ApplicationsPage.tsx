import ApplicationsHeader from "@/components/applications/ApplicationsHeader";
import ApplicationsFilters from "@/components/applications/ApplicationsFilters";
import ApplicationsTable from "@/components/applications/ApplicationsTable";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <ApplicationsHeader />
      <ApplicationsFilters />
      <ApplicationsTable />
    </div>
  );
}
