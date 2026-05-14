import { useQuery } from "@tanstack/react-query";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import ApplicationsTableSkeleton from "@/components/applications/ApplicationsTableSkeleton";
import ApplicationsEmptyState from "@/components/applications/ApplicationsEmptyState";
import { getApplications } from "@/services/jobApplicationService";

export default function ApplicationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  if (isLoading) {
    return <ApplicationsTableSkeleton />;
  }

  if (!data || data.length === 0) {
    return <ApplicationsEmptyState />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Applications
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Track and manage your application pipeline.
        </p>
      </div>

      <ApplicationsTable applications={data} />
    </div>
  );
}
