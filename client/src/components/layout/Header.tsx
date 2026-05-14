import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";

export default function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-sm text-slate-500">Career Operations Workspace</p>

        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Welcome back, {user?.name}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{user?.name}</p>

          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
