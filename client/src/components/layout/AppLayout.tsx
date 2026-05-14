import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Container from "./Container";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1">
          <Container>
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
}
