import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/services/profileService";
import type { UserProfile } from "@/services/profileService";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import ApplicationModal from "@/components/applications/ApplicationModal";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Code,
  Mail,
  Phone,
  Calendar,
  Building,
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

    presentDivision: "",
    presentDistrict: "",
    presentArea: "",
    presentLocation: "",
    presentHouse: "",
    presentUpazila: "",
    presentPoliceStation: "",
    presentPostOffice: "",
    presentPostCode: "",

    permanentDivision: "",
    permanentDistrict: "",
    permanentUpazila: "",
    permanentUnion: "",
    permanentVillage: "",
    permanentPostOffice: "",
    permanentPoliceStation: "",
    permanentPostCode: "",

    nationalId: "",
    birthRegistration: "",
    bioSummary: "",
  });

  const { data: profile, isPending } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
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
    setFormData(currentProfile);
    setIsEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isPending && !profile) {
    return <ProfileSkeleton />;
  }

  const currentProfile = profile || {
    nameEnglish: "Software Engineer",
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
    email: "user@example.com",

    presentDivision: "",
    presentDistrict: "",
    presentArea: "",
    presentLocation: "",
    presentHouse: "",
    presentUpazila: "",
    presentPoliceStation: "",
    presentPostOffice: "",
    presentPostCode: "",

    permanentDivision: "",
    permanentDistrict: "",
    permanentUpazila: "",
    permanentUnion: "",
    permanentVillage: "",
    permanentPostOffice: "",
    permanentPoliceStation: "",
    permanentPostCode: "",

    bioSummary: "Full Stack Engineer passionate about building modern web applications, scalable APIs, and developer tools.",
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6"
      >
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
              href="https://github.com"
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
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${activeTab === "personal"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            <User className="w-4 h-4" /> Personal & Address
          </button>

          <button
            onClick={() => setActiveTab("education")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${activeTab === "education"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            <GraduationCap className="w-4 h-4" /> Education & Certifications
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${activeTab === "experience"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            <Briefcase className="w-4 h-4" /> Experience & Projects
          </button>

          <button
            onClick={() => setActiveTab("coding")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${activeTab === "coding"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            <Code className="w-4 h-4" /> Competitive Programming & Stack
          </button>
        </div>
      </motion.div>

      {/* Tab 1: Personal Information & Addresses */}
      <AnimatePresence mode="wait">
        {activeTab === "personal" && (
          <motion.div
            key="personal-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
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
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {currentProfile.dateOfBirth ? new Date(currentProfile.dateOfBirth).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "Not Provided"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-xs block font-medium">National ID (NID)</span>
                  <span className="font-mono font-semibold text-slate-800">{currentProfile.nationalId || "Not Provided"}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-xs block font-medium">Birth Registration</span>
                  <span className="font-mono font-semibold text-slate-800">{currentProfile.birthRegistration || "Not Provided"}</span>
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

            {/* Granular Addresses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Present Address (Voter Address) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" /> Present Address (Voter Address)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Division</span>
                    <strong className="text-slate-900">{currentProfile.presentDivision || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">District</span>
                    <strong className="text-slate-900">{currentProfile.presentDistrict || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 sm:col-span-2">
                    <span className="text-slate-400 text-xs block font-medium">Area</span>
                    <strong className="text-slate-900">{currentProfile.presentArea || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Location</span>
                    <strong className="text-slate-900">{currentProfile.presentLocation || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">House</span>
                    <strong className="text-slate-900">{currentProfile.presentHouse || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Upazila</span>
                    <strong className="text-slate-900">{currentProfile.presentUpazila || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Police Station</span>
                    <strong className="text-slate-900">{currentProfile.presentPoliceStation || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Post Office</span>
                    <strong className="text-slate-900">{currentProfile.presentPostOffice || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Post Code</span>
                    <strong className="text-slate-900">{currentProfile.presentPostCode || "Not Provided"}</strong>
                  </div>
                </div>
              </div>

              {/* Permanent Address */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-600" /> Permanent Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Division</span>
                    <strong className="text-slate-900">{currentProfile.permanentDivision || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">District</span>
                    <strong className="text-slate-900">{currentProfile.permanentDistrict || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Upazila</span>
                    <strong className="text-slate-900">{currentProfile.permanentUpazila || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Union</span>
                    <strong className="text-slate-900">{currentProfile.permanentUnion || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Village</span>
                    <strong className="text-slate-900">{currentProfile.permanentVillage || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Post Office</span>
                    <strong className="text-slate-900">{currentProfile.permanentPostOffice || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Police Station</span>
                    <strong className="text-slate-900">{currentProfile.permanentPoliceStation || "Not Provided"}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium">Post Code</span>
                    <strong className="text-slate-900">{currentProfile.permanentPostCode || "Not Provided"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <ApplicationModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Detailed Profile Information"
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
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
          </div>

          {/* Granular Present Address Controls */}
          <div className="border-t border-slate-200 pt-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Present Address Fields</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><Label>Division</Label><Input value={formData.presentDivision || ""} onChange={(e) => setFormData({ ...formData, presentDivision: e.target.value })} /></div>
              <div><Label>District</Label><Input value={formData.presentDistrict || ""} onChange={(e) => setFormData({ ...formData, presentDistrict: e.target.value })} /></div>
              <div><Label>Upazila</Label><Input value={formData.presentUpazila || ""} onChange={(e) => setFormData({ ...formData, presentUpazila: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={formData.presentLocation || ""} onChange={(e) => setFormData({ ...formData, presentLocation: e.target.value })} /></div>
              <div><Label>House</Label><Input value={formData.presentHouse || ""} onChange={(e) => setFormData({ ...formData, presentHouse: e.target.value })} /></div>
              <div><Label>Police Station</Label><Input value={formData.presentPoliceStation || ""} onChange={(e) => setFormData({ ...formData, presentPoliceStation: e.target.value })} /></div>
              <div><Label>Post Office</Label><Input value={formData.presentPostOffice || ""} onChange={(e) => setFormData({ ...formData, presentPostOffice: e.target.value })} /></div>
              <div><Label>Post Code</Label><Input value={formData.presentPostCode || ""} onChange={(e) => setFormData({ ...formData, presentPostCode: e.target.value })} /></div>
            </div>
          </div>

          {/* Granular Permanent Address Controls */}
          <div className="border-t border-slate-200 pt-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Permanent Address Fields</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><Label>Division</Label><Input value={formData.permanentDivision || ""} onChange={(e) => setFormData({ ...formData, permanentDivision: e.target.value })} /></div>
              <div><Label>District</Label><Input value={formData.permanentDistrict || ""} onChange={(e) => setFormData({ ...formData, permanentDistrict: e.target.value })} /></div>
              <div><Label>Upazila</Label><Input value={formData.permanentUpazila || ""} onChange={(e) => setFormData({ ...formData, permanentUpazila: e.target.value })} /></div>
              <div><Label>Union</Label><Input value={formData.permanentUnion || ""} onChange={(e) => setFormData({ ...formData, permanentUnion: e.target.value })} /></div>
              <div><Label>Village</Label><Input value={formData.permanentVillage || ""} onChange={(e) => setFormData({ ...formData, permanentVillage: e.target.value })} /></div>
              <div><Label>Police Station</Label><Input value={formData.permanentPoliceStation || ""} onChange={(e) => setFormData({ ...formData, permanentPoliceStation: e.target.value })} /></div>
              <div><Label>Post Office</Label><Input value={formData.permanentPostOffice || ""} onChange={(e) => setFormData({ ...formData, permanentPostOffice: e.target.value })} /></div>
              <div><Label>Post Code</Label><Input value={formData.permanentPostCode || ""} onChange={(e) => setFormData({ ...formData, permanentPostCode: e.target.value })} /></div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <Button type="submit" disabled={updateMutation.isPending} className="flex items-center gap-1.5">
              <Save className="w-4 h-4" /> {updateMutation.isPending ? "Saving..." : "Save Profile Details"}
            </Button>
          </div>
        </form>
      </ApplicationModal>
    </div>
  );
}
