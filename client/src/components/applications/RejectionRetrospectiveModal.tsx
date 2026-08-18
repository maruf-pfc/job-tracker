import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  X,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  Target,
  Clock,
  HelpCircle,
  FileCheck2,
  Brain,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { getRetrospective, upsertRetrospective } from "@/services/rejectionService";
import type { JobApplication } from "@/types/job-application";
import type { CreateRejectionRetrospectiveRequest, RejectionRetrospective } from "@/types/rejection";

interface Props {
  open: boolean;
  onClose: () => void;
  application: JobApplication | null;
}

const CORPORATE_STAGES = [
  "Resume / ATS Screening",
  "Recruiter Phone Screen",
  "Coding / OA Assessment",
  "System Design Round",
  "Hiring Manager / Behavioral",
  "Executive / Offer Negotiation",
];

const GOVT_STAGES = [
  "MCQ / Preliminary Test",
  "Subjective Written Exam",
  "Practical / Skill Test",
  "Viva Voce Board",
  "Medical & Police Verification",
];

const PREP_TIMES = [
  "< 1 month",
  "1-3 months",
  "3-6 months",
  "6+ months",
  "No dedicated prep",
];

const MOCK_COUNTS = [
  "0 (None)",
  "1-3 mocks",
  "4-10 mocks",
  "10+ mocks",
];

const FEEDBACK_STATUSES = [
  "Detailed feedback received",
  "Generic automated email",
  "Score published on portal",
  "Ghosted / No response after round",
];

const ROOT_CAUSES = [
  "Technical Depth & Core Concepts",
  "Exam Speed & Time Management",
  "Resume & ATS Optimization",
  "Communication & Interview Confidence",
  "Salary & Experience Mismatch",
  "Quota & External Factors",
];

const CORPORATE_TOPICS = [
  "System Design - Scalability & Partitioning",
  "System Design - Caching & Message Queues",
  "LeetCode - Dynamic Programming",
  "LeetCode - Trees & Graphs",
  "LeetCode - Two Pointers & Sliding Window",
  "Concurrency & Multithreading",
  "Database Query Optimization & Indexing",
  "Microservices & Distributed Transactions",
  "Clean Architecture & Design Patterns",
  "Frontend Performance (LCP/INP/SSR)",
];

const GOVT_TOPICS = [
  "Analytical Math & Shortcuts",
  "General Knowledge / Current Affairs",
  "Bangla Literature & Grammar",
  "English Vocabulary & Comprehension",
  "C++ & OOP Concepts",
  "SQL & DB Normalization",
  "Computer Networks & Subnetting",
  "Operating Systems & Linux",
  "Data Structures & Algorithms",
  "ICT Policy & Cyber Security",
];

const BEHAVIORAL_FACTORS = [
  "Nervousness / Hesitation under pressure",
  "Lack of STAR structure in answers",
  "Weak explanation of past projects",
  "Salary / Notice period mismatch",
  "Language fluency (English / Bengali)",
  "Knowledge gap in recent company/org initiatives",
  "Board tough cross-examination",
];

const EXTERNAL_BLOCKERS = [
  "Exam hall rush / Severe traffic",
  "Faulty mouse/keyboard during practical test",
  "Illness / Fatigue / Low sleep before exam",
  "Ambiguous question paper / Misleading prompt",
  "High competition / Extreme cutoff bar",
  "Unrealistic experience expectation",
];

const STUDY_MATERIALS = [
  "Previous Year Question Banks (BUET/BPSC/Job Solutions)",
  "LeetCode / NeetCode 150",
  "Alex Xu System Design Vol 1 & 2",
  "Standard University Textbooks (CLRS/Tanenbaum/Silberschatz)",
  "Online Mock Test & Model Test Platforms",
  "Handwritten Self-Notes & Cheat Sheets",
];

interface FormProps {
  application: JobApplication;
  existingRetrospective: RejectionRetrospective | null | undefined;
  onClose: () => void;
}

function RetrospectiveForm({ application, existingRetrospective, onClose }: FormProps) {
  const queryClient = useQueryClient();

  const isGovtDefault =
    application.jobType?.toLowerCase().includes("govt") ||
    application.company?.toLowerCase().includes("bpsc") ||
    application.company?.toLowerCase().includes("bank") ||
    application.sourcePlatform?.toLowerCase().includes("teletalk");

  const defaultDomain: "Corporate" | "Govt & Bank" =
    existingRetrospective?.jobDomain || (isGovtDefault ? "Govt & Bank" : "Corporate");

  const [activeTab, setActiveTab] = useState<"general" | "metrics" | "checklists" | "reflection">("general");

  const [jobDomain, setJobDomain] = useState<"Corporate" | "Govt & Bank">(defaultDomain);
  const [failedStage, setFailedStage] = useState<string>(
    existingRetrospective?.failedStage || (defaultDomain === "Corporate" ? CORPORATE_STAGES[0] : GOVT_STAGES[0])
  );
  const [preparationTime, setPreparationTime] = useState<string>(
    existingRetrospective?.preparationTime || PREP_TIMES[1]
  );
  const [mockCount, setMockCount] = useState<string>(
    existingRetrospective?.mockCount || MOCK_COUNTS[1]
  );

  const [difficultyRating, setDifficultyRating] = useState<number>(
    existingRetrospective?.difficultyRating || 4
  );
  const [timePressureRating, setTimePressureRating] = useState<number>(
    existingRetrospective?.timePressureRating || 3
  );
  const [confidenceRating, setConfidenceRating] = useState<number>(
    existingRetrospective?.confidenceRating || 6
  );
  const [estimatedScore, setEstimatedScore] = useState<string>(
    existingRetrospective?.estimatedScore?.toString() || ""
  );
  const [expectedCutoffScore, setExpectedCutoffScore] = useState<string>(
    existingRetrospective?.expectedCutoffScore?.toString() || ""
  );
  const [negativeMarksLost, setNegativeMarksLost] = useState<string>(
    existingRetrospective?.negativeMarksLost?.toString() || ""
  );
  const [feedbackStatus, setFeedbackStatus] = useState<string>(
    existingRetrospective?.feedbackStatus || FEEDBACK_STATUSES[1]
  );

  const [technicalTopicGaps, setTechnicalTopicGaps] = useState<string[]>(
    existingRetrospective?.technicalTopicGaps || []
  );
  const [behavioralFactors, setBehavioralFactors] = useState<string[]>(
    existingRetrospective?.behavioralFactors || []
  );
  const [externalBlockers, setExternalBlockers] = useState<string[]>(
    existingRetrospective?.externalBlockers || []
  );
  const [studyMaterialsUsed, setStudyMaterialsUsed] = useState<string[]>(
    existingRetrospective?.studyMaterialsUsed || []
  );

  const [primaryRootCause, setPrimaryRootCause] = useState<string>(
    existingRetrospective?.primaryRootCause || ROOT_CAUSES[0]
  );
  const [whatWentWell, setWhatWentWell] = useState(existingRetrospective?.whatWentWell || "");
  const [whatFailed, setWhatFailed] = useState(existingRetrospective?.whatFailed || "");
  const [actionablePlan, setActionablePlan] = useState(existingRetrospective?.actionablePlan || "");

  const toggleArrayItem = (list: string[], setList: (items: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleDomainChange = (newDomain: "Corporate" | "Govt & Bank") => {
    setJobDomain(newDomain);
    setFailedStage(newDomain === "Corporate" ? CORPORATE_STAGES[0] : GOVT_STAGES[0]);
  };

  const mutation = useMutation({
    mutationFn: (payload: CreateRejectionRetrospectiveRequest) =>
      upsertRetrospective(application.id, payload),
    onSuccess: async () => {
      toast.success("Post-Mortem Diagnostic Assessment saved successfully");
      await queryClient.invalidateQueries({ queryKey: ["retrospective", application.id] });
      await queryClient.invalidateQueries({ queryKey: ["failure-analytics"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to save post-mortem assessment");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({
      jobDomain,
      failedStage,
      primaryRootCause,
      specificWeaknessTags: technicalTopicGaps.slice(0, 5),
      preparationTime,
      mockCount,
      difficultyRating,
      timePressureRating,
      confidenceRating,
      estimatedScore: estimatedScore ? parseFloat(estimatedScore) : undefined,
      expectedCutoffScore: expectedCutoffScore ? parseFloat(expectedCutoffScore) : undefined,
      negativeMarksLost: negativeMarksLost ? parseFloat(negativeMarksLost) : undefined,
      feedbackStatus,
      technicalTopicGaps,
      behavioralFactors,
      externalBlockers,
      studyMaterialsUsed,
      whatWentWell,
      whatFailed,
      actionablePlan,
    });
  };

  const currentStages = jobDomain === "Corporate" ? CORPORATE_STAGES : GOVT_STAGES;
  const currentTopics = jobDomain === "Corporate" ? CORPORATE_TOPICS : GOVT_TOPICS;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[80vh]">
      {/* Questionnaire Step Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/90 px-6 pt-3 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "general"
              ? "border-indigo-600 text-indigo-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>1. Profile & Stage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("metrics")}
          className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "metrics"
              ? "border-indigo-600 text-indigo-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>2. Scores & Pressure</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("checklists")}
          className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "checklists"
              ? "border-indigo-600 text-indigo-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>3. Topic Checklists</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reflection")}
          className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "reflection"
              ? "border-indigo-600 text-indigo-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>4. Action Plan</span>
        </button>
      </div>

      {/* Form Content Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* TAB 1: General Profile & Stage */}
        {activeTab === "general" && (
          <div className="space-y-6">
            {/* Question 1: Domain Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. What category of recruitment was this?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => handleDomainChange("Corporate")}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    jobDomain === "Corporate"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="domain"
                    checked={jobDomain === "Corporate"}
                    onChange={() => handleDomainChange("Corporate")}
                    className="mt-0.5 text-indigo-600"
                  />
                  <div>
                    <div className="text-xs font-bold">Corporate Tech Role</div>
                    <div className="text-[11px] text-slate-500">
                      Software engineering, system design, LeetCode, startup/MNC rounds.
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => handleDomainChange("Govt & Bank")}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    jobDomain === "Govt & Bank"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="domain"
                    checked={jobDomain === "Govt & Bank"}
                    onChange={() => handleDomainChange("Govt & Bank")}
                    className="mt-0.5 text-indigo-600"
                  />
                  <div>
                    <div className="text-xs font-bold">Bangladesh Govt & Bank Exam</div>
                    <div className="text-[11px] text-slate-500">
                      BPSC, Bangladesh Bank, Combined 8-Bank, BPDB, Teletalk circulars.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Question 2: Elimination Stage */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                2. At which specific stage were you eliminated?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentStages.map((stage) => (
                  <label
                    key={stage}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      failedStage === stage
                        ? "border-rose-500 bg-rose-50/60 text-rose-900 font-semibold"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="stage"
                      checked={failedStage === stage}
                      onChange={() => setFailedStage(stage)}
                      className="text-rose-600"
                    />
                    <span>{stage}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 3: Preparation Time Invested */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Total preparation time invested before this exam/round:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PREP_TIMES.map((time) => (
                  <label
                    key={time}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      preparationTime === time
                        ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="prepTime"
                      checked={preparationTime === time}
                      onChange={() => setPreparationTime(time)}
                      className="text-indigo-600"
                    />
                    <span>{time}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 4: Mock Tests / Interviews Taken */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Number of full mock exams / mock interviews practiced beforehand:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MOCK_COUNTS.map((m) => (
                  <label
                    key={m}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      mockCount === m
                        ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="mockCount"
                      checked={mockCount === m}
                      onChange={() => setMockCount(m)}
                      className="text-indigo-600"
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Scores, Difficulty & Pressure */}
        {activeTab === "metrics" && (
          <div className="space-y-6">
            {/* Difficulty Rating */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  1. Exam / Interview Difficulty Rating:
                </label>
                <span className="text-xs font-bold text-indigo-600">
                  {difficultyRating === 1 && "Very Easy (1/5)"}
                  {difficultyRating === 2 && "Moderate (2/5)"}
                  {difficultyRating === 3 && "Standard Competitive (3/5)"}
                  {difficultyRating === 4 && "Hard & Exhaustive (4/5)"}
                  {difficultyRating === 5 && "Extremely Brutal (5/5)"}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficultyRating(lvl)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      difficultyRating === lvl
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {lvl} ★
                  </button>
                ))}
              </div>
            </div>

            {/* Time Pressure Level */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Time Pressure & Pacing Stress:
                </label>
                <span className="text-xs font-bold text-rose-600">
                  {timePressureRating === 1 && "Relaxed / Plenty of time (1/5)"}
                  {timePressureRating === 2 && "Comfortable pace (2/5)"}
                  {timePressureRating === 3 && "Rushed near the end (3/5)"}
                  {timePressureRating === 4 && "Severe deficit / Left blank (4/5)"}
                  {timePressureRating === 5 && "Extreme panic / High negative marks (5/5)"}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setTimePressureRating(lvl)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      timePressureRating === lvl
                        ? "border-rose-600 bg-rose-600 text-white shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Confidence Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Self-Confidence Level before entering the exam / interview:
                </label>
                <span className="text-xs font-bold text-indigo-600">{confidenceRating} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={confidenceRating}
                onChange={(e) => setConfidenceRating(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>1 (Zero confidence)</span>
                <span>5 (Neutral)</span>
                <span>10 (Peak confidence)</span>
              </div>
            </div>

            {/* Score Estimates (Numeric Inputs) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Estimated Score Scored
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 64.5"
                  value={estimatedScore}
                  onChange={(e) => setEstimatedScore(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Expected Cutoff Score
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 72.0"
                  value={expectedCutoffScore}
                  onChange={(e) => setExpectedCutoffScore(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Negative Mark Penalties
                </label>
                <input
                  type="number"
                  step="0.25"
                  placeholder="e.g. 6.0"
                  value={negativeMarksLost}
                  onChange={(e) => setNegativeMarksLost(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 font-mono text-rose-600 focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Feedback Status */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Feedback status from recruiter / exam authority:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FEEDBACK_STATUSES.map((f) => (
                  <label
                    key={f}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      feedbackStatus === f
                        ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="feedbackStatus"
                      checked={feedbackStatus === f}
                      onChange={() => setFeedbackStatus(f)}
                      className="text-indigo-600"
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Topic Checklists */}
        {activeTab === "checklists" && (
          <div className="space-y-6">
            {/* Technical Topic Gaps Checklist */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>1. Specific Technical & Knowledge Topic Gaps (Check all that apply)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentTopics.map((topic) => {
                  const checked = technicalTopicGaps.includes(topic);
                  return (
                    <label
                      key={topic}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        checked
                          ? "border-rose-500 bg-rose-50/70 text-rose-900 font-semibold"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayItem(technicalTopicGaps, setTechnicalTopicGaps, topic)}
                        className="rounded text-rose-600"
                      />
                      <span>{topic}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Behavioral & Viva Factors */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>2. Behavioral, Soft Skills & Viva Board Factors</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BEHAVIORAL_FACTORS.map((factor) => {
                  const checked = behavioralFactors.includes(factor);
                  return (
                    <label
                      key={factor}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        checked
                          ? "border-amber-500 bg-amber-50/70 text-amber-900 font-semibold"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayItem(behavioralFactors, setBehavioralFactors, factor)}
                        className="rounded text-amber-600"
                      />
                      <span>{factor}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* External & Environmental Blockers */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-slate-600" />
                <span>3. Environmental & External Blockers</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXTERNAL_BLOCKERS.map((blocker) => {
                  const checked = externalBlockers.includes(blocker);
                  return (
                    <label
                      key={blocker}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        checked
                          ? "border-slate-800 bg-slate-100 text-slate-900 font-semibold"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayItem(externalBlockers, setExternalBlockers, blocker)}
                        className="rounded text-slate-800"
                      />
                      <span>{blocker}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Study Materials Used */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>4. Preparation Materials & Resources Followed</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STUDY_MATERIALS.map((mat) => {
                  const checked = studyMaterialsUsed.includes(mat);
                  return (
                    <label
                      key={mat}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        checked
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayItem(studyMaterialsUsed, setStudyMaterialsUsed, mat)}
                        className="rounded text-emerald-600"
                      />
                      <span>{mat}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Action Plan & Root Cause */}
        {activeTab === "reflection" && (
          <div className="space-y-5">
            {/* Primary Root Cause */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Primary Root Cause of Elimination
              </label>
              <select
                value={primaryRootCause}
                onChange={(e) => setPrimaryRootCause(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500"
              >
                {ROOT_CAUSES.map((cause) => (
                  <option key={cause} value={cause}>
                    {cause}
                  </option>
                ))}
              </select>
            </div>

            {/* Qualitative Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What went well during this round?</span>
              </label>
              <textarea
                value={whatWentWell}
                onChange={(e) => setWhatWentWell(e.target.value)}
                rows={2}
                placeholder="e.g. Cleared the coding and English comprehension sections with top marks..."
                className="w-full text-xs border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>What caused the drop-off or mark penalty?</span>
              </label>
              <textarea
                value={whatFailed}
                onChange={(e) => setWhatFailed(e.target.value)}
                rows={2}
                placeholder="e.g. Spent 8 minutes stuck on 3 analytical geometry problems and lost marks to negative penalty..."
                className="w-full text-xs border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Actionable Correction Plan & What to Practice Next</span>
              </label>
              <textarea
                value={actionablePlan}
                onChange={(e) => setActionablePlan(e.target.value)}
                rows={3}
                placeholder="e.g. Practice 100-question timed mocks with a strict 45-second cap per question. Solve 2-pass strategy..."
                className="w-full text-xs border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation & Submit */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div>
          {activeTab !== "general" && (
            <button
              type="button"
              onClick={() => {
                if (activeTab === "metrics") setActiveTab("general");
                if (activeTab === "checklists") setActiveTab("metrics");
                if (activeTab === "reflection") setActiveTab("checklists");
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeTab !== "reflection" ? (
            <button
              type="button"
              onClick={() => {
                if (activeTab === "general") setActiveTab("metrics");
                if (activeTab === "metrics") setActiveTab("checklists");
                if (activeTab === "checklists") setActiveTab("reflection");
              }}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Next Section</span>
              <span>→</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{mutation.isPending ? "Saving Analysis..." : "Complete & Save Assessment"}</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default function RejectionRetrospectiveModal({ open, onClose, application }: Props) {
  const { data: existingRetrospective, isLoading } = useQuery({
    queryKey: ["retrospective", application?.id],
    queryFn: () => (application ? getRetrospective(application.id) : null),
    enabled: !!application && open,
  });

  if (!open || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Post-Mortem Diagnostic Assessment
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {application.role} • <span className="font-semibold text-slate-800">{application.company}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Multi-Step Form */}
        {isLoading ? (
          <div className="p-16 text-center text-xs text-slate-500">Loading diagnostic survey...</div>
        ) : (
          <RetrospectiveForm
            key={existingRetrospective?.id || application.id}
            application={application}
            existingRetrospective={existingRetrospective}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
