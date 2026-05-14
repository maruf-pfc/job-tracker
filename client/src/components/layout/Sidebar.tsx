import { NavLink } from "react-router-dom";
import { navigation } from "@/config/navigation";

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:flex">
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Job Tracker
        </h1>

        <p className="mt-1 text-sm text-slate-400">Career Operations</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />

              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm font-medium text-white">Career Pipeline</p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Organize applications, interviews, and opportunities from one
            workspace.
          </p>
        </div>
      </div>
    </aside>
  );
}
