import { BrowserRouter, Route, Routes } from "react-router-dom";

import { useEffect } from "react";

import { Toaster } from "sonner";

import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/DashboardPage";

import ApplicationsPage from "./pages/ApplicationsPage";

import CompaniesPage from "./pages/CompaniesPage";

import LookupsPage from "./pages/LookupsPage";

import SettingsPage from "./pages/SettingsPage";

import ProtectedRoute from "./routes/ProtectedRoute";

import AppLayout from "./components/layout/AppLayout";

import { useAuthStore } from "./stores/authStore";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />

            <Route path="/applications" element={<ApplicationsPage />} />

            <Route path="/companies" element={<CompaniesPage />} />

            <Route path="/lookups" element={<LookupsPage />} />

            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>

      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}
