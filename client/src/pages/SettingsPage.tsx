import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Download, Upload, User, ShieldCheck, Database } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [importing, setImporting] = useState(false);

  const handleExportCsv = async () => {
    try {
      const response = await api.get("/export/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `job_applications_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV export downloaded successfully!");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setImporting(true);
    try {
      await api.post("/import/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("CSV applications imported successfully!");
    } catch {
      toast.error("Failed to import CSV file");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage account security, workspace preferences, and data import/export.
        </p>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Account Profile</h3>
            <p className="text-xs text-slate-500">Your personal details and authentication identity.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Full Name</label>
            <Input value={user?.name ?? "Demo User"} readOnly className="bg-slate-50" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Email Address</label>
            <Input value={user?.email ?? "demo@jobtracker.dev"} readOnly className="bg-slate-50" />
          </div>
        </div>
      </div>

      {/* Data Import/Export Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Data Backup & Export</h3>
            <p className="text-xs text-slate-500">Import or export your job applications as CSV format.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button onClick={handleExportCsv} className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV Data
          </Button>

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">
            <Upload className="w-4 h-4" /> {importing ? "Importing..." : "Import CSV File"}
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCsv}
              disabled={importing}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Security Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Authentication Method</h4>
            <p className="text-xs text-slate-500">ASP.NET Core Identity with JWT Bearer Token Security</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
          Active & Protected
        </span>
      </div>
    </div>
  );
}
