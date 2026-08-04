import React, { useEffect, useState } from "react";
import type { JobApplication } from "@/types/job-application";
import { Building2, MapPin, DollarSign, Calendar, ArrowRightLeft } from "lucide-react";
import { formatDate } from "@/utils/date";

interface KanbanBoardProps {
  applications: JobApplication[];
  onStatusChange?: (updatedApp: JobApplication) => void;
}

const DEFAULT_COLUMNS = ["Saved", "Applied", "Interview", "Offer", "Rejected", "Ghosted"];

const STATUS_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  Saved: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" },
  Applied: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Interview: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  Offer: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  Ghosted: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications: initialApps,
  onStatusChange,
}) => {
  const [apps, setApps] = useState<JobApplication[]>(initialApps);
  const [activeMobileColumn, setActiveMobileColumn] = useState<string>("Applied");

  useEffect(() => {
    setApps(initialApps);
  }, [initialApps]);

  const handleMoveStatus = async (appId: string, newStatusName: string) => {
    const appToUpdate = apps.find((a) => a.id === appId);
    if (!appToUpdate) return;

    const previousStatus = appToUpdate.applicationStatus;
    const updatedApps = apps.map((a) =>
      a.id === appId ? { ...a, applicationStatus: newStatusName } : a
    );
    setApps(updatedApps);

    try {
      if (onStatusChange) {
        onStatusChange({ ...appToUpdate, applicationStatus: newStatusName });
      }
    } catch (err) {
      console.error("Failed to update status, rolling back:", err);
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, applicationStatus: previousStatus } : a))
      );
    }
  };

  const getColumnApps = (columnName: string) => {
    return apps.filter(
      (a) => a.applicationStatus?.toLowerCase() === columnName.toLowerCase()
    );
  };

  return (
    <div className="space-y-4">
      {/* Mobile Column Quick Switcher */}
      <div className="md:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {DEFAULT_COLUMNS.map((column) => {
          const count = getColumnApps(column).length;
          const isActive = activeMobileColumn === column;
          return (
            <button
              key={column}
              onClick={() => setActiveMobileColumn(column)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
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
              className={`w-full min-w-[280px] sm:min-w-[310px] max-w-[340px] flex-1 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/90 flex flex-col min-h-[460px] snap-start transition-all ${
                isMobileHidden ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3.5 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${colors.bg} border ${colors.border}`} />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {column}
                  </h3>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-200/80 text-slate-700">
                  {columnApplications.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {columnApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                        {app.role}
                      </h4>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{app.company}</span>
                      </p>
                    </div>

                    {(app.location || app.salaryRange) && (
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 pt-0.5">
                        {app.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{app.location}</span>
                          </span>
                        )}
                        {app.salaryRange && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{app.salaryRange}</span>
                          </span>
                        )}
                      </div>
                    )}

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDate(app.appliedAt)}
                      </span>

                      <div className="flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                        <select
                          value={column}
                          onChange={(e) => handleMoveStatus(app.id, e.target.value)}
                          className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium cursor-pointer hover:bg-slate-100 transition-colors focus:ring-1 focus:ring-indigo-500"
                        >
                          {DEFAULT_COLUMNS.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

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
    </div>
  );
};
