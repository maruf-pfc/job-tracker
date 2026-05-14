import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import JobApplicationsPage from "@/pages/JobApplicationsPage";
import CompaniesPage from "@/pages/CompaniesPage";
import RegisterPage from "@/pages/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />

            <Route path="/applications" element={<JobApplicationsPage />} />

            <Route path="/companies" element={<CompaniesPage />} />
          </Route>
        </Route>
      </Routes>

      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}
