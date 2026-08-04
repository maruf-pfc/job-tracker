import { useState } from "react";
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Globe,
  Mail,
  Phone,
  Calendar,
  FileText,
  Building,
  CheckCircle2,
  Trophy,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<
    "personal" | "education" | "experience" | "coding"
  >("personal");

  return (
    <div className="space-y-6">
      {/* Header Profile Hero Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
              MS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Demo User
                </h1>
                <span className="text-sm text-slate-500 font-normal">
                  ()
                </span>
              </div>
              <p className="text-sm font-medium text-indigo-600 mt-0.5">
                Full Stack Developer & Competitive Programmer
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Dhaka, Bangladesh
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> demo@jobtracker.dev
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> 
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <a
              href="https://github.com/your-github-username"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1"
              title="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1"
              title="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="https://your-portfolio.dev"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-600 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1"
              title="Portfolio"
            >
              <Globe className="w-3.5 h-3.5" /> Portfolio
            </a>
          </div>
        </div>

        {/* Developer Bio Summary */}
        <div className="pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
          Full Stack Developer and competitive programmer with hands-on experience building web applications and AI-powered automation tools for real-world business operations. Skilled in delivering end-to-end products from database design and API development to responsive frontend interfaces. Currently deepening expertise in backend engineering.
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pt-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "personal"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="w-4 h-4" /> Personal & Address
          </button>

          <button
            onClick={() => setActiveTab("education")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "education"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Education & Certifications
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "experience"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Experience & Projects
          </button>

          <button
            onClick={() => setActiveTab("coding")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "coding"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code className="w-4 h-4" /> Competitive Programming & Stack
          </button>
        </div>
      </div>

      {/* Tab 1: Personal Information & Addresses */}
      {activeTab === "personal" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" /> Personal Identity Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Name (English)</span>
                <span className="font-bold text-slate-900">Demo User</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Name (Bangla)</span>
                <span className="font-bold text-slate-900"></span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Father's Name</span>
                <span className="font-semibold text-slate-800"></span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Mother's Name</span>
                <span className="font-semibold text-slate-800"></span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Date of Birth</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> 
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">National ID (NID)</span>
                <span className="font-mono font-semibold text-slate-800"></span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Birth Registration</span>
                <span className="font-mono font-semibold text-slate-800"></span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Nationality & Religion</span>
                <span className="font-semibold text-slate-800">Bangladeshi | Islam</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Gender & Marital Status</span>
                <span className="font-semibold text-slate-800">Male | Single</span>
              </div>
            </div>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Present Address */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" /> Present Address (Voter Address)
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <p><strong className="text-slate-900">Location / House:</strong>  (House 176/7)</p>
                <p><strong className="text-slate-900">Area:</strong> Hatirjheel, Dhaka North City Corp (Ward 22)</p>
                <p><strong className="text-slate-900">Thana / Police Station:</strong> Hatirjheel (Gulshan Upazila)</p>
                <p><strong className="text-slate-900">District & Post:</strong> Khilgaon, Dhaka - 1219</p>
              </div>
            </div>

            {/* Permanent Address */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" /> Permanent Address
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <p><strong className="text-slate-900">Village:</strong> ,  Union</p>
                <p><strong className="text-slate-900">Police Station:</strong> ,  Upazila</p>
                <p><strong className="text-slate-900">District:</strong> Cumilla (Chattogram Division)</p>
                <p><strong className="text-slate-900">Post Office & Code:</strong>  - 3544</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Education & Certifications */}
      {activeTab === "education" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" /> Educational Qualifications
            </h3>

            <div className="space-y-4">
              {/* B.Sc. */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    B.Sc. in Computer Science & Engineering
                  </h4>
                  <p className="text-xs font-medium text-indigo-600 mt-0.5">
                    Green University of Bangladesh
                  </p>
                  <span className="text-xs text-slate-500 block mt-1">Feb 2022 – Feb 2026</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                    CGPA: 3.05 / 4.00
                  </span>
                </div>
              </div>

              {/* H.S.C */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Higher Secondary Certificate (H.S.C)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Board: Dhaka | Group: Science | Roll: 135560</p>
                  <span className="text-xs text-slate-500 block mt-1">Passing Year: 2020</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                    GPA: 4.58 / 5.00
                  </span>
                </div>
              </div>

              {/* S.S.C */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Secondary School Certificate (S.S.C)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Board: Dhaka | Group: Science | Roll: 223586</p>
                  <span className="text-xs text-slate-500 block mt-1">Passing Year: 2018</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                    GPA: 4.61 / 5.00
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" /> Certifications & Achievements
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> SQL (Basic) Certificate
                </h4>
                <p className="text-xs text-slate-500">Verified Database & Query Management Proficiency</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Problem-Solving (Basic) Certificate
                </h4>
                <p className="text-xs text-slate-500">Algorithms & Data Structures Competency</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Experience & Projects */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" /> Professional Experience
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Web Developer</h4>
                  <p className="text-xs font-semibold text-indigo-600">Softvence IT Ltd. (Onsite)</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-medium">
                  Sept 2025 – Feb 2026
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Developed and delivered modern web platforms and workflow automation solutions for real-world operational use cases, including business websites and Zapier automation pipelines to streamline repetitive workflows, lead collection, third-party integrations, and operational processes across multiple projects.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Key Portfolio Projects
            </h3>

            <div className="space-y-4">
              <div className="p-4.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900">StoreDesk — Full Stack Inventory Management System</h4>
                  <a href="https://github.com/your-github-username" target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
                    Repository
                  </a>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Designed and developed a modern inventory management platform featuring category/item management, stock tracking, issue-return workflows, low-stock monitoring, operational dashboard analytics, and JWT authentication.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["React", "TypeScript", "Tailwind CSS", "Zustand", "TanStack Query", "ASP.NET Core", "PostgreSQL", "Docker"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900">Job Tracker — Personal CRM for Job Hunting</h4>
                  <a href="https://github.com/your-github-username" target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
                    Repository
                  </a>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Full-stack job tracking platform for managing applications, companies, follow-ups, interview pipelines, and career workflows in a single operational workspace with dashboard analytics.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["React", "TypeScript", "Tailwind CSS", "TanStack Query", "ASP.NET Core Identity", "PostgreSQL", "JWT"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Competitive Programming & Stack */}
      {activeTab === "coding" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-600" /> Competitive Programming Profiles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-center">
                <span className="text-xs text-slate-500 font-medium block">Codeforces</span>
                <span className="text-lg font-bold text-slate-900">Gray Coder (953)</span>
                <p className="text-xs text-slate-500">Handle: maruf-sarker</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-center">
                <span className="text-xs text-slate-500 font-medium block">CodeChef</span>
                <span className="text-lg font-bold text-amber-600">2-Star Coder (1514)</span>
                <p className="text-xs text-slate-500">Handle: mdmarufsarker</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-center">
                <span className="text-xs text-slate-500 font-medium block">LeetCode</span>
                <span className="text-lg font-bold text-emerald-600">Rating: 1484</span>
                <p className="text-xs text-slate-500">1000+ Problems Solved</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-600" /> Core Technologies & Tools
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Languages:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["C", "C++", "C#", "Java", "JavaScript", "TypeScript", "Python"].map((item) => (
                    <span key={item} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Frameworks & Libraries:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[".NET", "ASP.NET Core", "React.js", "Next.js", "Node.js", "Express.js", "Tailwind CSS"].map((item) => (
                    <span key={item} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Databases & Infrastructure:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["PostgreSQL", "MySQL", "MongoDB", "Docker", "VPS", "Vercel", "Coolify", "Linux"].map((item) => (
                    <span key={item} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
