import { useEffect, useState } from "react";
import { getDashboardSummary, getDashboardAnalytics } from "@/services/dashboardService";
import type { DashboardAnalytics } from "@/services/dashboardService";
import type { DashboardSummary } from "@/types/dashboard";
import { generateDashboardAiInsights } from "@/services/geminiService";
import type { AiInsightResult } from "@/services/geminiService";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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
} from "recharts";
import {
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  CheckCircle,
  XCircle,
  Lightbulb,
  RefreshCw,
  Key,
} from "lucide-react";

const STATUS_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Gemini AI Insights state
  const [aiResult, setAiResult] = useState<AiInsightResult | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumData, anaData] = await Promise.all([
          getDashboardSummary().catch(() => null),
          getDashboardAnalytics().catch(() => null),
        ]);
        setSummary(sumData);
        setAnalytics(anaData);
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

  const handleGenerateGeminiInsights = async () => {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      toast.error("Please add your Gemini API Key in Settings first!");
      return;
    }

    setGeneratingAi(true);
    try {
      const res = await generateDashboardAiInsights(
        {
          totalApplications,
          responseRate,
          totalInterviews,
          totalOffers,
        },
        apiKey
      );
      setAiResult(res);
      toast.success("AI Insights generated via Gemini!");
    } catch {
      toast.error("Failed to generate AI insights. Check your Gemini API Key.");
    } finally {
      setGeneratingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 animate-spin text-indigo-600" /> Loading dashboard analytics...
      </div>
    );
  }

  // Chart data for Status Distribution
  const statusPieData = analytics?.statusBreakdown
    ? Object.entries(analytics.statusBreakdown).map(([name, value]) => ({ name, value }))
    : [
        { name: "Applied", value: totalApplications > 0 ? totalApplications - totalInterviews : 2 },
        { name: "Interviewing", value: totalInterviews > 0 ? totalInterviews : 1 },
        { name: "Offers", value: totalOffers > 0 ? totalOffers : 0 },
      ];

  const defaultAssessment =
    totalApplications === 0
      ? "You haven't submitted applications yet this month. Target submitting 5–8 tailored applications per week for Full Stack Engineer roles to maintain consistent response momentum."
      : `You currently have ${totalApplications} active application(s) with a ${responseRate}% response rate. Your response rate is healthy. Focus on scheduled follow-ups and custom resume tailoring for backend .NET & Full Stack roles.`;

  const defaultDos = [
    "Follow up on applications that have been pending without response for > 7 business days.",
    "Use the AI Cover Letter Generator on the Settings page to tailor emails for high-priority targets.",
    "Log interview feedback immediately after rounds in your markdown notes for future preparation.",
  ];

  const defaultDonts = [
    "Don't send generic, non-customized resumes to senior Full Stack or .NET roles.",
    "Don't leave interview dates blank or untracked without set reminders.",
    "Don't neglect automated data backups — use n8n or CSV export to preserve historical data.",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard Analytics & Gemini AI Insights
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Track your job search stats, response rate, application velocity, and AI recommendations.
        </p>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applications</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{totalApplications}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Response Rate</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-600">
              {responseRate}%
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews Scheduled</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-indigo-600">{totalInterviews}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Offers</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-amber-600">{totalOffers}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Application Velocity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" /> Application Velocity (Weekly Trends)
          </h2>
          {analytics?.weeklyTrends && analytics.weeklyTrends.length > 0 ? (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="weekLabel" stroke="#64748b" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "12px" }} />
                  <Bar dataKey="applicationCount" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50 p-6 text-center">
              <Briefcase className="w-8 h-8 text-slate-400 mb-2" />
              No application activity recorded in recent weeks. Keep applying to see weekly momentum trends!
            </div>
          )}
        </div>

        {/* Chart 2: Status Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-600" /> Application Status Breakdown
          </h2>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Suggestions & Gemini Insights */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Gemini AI Career Coach & Insights</h3>
              <p className="text-xs text-slate-500">Live AI evaluation based on your active pipeline metrics.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateGeminiInsights}
              disabled={generatingAi}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${generatingAi ? "animate-spin" : ""}`} />
              {generatingAi ? "Analyzing with Gemini..." : "Generate AI Insights"}
            </button>

            <Link
              to="/settings"
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
              title="Configure API Key"
            >
              <Key className="w-3.5 h-3.5" /> API Key
            </Link>
          </div>
        </div>

        {/* Smart Evaluation */}
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-slate-700">
            <span className="font-bold text-slate-900 block">AI Velocity & Conversion Assessment:</span>
            <p>{aiResult?.assessment || defaultAssessment}</p>
          </div>
        </div>

        {/* Guidelines Grid: DOs & DON'Ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Actionable To-Dos (DOs) */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-3">
            <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Recommended Action Items (DOs)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
              {(aiResult?.dos || defaultDos).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Guidelines (DON'Ts) */}
          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/70 space-y-3">
            <h4 className="text-sm font-bold text-rose-900 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600" /> Critical Practices to Avoid (DON'Ts)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-rose-950">
              {(aiResult?.donts || defaultDonts).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
