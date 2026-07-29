import { useEffect, useState } from "react";
import { getDashboardSummary, getDashboardAnalytics } from "@/services/dashboardService";
import type { DashboardAnalytics } from "@/services/dashboardService";
import type { DashboardSummary } from "@/types/dashboard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Briefcase, CheckCircle2, TrendingUp, Award, Clock } from "lucide-react";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 animate-spin text-indigo-600" /> Loading dashboard statistics...
      </div>
    );
  }

  const totalApplications = summary?.totalApplications ?? analytics?.totalApplications ?? 0;
  const totalInterviews = summary?.totalInterviews ?? analytics?.totalInterviews ?? 0;
  const totalOffers = summary?.totalOffers ?? analytics?.totalOffers ?? 0;
  const responseRate = analytics?.responseRatePercentage ?? 0;

  return (
    <div className="space-y-6">
      {/* Header matching ApplicationsPage */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Track your job search stats, response rate, and application velocity.
        </p>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Applications</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{totalApplications}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Response Rate</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-600">
              {responseRate}%
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Interview Rate</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-indigo-600">{totalInterviews}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Offers</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-amber-600">{totalOffers}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Chart Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Application Velocity (Weekly Trends)</h2>
        {analytics?.weeklyTrends && analytics.weeklyTrends.length > 0 ? (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="weekLabel" stroke="#64748b" fontSize={13} />
                <YAxis allowDecimals={false} stroke="#64748b" fontSize={13} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "12px" }} />
                <Bar dataKey="applicationCount" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <Briefcase className="w-8 h-8 text-slate-400 mb-2" />
            No application activity recorded in recent weeks.
          </div>
        )}
      </div>
    </div>
  );
}
