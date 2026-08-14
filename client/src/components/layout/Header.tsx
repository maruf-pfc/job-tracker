import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { Menu, LogOut } from "lucide-react";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 lg:hidden transition-colors cursor-pointer"
            aria-label="Open Mobile Navigation Menu"
          >
            <Menu size={20} />
          </button>
        )}

        <div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Career Operations Workspace</p>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 truncate max-w-[200px] sm:max-w-none">
            Welcome back, {user?.name}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <Button variant="secondary" onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm">
          <LogOut size={16} className="shrink-0" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
