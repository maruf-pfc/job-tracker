import React from "react";
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type { AiCareerInsight } from "../../types/ai-advisor";

interface AiCareerAdvisorCardProps {
  insights: AiCareerInsight | null;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export const AiCareerAdvisorCard: React.FC<AiCareerAdvisorCardProps> = ({
  insights,
  loading,
  refreshing,
  onRefresh,
}) => {
  if (loading && !insights) {
    return (
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/30 p-6 shadow-xs animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-slate-200 rounded-md" />
          <div className="h-6 w-24 bg-slate-200 rounded-full" />
        </div>
        <div className="h-20 bg-slate-200/70 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-slate-200/50 rounded-xl" />
          <div className="h-32 bg-slate-200/50 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const formattedDate = insights.generatedAt
    ? new Date(insights.generatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  return (
    <div className="rounded-2xl border border-indigo-200/70 bg-gradient-to-b from-white via-white to-indigo-50/20 shadow-xs overflow-hidden">
      {/* Top Header Bar */}
      <div className="border-b border-indigo-100/80 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 px-6 py-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  Executive AI Career Strategist
                </h2>
                <span className="inline-flex items-center rounded-full bg-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-200 ring-1 ring-inset ring-indigo-400/40">
                  Gemini Flash Intelligence
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                Automated synthesized diagnostic across your corporate applications, govt exams, and post-mortems.
              </p>
            </div>
          </div>

          {/* Action & Cache Status */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                insights.isCached
                  ? "bg-slate-800/80 text-indigo-200 ring-1 ring-slate-700"
                  : "bg-emerald-950/80 text-emerald-300 ring-1 ring-emerald-600/50"
              }`}
              title={
                insights.isCached
                  ? "Daily synthesized intelligence stored in database with zero redundant AI calls."
                  : "Freshly generated daily analysis stored in database."
              }
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{insights.isCached ? "Daily Cache" : "Daily Analysis"}</span>
              <span className="opacity-60">• {formattedDate}</span>
            </span>

            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-95"
              title="Force re-generate a new AI assessment"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Analyzing..." : "Re-analyze"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 space-y-6">
        {/* Executive Summary Callout */}
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-blue-50/50 p-4.5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Executive Pipeline Diagnostic & Velocity Assessment</span>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            {insights.executiveSummary}
          </p>
        </div>

        {/* Govt vs Corporate Strategy Comparison */}
        {insights.govtVsCorporateStrategy && (
          <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Govt / Bank Exam Preparation vs Corporate Track Strategy</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {insights.govtVsCorporateStrategy}
            </p>
          </div>
        )}

        {/* Tactical Strengths & Critical Gaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Key Strengths */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tactical Pipeline Strengths ({insights.keyStrengths?.length || 0})</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {insights.keyStrengths && insights.keyStrengths.length > 0 ? (
                insights.keyStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">No specific strengths calculated yet</li>
              )}
            </ul>
          </div>

          {/* Critical Gaps */}
          <div className="rounded-xl border border-rose-100 bg-rose-50/20 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Identified Bottlenecks & Gaps ({insights.criticalGaps?.length || 0})</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {insights.criticalGaps && insights.criticalGaps.length > 0 ? (
                insights.criticalGaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{gap}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">No bottlenecks detected yet</li>
              )}
            </ul>
          </div>
        </div>

        {/* Prioritized Action Plan */}
        {insights.actionPlan && insights.actionPlan.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Recommended High-Impact Action Items</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {insights.actionPlan.length} prescribed priority tasks
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {insights.actionPlan.map((action, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {action.category || "Strategy"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        action.priority === "High"
                          ? "bg-rose-100 text-rose-700"
                          : action.priority === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {action.priority} Priority
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 leading-snug">
                      <ArrowRight className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span>{action.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
