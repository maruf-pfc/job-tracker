import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/authStore";
import type { UserProfile, EducationRecord, CodingProfiles } from "@/types/profile";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import ApplicationModal from "@/components/applications/ApplicationModal";
import { ProfileSkeleton } from "@/components/common/Skeletons";
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
  Plus,
  Trash2,
  ExternalLink,
  Globe,
  Award,
} from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<
    "personal" | "education" | "experience" | "coding"
  >("personal");
  const [modalTab, setModalTab] = useState<
    "basic" | "identity" | "present" | "permanent" | "education" | "coding"
  >("basic");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { profile, isLoading, updateProfile, isUpdating } = useProfile();

  // Form State
  const [formData, setFormData] = useState<UserProfile>({
    nameEnglish: "",
    nameBangla: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    nationality: "Bangladeshi",
    religion: "Islam",
    gender: "Male",
    maritalStatus: "Single",
    birthRegistration: "",
    nationalId: "",
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

    bioSummary: "",
    educationDetailsJson: "[]",
    codingProfilesJson: "{}",
  });

  const [educationList, setEducationList] = useState<EducationRecord[]>([]);
  const [codingDetails, setCodingDetails] = useState<CodingProfiles>({});

  const currentProfile: UserProfile = profile || {
    nameEnglish: user?.name || "",
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
    email: user?.email || "",

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

    bioSummary: "",
    educationDetailsJson: "[]",
    codingProfilesJson: "{}",
  };

  // Parse Education & Coding Profiles safely
  const parsedEducation: EducationRecord[] = (() => {
    try {
      if (!currentProfile.educationDetailsJson) return [];
      const parsed = JSON.parse(currentProfile.educationDetailsJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const parsedCoding: CodingProfiles = (() => {
    try {
      if (!currentProfile.codingProfilesJson) return {};
      const parsed = JSON.parse(currentProfile.codingProfilesJson);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  })();

  const getInitials = (name?: string) => {
    if (!name) return "US";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const openEditModal = () => {
    setFormData({
      ...currentProfile,
      nameEnglish: currentProfile.nameEnglish || user?.name || "",
      email: currentProfile.email || user?.email || "",
    });

    try {
      const edu = currentProfile.educationDetailsJson
        ? JSON.parse(currentProfile.educationDetailsJson)
        : [];
      setEducationList(Array.isArray(edu) ? edu : []);
    } catch {
      setEducationList([]);
    }

    try {
      const cod = currentProfile.codingProfilesJson
        ? JSON.parse(currentProfile.codingProfilesJson)
        : {};
      setCodingDetails(typeof cod === "object" && cod !== null ? cod : {});
    } catch {
      setCodingDetails({});
    }

    setModalTab("basic");
    setIsEditModalOpen(true);
  };

  const handleAddEducation = () => {
    setEducationList((prev) => [
      ...prev,
      {
        degree: "",
        institute: "",
        major: "",
        passingYear: "",
        cgpaOrGrade: "",
        boardOrUniversity: "",
      },
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationRecord,
    value: string
  ) => {
    setEducationList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submissionData: UserProfile = {
        ...formData,
        educationDetailsJson: JSON.stringify(educationList),
        codingProfilesJson: JSON.stringify(codingDetails),
      };
      await updateProfile(submissionData);
      setIsEditModalOpen(false);
    } catch {
      // Handled in hook
    }
  };

  if (isLoading && !profile) {
    return <ProfileSkeleton />;
  }

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
              {getInitials(currentProfile.nameEnglish)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  {currentProfile.nameEnglish || "Your Name"}
                </h1>
                {currentProfile.nameBangla && (
                  <span className="text-sm text-slate-500 font-normal">
                    ({currentProfile.nameBangla})
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-indigo-600 mt-0.5">
                {parsedCoding.designation || "Software Professional & Candidate"}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentProfile.presentDistrict
                    ? `${currentProfile.presentDistrict}, ${currentProfile.presentDivision || "Bangladesh"}`
                    : "Dhaka, Bangladesh"}
                </span>
                {currentProfile.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {currentProfile.email}
                  </span>
                )}
                {currentProfile.mobileNumber && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {currentProfile.mobileNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <Button onClick={openEditModal} className="flex items-center gap-1.5 cursor-pointer">
              <Edit className="w-4 h-4" /> Edit Full Profile
            </Button>

            {parsedCoding.github && (
              <a
                href={parsedCoding.github.startsWith("http") ? parsedCoding.github : `https://${parsedCoding.github}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1"
              >
                GitHub <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {parsedCoding.linkedin && (
              <a
                href={parsedCoding.linkedin.startsWith("http") ? parsedCoding.linkedin : `https://${parsedCoding.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1"
              >
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {parsedCoding.portfolioUrl && (
              <a
                href={parsedCoding.portfolioUrl.startsWith("http") ? parsedCoding.portfolioUrl : `https://${parsedCoding.portfolioUrl}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1"
              >
                Portfolio <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Developer Bio Summary */}
        {currentProfile.bioSummary ? (
          <div className="pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {currentProfile.bioSummary}
          </div>
        ) : (
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 italic">
            Click "Edit Full Profile" to add your professional bio summary and career profile.
          </div>
        )}

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
            <GraduationCap className="w-4 h-4" /> Education & Credentials ({parsedEducation.length})
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "experience"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Experience & Summary
          </button>

          <button
            onClick={() => setActiveTab("coding")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "coding"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code className="w-4 h-4" /> Coding Handles & Stack
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
                  <span className="font-bold text-slate-900">{currentProfile.nameEnglish || "N/A"}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-xs block font-medium">Name (Bangla)</span>
                  <span className="font-bold text-slate-900">{currentProfile.nameBangla || "N/A"}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-xs block font-medium">Father's Name</span>
                  <span className="font-semibold text-slate-800">{currentProfile.fatherName || "Not Provided"}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-xs block font-medium">Mother's Name</span>
                  <span className="font-semibold text-slate-800">{currentProfile.motherName || "Not Provided"}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-xs block font-medium">Date of Birth</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />{" "}
                    {currentProfile.dateOfBirth
                      ? new Date(currentProfile.dateOfBirth).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Not Provided"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-xs block font-medium">National ID (NID)</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {currentProfile.nationalId || "Not Provided"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-xs block font-medium">Birth Registration</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {currentProfile.birthRegistration || "Not Provided"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-xs block font-medium">Nationality & Religion</span>
                  <span className="font-semibold text-slate-800">
                    {currentProfile.nationality || "Bangladeshi"} | {currentProfile.religion || "Islam"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-xs block font-medium">Gender & Marital Status</span>
                  <span className="font-semibold text-slate-800">
                    {currentProfile.gender || "Male"} | {currentProfile.maritalStatus || "Single"}
                  </span>
                </div>
              </div>
            </div>

            {/* Granular Addresses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Present Address */}
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

        {/* Tab 2: Education & Certifications */}
        {activeTab === "education" && (
          <motion.div
            key="education-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" /> Academic Degrees & Qualifications
                </h3>
                <Button onClick={openEditModal} variant="secondary" size="sm" className="flex items-center gap-1 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Manage Education
                </Button>
              </div>

              {parsedEducation.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parsedEducation.map((edu, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-2 hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-sm text-slate-900">{edu.degree || "Degree"}</span>
                        {edu.passingYear && (
                          <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                            {edu.passingYear}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-700 font-medium">{edu.institute || "Institution"}</div>
                      {edu.major && (
                        <div className="text-xs text-slate-500">Major / Group: <span className="text-slate-700 font-medium">{edu.major}</span></div>
                      )}
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                        <span>CGPA / Grade: <strong className="text-slate-800">{edu.cgpaOrGrade || "N/A"}</strong></span>
                        <span>{edu.boardOrUniversity || ""}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">No academic degrees recorded yet.</p>
                  <Button onClick={openEditModal} size="sm" className="text-xs">
                    Add Education Records
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 3: Experience & Projects */}
        {activeTab === "experience" && (
          <motion.div
            key="experience-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" /> Career Profile & Experience Overview
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block">
                    Current Professional Role
                  </span>
                  <div className="text-base font-bold text-slate-900">
                    {parsedCoding.designation || "Software Engineer / Job Candidate"}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block">
                    Professional Summary & Target Focus
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {currentProfile.bioSummary || "Add your career summary in the profile editor."}
                  </p>
                </div>

                {parsedCoding.topSkills && parsedCoding.topSkills.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block">
                      Core Technical Skills
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {parsedCoding.topSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Coding & Competitive Programming */}
        {activeTab === "coding" && (
          <motion.div
            key="coding-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-600" /> Competitive Programming & Online Handles
                </h3>
                <Button onClick={openEditModal} variant="secondary" size="sm" className="flex items-center gap-1 text-xs">
                  <Edit className="w-3.5 h-3.5" /> Edit Handles
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold">GitHub</span>
                    <Globe className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="font-semibold text-slate-900 truncate">
                    {parsedCoding.github ? (
                      <a
                        href={parsedCoding.github.startsWith("http") ? parsedCoding.github : `https://${parsedCoding.github}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        {parsedCoding.github} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      "Not Provided"
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold">LinkedIn</span>
                    <Globe className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="font-semibold text-slate-900 truncate">
                    {parsedCoding.linkedin ? (
                      <a
                        href={parsedCoding.linkedin.startsWith("http") ? parsedCoding.linkedin : `https://${parsedCoding.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        {parsedCoding.linkedin} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      "Not Provided"
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold">Codeforces</span>
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="font-semibold text-slate-900 truncate">
                    {parsedCoding.codeforces ? (
                      <a
                        href={`https://codeforces.com/profile/${parsedCoding.codeforces}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        {parsedCoding.codeforces} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      "Not Provided"
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold">LeetCode</span>
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="font-semibold text-slate-900 truncate">
                    {parsedCoding.leetcode ? (
                      <a
                        href={`https://leetcode.com/${parsedCoding.leetcode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        {parsedCoding.leetcode} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      "Not Provided"
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold">CodeChef</span>
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="font-semibold text-slate-900 truncate">
                    {parsedCoding.codechef || "Not Provided"}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold">Portfolio Website</span>
                    <Globe className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="font-semibold text-slate-900 truncate">
                    {parsedCoding.portfolioUrl ? (
                      <a
                        href={parsedCoding.portfolioUrl.startsWith("http") ? parsedCoding.portfolioUrl : `https://${parsedCoding.portfolioUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        {parsedCoding.portfolioUrl} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      "Not Provided"
                    )}
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
        title="Edit Full Profile Information"
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          {/* Modal Tab Navigator */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-2 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setModalTab("basic")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                modalTab === "basic" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => setModalTab("identity")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                modalTab === "identity" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Identity & Civil
            </button>
            <button
              type="button"
              onClick={() => setModalTab("present")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                modalTab === "present" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Present Address
            </button>
            <button
              type="button"
              onClick={() => setModalTab("permanent")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                modalTab === "permanent" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Permanent Address
            </button>
            <button
              type="button"
              onClick={() => setModalTab("education")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                modalTab === "education" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Education
            </button>
            <button
              type="button"
              onClick={() => setModalTab("coding")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                modalTab === "coding" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Coding & Handles
            </button>
          </div>

          {/* Tab: Basic Info */}
          {modalTab === "basic" && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Name (English) *</Label>
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
                    placeholder="যেমন: মোঃ মারুফ সরকার"
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

                <div className="space-y-1.5">
                  <Label>Mobile Number</Label>
                  <Input
                    value={formData.mobileNumber || ""}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="+88017..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Professional Bio / Summary</Label>
                <textarea
                  rows={3}
                  value={formData.bioSummary || ""}
                  onChange={(e) => setFormData({ ...formData, bioSummary: e.target.value })}
                  placeholder="Write a brief overview of your background, career focus, and skills..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Tab: Identity & Civil */}
          {modalTab === "identity" && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <select
                    value={formData.gender || "Male"}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Marital Status</Label>
                  <select
                    value={formData.maritalStatus || "Single"}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Nationality</Label>
                  <Input
                    value={formData.nationality || "Bangladeshi"}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Religion</Label>
                  <Input
                    value={formData.religion || "Islam"}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>National ID (NID)</Label>
                  <Input
                    value={formData.nationalId || ""}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    placeholder="NID Number"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Birth Registration Number</Label>
                  <Input
                    value={formData.birthRegistration || ""}
                    onChange={(e) => setFormData({ ...formData, birthRegistration: e.target.value })}
                    placeholder="Birth Certificate No."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Present Address */}
          {modalTab === "present" && (
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Present Address (Voter Location)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div><Label>Division</Label><Input value={formData.presentDivision || ""} onChange={(e) => setFormData({ ...formData, presentDivision: e.target.value })} /></div>
                <div><Label>District</Label><Input value={formData.presentDistrict || ""} onChange={(e) => setFormData({ ...formData, presentDistrict: e.target.value })} /></div>
                <div><Label>Upazila</Label><Input value={formData.presentUpazila || ""} onChange={(e) => setFormData({ ...formData, presentUpazila: e.target.value })} /></div>
                <div><Label>Area</Label><Input value={formData.presentArea || ""} onChange={(e) => setFormData({ ...formData, presentArea: e.target.value })} /></div>
                <div><Label>Location</Label><Input value={formData.presentLocation || ""} onChange={(e) => setFormData({ ...formData, presentLocation: e.target.value })} /></div>
                <div><Label>House</Label><Input value={formData.presentHouse || ""} onChange={(e) => setFormData({ ...formData, presentHouse: e.target.value })} /></div>
                <div><Label>Police Station</Label><Input value={formData.presentPoliceStation || ""} onChange={(e) => setFormData({ ...formData, presentPoliceStation: e.target.value })} /></div>
                <div><Label>Post Office</Label><Input value={formData.presentPostOffice || ""} onChange={(e) => setFormData({ ...formData, presentPostOffice: e.target.value })} /></div>
                <div><Label>Post Code</Label><Input value={formData.presentPostCode || ""} onChange={(e) => setFormData({ ...formData, presentPostCode: e.target.value })} /></div>
              </div>
            </div>
          )}

          {/* Tab: Permanent Address */}
          {modalTab === "permanent" && (
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Permanent Address</h4>
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
          )}

          {/* Tab: Education */}
          {modalTab === "education" && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Academic Qualifications</h4>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Degree
                </button>
              </div>

              {educationList.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  No education records added. Click "Add Degree" to record B.Sc, HSC, SSC, or certifications.
                </div>
              )}

              {educationList.map((edu, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700">Degree Entry #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1 text-xs transition-colors cursor-pointer"
                      title="Remove degree"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <Label>Degree / Certificate</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
                        placeholder="e.g. B.Sc. in Computer Science"
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institute}
                        onChange={(e) => handleEducationChange(idx, "institute", e.target.value)}
                        placeholder="e.g. Dhaka International University"
                      />
                    </div>
                    <div>
                      <Label>Major / Group</Label>
                      <Input
                        value={edu.major || ""}
                        onChange={(e) => handleEducationChange(idx, "major", e.target.value)}
                        placeholder="e.g. CSE / Science"
                      />
                    </div>
                    <div>
                      <Label>Passing Year</Label>
                      <Input
                        value={edu.passingYear || ""}
                        onChange={(e) => handleEducationChange(idx, "passingYear", e.target.value)}
                        placeholder="e.g. 2024"
                      />
                    </div>
                    <div>
                      <Label>CGPA / Grade</Label>
                      <Input
                        value={edu.cgpaOrGrade || ""}
                        onChange={(e) => handleEducationChange(idx, "cgpaOrGrade", e.target.value)}
                        placeholder="e.g. 3.85 / 4.00"
                      />
                    </div>
                    <div>
                      <Label>Board / University</Label>
                      <Input
                        value={edu.boardOrUniversity || ""}
                        onChange={(e) => handleEducationChange(idx, "boardOrUniversity", e.target.value)}
                        placeholder="e.g. Dhaka Board"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Coding & Handles */}
          {modalTab === "coding" && (
            <div className="space-y-4 pt-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Professional Handles & Designation</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Professional Title / Designation</Label>
                  <Input
                    value={codingDetails.designation || ""}
                    onChange={(e) => setCodingDetails({ ...codingDetails, designation: e.target.value })}
                    placeholder="e.g. Full Stack .NET & React Engineer"
                  />
                </div>
                <div>
                  <Label>GitHub URL / Handle</Label>
                  <Input
                    value={codingDetails.github || ""}
                    onChange={(e) => setCodingDetails({ ...codingDetails, github: e.target.value })}
                    placeholder="e.g. github.com/maruf-pfc"
                  />
                </div>
                <div>
                  <Label>LinkedIn URL / Profile</Label>
                  <Input
                    value={codingDetails.linkedin || ""}
                    onChange={(e) => setCodingDetails({ ...codingDetails, linkedin: e.target.value })}
                    placeholder="e.g. linkedin.com/in/mdmarufsarker"
                  />
                </div>
                <div>
                  <Label>Portfolio Website</Label>
                  <Input
                    value={codingDetails.portfolioUrl || ""}
                    onChange={(e) => setCodingDetails({ ...codingDetails, portfolioUrl: e.target.value })}
                    placeholder="e.g. https://itsniloy.eu.org"
                  />
                </div>
                <div>
                  <Label>Codeforces Handle</Label>
                  <Input
                    value={codingDetails.codeforces || ""}
                    onChange={(e) => setCodingDetails({ ...codingDetails, codeforces: e.target.value })}
                    placeholder="e.g. niloy_cf"
                  />
                </div>
                <div>
                  <Label>LeetCode Handle</Label>
                  <Input
                    value={codingDetails.leetcode || ""}
                    onChange={(e) => setCodingDetails({ ...codingDetails, leetcode: e.target.value })}
                    placeholder="e.g. niloy_leetcode"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating} className="flex items-center gap-1.5 cursor-pointer">
              <Save className="w-4 h-4" /> {isUpdating ? "Saving..." : "Save All Profile Details"}
            </Button>
          </div>
        </form>
      </ApplicationModal>
    </div>
  );
}
