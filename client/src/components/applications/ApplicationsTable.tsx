import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteApplication } from "@/services/jobApplicationService";
import type { JobApplication } from "@/types/job-application";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import ApplicationActions from "./ApplicationActions";
import DeleteApplicationDialog from "./DeleteApplicationDialog";
import EditApplicationModal from "./EditApplicationModal";
import { formatDate } from "@/utils/date";
import { Building2, MapPin, Calendar, DollarSign, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

interface ApplicationsTableProps {
  applications: JobApplication[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 8;

const PRIORITY_STYLE_MAP: Record<string, string> = {
  High: "bg-rose-50 text-rose-700 border-rose-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function ApplicationsTable({
  applications,
  isLoading,
}: ApplicationsTableProps) {
  const queryClient = useQueryClient();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,

    onSuccess: async () => {
      toast.success("Application deleted");

      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      setSelectedId(null);
    },

    onError: () => {
      toast.error("Failed to delete application");
    },
  });

  const handleDelete = () => {
    if (!selectedId) return;
    deleteMutation.mutate(selectedId);
  };

  const totalCount = applications?.length || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
  const paginatedApplications = (applications || []).slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 flex items-center justify-center gap-2 shadow-xs">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        Loading applications...
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-3">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">No applications found</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          Start tracking your job applications to build your career pipeline.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Company & Role</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Priority</th>
              <th className="px-5 py-3.5">Work / Location</th>
              <th className="px-5 py-3.5">Applied Date</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white text-sm">
            {paginatedApplications.map((app) => {
              const priorityClass = PRIORITY_STYLE_MAP[app.priority] || PRIORITY_STYLE_MAP.Low;

              return (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Company & Role */}
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900">{app.role}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{app.company}</span>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <ApplicationStatusBadge status={app.applicationStatus} />
                  </td>

                  {/* Priority Pill */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityClass}`}>
                      {app.priority}
                    </span>
                  </td>

                  {/* Work / Location / Salary */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="space-y-1 text-xs text-slate-600">
                      {app.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{app.location}</span>
                        </div>
                      )}
                      {app.salaryRange && (
                        <div className="flex items-center gap-1 text-slate-500 font-mono">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{app.salaryRange}</span>
                        </div>
                      )}
                      {!app.location && !app.salaryRange && (
                        <span className="text-slate-400 italic">No details</span>
                      )}
                    </div>
                  </td>

                  {/* Applied Date */}
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(app.appliedAt)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <ApplicationActions
                      onEdit={() => setEditingApplication(app)}
                      onDelete={() => setSelectedId(app.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Footer Controls */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}</span> of{" "}
            <span className="font-bold text-slate-900">{totalCount}</span> applications
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <span className="px-2 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <DeleteApplicationDialog
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />

      <EditApplicationModal
        open={!!editingApplication}
        onClose={() => setEditingApplication(null)}
        application={editingApplication}
      />
    </>
  );
}
