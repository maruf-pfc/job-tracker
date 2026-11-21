import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BrainCircuit, RefreshCw, Lightbulb, Target, AlertCircle, BarChart3, CheckCircle2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getFailureAnalytics } from "@/services/rejectionService";
import { aiAdvisorService } from "@/services/aiAdvisorService";
import type { FailureAnalytics } from "@/types/rejection";
import type { AiCareerInsight } from "@/types/ai-advisor";
import { AiCareerAdvisorCard } from "@/components/dashboard/AiCareerAdvisorCard";

const card = "rounded-[18px] border border-[#e5e8e2] bg-white p-5 shadow-[0_2px_14px_rgba(25,45,29,.025)] sm:p-6";
const format = (n: unknown) => typeof n === "number" && Number.isFinite(n) ? n.toLocaleString("en-US",{maximumFractionDigits:1}) : "0";
const tooltipStyle = {backgroundColor:"#1c2c25", color:"white", border:"1px solid #304638", borderRadius:10};
type Track = "All" | "Corporate" | "Govt & Bank";

export default function CareerIntelligencePage() {
  const [insights, setInsights] = useState<AiCareerInsight | null>(null);
  const [failure, setFailure] = useState<FailureAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [track, setTrack] = useState<Track>("All");

  useEffect(() => {
    let active = true;
    Promise.all([
      aiAdvisorService.getCareerInsights().catch(() => null),
      getFailureAnalytics().catch(() => null),
    ]).then(([ai, diagnostics]) => {
      if (active) { setInsights(ai); setFailure(diagnostics); }
    }).finally(() => { if(active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function refresh() {
    setRefreshing(true);
    try {
      const [ai, diagnostics] = await Promise.all([
        aiAdvisorService.refreshCareerInsights().catch(() => null),
        getFailureAnalytics().catch(() => null),
      ]);
      if(ai) setInsights(ai);
      if(diagnostics) setFailure(diagnostics);
    } finally { setRefreshing(false); }
  }

  const stages = useMemo(() => (failure?.stageBreakdown ?? []).filter(item => {
    if (track === "All") return true;
    const keys = track === "Corporate"
      ? ["resume","screen","coding","system design","behavioral","offer"]
      : ["mcq","preliminary","written","practical","viva","medical"];
    return keys.some(k => item.stage?.toLowerCase().includes(k));
  }), [failure, track]);
  const plans = useMemo(() => (failure?.remediationActionPlan ?? []).filter(item => {
    if (track === "All") return true;
    const keys = track === "Corporate" ? ["corporate","algorithm","general"] : ["govt","viva","exam"];
    return keys.some(k => item.category?.toLowerCase().includes(k));
  }), [failure, track]);
  return <div className="min-w-0 bg-[#f9faf7] pb-12 font-['Inter',system-ui,sans-serif] text-[#243229]">
    <div className="mx-auto max-w-[1500px] space-y-5 pt-1 sm:space-y-6 sm:pt-2">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-[#6f8172] hover:text-[#255b3a]"><ArrowLeft size={14}/> Dashboard</Link>
          <h1 className="mt-3 flex items-center gap-3 text-[28px] font-semibold tracking-[-.045em] text-[#19291f] sm:text-[34px]"><BrainCircuit className="text-[#2d7045]" size={28}/> Career Intelligence</h1>
          <p className="mt-2 text-[13px] text-[#738176]">AI career guidance, learning patterns, and practical improvements in one place.</p>
        </div>
        <button onClick={refresh} disabled={refreshing || loading} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#265d3c] px-4 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#1b482e] active:scale-[.98] disabled:opacity-50"><RefreshCw size={15} className={refreshing ? "animate-spin" : ""}/> Refresh insights</button>
      </div>
      <section className={card}>
        <div className="mb-4 flex items-center gap-2"><Lightbulb size={18} className="text-[#36784b]"/><h2 className="text-[17px] font-semibold">AI career advisor</h2></div>
        <AiCareerAdvisorCard insights={insights} loading={loading} refreshing={refreshing} onRefresh={refresh}/>
      </section>
      <section className={card}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h2 className="text-[17px] font-semibold">Rejection & assessment diagnostics</h2><p className="mt-1 text-xs text-[#849188]">Patterns derived from your recorded post-mortem surveys.</p></div>
          <span className="rounded-full bg-[#edf4ed] px-3 py-1.5 text-xs font-semibold text-[#356646]">{format(failure?.totalRetrospectives)} retrospectives</span>
        </div>
        {failure && failure.totalRetrospectives > 0 ? <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ["Exam difficulty",`${format(failure.avgDifficultyRating)} / 5`],
              ["Time pressure",`${format(failure.avgTimePressureRating)} / 5`],
              ["Confidence",`${format(failure.avgConfidenceRating)} / 10`],
              ["Avg. cutoff deficit",`${format(failure.avgCutoffDeficit)} pts`],
            ].map(([label,value]) => <div key={label} className="rounded-xl border border-[#e8ece6] bg-[#fbfcfa] p-4"><p className="text-[12px] text-[#7c8c80]">{label}</p><p className="mt-2 text-xl font-semibold tracking-tight text-[#253d2e]">{value}</p></div>)}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter diagnostic track">{(["All","Corporate","Govt & Bank"] as const).map(item => <button key={item} onClick={() => setTrack(item)} aria-pressed={track===item} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${track===item ? "bg-[#265b3b] text-white" : "border border-[#e1e8df] bg-white text-[#68796b] hover:bg-[#f1f5f0]"}`}>{item}</button>)}</div>
          <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <div className="min-w-0 rounded-xl border border-[#e8ece5] p-4"><h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><BarChart3 size={17} className="text-[#39764d]"/> Elimination stages</h3>{stages.length ? <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={stages} margin={{left:8,right:16}}><CartesianGrid horizontal={false} stroke="#e9eee8"/><XAxis type="number" allowDecimals={false} tick={{fontSize:10}}/><YAxis type="category" dataKey="stage" width={110} tick={{fontSize:10}}/><Tooltip contentStyle={tooltipStyle} itemStyle={{color:"#fff"}}/><Bar dataKey="count" name="Cases" fill="#5b9970" radius={[0,5,5,0]}/></BarChart></ResponsiveContainer></div> : <p className="py-12 text-center text-xs text-[#849188]">No stage data for this track.</p>}</div>
            <div className="min-w-0 rounded-xl border border-[#e8ece5] p-4"><h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><AlertCircle size={17} className="text-[#b17c49]"/> Root causes</h3>{failure.rootCauseBreakdown?.length ? <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={failure.rootCauseBreakdown} margin={{left:8,right:16}}><CartesianGrid horizontal={false} stroke="#e9eee8"/><XAxis type="number" allowDecimals={false} tick={{fontSize:10}}/><YAxis type="category" dataKey="cause" width={110} tick={{fontSize:10}}/><Tooltip contentStyle={tooltipStyle} itemStyle={{color:"#fff"}}/><Bar dataKey="count" name="Cases" fill="#a5be9c" radius={[0,5,5,0]}/></BarChart></ResponsiveContainer></div> : <p className="py-12 text-center text-xs text-[#849188]">No root cause records yet.</p>}</div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {[{title:"Recurring skill gaps",items:failure.topTopicGaps},{title:"External blockers",items:failure.topExternalBlockers}].map(group=><div key={group.title} className="rounded-xl border border-[#e8ece5] p-4"><h3 className="text-sm font-semibold">{group.title}</h3><div className="mt-3 flex flex-wrap gap-2">{group.items?.length ? group.items.map(x=><span key={x.topic} className="rounded-lg bg-[#eef4ed] px-3 py-2 text-xs text-[#386047]">{x.topic} <b className="ml-1">{x.count}</b></span>) : <span className="text-xs text-[#92a095]">No records available.</span>}</div></div>)}
          </div>
          <div><h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Target size={17} className="text-[#36784b]"/> Your improvement plan</h3>{plans.length ? <div className="grid gap-3 lg:grid-cols-2">{plans.map((p,i)=><article key={`${p.title}-${i}`} className="rounded-xl border border-[#e8ece5] bg-[#fcfdfa] p-4"><div className="flex flex-wrap items-center gap-2 text-[11px]"><span className="rounded-md bg-[#e8f2e6] px-2 py-1 text-[#316642]">{p.category}</span><span className="text-[#9b7952]">{p.priority} priority</span></div><h4 className="mt-3 text-sm font-semibold">{p.title}</h4><p className="mt-2 text-xs leading-5 text-[#718173]">{p.description}</p><p className="mt-3 flex gap-2 rounded-lg bg-[#eff6ee] p-3 text-xs leading-5 text-[#386447]"><CheckCircle2 size={16} className="mt-0.5 shrink-0"/>{p.recommendedAction}</p></article>)}</div> : <p className="text-xs text-[#849188]">No recommendations available for this track.</p>}</div>
        </div> : <div className="py-14 text-center"><AlertCircle className="mx-auto text-[#9aaa9b]" size={26}/><h3 className="mt-3 text-sm font-semibold">No retrospectives recorded</h3><p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#8a978c]">Record a post-mortem from a rejected application to start identifying patterns and opportunities for improvement.</p><Link className="mt-4 inline-block text-xs font-semibold text-[#28633d] hover:underline" to="/applications">Go to applications</Link></div>}
      </section>
    </div>
  </div>;
}
