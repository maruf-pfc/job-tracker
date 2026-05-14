import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h2 className="text-sm font-medium text-slate-500">Welcome back</h2>

        <h1 className="text-lg font-semibold text-slate-900">{user?.name}</h1>
      </div>

      <Button variant="secondary" onClick={logout}>
        Logout
      </Button>
    </header>
  );
}
