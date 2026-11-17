import { useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, CalendarClock, CheckCircle2, Clock3, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ApplicationForm from "@/components/applications/ApplicationForm";
import { useApplications } from "@/hooks/useApplications";
import { ApplicationsSkeleton } from "@/components/common/Skeletons";

type Tab = "all" | "active" | "archived";
const surface = "rounded-2xl border border-[#e4e8e2] bg-white shadow-[0_3px_14px_rgba(21,38,28,0.025)]";
const inputStyle = "h-10 w-full rounded-lg border border-[#dde4dd] bg-white px-3 text-[13px] text-[#23352d] outline-none transition-all duration-200 focus:border-[#447b59] focus:ring-4 focus:ring-[#447b59]/10";

function matchesClosedStatus(value?: string) {
  return /rejected|withdrawn|declined|closed|offer|hired|accepted/i.test(value ?? "");
}

export default function ApplicationsPage() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { applications, isLoading } = useApplications();

  const items = useMemo(() => applications ?? [], [applications]);
  // The existing hook/page only exposes status, not an archive flag. Keep this
  // view explicitly status-derived instead of pretending it is persisted archive data.
  const activeCount = items.filter((app) => !matchesClosedStatus(app.applicationStatus)).length;
  const closedCount = items.length - activeCount;
  const interviewCount = items.filter((app) =>
    /interview|screen|assessment|exam/i.test(app.applicationStatus ?? "") ||
    (app.totalRounds ?? 0) > 0 ||
    (app.passedRounds ?? 0) > 0
  ).length;
  const offerCount = items.filter((app) => /offer|hired|accepted/i.test(app.applicationStatus ?? "")).length;

  const statuses = useMemo(() => Array.from(new Set(items.map((a) => a.applicationStatus).filter((v): v is string => Boolean(v)))).sort(), [items]);
  const priorities = useMemo(() => Array.from(new Set(items.map((a) => a.priority).filter((v): v is string => Boolean(v)))).sort(), [items]);
  const workTypes = useMemo(() => Array.from(new Set(items.map((a) => a.workType).filter((v): v is string => Boolean(v)))).sort(), [items]);

  const filteredApplications = useMemo(() => items.filter((app) => {
    const search = searchQuery.trim().toLowerCase();
    const found = !search || [app.company, app.role, app.location].some((v) => v?.toLowerCase().includes(search));
    const closed = matchesClosedStatus(app.applicationStatus);
    return found && (tab === "all" || (tab === "active" ? !closed : closed)) &&
      (!statusFilter || app.applicationStatus?.toLowerCase() === statusFilter.toLowerCase()) &&
      (!priorityFilter || app.priority?.toLowerCase() === priorityFilter.toLowerCase()) &&
      (!workTypeFilter || app.workType?.toLowerCase() === workTypeFilter.toLowerCase());
  }), [items, tab, searchQuery, statusFilter, priorityFilter, workTypeFilter]);

  const activeFilters = [statusFilter, priorityFilter, workTypeFilter].filter(Boolean).length;
  const resetFilters = () => { setSearchQuery(""); setStatusFilter(""); setPriorityFilter(""); setWorkTypeFilter(""); setTab("all"); };

  if (isLoading) return <ApplicationsSkeleton />;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-12 font-['Inter',sans-serif] text-[#172820] animate-[fadeIn_.35s_ease-out]">
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @media (prefers-reduced-motion: reduce) { .animate-\\[fadeIn_\\.35s_ease-out\\], .animate-\\[fadeIn_\\.2s_ease-out\\] { animation: none !important; } }`}</style>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#658172]"><BriefcaseBusiness size={14} /> Workspace / Tracking</div>
          <h1 className="text-[clamp(26px,3vw,34px)] font-semibold tracking-[-.045em] leading-tight">Applications</h1>
          <p className="mt-2 text-sm text-[#758078]">Keep every opportunity, next step, and status in one place.</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#214b35] px-4 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#183e2a] hover:shadow-md active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214b35]">
          <Plus size={17} /> Add application
        </button>
      </header>

      <section aria-label="Application overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total applications", value: items.length, icon: BriefcaseBusiness },
          { label: "In progress", value: activeCount, icon: Clock3 },
          { label: "Interview stage", value: interviewCount, icon: CalendarClock },
          { label: "Offers", value: offerCount, icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className={`${surface} group flex min-h-[112px] items-center gap-4 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#326448] transition-colors group-hover:bg-[#dfeadc]"><Icon size={20} strokeWidth={1.8}/></span>
            <div className="min-w-0"><div className="text-[27px] font-semibold leading-none tracking-[-.045em] tabular-nums">{value}</div><p className="mt-2 text-[12px] leading-snug text-[#727d75]">{label}</p></div>
          </div>
        ))}
      </section>

      <section className={`${surface} overflow-hidden`} aria-label="Applications list">
        <div className="border-b border-[#e9ece6] px-4 pt-4 sm:px-6 sm:pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 overflow-x-auto" role="tablist" aria-label="Application views">
              {([{ id: "all", title: "All applications", count: items.length }, { id: "active", title: "In progress", count: activeCount }, { id: "archived", title: "Closed", count: closedCount }] as const).map((item) => (
                <button key={item.id} role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)} className={`relative flex h-11 shrink-0 items-center gap-2 px-3 text-[13px] font-medium transition-colors ${tab === item.id ? "text-[#205638]" : "text-[#7b8580] hover:text-[#263e31]"}`}>
                  {item.title}<span className={`rounded-md px-1.5 py-0.5 text-[11px] tabular-nums ${tab === item.id ? "bg-[#e5f0e2] text-[#205638]" : "bg-[#f1f3ef] text-[#78847b]"}`}>{item.count}</span>
                  {tab === item.id && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#285e40]"/>}
                </button>
              ))}
            </div>
            <div className="pb-2 text-xs text-[#8a938c]">{filteredApplications.length} results <ArrowRight size={13} className="ml-1 inline" /></div>
          </div>
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1 sm:max-w-[440px]"><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a948c]"/><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${inputStyle} pl-10`} placeholder="Search companies, roles or locations…" aria-label="Search applications"/></div>
            <button onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters} className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3.5 text-[13px] font-medium transition-all hover:bg-[#f1f6f0] ${showFilters || activeFilters ? "border-[#9ebb9d] bg-[#f0f6ed] text-[#28583d]" : "border-[#dde4dd] bg-white text-[#4f6055]"}`}><SlidersHorizontal size={15}/> Filters {activeFilters > 0 && <span className="rounded-full bg-[#2b6041] px-1.5 text-[11px] text-white">{activeFilters}</span>}</button>
            {(activeFilters > 0 || searchQuery) && <button onClick={resetFilters} className="inline-flex h-10 items-center justify-center gap-1.5 px-3 text-[12px] font-medium text-[#7c8980] transition-colors hover:text-[#234d36]"><X size={14}/> Clear all</button>}
          </div>
          {showFilters && <div className="grid gap-3 rounded-xl border border-[#e7ece5] bg-[#f8faf7] p-3 sm:grid-cols-3 animate-[fadeIn_.2s_ease-out]">
            {[
              { label: "Status", value: statusFilter, setValue: setStatusFilter, options: statuses },
              { label: "Priority", value: priorityFilter, setValue: setPriorityFilter, options: priorities },
              { label: "Work type", value: workTypeFilter, setValue: setWorkTypeFilter, options: workTypes },
            ].map(({ label, value, setValue, options }) => <label key={label} className="space-y-1 text-[11px] font-semibold text-[#5a695f]">{label}<select className={inputStyle} value={value} onChange={(e) => setValue(e.target.value)}><option value="">All {label.toLowerCase()}s</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>)}
          </div>}
        </div>
        <div className="min-w-0 border-t border-[#eef0eb] [&_table]:w-full [&_thead]:bg-[#f8faf7] [&_th]:text-[#647469] [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-[#f6faf5]">
          <ApplicationsTable applications={filteredApplications} isLoading={false}/>
        </div>
      </section>
      <ApplicationModal open={open} onClose={() => setOpen(false)} title="Add application"><ApplicationForm onSuccess={() => setOpen(false)}/></ApplicationModal>
    </div>
  );
}
