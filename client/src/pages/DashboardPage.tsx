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
      <div className="p-6 flex items-center justify-center text-slate-500 text-sm">
        <Clock className="w-4 h-4 animate-spin mr-2" /> Loading analytics...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Career Operating System</h1>
        <p className="text-xs text-slate-500">Analytics-driven job application tracking & pipeline performance.</p>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Applications</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">{summary?.totalApplications ?? 0}</p>
          </div>
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Response Rate</p>
            <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              {analytics?.responseRatePercentage ?? 0}%
            </p>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Interview Rate</p>
            <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{summary?.interviews ?? 0}</p>
          </div>
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Offers</p>
            <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mt-1">{summary?.offers ?? 0}</p>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Chart Section */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Application Velocity (Weekly Trends)</h2>
        {analytics?.weeklyTrends && analytics.weeklyTrends.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="weekLabel" stroke="#94a3b8" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff", borderRadius: "8px" }} />
                <Bar dataKey="applicationCount" fill="#6366f1" radius={[4, 4, 0, 0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            No application activity recorded in recent weeks.
          </div>
        )}
      </div>
    </div>
  );
}
