import { LayoutDashboard, BriefcaseBusiness, Building2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    to: "/applications",
    label: "Applications",
    icon: BriefcaseBusiness,
  },

  {
    to: "/companies",
    label: "Companies",
    icon: Building2,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-stone-200 bg-white">
      <div className="border-b border-stone-200 p-6">
        <h1 className="text-xl font-semibold text-stone-900">Job Tracker</h1>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `
                flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors

                ${
                  isActive
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }
              `
              }
            >
              <Icon size={18} />

              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
