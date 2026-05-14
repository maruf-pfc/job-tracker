import { useQuery } from "@tanstack/react-query";
import { getApplications } from "@/services/jobApplicationService";

export default function ApplicationsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Loading applications...</p>
      </div>
    );
  }

  if (!data?.items?.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          No applications found
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          Start tracking your job applications to build your career pipeline.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
              Company
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
              Role
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
              Status
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
              Priority
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
              Platform
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
              Applied Date
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
          {data.items.map((application) => (
            <tr key={application.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-medium text-slate-900">
                {application.company}
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {application.role}
              </td>

              <td className="px-4 py-3">
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {application.applicationStatus}
                </span>
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {application.priority}
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {application.sourcePlatform}
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {new Date(application.appliedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
