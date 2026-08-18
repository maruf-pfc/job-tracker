import { useEffect, useState, useMemo } from "react";
import { getDashboardSummary, getDashboardAnalytics } from "@/services/dashboardService";
import { getFailureAnalytics } from "@/services/rejectionService";
import type { DashboardAnalytics } from "@/services/dashboardService";
import type { DashboardSummary } from "@/types/dashboard";
import type { FailureAnalytics } from "@/types/rejection";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Award,
  BarChart3,
  Layers,
  PieChart as PieIcon,
  Globe,
  Filter,
  Zap,
  AlertTriangle,
  Lightbulb,
  Check,
  Compass,
  Clock,
  ShieldAlert,
  Gauge,
  Brain,
  BookOpen,
  Target,
  TrendingDown,
} from "lucide-react";

import { DashboardSkeleton } from "@/components/common/Skeletons";

const STATUS_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
const PLATFORM_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#64748b"];
const FAILURE_COLORS = ["#f43f5e", "#fb7185", "#f97316", "#eab308", "#8b5cf6", "#06b6d4"];

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [failureAnalytics, setFailureAnalytics] = useState<FailureAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackFilter, setTrackFilter] = useState<"All" | "Corporate" | "Govt & Bank">("All");

  useEffect(() => {
    async function loadData() {
      try {
        const [sumData, anaData, failData] = await Promise.all([
          getDashboardSummary().catch(() => null),
          getDashboardAnalytics().catch(() => null),
          getFailureAnalytics().catch(() => null),
        ]);
        setSummary(sumData);
        setAnalytics(anaData);
        setFailureAnalytics(failData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalApplications = summary?.totalApplications ?? analytics?.totalApplications ?? 0;
  const totalInterviews = summary?.totalInterviews ?? analytics?.totalInterviews ?? 0;
  const totalOffers = summary?.totalOffers ?? analytics?.totalOffers ?? 0;
  const responseRate = analytics?.responseRatePercentage ?? 0;
  const conversionRate = analytics?.interviewConversionRatePercentage ?? 0;
  const totalRetrospectives = failureAnalytics?.totalRetrospectives ?? 0;

  // Filtered stage and root cause data based on trackFilter
  const filteredStages = useMemo(() => {
    if (!failureAnalytics?.stageBreakdown) return [];
    if (trackFilter === "All") return failureAnalytics.stageBreakdown;
    if (trackFilter === "Corporate") {
      return failureAnalytics.stageBreakdown.filter((s) =>
        ["Resume", "Screen", "Coding", "System Design", "Behavioral", "Offer"].some((k) =>
          s.stage.includes(k)
        )
      );
    }
    return failureAnalytics.stageBreakdown.filter((s) =>
      ["MCQ", "Preliminary", "Written", "Practical", "Viva", "Medical"].some((k) =>
        s.stage.includes(k)
      )
    );
  }, [failureAnalytics, trackFilter]);

  const filteredRemediations = useMemo(() => {
    if (!failureAnalytics?.remediationActionPlan) return [];
    if (trackFilter === "All") return failureAnalytics.remediationActionPlan;
    if (trackFilter === "Corporate") {
      return failureAnalytics.remediationActionPlan.filter((r) =>
        r.category.toLowerCase().includes("corporate") ||
        r.category.toLowerCase().includes("algorithm") ||
        r.category.toLowerCase().includes("general")
      );
    }
    return failureAnalytics.remediationActionPlan.filter((r) =>
      r.category.toLowerCase().includes("govt") ||
      r.category.toLowerCase().includes("viva") ||
      r.category.toLowerCase().includes("exam")
    );
  }, [failureAnalytics, trackFilter]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Chart data formatting from real analytics
  const statusChartData = useMemo(() => {
    if (!analytics?.statusBreakdown || analytics.statusBreakdown.length === 0) return [];
    return analytics.statusBreakdown.map((item) => ({
      name: item.status || "Other",
      value: item.count,
    }));
  }, [analytics]);

  const platformChartData = useMemo(() => {
    if (!analytics?.platformBreakdown || analytics.platformBreakdown.length === 0) return [];
    return analytics.platformBreakdown.map((item) => ({
      platform: item.platform,
      count: item.count,
    }));
  }, [analytics]);

  const priorityChartData = useMemo(() => {
    if (!analytics?.priorityBreakdown || analytics.priorityBreakdown.length === 0) return [];
    return analytics.priorityBreakdown.map((item) => ({
      priority: item.priority,
      count: item.count,
    }));
  }, [analytics]);

  const weeklyVelocityData = useMemo(() => {
    if (!analytics?.weeklyTrends || analytics.weeklyTrends.length === 0) return [];
    return analytics.weeklyTrends.map((t) => ({
      week: t.weekLabel,
      applications: t.applicationCount,
    }));
  }, [analytics]);

  const difficultyPressureData = useMemo(() => {
    if (!failureAnalytics || totalRetrospectives === 0) return [];
    return [
      { metric: "Exam Difficulty", value: failureAnalytics.avgDifficultyRating, max: 5, fill: "#6366f1" },
      { metric: "Time Pressure", value: failureAnalytics.avgTimePressureRating, max: 5, fill: "#f43f5e" },
      { metric: "Self Confidence", value: failureAnalytics.avgConfidenceRating / 2, max: 5, fill: "#10b981" },
    ];
  }, [failureAnalytics, totalRetrospectives]);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Track Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-600" />
            Executive Career Operations & Failure Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time pipeline metrics, multi-variable Google-Form post-mortems, and senior remediation intelligence.
          </p>
        </div>

        {/* Track Filter Tabs */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setTrackFilter("All")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              trackFilter === "All"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Tracks ({totalApplications})
          </button>
          <button
            onClick={() => setTrackFilter("Corporate")}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              trackFilter === "Corporate"
                ? "bg-white text-indigo-600 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Corporate Tech</span>
          </button>
          <button
            onClick={() => setTrackFilter("Govt & Bank")}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              trackFilter === "Govt & Bank"
                ? "bg-white text-purple-600 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Govt & Bank</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights: 6 Modern Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {/* Metric 1: Total Applications */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pipeline</p>
            <p className="text-2xl font-black text-slate-900">{totalApplications}</p>
          </div>
        </div>

        {/* Metric 2: Response Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Response Rate</p>
            <p className="text-2xl font-black text-indigo-600">{responseRate}%</p>
          </div>
        </div>

        {/* Metric 3: Interviews & Exams */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Interviews/Exams</p>
            <p className="text-2xl font-black text-slate-900">{totalInterviews}</p>
          </div>
        </div>

        {/* Metric 4: Offers Won */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Offers Won</p>
            <p className="text-2xl font-black text-emerald-600">{totalOffers}</p>
          </div>
        </div>

        {/* Metric 5: Conversion Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Offer Ratio</p>
            <p className="text-2xl font-black text-purple-600">{conversionRate}%</p>
          </div>
        </div>

        {/* Metric 6: Post-Mortems */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Post-Mortems</p>
            <p className="text-2xl font-black text-rose-600">{totalRetrospectives}</p>
          </div>
        </div>
      </div>

      {/* Conversion Funnel Progress Diagram */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Recruitment Conversion Funnel & Velocity
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            End-to-End Success & Drop-off Flow
          </span>
        </div>

        {/* Visual Progress Bar Funnel */}
        <div className="space-y-3 pt-2">
          {/* Stage 1: Applications Sent */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>1. Applications Submitted (Initial Base)</span>
              <span className="font-bold text-slate-900">{totalApplications} ({totalApplications > 0 ? "100%" : "0%"})</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: totalApplications > 0 ? "100%" : "0%" }}
              />
            </div>
          </div>

          {/* Stage 2: Interview Shortlist */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>2. Recruiter & Exam Screened / Interview Shortlist</span>
              <span className="font-bold text-indigo-600">
                {totalInterviews} ({responseRate}%)
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(responseRate, 100)}%` }}
              />
            </div>
          </div>

          {/* Stage 3: Job Offers */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>3. Final Job Offers & Selection</span>
              <span className="font-bold text-emerald-600">
                {totalOffers} ({conversionRate}%)
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(conversionRate, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytical Visual Charts (4 Grid Charts) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Application Velocity Area Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" /> Weekly Application Velocity
          </h2>
          <div className="h-64 w-full pt-2">
            {weeklyVelocityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyVelocityData}>
                  <defs>
                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "12px" }} />
                  <Area type="monotone" dataKey="applications" stroke="#6366f1" fillOpacity={1} fill="url(#colorApp)" name="Applications" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <BarChart3 className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No application velocity data yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Submit applications to view weekly momentum and pace trends over time.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Status Breakdown Donut */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-indigo-600" /> Pipeline Status Distribution
          </h2>
          <div className="h-64 w-full pt-2">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <PieIcon className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No status distribution yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Saved, Applied, Interviewing, and Offer stages will show your pipeline breakdown here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Source Platforms Horizontal Bars */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" /> Application Portals & Platforms
          </h2>
          <div className="h-64 w-full pt-2">
            {platformChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={platformChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" allowDecimals={false} stroke="#64748b" fontSize={12} />
                  <YAxis dataKey="platform" type="category" stroke="#64748b" fontSize={12} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "12px" }} />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} name="Applications">
                    {platformChartData.map((_, index) => (
                      <Cell key={`cell-plat-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Globe className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No portal metrics yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Discover where you yield the highest response rate across platforms like LinkedIn, Bdjobs, and Teletalk.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chart 4: Role Priority Metrics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" /> Target Role Priority Breakdown
          </h2>
          <div className="h-64 w-full pt-2">
            {priorityChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="priority" stroke="#64748b" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "12px" }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Filter className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No priority metrics yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Analyze distribution across High, Medium, and Low target opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: Deep Google-Form Post-Mortem Failure Analysis & Senior Remediation Engine */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Post-Mortem Diagnostic Analytics & Remediation Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Deep multi-variable statistical intelligence derived from structured post-mortem surveys on failed Corporate and Bangladesh Govt/Bank exams.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {totalRetrospectives} Diagnostic Assessments Logged
            </span>
          </div>
        </div>

        {failureAnalytics && totalRetrospectives > 0 ? (
          <>
            {/* Diagnostic Vital Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Gauge className="w-4 h-4 text-indigo-600" />
                  <span>Avg Exam Difficulty</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {failureAnalytics.avgDifficultyRating} <span className="text-xs text-slate-400 font-normal">/ 5 ★</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>Time Pressure Stress</span>
                </div>
                <div className="text-xl font-bold text-rose-600 mt-1">
                  {failureAnalytics.avgTimePressureRating} <span className="text-xs text-slate-400 font-normal">/ 5</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pre-Exam Confidence</span>
                </div>
                <div className="text-xl font-bold text-emerald-600 mt-1">
                  {failureAnalytics.avgConfidenceRating} <span className="text-xs text-slate-400 font-normal">/ 10</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <TrendingDown className="w-4 h-4 text-amber-500" />
                  <span>Avg Cutoff Deficit</span>
                </div>
                <div className="text-xl font-bold text-amber-600 mt-1">
                  ~{failureAnalytics.avgCutoffDeficit} <span className="text-xs text-slate-400 font-normal">pts gap</span>
                </div>
              </div>
            </div>

            {/* Failure Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Elimination Stage Breakdown */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-indigo-600" />
                    Elimination Stage Distribution ({trackFilter})
                  </h3>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={filteredStages}
                      margin={{ left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" stroke="#64748b" fontSize={11} />
                      <YAxis
                        dataKey="stage"
                        type="category"
                        stroke="#64748b"
                        fontSize={11}
                        width={130}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          color: "#fff",
                          borderRadius: "12px",
                        }}
                      />
                      <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Failures">
                        {filteredStages.map((_, idx) => (
                          <Cell
                            key={`cell-fail-${idx}`}
                            fill={FAILURE_COLORS[idx % FAILURE_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Root Cause Breakdown */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Primary Root Cause Distribution
                </h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={failureAnalytics.rootCauseBreakdown}
                        dataKey="count"
                        nameKey="cause"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {failureAnalytics.rootCauseBreakdown.map((_, idx) => (
                          <Cell
                            key={`cell-cause-${idx}`}
                            fill={FAILURE_COLORS[idx % FAILURE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          color: "#fff",
                          borderRadius: "12px",
                        }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Diagnostic Difficulty & Time Pressure Chart */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-indigo-600" />
                Exam Difficulty vs Time Pressure vs Confidence Index (Scaled to 5.0)
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={difficultyPressureData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                    <YAxis domain={[0, 5]} allowDecimals={true} stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        color: "#fff",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="value" name="Rating Index" radius={[6, 6, 0, 0]}>
                      {difficultyPressureData.map((entry, index) => (
                        <Cell key={`cell-dp-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Topic Knowledge Gaps & External Blockers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Technical / Subject Topic Gap Heatmap */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  Recurring Subject & Topic Gap Frequency
                </h3>
                <div className="flex flex-wrap gap-2">
                  {failureAnalytics.topTopicGaps && failureAnalytics.topTopicGaps.length > 0 ? (
                    failureAnalytics.topTopicGaps.map((topicItem) => (
                      <span
                        key={topicItem.topic}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
                      >
                        <span>{topicItem.topic}</span>
                        <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-200 text-rose-800">
                          {topicItem.count}
                        </span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No topic gaps logged yet</span>
                  )}
                </div>
              </div>

              {/* Environmental & External Blockers */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Environmental & External Blockers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {failureAnalytics.topExternalBlockers && failureAnalytics.topExternalBlockers.length > 0 ? (
                    failureAnalytics.topExternalBlockers.map((blockerItem) => (
                      <span
                        key={blockerItem.topic}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"
                      >
                        <span>{blockerItem.topic}</span>
                        <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-200 text-amber-800">
                          {blockerItem.count}
                        </span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No external blockers recorded</span>
                  )}
                </div>
              </div>
            </div>

            {/* Preparation Time Correlation Matrix */}
            {failureAnalytics.preparationCorrelation && failureAnalytics.preparationCorrelation.length > 0 && (
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Preparation Duration Correlation Matrix
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {failureAnalytics.preparationCorrelation.map((p) => (
                    <div key={p.prepDuration} className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                      <div className="font-bold text-slate-800">{p.prepDuration}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {p.count} failure(s) • Avg Conf: {p.avgConfidence}/10
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Senior Remediation Action Cards */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Senior Researcher & Engineering Remediation Roadmap ({trackFilter})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRemediations.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.priority === "High"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.priority} Priority
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 text-xs text-slate-700 space-y-1">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Prescribed Practice Strategy:</span>
                      </div>
                      <p className="leading-relaxed text-slate-600 pl-5">
                        {item.recommendedAction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50 space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">
              No Post-Mortem Assessments Logged Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              When an application is rejected or failed (Corporate or Bangladesh Govt/Bank), click
              the "Post-Mortem" button on the Applications page to record your diagnostic survey. The system
              will compute deep statistical intelligence and expert practice strategies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
