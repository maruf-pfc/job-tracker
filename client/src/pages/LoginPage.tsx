import { Link } from "react-router-dom";
import { BriefcaseBusiness, ArrowUpRight, CheckCircle2, ChartNoAxesCombined, CalendarCheck2 } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
const features = [
 { icon: CheckCircle2, title: "Track every opportunity", text: "Applications, statuses and next steps in one place." },
 { icon: CalendarCheck2, title: "Stay ahead of follow-ups", text: "Keep important recruitment milestones visible." },
 { icon: ChartNoAxesCombined, title: "Understand your progress", text: "See what is working across your search." },
];
export default function LoginPage() { return <main className="grid min-h-dvh bg-[#f7f9f5] lg:grid-cols-[minmax(360px,44%)_1fr]">
  <aside className="relative hidden min-h-dvh flex-col overflow-hidden bg-[#14271e] p-10 text-white lg:flex xl:p-14">
    <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#315e43]"><BriefcaseBusiness size={21}/></span><span className="text-lg font-semibold tracking-[-.04em]">Job Tracker</span></div>
    <div className="my-auto max-w-[480px] py-16"><div className="mb-7 inline-flex rounded-full border border-[#456b50] px-3 py-1 text-[11px] tracking-wide text-[#bdd6c0]">YOUR CAREER WORKSPACE</div><h2 className="text-4xl font-semibold leading-[1.15] tracking-[-.055em] xl:text-5xl">A clearer way to manage your job search.</h2><p className="mt-5 max-w-md text-[15px] leading-7 text-[#a6bcac]">Everything you need to track opportunities, prepare for interviews, and make better decisions.</p>
      <div className="mt-12 space-y-7">{features.map(({icon:Icon,title,text})=><div className="flex gap-4" key={title}><span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#b5d5b9]"><Icon size={19}/></span><div><p className="text-[14px] font-medium">{title}</p><p className="mt-1 text-[12px] leading-5 text-[#9cb2a3]">{text}</p></div></div>)}</div>
    </div><p className="text-[11px] text-[#90a997]">A little more clarity, every day.</p>
  </aside>
  <section className="flex min-h-dvh flex-col px-5 py-7 sm:px-9"><div className="flex items-center justify-between lg:justify-end"><div className="flex items-center gap-2 text-[#244d35] lg:hidden"><BriefcaseBusiness size={22}/><span className="font-semibold">Job Tracker</span></div><Link to="/register" className="inline-flex items-center gap-1 text-[13px] font-medium text-[#2d6042] hover:underline">Create an account <ArrowUpRight size={15}/></Link></div><div className="flex flex-1 items-center justify-center py-12"><div className="w-full max-w-[460px]"><AuthCard title="Welcome back" subtitle="Sign in to pick up where you left off."><LoginForm/><p className="mt-7 text-center text-[13px] text-[#728177]">New to Job Tracker? <Link to="/register" className="font-semibold text-[#2b6446] hover:underline">Create an account</Link></p></AuthCard><p className="mt-6 text-center text-[11px] text-[#97a39a]">Keep your opportunities organized and your search focused.</p></div></div></section>
</main>; }
