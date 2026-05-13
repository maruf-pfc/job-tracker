import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_layout")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
