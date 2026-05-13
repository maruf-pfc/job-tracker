import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_layout")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Outlet />
    </div>
  );
}
