import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { navigation } from "@/config/navigation";
import { BriefcaseBusiness, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const items = navigation;

  const content = (mobile: boolean) => {
    const collapsed = !mobile && isCollapsed;

    return (
      <div className="flex h-full min-h-0 flex-col bg-[#14231e] text-[#eaf2e9]">
        {/* Header Branding */}
        <div className={`flex h-[70px] shrink-0 items-center border-b border-white/10 ${collapsed ? "justify-center px-2" : "justify-between px-4 sm:px-5"}`}>
          <NavLink
            to="/"
            onClick={mobile ? onClose : undefined}
            title="Job Tracker"
            className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9ccc9e]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#4d7455] bg-[#234a35] text-[#a5d5a6] shadow-sm">
              <BriefcaseBusiness size={20} strokeWidth={1.8} />
            </span>
            {!collapsed && (
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-semibold tracking-[-.035em] text-white">
                  Job Tracker
                </span>
                <span className="block text-[11px] text-[#98ada0]">
                  Your career workspace
                </span>
              </span>
            )}
          </NavLink>

          {mobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="rounded-lg p-2 text-[#b4c2b8] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <X size={20} />
            </button>
          )}

          {!mobile && !collapsed && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              title="Collapse sidebar (⌘B)"
              className="rounded-lg p-1.5 text-[#8fa79a] hover:bg-white/10 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <PanelLeftClose size={17} />
            </button>
          )}
        </div>

        {/* Section Label */}
        {!collapsed ? (
          <div className="px-5 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-[.18em] text-[#8ea99a]">
            Workspace
          </div>
        ) : (
          <div className="py-2" />
        )}

        {/* Navigation Items */}
        <nav
          aria-label="Main navigation"
          className={`min-h-0 flex-1 space-y-1 overflow-y-auto pb-4 ${collapsed ? "px-2" : "px-3"}`}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/"}
                onClick={mobile ? onClose : undefined}
                title={collapsed ? item.title : undefined}
                aria-label={collapsed ? item.title : undefined}
                className={({ isActive }) =>
                  `group flex min-h-10 items-center rounded-[9px] text-[13px] font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a9cbaa] ${
                    collapsed
                      ? "justify-center px-0 w-11 mx-auto"
                      : "gap-3 px-3.5"
                  } ${
                    isActive
                      ? "bg-[#305a3e] text-white shadow-xs"
                      : "text-[#b4c4b9] hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className={`border-t border-white/10 ${collapsed ? "p-2.5 text-center" : "px-4 py-4"}`}>
          {!collapsed ? (
            <>
              <p className="text-[12px] font-medium text-[#e0ece1]">
                One application at a time.
              </p>
              <p className="mt-0.5 text-[11px] leading-4 text-[#8fa79a]">
                Stay organized, follow up, and see progress.
              </p>
              <span className="mt-2 block text-[10px] text-[#718578]">
                JobTracker v1.0.0
              </span>
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="mt-3 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-[#a9bcae] hover:bg-white/10 hover:text-white transition-colors"
                >
                  <span>Minimize sidebar</span>
                  <PanelLeftClose size={14} />
                </button>
              )}
            </>
          ) : (
            onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expand sidebar"
                title="Expand sidebar (⌘B)"
                className="flex h-10 w-10 mx-auto items-center justify-center rounded-lg bg-white/5 text-[#a9bcae] hover:bg-white/10 hover:text-white transition-colors"
              >
                <PanelLeftOpen size={18} />
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 transition-[width] duration-300 ease-in-out lg:block ${
          isCollapsed ? "w-[72px]" : "w-[244px]"
        }`}
      >
        {content(false)}
      </aside>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className="absolute inset-0 w-full bg-[#0c1712]/65 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              aria-label="Mobile navigation"
              className="relative h-full w-[min(290px,85vw)] shadow-2xl"
              initial={{ x: reduceMotion ? 0 : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: reduceMotion ? 0 : "-100%" }}
              transition={{
                duration: reduceMotion ? 0 : 0.26,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {content(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
