import { NavLink } from "react-router-dom";
import { navigation } from "@/config/navigation";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-lg font-semibold tracking-tight text-white">
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
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />

              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
