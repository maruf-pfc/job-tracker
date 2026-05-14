import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import CompaniesPage from "./pages/CompaniesPage";
import LookupsPage from "./pages/LookupsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />

            <Route path="/applications" element={<ApplicationsPage />} />

            <Route path="/companies" element={<CompaniesPage />} />

            <Route path="/lookups" element={<LookupsPage />} />
          </Route>
        </Route>
      </Routes>

      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}
