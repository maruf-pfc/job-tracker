import Select from "@/components/ui/Select";
import { Search, X } from "lucide-react";

interface ApplicationsFiltersProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  statusFilter?: string;
  onStatusChange?: (val: string) => void;
  priorityFilter?: string;
  onPriorityChange?: (val: string) => void;
  workTypeFilter?: string;
  onWorkTypeChange?: (val: string) => void;
  onReset?: () => void;
}

export default function ApplicationsFilters({
  searchQuery = "",
  onSearchChange,
  statusFilter = "",
  onStatusChange,
  priorityFilter = "",
  onPriorityChange,
  workTypeFilter = "",
  onWorkTypeChange,
  onReset,
}: ApplicationsFiltersProps) {
  const hasActiveFilters = Boolean(
    searchQuery || statusFilter || priorityFilter || workTypeFilter
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search Input with Icon */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search company or role..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className="text-sm bg-slate-50 border-slate-200 rounded-xl"
        >
          <option value="">All Statuses</option>
          <option value="Saved">Saved</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Ghosted">Ghosted</option>
        </Select>

        {/* Priority Filter */}
        <Select
          value={priorityFilter}
          onChange={(e) => onPriorityChange?.(e.target.value)}
          className="text-sm bg-slate-50 border-slate-200 rounded-xl"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </Select>

        {/* Work Type Filter */}
        <Select
          value={workTypeFilter}
          onChange={(e) => onWorkTypeChange?.(e.target.value)}
          className="text-sm bg-slate-50 border-slate-200 rounded-xl"
        >
          <option value="">All Work Types</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Filtered results active</span>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
