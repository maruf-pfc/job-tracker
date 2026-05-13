import { useAuthStore } from "@/stores/authStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Welcome back</h2>

        <p className="text-sm text-stone-500">{user?.name}</p>
      </div>

      <button
        onClick={logout}
        className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
      >
        Logout
      </button>
    </header>
  );
}
