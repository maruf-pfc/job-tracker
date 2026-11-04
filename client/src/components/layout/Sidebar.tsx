import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { navigation } from "@/config/navigation";
import { BrainCircuit, BriefcaseBusiness, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface SidebarProps { isOpen?: boolean; onClose?: () => void; }

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // The route itself must also be registered in the application's router.
  const items = navigation.some((item) => item.href === "/career-intelligence")
    ? navigation
    : [...navigation.slice(0, navigation.findIndex((item) => item.href === "/profile") < 0 ? navigation.length : navigation.findIndex((item) => item.href === "/profile")),
       { href: "/career-intelligence", title: "Career Intelligence", icon: BrainCircuit },
       ...navigation.slice(navigation.findIndex((item) => item.href === "/profile") < 0 ? navigation.length : navigation.findIndex((item) => item.href === "/profile"))];

  const content = (mobile: boolean) => (
    <div className="flex h-full min-h-0 flex-col bg-[#14231e] text-[#eaf2e9]">
      <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-5">
        <NavLink to="/" onClick={mobile ? onClose : undefined} className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9ccc9e]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#4d7455] bg-[#234a35] text-[#a5d5a6]"><BriefcaseBusiness size={21} strokeWidth={1.8}/></span>
          <span className="min-w-0"><span className="block truncate text-[16px] font-semibold tracking-[-.035em] text-white">Job Tracker</span><span className="block text-[11px] text-[#98ada0]">Your career workspace</span></span>
        </NavLink>
        {mobile && <button type="button" onClick={onClose} aria-label="Close navigation" className="rounded-lg p-2 text-[#b4c2b8] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><X size={20}/></button>}
      </div>
      <div className="px-6 pb-2 pt-8 text-[10px] font-semibold uppercase tracking-[.18em] text-[#8ea99a]">Workspace</div>
      <nav aria-label="Main navigation" className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-5">
        {items.map((item) => { const Icon = item.icon; return (
          <NavLink key={item.href} to={item.href} end={item.href === "/"} onClick={mobile ? onClose : undefined}
            className={({isActive}) => `group flex min-h-11 items-center gap-3 rounded-[9px] px-3.5 text-[13px] font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a9cbaa] ${isActive ? "bg-[#305a3e] text-white" : "text-[#b4c4b9] hover:bg-white/10 hover:text-white"}`}>
            <Icon size={17} strokeWidth={1.8} className="shrink-0"/><span>{item.title}</span>
          </NavLink>
        ); })}
      </nav>
      <div className="border-t border-white/10 px-5 py-5"><p className="text-[12px] font-medium text-[#e0ece1]">One application at a time.</p><p className="mt-1 text-[11px] leading-5 text-[#8fa79a]">Stay organized, follow up, and see your progress.</p></div>
    </div>
  );
  return <>
    <aside className="sticky top-0 hidden h-screen w-[244px] shrink-0 lg:block">{content(false)}</aside>
    <AnimatePresence>{isOpen && <div className="fixed inset-0 z-50 lg:hidden">
      <motion.button type="button" aria-label="Close navigation" onClick={onClose} className="absolute inset-0 w-full bg-[#0c1712]/65 backdrop-blur-[2px]" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/>
      <motion.aside aria-label="Mobile navigation" className="relative h-full w-[min(290px,85vw)] shadow-2xl" initial={{x:reduceMotion ? 0 : "-100%"}} animate={{x:0}} exit={{x:reduceMotion ? 0 : "-100%"}} transition={{duration:reduceMotion ? 0 : .26,ease:[.22,1,.36,1]}}>{content(true)}</motion.aside>
    </div>}</AnimatePresence>
  </>;
}
