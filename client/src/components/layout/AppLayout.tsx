import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  return <div className="flex min-h-screen bg-[#f8faf7] text-[#1b3023] [font-family:Inter,ui-sans-serif,system-ui,sans-serif]">
    <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}/>
    <div className="flex min-w-0 flex-1 flex-col"><Header onMenuToggle={() => setIsMobileMenuOpen(v => !v)}/>
      <main id="main-content" className="min-w-0 flex-1 overflow-x-hidden"><div className="mx-auto w-full max-w-[1600px] px-3.5 py-5 sm:px-6 sm:py-8 xl:px-9">
        <AnimatePresence mode="wait" initial={false}><motion.div key={location.pathname} initial={reduceMotion ? false : {opacity:0,y:8}} animate={{opacity:1,y:0}} exit={reduceMotion ? undefined : {opacity:0,y:-6}} transition={{duration:reduceMotion ? 0 : .2,ease:"easeOut"}}><Outlet/></motion.div></AnimatePresence>
      </div></main>
    </div>
  </div>;
}
