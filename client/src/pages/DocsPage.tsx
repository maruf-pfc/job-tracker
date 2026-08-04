import { useState } from "react";
import { BookOpen, Sparkles, Bot, Shield, FileText, CheckCircle2, ChevronRight } from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<"overview" | "ai" | "automation" | "security">("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" /> Platform Documentation & Guides
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Learn how to maximize your job search with AI cold email generation, n8n Excel automation, and webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1.5">
          <button
            onClick={() => setActiveSection("overview")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
              activeSection === "overview"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Getting Started
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveSection("ai")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
              activeSection === "ai"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Assistance & Prompts
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveSection("automation")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
              activeSection === "automation"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4" /> n8n & Bot Webhooks
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveSection("security")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
              activeSection === "security"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Security & Backups
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* Documentation Content Area (MDX style) */}
        <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs prose max-w-none text-slate-700 space-y-6">
          {activeSection === "overview" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Getting Started with Job Tracker CRM
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Welcome to <strong>Job Tracker</strong> — your personal full-stack job application CRM designed to streamline developer application pipelines, company tracking, and automated follow-ups.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <h3 className="font-bold text-slate-900">Key Features:</h3>
                <ul className="space-y-1.5 list-disc pl-5 text-slate-600">
                  <li><strong>Kanban & Table Views:</strong> Manage status pipelines (Applied, Screening, Technical Interview, Offer).</li>
                  <li><strong>Database-Driven Roles & Companies:</strong> Maintain custom company records and target job titles.</li>
                  <li><strong>Markdown Notes & Links:</strong> Save detailed interview feedback and Google Drive resume links.</li>
                  <li><strong>Analytics Dashboard:</strong> View response rates and application velocity trends.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === "ai" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> AI Email & Cover Letter Guide
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Job Tracker integrates with Google Gemini / OpenAI to automatically generate tailored cold emails and cover letters using your profile details.
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <h3 className="font-bold text-slate-900">Step 1: Configure Your API Key</h3>
                <p className="text-slate-600">
                  Navigate to <strong>Settings</strong> &rarr; <strong>AI Cover Letter & Email Generator</strong> and paste your Gemini or OpenAI API Key.
                </p>

                <h3 className="font-bold text-slate-900 pt-2">Step 2: Customize Your System Prompt</h3>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
                  {`Generate a high-converting cold email tailored for [Role] at [Company]. Mention my Full Stack .NET & React background and key achievements.`}
                </div>

                <h3 className="font-bold text-slate-900 pt-2">Step 3: Generate Cover Letter</h3>
                <p className="text-slate-600">
                  When adding or editing an application, click the <strong>Generate AI Cover Letter</strong> button to copy a ready-to-send draft.
                </p>
              </div>
            </div>
          )}

          {activeSection === "automation" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-600" /> n8n Automation & Webhook Live Excel Sync
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Automatically backup every application event (Create / Update / Status Change) directly into an Excel spreadsheet or send alerts to Telegram & Discord.
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <h3 className="font-bold text-slate-900">Setting up n8n Webhook for Excel Sync:</h3>
                <ol className="space-y-2 list-decimal pl-5 text-slate-600">
                  <li>Create a new workflow in <strong>n8n</strong> with a <code>Webhook Trigger (POST)</code> node.</li>
                  <li>Connect the Webhook node to a <code>Microsoft Excel / Google Sheets</code> node.</li>
                  <li>Copy the production webhook URL from n8n (e.g. <code>https://n8n.yourdomain.com/webhook/job-application</code>).</li>
                  <li>Paste the Webhook URL in <strong>Settings</strong> &rarr; <strong>n8n / Excel Webhook URL</strong>.</li>
                </ol>

                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Telegram & Discord Alerts:
                  </span>
                  <p className="text-xs text-slate-600">
                    Add your Telegram Bot Token and Chat ID under Settings. Whenever you move an application card on the Kanban board, instant notifications will be dispatched to your chat!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" /> Security Best Practices & Backups
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Your data is protected with ASP.NET Core Identity JWT Authentication, BCrypt password hashing, and HTTP Security Headers (nosniff, DENY frame, XSS block).
              </p>

              <div className="space-y-2 text-xs sm:text-sm">
                <h3 className="font-bold text-slate-900">Data Backups:</h3>
                <p className="text-slate-600">
                  You can download a complete CSV dump of your applications at any time from <strong>Settings</strong> &rarr; <strong>Export CSV Backup</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
