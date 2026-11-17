import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";
import ApplicationStatusBadge from "@/components/applications/ApplicationStatusBadge";
import ApplicationActions from "@/components/applications/ApplicationActions";
import DeleteApplicationDialog from "@/components/applications/DeleteApplicationDialog";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ApplicationForm from "@/components/applications/ApplicationForm";
import RejectionRetrospectiveModal from "@/components/applications/RejectionRetrospectiveModal";
import { InterviewRoundsTimeline } from "@/components/applications/InterviewRoundsTimeline";
import { deleteApplication } from "@/services/jobApplicationService";
import { formatDate } from "@/lib/utils";
import type { JobApplication } from "@/types/job-application";

type Props = {
  applications?: JobApplication[];
  isLoading?: boolean;
};

const PRIORITY_STYLE_MAP: Record<string, string> = {
  High: "border-red-200/60 bg-red-50 text-red-700",
  Medium: "border-amber-200/60 bg-amber-50 text-amber-700",
  Low: "border-slate-200/60 bg-slate-50 text-slate-700",
};

const ITEMS_PER_PAGE = 8;

export default function ApplicationsTable({ applications, isLoading }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);
  const [retrospectiveApp, setRetrospectiveApp] =
    useState<JobApplication | null>(null);
  const [roundsApp, setRoundsApp] = useState<JobApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const totalCount = applications?.length || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedApplications = (applications || []).slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: async () => {
      toast.success("Application deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-analytics"] });
      setSelectedId(null);
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(
        axiosErr.response?.data?.message || "Failed to delete application",
      );
    },
  });

  const isGovtOrBank = (app: JobApplication) => {
    const jt = (app.jobType || "").toLowerCase();
    const sp = (app.sourcePlatform || "").toLowerCase();
    const comp = (app.company || "").toLowerCase();
    return (
      jt.includes("govt") ||
      jt.includes("bank") ||
      jt.includes("cadre") ||
      sp.includes("teletalk") ||
      sp.includes("bpsc") ||
      sp.includes("erecruiter") ||
      comp.includes("bpsc") ||
      comp.includes("bank") ||
      comp.includes("ministry")
    );
  };

  if (isLoading) {
    return null;
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf5e9] text-[#326347] mb-3">
          <Briefcase size={24} />
        </div>
        <h3 className="text-base font-semibold text-slate-900">No matching applications</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          Try adjusting your filters or add your first application to start tracking.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-[#e3e9df] bg-white shadow-[0_1px_2px_rgba(25,50,28,.04)]">
        <div className="overflow-x-auto w-full -webkit-overflow-scrolling-touch">
          <table className="w-full min-w-[920px] text-left border-collapse">
          <thead className="border-b border-[#e6ece3] bg-[#f7f9f5] text-[11px] font-semibold tracking-[.02em] text-[#6a7b6e]">
            <tr>
              <th className="px-4 py-3.5">Organization & Role</th>
              <th className="px-4 py-3.5">Category & Platform</th>
              <th className="px-4 py-3.5">Status / Stage</th>
              <th className="px-4 py-3.5">Priority</th>
              <th className="px-4 py-3.5">Location & Compensation</th>
              <th className="px-4 py-3.5">Applied Date</th>
              <th className="px-4 py-3.5">Follow-up Date</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#edf0eb] bg-white text-[13px]">
            {paginatedApplications.map((app) => {
              const priorityClass = PRIORITY_STYLE_MAP[app.priority] || PRIORITY_STYLE_MAP.Low;
              const isRejected = app.applicationStatus?.toLowerCase() === "rejected";
              const isGovt = isGovtOrBank(app);
              const deadlineFormatted = formatDate(app.followUpDate);

              return (
                <tr key={app.id} className="hover:bg-[#f6faf5] transition-colors duration-150">
                  {/* Organization & Role */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{app.role}</span>
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            title={isGovt ? "View Govt Circular / Notice" : "View Job Posting"}
                            className="text-slate-400 hover:text-[#326347] transition-colors inline-flex items-center"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        {isGovt ? (
                          <Landmark className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span>{app.company}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category & Platform */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div>
                        {isGovt ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                            🏛️ Govt & Bank
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#edf5e9] text-indigo-700 border border-[#d9e8d4]">
                            🏢 Corporate Tech
                          </span>
                        )}
                      </div>
                      {app.sourcePlatform && (
                        <div className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
                          via {app.sourcePlatform}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status Badge, Stage/Rounds & Retrospective Link */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <ApplicationStatusBadge
                          status={app.applicationStatus}
                          passedRounds={app.passedRounds}
                          totalRounds={app.totalRounds}
                          failedStage={app.failedStage}
                          latestRoundName={app.latestRoundName}
                        />
                        {isRejected && (
                          <button
                            onClick={() => setRetrospectiveApp(app)}
                            title="Log Failure Analysis & Action Plan"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                          >
                            <AlertCircle className="w-3 h-3" />
                            <span>Post-Mortem</span>
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setRoundsApp(app)}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-medium transition-colors cursor-pointer rounded-md px-2 py-0.5 ${
                          (app.passedRounds ?? 0) > 0
                            ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80"
                            : (app.totalRounds ?? 0) > 0
                            ? "bg-[#edf5e9] text-[#2c5b3c] hover:bg-[#e2eedc] border border-[#d2e4cb]"
                            : "text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/60"
                        }`}
                        title="Manage interview rounds"
                      >
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-[#3d704d]" />
                        {(app.passedRounds ?? 0) > 0 || (app.totalRounds ?? 0) > 0 ? (
                          <span className="truncate max-w-[220px]">
                            {(app.passedRounds ?? 0) > 0 ? (
                              <span className="font-semibold text-emerald-800">
                                {app.passedRounds} round{app.passedRounds! > 1 ? "s" : ""} passed
                              </span>
                            ) : (
                              <span>{app.totalRounds} round{app.totalRounds! > 1 ? "s" : ""}</span>
                            )}
                            {app.failedStage
                              ? ` • Dropped at ${app.failedStage}`
                              : app.latestRoundName
                              ? ` • ${app.latestRoundName}`
                              : ""}
                          </span>
                        ) : (
                          <span>+ Add interview rounds</span>
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Priority Pill */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityClass}`}>
                      {app.priority}
                    </span>
                  </td>

                  {/* Location & Compensation */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="space-y-1 text-xs text-slate-600">
                      {app.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{app.location}</span>
                        </div>
                      )}
                      {app.salaryRange && (
                        <div className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{app.salaryRange}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Applied Date */}
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(app.appliedAt)}</span>
                    </div>
                  </td>

                  {/* Follow-up Date */}
                  <td className="px-4 py-4 whitespace-nowrap text-xs font-medium">
                    {deadlineFormatted !== "N/A" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                        ⏰ {deadlineFormatted}
                      </span>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <ApplicationActions
                      onEdit={() => setEditingApplication(app)}
                      onDelete={() => setSelectedId(app.id)}
                      onManageRounds={() => setRoundsApp(app)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3.5 bg-[#fafbf8] border-t border-[#e6ece3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-900">{(safePage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="font-bold text-slate-900">{Math.min(safePage * ITEMS_PER_PAGE, totalCount)}</span> of{" "}
            <span className="font-bold text-slate-900">{totalCount}</span> applications
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={safePage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <span className="px-2 font-semibold text-slate-700">
              Page {safePage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Application Modal */}
      <ApplicationModal
        open={Boolean(editingApplication)}
        onClose={() => setEditingApplication(null)}
        title="Edit Application"
      >
        <ApplicationForm
          key={editingApplication?.id || "new"}
          initialData={editingApplication}
          onSuccess={() => setEditingApplication(null)}
        />
      </ApplicationModal>

      {/* Delete Confirmation Modal */}
      <DeleteApplicationDialog
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
        onConfirm={() => selectedId && deleteMutation.mutate(selectedId)}
        loading={deleteMutation.isPending}
      />

      {/* Post-Mortem Survey Diagnostic Modal */}
      <RejectionRetrospectiveModal
        open={Boolean(retrospectiveApp)}
        onClose={() => setRetrospectiveApp(null)}
        application={retrospectiveApp}
      />

      {/* Interview Rounds Modal */}
      <ApplicationModal
        open={Boolean(roundsApp)}
        onClose={() => setRoundsApp(null)}
        title={`Interview Rounds — ${roundsApp?.company || ""} (${roundsApp?.role || ""})`}
      >
        {roundsApp && (
          <InterviewRoundsTimeline jobApplicationId={roundsApp.id} />
        )}
      </ApplicationModal>
    </>
  );
}
