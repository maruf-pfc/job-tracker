import React, { useEffect, useState } from "react";
import type { JobApplication } from "@/types/job-application";
import { Building2, MapPin, DollarSign } from "lucide-react";

interface KanbanBoardProps {
  applications: JobApplication[];
  onStatusChange?: (updatedApp: JobApplication) => void;
}

const DEFAULT_COLUMNS = ["Saved", "Applied", "Interview", "Offer", "Rejected", "Ghosted"];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications: initialApps,
  onStatusChange,
}) => {
  const [apps, setApps] = useState<JobApplication[]>(initialApps);

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
    return apps.filter((a) =>
      a.applicationStatus?.toLowerCase() === columnName.toLowerCase()
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
      {DEFAULT_COLUMNS.map((column) => {
        const columnApplications = getColumnApps(column);
        return (
          <div
            key={column}
            className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col min-h-[420px]"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                {column}
              </h3>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-200 text-slate-700">
                {columnApplications.length}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {columnApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                        {app.role}
                      </h4>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {app.company}
                      </p>
                    </div>
                  </div>

                  {(app.location || app.salaryRange) && (
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      {app.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {app.location}
                        </span>
                      )}
                      {app.salaryRange && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-slate-400" /> {app.salaryRange}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                    <select
                      value={column}
                      onChange={(e) => handleMoveStatus(app.id, e.target.value)}
                      className="text-[11px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium"
                    >
                      {DEFAULT_COLUMNS.map((col) => (
                        <option key={col} value={col}>
                          Move to {col}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {columnApplications.length === 0 && (
                <div className="h-24 flex items-center justify-center text-xs text-slate-400 italic border border-dashed border-slate-200 rounded-lg">
                  No applications
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
