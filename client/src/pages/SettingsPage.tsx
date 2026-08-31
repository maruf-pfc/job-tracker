import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Download, Upload, Database, Bot, Send, Bell } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

import { triggerWebhooks } from "@/services/webhookService";

export default function SettingsPage() {
  const [importing, setImporting] = useState(false);
  const [testingWebhooks, setTestingWebhooks] = useState(false);

  // Integrations State
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState(
    localStorage.getItem("n8n_webhook_url") || ""
  );
  const [telegramToken, setTelegramToken] = useState(
    localStorage.getItem("telegram_token") || ""
  );
  const [telegramChatId, setTelegramChatId] = useState(
    localStorage.getItem("telegram_chat_id") || ""
  );
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState(
    localStorage.getItem("discord_webhook_url") || ""
  );

  const handleSaveIntegrations = () => {
    localStorage.setItem("n8n_webhook_url", n8nWebhookUrl);
    localStorage.setItem("telegram_token", telegramToken);
    localStorage.setItem("telegram_chat_id", telegramChatId);
    localStorage.setItem("discord_webhook_url", discordWebhookUrl);
    toast.success("Automation & Webhook settings saved!");
  };

  const handleTestWebhooks = async () => {
    handleSaveIntegrations();
    setTestingWebhooks(true);
    try {
      const results = await triggerWebhooks("test_event", {
        company: "Google (Demo / Test)",
        role: "Senior Full Stack Engineer",
        applicationStatus: "Applied",
        salaryRange: "$150,000 - $180,000",
        location: "Remote / Hybrid",
        jobUrl: "https://careers.google.com",
      });

      if (results.length === 0) {
        toast.info("No webhook URLs configured to test.");
        return;
      }

      const succeeded = results.filter((r) => r.success).map((r) => r.provider);
      const failed = results.filter((r) => !r.success).map((r) => `${r.provider} (${r.error})`);

      if (succeeded.length > 0) {
        toast.success(`Webhook test delivered to: ${succeeded.join(", ")}`);
      }
      if (failed.length > 0) {
        toast.error(`Webhook delivery failed for: ${failed.join(", ")}`);
      }
    } catch {
      toast.error("An error occurred while testing webhooks.");
    } finally {
      setTestingWebhooks(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await api.get("/export/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `job_applications_${new Date().toISOString().slice(0, 10)}.csv`);
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings & Integrations
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage automation webhooks (n8n, Telegram, Discord, Excel sync) and data backups.
        </p>
      </div>

      {/* Automation Webhooks & Integrations */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">n8n, Webhook & Bot Integrations</h3>
            <p className="text-xs text-slate-500">Trigger live n8n Excel sheet backups or send alerts to Telegram/Discord on new applications.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-indigo-500" /> n8n / Excel Webhook URL
            </label>
            <Input
              placeholder="https://n8n.example.com/webhook/job-application"
              value={n8nWebhookUrl}
              onChange={(e) => setN8nWebhookUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-indigo-500" /> Discord Webhook URL
            </label>
            <Input
              placeholder="https://discord.com/api/webhooks/..."
              value={discordWebhookUrl}
              onChange={(e) => setDiscordWebhookUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Telegram Bot Token</label>
            <Input
              placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
              value={telegramToken}
              onChange={(e) => setTelegramToken(e.target.value)}
            />
            <p className="text-[11px] text-slate-500">Obtain from <span className="font-medium text-slate-700">@BotFather</span> on Telegram.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Telegram Chat / Channel ID</label>
            <Input
              placeholder="Your User ID (e.g. 123456789) or Group ID (-100...)"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
            />
            <p className="text-[11px] text-slate-500">
              Enter your <span className="font-medium text-slate-700">personal user ID</span> (from <span className="font-medium text-slate-700">@userinfobot</span>) or group/channel ID. Do not enter the bot&apos;s own ID.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button onClick={handleSaveIntegrations} className="flex items-center gap-2">
            <Bot className="w-4 h-4" /> Save Automation Settings
          </Button>
          <Button
            variant="secondary"
            onClick={handleTestWebhooks}
            disabled={testingWebhooks}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4 text-indigo-500" />
            {testingWebhooks ? "Sending Test Payload..." : "Test Webhooks (Send Ping)"}
          </Button>
        </div>
      </div>

      {/* Data Backup & Export Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Data Backup & Restore</h3>
            <p className="text-xs text-slate-500">Export your complete job tracking pipeline as CSV or import back data.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={handleExportCsv} className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV Backup
          </Button>

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
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
    </div>
  );
}
