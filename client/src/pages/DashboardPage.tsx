import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, BriefcaseBusiness, CalendarDays,
  CheckCircle2, FileText, Filter, Layers3,
  RefreshCw, SearchX, Sparkles, Target, TrendingUp,
  AlertCircle, BarChart3, Globe2, Activity,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { getDashboardSummary, getDashboardAnalytics } from "@/services/dashboardService";
import type { DashboardAnalytics } from "@/services/dashboardService";
import type { DashboardSummary } from "@/types/dashboard";
import { DashboardSkeleton } from "@/components/common/Skeletons";

/**
 * Drop-in dashboard page using existing API services.
 * The application's existing layout is responsible for the global sidebar/topbar.
 * No example application records are fabricated: date-based reminders and a live
 * activity feed require endpoints not supplied in the original dashboard page.
 */
const GREEN = "#27613f";
const STATUS_PALETTE = ["#92bda0", "#c6ddbd", "#2e7950", "#5c9b70", "#d6dad5", "#b5c6bd", "#d9b38c"];
const TOOLTIP_STYLE = {
  background: "#1c2c25", border: "1px solid #304638", borderRadius: 12,
  color: "#fff", boxShadow: "0 12px 35px rgba(0,0,0,.14)", fontSize: 12,
};

const panel = "rounded-[18px] border border-[#e5e8e2] bg-white shadow-[0_2px_14px_rgba(25,45,29,0.025)]";
const action = "inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-[13px] font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#357a50] active:scale-[0.98]";
const fmt = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(n);
const num = (n: unknown) => (typeof n === "number" && Number.isFinite(n) ? n : 0);
const css = `
  @keyframes jt-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes jt-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  .jt-enter { animation: jt-rise .55s cubic-bezier(.2,.75,.2,1) both; }
  .jt-fill { transform-origin: left; animation: jt-fill .9s cubic-bezier(.2,.75,.2,1) both; }
  .jt-enter-delay-1 { animation-delay: 80ms; }
  .jt-enter-delay-2 { animation-delay: 150ms; }
  .jt-enter-delay-3 { animation-delay: 220ms; }
  .jt-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .jt-scroll::-webkit-scrollbar-thumb { background: #d9e3d9; border-radius: 6px; }
  @media (prefers-reduced-motion: reduce) { .jt-enter, .jt-fill { animation: none !important; } * { scroll-behavior: auto !important; } }
`;

type IconComponent = typeof BriefcaseBusiness;
function Metric({ label, value, icon: Icon, caption, tone = "green" }: {
  label: string; value: string | number; icon: IconComponent; caption?: string;
  tone?: "green" | "red" | "neutral";
}) {
  const toneClass = tone === "red" ? "bg-[#fbe9e8] text-[#ad4943]" : tone === "neutral" ? "bg-[#f0f1ed] text-[#5e6b60]" : "bg-[#eaf4e9] text-[#27613f]";
  return (
    <div className={`${panel} group min-w-0 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(35,71,43,.08)] sm:p-5`}>
      <div className="flex items-start gap-3.5">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${toneClass}`}><Icon size={21} strokeWidth={1.8} /></span>
        <div className="min-w-0">
          <p className="text-[27px] font-semibold leading-none tracking-[-.045em] text-[#18251f] tabular-nums sm:text-[30px]">{value}</p>
          <p className="mt-2 text-[12px] font-medium text-[#55635a] sm:text-[13px]">{label}</p>
          {caption && <p className="mt-1 text-[11px] text-[#8a968d]">{caption}</p>}
        </div>
      </div>
    </div>
  );
}
function PanelHeading({ title, subtitle, to, linkText }: { title: string; subtitle?: string; to?: string; linkText?: string }) {
  return <div className="flex flex-wrap items-start justify-between gap-3">
    <div><h2 className="text-[16px] font-semibold tracking-[-.025em] text-[#1b2720] sm:text-[17px]">{title}</h2>
      {subtitle && <p className="mt-1 text-[12px] leading-5 text-[#829085]">{subtitle}</p>}</div>
    {to && <Link to={to} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#27613f] transition-colors hover:text-[#123c27] focus-visible:underline">{linkText || "View all"}<ArrowRight size={14} /></Link>}
  </div>;
}
function Empty({ title, description, icon: Icon = SearchX }: { title: string; description: string; icon?: IconComponent }) {
  return <div className="flex min-h-[160px] flex-col items-center justify-center px-4 py-7 text-center">
    <span className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-[#f1f5f0] text-[#66816c]"><Icon size={20} strokeWidth={1.7} /></span>
    <p className="text-[13px] font-semibold text-[#2f4135]">{title}</p>
    <p className="mt-1 max-w-[260px] text-[12px] leading-5 text-[#8a968c]">{description}</p>
  </div>;
}
function progressWidth(value: number, max: number) {
  return `${max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0}%`;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [s, a] = await Promise.all([
          getDashboardSummary().catch(() => null), getDashboardAnalytics().catch(() => null),
        ]);
        if (!mounted) return;
        setSummary(s); setAnalytics(a);
      } finally { if (mounted) { setLoading(false); } }
    }
    void load();
    return () => { mounted = false; };
  }, []);

  async function refreshDashboard() {
    setRefreshing(true);
    try {
      const [s, a] = await Promise.all([
        getDashboardSummary().catch(() => null), getDashboardAnalytics().catch(() => null),
      ]);
      setSummary(s); setAnalytics(a);
    } finally { setRefreshing(false); }
  }
  const total = num(summary?.totalApplications ?? analytics?.totalApplications);
  const interviews = num(summary?.totalInterviews ?? analytics?.totalInterviews);
  const offers = num(summary?.totalOffers ?? analytics?.totalOffers);
  const responseRate = num(analytics?.responseRatePercentage);
  const conversionRate = num(analytics?.interviewConversionRatePercentage);
  const statusData = useMemo(() => (analytics?.statusBreakdown ?? [])
    .map(s => ({ name: s.status || "Other", value: num(s.count) })).filter(s => s.value > 0), [analytics]);
  const platformData = useMemo(() => (analytics?.platformBreakdown ?? [])
    .map(s => ({ name: s.platform, value: num(s.count) })).sort((a,b) => b.value - a.value).slice(0, 6), [analytics]);
  const priorityData = useMemo(() => (analytics?.priorityBreakdown ?? [])
    .map(s => ({ name: s.priority, value: num(s.count) })).sort((a,b) => b.value - a.value), [analytics]);
  const weeklyData = useMemo(() => (analytics?.weeklyTrends ?? [])
    .map(s => ({ week: s.weekLabel, applications: num(s.applicationCount) })), [analytics]);
  const statusTotal = statusData.reduce((sum, s) => sum + s.value, 0);
  const mostCommonStatuses = [...statusData].sort((a,b) => b.value - a.value).slice(0, 5);
  const activeStatuses = statusData.filter(s => /review|interview|screen|progress|assessment|shortlist|test|exam|pending/i.test(s.name));
  const activeTotal = activeStatuses.reduce((sum, s) => sum + s.value, 0);
  const rejectedTotal = statusData.filter(s => /reject|fail|declin/i.test(s.name)).reduce((sum,s) => sum + s.value,0);
  const largestStage = Math.max(total, ...statusData.map(s => s.value), 1);
  if (loading) return <DashboardSkeleton />;

  return <div className="jt-scroll relative min-w-0 bg-[#f9faf7] pb-14 font-['Inter',system-ui,sans-serif] text-[#243229]">
    <style>{css}</style>
    <div className="mx-auto max-w-[1600px] space-y-6 pt-1 sm:space-y-7 sm:pt-2">
      {/* The app shell already renders the navigation sidebar and search topbar. */}
      <header className="jt-enter flex flex-wrap items-end justify-between gap-5 pb-1">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium tracking-wide text-[#809083]"><span>Workspace</span><span>/</span><span className="text-[#2b6742]">Overview</span></div>
          <h1 className="text-[27px] font-semibold leading-tight tracking-[-.045em] text-[#18251e] sm:text-[33px]">Your job search, at a glance.</h1>
          <p className="mt-2 text-[13px] leading-5 text-[#768279] sm:text-[14px]">Stay on top of your applications, measure progress, and make your next move.</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <button onClick={refreshDashboard} disabled={refreshing} className={`${action} border border-[#dce4dc] bg-white text-[#3f5646] hover:border-[#b7cbbb] hover:bg-[#f4f8f3] disabled:opacity-60`}>
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""}/> Refresh
          </button>
          <Link to="/applications" className={`${action} bg-[#255b3a] text-white shadow-[0_3px_9px_rgba(25,80,47,.13)] hover:bg-[#1a452d]`}>
            <BriefcaseBusiness size={15}/> View applications <ArrowUpRight size={14}/>
          </Link>
        </div>
      </header>

      <section className="jt-enter jt-enter-delay-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3" aria-label="Application statistics">
        <Metric icon={FileText} value={fmt(total)} label="Total applications" />
        <Metric icon={Activity} value={fmt(activeTotal)} label="In progress" caption="Based on current statuses" />
        <Metric
          icon={CalendarDays}
          value={fmt(interviews)}
          label="Interviews & exams"
          caption={
            summary?.totalInterviewRoundsPassed && summary.totalInterviewRoundsPassed > 0
              ? `${summary.totalInterviewRoundsPassed} rounds passed`
              : undefined
          }
        />
        <Metric icon={CheckCircle2} value={fmt(offers)} label="Offers" />
        <Metric icon={AlertCircle} value={fmt(rejectedTotal)} label="Rejected / failed" tone="red" />
      </section>

      <div className="jt-enter jt-enter-delay-2 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section className={`${panel} min-w-0 p-5 sm:p-6`}>
          <PanelHeading title="Application pipeline" subtitle="Current distribution across your application statuses" to="/applications" linkText="View applications"/>
          {statusData.length ? <div className="mt-8 space-y-4">
            {mostCommonStatuses.map((s, index) => <div key={s.name} className="grid grid-cols-[minmax(0,126px)_1fr_42px] items-center gap-3 sm:grid-cols-[minmax(0,170px)_1fr_54px]">
              <span className="truncate text-[12px] font-medium text-[#43564a]" title={s.name}>{s.name}</span>
              <div className="h-3 overflow-hidden rounded-full bg-[#edf1eb]"><div className="jt-fill h-full rounded-full" style={{ width: progressWidth(s.value, largestStage), backgroundColor: STATUS_PALETTE[index % STATUS_PALETTE.length], animationDelay: `${index * 90 + 120}ms` }}/></div>
              <span className="text-right text-[13px] font-semibold tabular-nums text-[#2a382e]">{fmt(s.value)}</span>
            </div>)}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf0ea] pt-4 text-[12px] text-[#819085]"><span>{fmt(statusTotal)} categorized applications</span><span>{statusData.length} distinct statuses</span></div>
          </div> : <Empty title="No pipeline data yet" description="Your application statuses will appear here as you start tracking opportunities." icon={Layers3}/>}
        </section>

        <section className={`${panel} min-w-0 p-5 sm:p-6`}>
          <PanelHeading title="Applications by status" subtitle="A snapshot of where things stand"/>
          {statusData.length ? <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row xl:flex-col 2xl:flex-row">
            <div className="relative h-[212px] w-[212px] shrink-0" aria-label={`Status breakdown: ${statusTotal} categorized applications`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={statusData} dataKey="value" innerRadius={69} outerRadius={92} paddingAngle={2} stroke="none" isAnimationActive animationDuration={850}>
                  {statusData.map((s, i) => <Cell key={s.name} fill={STATUS_PALETTE[i % STATUS_PALETTE.length]} />)}
                </Pie><Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{color:"#fff"}}/></PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><strong className="text-[30px] leading-none font-semibold tracking-[-.04em] text-[#223127] tabular-nums">{fmt(statusTotal)}</strong><span className="mt-1 text-[11px] text-[#87948a]">Applications</span></div>
            </div>
            <div className="w-full min-w-0 flex-1 space-y-3">
              {statusData.map((s, i) => <div key={s.name} className="flex min-w-0 items-center gap-2 text-[12px]"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{background:STATUS_PALETTE[i % STATUS_PALETTE.length]}}/><span className="min-w-0 flex-1 truncate text-[#657469]" title={s.name}>{s.name}</span><b className="font-semibold tabular-nums text-[#29392e]">{s.value}</b><span className="w-9 text-right tabular-nums text-[#94a096]">{Math.round(s.value / (statusTotal || 1)*100)}%</span></div>)}
            </div>
          </div> : <Empty title="Nothing to visualize" description="A status chart will be shown once you add applications." icon={BarChart3}/>}
        </section>
      </div>

      <div className="jt-enter jt-enter-delay-3 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <section className={`${panel} min-w-0 p-5 sm:p-6`}>
          <PanelHeading title="Response & conversion" subtitle="High-level recruiting outcomes"/>
          <div className="mt-6 space-y-6">
            {[{label:"Response rate",value:responseRate,icon:TrendingUp},{label:"Interview conversion",value:conversionRate,icon:Target}].map(item => <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-[12px] text-[#55665b]"><item.icon size={15} className="text-[#3d7852]"/>{item.label}</span><span className="text-[17px] font-semibold tabular-nums text-[#23372a]">{fmt(item.value)}%</span></div>
              <div className="h-2.5 rounded-full bg-[#edf1eb]"><div className="jt-fill h-full rounded-full bg-[#3b8554]" style={{width:`${Math.max(0,Math.min(100,item.value))}%`}}/></div>
            </div>)}
          </div>
          <p className="mt-7 border-t border-[#edf0ea] pt-4 text-[11px] leading-5 text-[#8b978e]">Rates are supplied by your dashboard analytics API.</p>
        </section>
        <section className={`${panel} min-w-0 p-5 sm:p-6`}>
          <PanelHeading title="Weekly momentum" subtitle="Applications submitted over time"/>
          <div className="mt-4 h-[195px] min-w-0">
            {weeklyData.length ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={weeklyData} margin={{top:9,right:7,left:-26,bottom:0}}>
              <defs><linearGradient id="jtWeeklyGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#67a67c" stopOpacity={.28}/><stop offset="100%" stopColor="#67a67c" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="#eef1eb" strokeDasharray="3 4"/><XAxis dataKey="week" tick={{fontSize:10,fill:"#98a49a"}} tickLine={false} axisLine={false}/><YAxis allowDecimals={false} tick={{fontSize:10,fill:"#98a49a"}} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{color:"#fff"}}/><Area dataKey="applications" name="Applications" type="monotone" stroke={GREEN} strokeWidth={2.4} fill="url(#jtWeeklyGreen)" animationDuration={900}/>
            </AreaChart></ResponsiveContainer> : <Empty title="No weekly history" description="Your weekly application trend will appear here." icon={Activity}/>}
          </div>
        </section>
        <section className={`${panel} min-w-0 p-5 sm:p-6`}>
          <PanelHeading title="Application sources" subtitle="Where your opportunities come from"/>
          {platformData.length ? <div className="mt-6 space-y-4">{platformData.map((item,i) => <div key={item.name}>
            <div className="mb-1.5 flex justify-between gap-2 text-[12px]"><span className="truncate text-[#5e7063]">{item.name}</span><span className="font-semibold tabular-nums text-[#314a38]">{item.value}</span></div>
            <div className="h-2 rounded-full bg-[#edf1eb]"><div className="jt-fill h-full rounded-full" style={{width:progressWidth(item.value,platformData[0]?.value || 1),background:STATUS_PALETTE[i%STATUS_PALETTE.length]}}/></div>
          </div>)}</div> : <Empty title="No sources yet" description="Application source statistics will appear when available." icon={Globe2}/>}
        </section>
      </div>

      <section className={`${panel} jt-enter p-5 sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3"><PanelHeading title="Priority overview" subtitle="How your application effort is distributed"/><Link to="/applications" className={`${action} border border-[#e1e9e0] bg-white text-[#346445] hover:bg-[#f5f8f3]`}><Filter size={14}/> Manage applications</Link></div>
        {priorityData.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{priorityData.map((p,i) => <div key={p.name} className="rounded-xl border border-[#e8ede6] bg-[#fcfdfa] p-4">
          <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{background:STATUS_PALETTE[i%STATUS_PALETTE.length]}}/><span className="truncate text-[12px] font-medium text-[#637267]">{p.name}</span></div>
          <div className="mt-2 flex items-end justify-between"><span className="text-2xl font-semibold tracking-[-.04em] tabular-nums">{p.value}</span><span className="text-xs text-[#98a599]">applications</span></div>
        </div>)}</div> : <Empty title="No priority information" description="Add priorities to your applications to see their breakdown." icon={Target}/>}
      </section>

      <section className={`${panel} jt-enter flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6`}>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e8f1e8] text-[#337047]"><Sparkles size={21}/></span>
          <div><h2 className="text-[16px] font-semibold tracking-tight text-[#1e2f23]">Go deeper with Career Intelligence</h2>
          <p className="mt-1 max-w-xl text-[12px] leading-5 text-[#849188]">Explore AI recommendations, rejection diagnostics, root causes, and preparation plans in one dedicated workspace.</p></div>
        </div>
        <Link to="/career-intelligence" className={`${action} shrink-0 bg-[#255b3a] text-white hover:bg-[#1a452d]`}>Open intelligence <ArrowRight size={15}/></Link>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[#9ba79c]"><span>Job Tracker · Your progress, clearly organized</span><span>Overview updates when dashboard data is refreshed</span></footer>
    </div>
  </div>;
}
