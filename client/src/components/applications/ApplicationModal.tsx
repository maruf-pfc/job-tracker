import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
type Props={open:boolean;onClose:()=>void;title:string;children:ReactNode};
export default function ApplicationModal({open,onClose,title,children}:Props){
 const titleId=useId();const reduceMotion=useReducedMotion();
 useEffect(()=>{if(!open)return;const key=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose();};const prev=document.body.style.overflow;document.body.style.overflow="hidden";window.addEventListener("keydown",key);return()=>{document.body.style.overflow=prev;window.removeEventListener("keydown",key);};},[open,onClose]);
 return <AnimatePresence>{open && <motion.div role="presentation" className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#0a1b11]/60 p-3 backdrop-blur-[3px] sm:p-6" onMouseDown={(e)=>{if(e.target===e.currentTarget)onClose();}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduceMotion?0:.17}} data-lenis-prevent>
 <motion.section role="dialog" aria-modal="true" aria-labelledby={titleId} className="flex max-h-[min(90dvh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#e2e9df] bg-[#fcfdfa] shadow-[0_28px_90px_rgba(8,35,18,.22)]" initial={reduceMotion?false:{opacity:0,scale:.98,y:10}} animate={{opacity:1,scale:1,y:0}} exit={reduceMotion?undefined:{opacity:0,scale:.99,y:6}} transition={{duration:reduceMotion?0:.2}}>
 <div className="flex shrink-0 items-center justify-between border-b border-[#e8ede6] bg-white px-5 py-4 sm:px-6"><h2 id={titleId} className="text-lg font-semibold tracking-[-.025em] text-[#1e3527]">{title}</h2><button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-[#829186] hover:bg-[#edf3ea] hover:text-[#2b583d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3e7952]"><X size={19}/></button></div>
 <div className="overflow-y-auto overscroll-contain p-4 sm:p-6" data-lenis-prevent>{children}</div>
 </motion.section></motion.div>}</AnimatePresence>;
}
