import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApplicationStatuses } from "@/services/applicationStatusService";
import { getJobTypes } from "@/services/jobTypeService";
import { getWorkTypes } from "@/services/workTypeService";
import { getPriorities } from "@/services/priorityService";
import { getSourcePlatforms } from "@/services/sourcePlatformService";
import Button from "@/components/ui/Button";
import { Tag, Briefcase, Globe, Signal, Building } from "lucide-react";

export default function LookupsPage() {
  const [activeTab, setActiveTab] = useState<
    "statuses" | "priorities" | "jobTypes" | "workTypes" | "platforms"
  >("statuses");

  const { data: statuses } = useQuery({ queryKey: ["statuses"], queryFn: getApplicationStatuses });
  const { data: priorities } = useQuery({ queryKey: ["priorities"], queryFn: getPriorities });
  const { data: jobTypes } = useQuery({ queryKey: ["jobTypes"], queryFn: getJobTypes });
  const { data: workTypes } = useQuery({ queryKey: ["workTypes"], queryFn: getWorkTypes });
  const { data: platforms } = useQuery({ queryKey: ["platforms"], queryFn: getSourcePlatforms });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            System Lookups
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Configure dropdown categories, priorities, platforms, and application statuses.
          </p>
        </div>
        <Button>Add Category Option</Button>
      </div>

      {/* Tabs Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("statuses")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-colors ${
            activeTab === "statuses"
              ? "bg-indigo-50 text-indigo-600 font-semibold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Signal className="w-4 h-4" /> Application Statuses ({statuses?.length ?? 0})
        </button>

        <button
          onClick={() => setActiveTab("priorities")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-colors ${
            activeTab === "priorities"
              ? "bg-indigo-50 text-indigo-600 font-semibold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Tag className="w-4 h-4" /> Priorities ({priorities?.length ?? 0})
        </button>

        <button
          onClick={() => setActiveTab("jobTypes")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-colors ${
            activeTab === "jobTypes"
              ? "bg-indigo-50 text-indigo-600 font-semibold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Briefcase className="w-4 h-4" /> Job Types ({jobTypes?.length ?? 0})
        </button>

        <button
          onClick={() => setActiveTab("workTypes")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-colors ${
            activeTab === "workTypes"
              ? "bg-indigo-50 text-indigo-600 font-semibold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Building className="w-4 h-4" /> Work Types ({workTypes?.length ?? 0})
        </button>

        <button
          onClick={() => setActiveTab("platforms")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-colors ${
            activeTab === "platforms"
              ? "bg-indigo-50 text-indigo-600 font-semibold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Globe className="w-4 h-4" /> Source Platforms ({platforms?.length ?? 0})
        </button>
      </div>

      {/* Content Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        {activeTab === "statuses" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {statuses?.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Status</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "priorities" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {priorities?.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">Priority</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "jobTypes" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {jobTypes?.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">Job Type</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "workTypes" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {workTypes?.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Work Type</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "platforms" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {platforms?.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">Platform</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
