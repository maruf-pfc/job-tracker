import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  ArrowRightLeft,
  AlertTriangle,
  Landmark,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { updateApplicationStatus } from "@/services/jobApplicationService";
import { formatDate } from "@/lib/utils";
import type { JobApplication } from "@/types/job-application";
import RejectionRetrospectiveModal from "./RejectionRetrospectiveModal";

type Props = {
  applications?: JobApplication[];
  isLoading?: boolean;
};

const DEFAULT_COLUMNS = [
  "Saved",
  "Applied",
  "MCQ / Preliminary",
  "Written Exam",
  "Practical / Skill Test",
  "Viva Voce",
  "Interview",
  "Offer",
  "Rejected",
];

const STATUS_COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  Saved: { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-700" },
  Applied: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  "MCQ / Preliminary": { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-800" },
  "Written Exam": { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-800" },
  "Practical / Skill Test": { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-800" },
  "Viva Voce": { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800" },
  Interview: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
  Offer: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  Rejected: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
};

export function KanbanBoard({ applications, isLoading }: Props) {
  const queryClient = useQueryClient();
  const [retrospectiveApp, setRetrospectiveApp] = useState<JobApplication | null>(null);
  const [activeMobileColumn, setActiveMobileColumn] = useState<string>("Saved");

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateApplicationStatus(id, status),
    onSuccess: async (_, variables) => {
      toast.success("Application status updated");
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-analytics"] });

      if (variables.status.toLowerCase() === "rejected") {
        const found = applications?.find((a) => a.id === variables.id);
        if (found) {
          setRetrospectiveApp(found);
        }
      }
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || "Failed to update status");
    },
  });

  const getColumnApps = (statusName: string) => {
    return (
      applications?.filter(
        (app) => app.applicationStatus?.toLowerCase() === statusName.toLowerCase()
      ) || []
    );
  };

  const handleMoveStatus = (appId: string, newStatus: string) => {
    mutation.mutate({ id: appId, status: newStatus });
  };

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

  return (
    <div className="w-full">
      {/* Mobile Column Switcher */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-none">
        {DEFAULT_COLUMNS.map((column) => {
          const count = getColumnApps(column).length;
          const isActive = activeMobileColumn === column;
          return (
            <button
              key={column}
              onClick={() => setActiveMobileColumn(column)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{column}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${isActive ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Responsive Horizontal Scroll Kanban Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x max-w-full">
        {DEFAULT_COLUMNS.map((column) => {
          const columnApplications = getColumnApps(column);
          const colors = STATUS_COLOR_MAP[column] || STATUS_COLOR_MAP.Saved;
          const isMobileHidden = activeMobileColumn !== column;

          return (
            <div
              key={column}
              className={`w-72 shrink-0 min-w-[285px] bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/90 flex flex-col min-h-[460px] snap-start transition-all ${
                isMobileHidden ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3.5 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${colors.bg} border ${colors.border}`} />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 truncate">
                    {column}
                  </h3>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-200/80 text-slate-700">
                  {columnApplications.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {columnApplications.map((app) => {
                  const isGovt = isGovtOrBank(app);
                  return (
                    <div
                      key={app.id}
                      className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                            {app.role}
                          </h4>
                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noreferrer"
                              title={isGovt ? "View Govt Circular" : "View Job Post"}
                              className="text-slate-400 hover:text-indigo-600 shrink-0 p-0.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                          {isGovt ? (
                            <Landmark className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">{app.company}</span>
                        </p>
                      </div>

                      {/* Domain & Platform Tags */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isGovt ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            🏛️ Govt/Bank
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            🏢 Corporate
                          </span>
                        )}
                        {app.sourcePlatform && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 truncate max-w-[130px]">
                            {app.sourcePlatform}
                          </span>
                        )}
                      </div>

                      {(app.location || app.salaryRange) && (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-0.5">
                          {app.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[110px]">{app.location}</span>
                            </span>
                          )}
                          {app.salaryRange && (
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <DollarSign className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[110px]">{app.salaryRange}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Deadline / Exam Date Badge */}
                      {formatDate(app.followUpDate) !== "N/A" && (
                        <div className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 rounded px-1.5 py-0.5 flex items-center gap-1 w-fit">
                          <span>⏰ Deadline: {formatDate(app.followUpDate)}</span>
                        </div>
                      )}

                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1" title="Applied Date">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDate(app.appliedAt)}
                        </span>

                        <div className="flex items-center gap-1">
                          <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                          <select
                            value={column}
                            onChange={(e) => handleMoveStatus(app.id, e.target.value)}
                            className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium cursor-pointer hover:bg-slate-100 transition-colors focus:ring-1 focus:ring-indigo-500 max-w-[110px] truncate"
                          >
                            {DEFAULT_COLUMNS.map((col) => (
                              <option key={col} value={col}>
                                {col}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {column === "Rejected" && (
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            onClick={() => setRetrospectiveApp(app)}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Log Post-Mortem</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {columnApplications.length === 0 && (
                  <div className="h-28 flex flex-col items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white/50">
                    <span>No applications</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <RejectionRetrospectiveModal
        open={!!retrospectiveApp}
        onClose={() => setRetrospectiveApp(null)}
        application={retrospectiveApp}
      />
    </div>
  );
}

export default KanbanBoard;
