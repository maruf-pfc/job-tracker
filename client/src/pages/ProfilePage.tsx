import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/services/profileService";
import type { UserProfile } from "@/services/profileService";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import ApplicationModal from "@/components/applications/ApplicationModal";
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Code,
  Globe,
  Mail,
  Phone,
  Calendar,
  Building,
  Trophy,
  Edit,
  Save,
} from "lucide-react";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "personal" | "education" | "experience" | "coding"
  >("personal");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<UserProfile>({
    nameEnglish: "",
    nameBangla: "",
    fatherName: "",
    motherName: "",
    mobileNumber: "",
    email: "",
    presentAddress: "",
    permanentAddress: "",
    nationalId: "",
    birthRegistration: "",
    bioSummary: "",
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserProfile) => updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated in database successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setIsEditModalOpen(false);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const openEditModal = () => {
    if (profile) {
      setFormData(profile);
    }
    setIsEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        Loading user profile...
      </div>
    );
  }

  const currentProfile = profile || {
    nameEnglish: "Demo User",
    nameBangla: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    nationality: "Bangladeshi",
    religion: "Islam",
    gender: "Male",
    birthRegistration: "",
    nationalId: "",
    maritalStatus: "Single",
    mobileNumber: "",
    email: "demo@jobtracker.dev",
    presentAddress: " (House 176/7), Ward 22, Hatirjheel, Khilgaon, Dhaka - 1219",
    permanentAddress: ", , , , Cumilla - 3544",
    bioSummary: "Full Stack Developer and competitive programmer with hands-on experience building web applications and AI-powered automation tools for real-world business operations.",
  };

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
                  {currentProfile.nameEnglish}
                </h1>
                {currentProfile.nameBangla && (
                  <span className="text-sm text-slate-500 font-normal">
                    ({currentProfile.nameBangla})
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-indigo-600 mt-0.5">
                Full Stack Developer & Competitive Programmer
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Dhaka, Bangladesh
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {currentProfile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {currentProfile.mobileNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button onClick={openEditModal} className="flex items-center gap-1.5">
              <Edit className="w-4 h-4" /> Edit Profile
            </Button>

            <a
              href="https://github.com/your-github-username"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1"
            >
              LinkedIn
            </a>
            <a
              href="https://your-portfolio.dev"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-slate-600 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" /> Portfolio
            </a>
          </div>
        </div>

        {/* Developer Bio Summary */}
        <div className="pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {currentProfile.bioSummary}
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
                <span className="font-bold text-slate-900">{currentProfile.nameEnglish}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Name (Bangla)</span>
                <span className="font-bold text-slate-900">{currentProfile.nameBangla || "N/A"}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Father's Name</span>
                <span className="font-semibold text-slate-800">{currentProfile.fatherName || "N/A"}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Mother's Name</span>
                <span className="font-semibold text-slate-800">{currentProfile.motherName || "N/A"}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Date of Birth</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> 
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">National ID (NID)</span>
                <span className="font-mono font-semibold text-slate-800">{currentProfile.nationalId || ""}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs block font-medium">Birth Registration</span>
                <span className="font-mono font-semibold text-slate-800">{currentProfile.birthRegistration || ""}</span>
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
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" /> Present Address (Voter Address)
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {currentProfile.presentAddress}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" /> Permanent Address
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {currentProfile.permanentAddress}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Education */}
      {activeTab === "education" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" /> Educational Qualifications
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">B.Sc. in Computer Science & Engineering</h4>
                  <p className="text-xs font-medium text-indigo-600 mt-0.5">Green University of Bangladesh</p>
                  <span className="text-xs text-slate-500 block mt-1">Feb 2022 – Feb 2026</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                    CGPA: 3.05 / 4.00
                  </span>
                </div>
              </div>

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
        </div>
      )}

      {/* Tab 3: Experience */}
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
                Developed and delivered modern web platforms and workflow automation solutions for real-world operational use cases, including business websites and Zapier automation pipelines.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Coding */}
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
        </div>
      )}

      {/* Edit Profile Modal */}
      <ApplicationModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal Profile Data"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name (English)</Label>
              <Input
                value={formData.nameEnglish}
                onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Name (Bangla)</Label>
              <Input
                value={formData.nameBangla || ""}
                onChange={(e) => setFormData({ ...formData, nameBangla: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Father's Name</Label>
              <Input
                value={formData.fatherName || ""}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Mother's Name</Label>
              <Input
                value={formData.motherName || ""}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Mobile Number</Label>
              <Input
                value={formData.mobileNumber || ""}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Present Address</Label>
            <Textarea
              rows={2}
              value={formData.presentAddress || ""}
              onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Permanent Address</Label>
            <Textarea
              rows={2}
              value={formData.permanentAddress || ""}
              onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Bio / Executive Summary</Label>
            <Textarea
              rows={3}
              value={formData.bioSummary || ""}
              onChange={(e) => setFormData({ ...formData, bioSummary: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <Button type="submit" disabled={updateMutation.isPending} className="flex items-center gap-1.5">
              <Save className="w-4 h-4" /> {updateMutation.isPending ? "Saving..." : "Save to Database"}
            </Button>
          </div>
        </form>
      </ApplicationModal>
    </div>
  );
}
