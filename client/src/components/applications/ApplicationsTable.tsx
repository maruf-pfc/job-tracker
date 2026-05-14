import type { JobApplication } from "@/types/job-application";

import ApplicationStatusBadge from "./ApplicationStatusBadge";

type Props = {
  applications: JobApplication[];
};

export default function ApplicationsTable({ applications }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Role</th>

              <th className="px-4 py-3 text-left font-medium">Company</th>

              <th className="px-4 py-3 text-left font-medium">Status</th>

              <th className="px-4 py-3 text-left font-medium">Priority</th>

              <th className="px-4 py-3 text-left font-medium">Platform</th>

              <th className="px-4 py-3 text-left font-medium">Applied</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <tr
                key={application.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {application.role}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {application.location}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3 text-slate-700">
                  {application.companyName}
                </td>

                <td className="px-4 py-3">
                  <ApplicationStatusBadge status={application.status} />
                </td>

                <td className="px-4 py-3 text-slate-700">
                  {application.priority}
                </td>

                <td className="px-4 py-3 text-slate-700">
                  {application.sourcePlatform}
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {new Date(application.appliedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
