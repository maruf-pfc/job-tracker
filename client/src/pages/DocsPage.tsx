import { useState } from "react";
import { BookOpen, Sparkles, Bot, Shield, FileText, CheckCircle2, ChevronRight, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<"overview" | "ai" | "automation" | "security">("overview");
  const [copiedCode, setCopiedCode] = useState(false);

  const samplePayload = `{
  "event": "JOB_APPLICATION_CREATED",
  "applicationId": "guid-here",
  "company": "Google",
  "role": "Fullstack Software Engineer",
  "location": "Remote",
  "status": "Applied",
  "appliedAt": "2026-08-04T12:00:00Z"
}`;

  const copyPayload = () => {
    navigator.clipboard.writeText(samplePayload);
    setCopiedCode(true);
    toast.success("Webhook JSON payload copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-600 shrink-0" />
            <span>Platform Documentation & Guides</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Learn how to maximize your job search with AI Gemini Pro insights, n8n Excel automation, and webhooks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: "overview", label: "Getting Started", icon: FileText },
            { id: "ai", label: "AI Assistance & Prompts", icon: Sparkles },
            { id: "automation", label: "n8n & Bot Webhooks", icon: Bot },
            { id: "security", label: "Security & Backups", icon: Shield },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-indigo-600"}`} />
                  {item.label}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "opacity-100" : "opacity-40"}`} />
              </button>
            );
          })}
        </div>

        {/* Documentation Content Area (MDX style) */}
        <div className="md:col-span-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs text-slate-700 min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeSection === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" /> Getting Started with Job Tracker CRM
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Welcome to <strong>Job Tracker</strong> — your personal full-stack job application CRM designed to streamline developer application pipelines, company tracking, and automated follow-ups.
                </p>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-2 text-xs sm:text-sm">
                  <h3 className="font-bold text-slate-900 text-sm">Key Capabilities:</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Kanban & Table Views:</strong> Manage status pipelines (Saved, Applied, Technical Interview, Offer, Rejected).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Database-Driven Roles & Companies:</strong> Maintain custom company records and target job titles backed by PostgreSQL.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Markdown Notes & Resume Links:</strong> Save detailed interview feedback and Google Drive resume links.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Analytics Dashboard & Gemini AI:</strong> View response rates and generate real-time AI career coaching insights.</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeSection === "ai" && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" /> AI Assistance & Gemini Pro Setup
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Job Tracker integrates with Google Gemini Pro API models (`gemini-1.5-pro`, `gemini-2.0-flash`) to automatically generate tailored cold emails, cover letters, and application velocity reports.
                </p>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <h3 className="font-bold text-slate-900">Step 1: Configure Your API Key</h3>
                    <p className="text-slate-600">
                      Add your Gemini API Key in <code>client/.env</code> as <code>VITE_GEMINI_API_KEY</code> or paste it under <strong>Settings &rarr; AI Key</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <h3 className="font-bold text-slate-900">Step 2: Generate Dashboard AI Insights</h3>
                    <p className="text-slate-600">
                      Click the <strong>Generate AI Insights</strong> button on your Dashboard. Gemini Pro analyzes your response rate, interview conversion, and application volume to deliver actionable DOs and DON'Ts.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "automation" && (
              <motion.div
                key="automation"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-600" /> n8n Automation & Webhook Live Excel Sync
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Automatically backup every application event (Create / Update / Status Change) directly into an Excel spreadsheet or send alerts to Telegram & Discord.
                </p>

                <div className="space-y-3 text-xs sm:text-sm">
                  <h3 className="font-bold text-slate-900">n8n Webhook Payload Schema:</h3>
                  <div className="relative rounded-2xl bg-slate-900 p-4 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                    <button
                      onClick={copyPayload}
                      className="absolute right-3 top-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-[11px] cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Copied" : "Copy JSON"}</span>
                    </button>
                    <pre>{samplePayload}</pre>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" /> Security Best Practices & Backups
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Your application data is secured with ASP.NET Core Identity JWT Authentication, Serilog request logging, and Serilog Security Headers.
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs sm:text-sm">
                  <h3 className="font-bold text-slate-900">Data Export & Backup:</h3>
                  <p className="text-slate-600">
                    Download a full CSV dump of all application records at any time from <strong>Settings &rarr; Export CSV Backup</strong>.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
