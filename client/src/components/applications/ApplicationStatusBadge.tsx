type Props = {
  status: string;
  passedRounds?: number;
  totalRounds?: number;
  failedStage?: string;
  latestRoundName?: string;
};

const STATUS_MAP: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  Saved: { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-400", border: "border-slate-200" },
  Applied: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200" },
  "MCQ / Preliminary": { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500", border: "border-violet-200" },
  "Written Exam": { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500", border: "border-sky-200" },
  "Practical / Skill Test": { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500", border: "border-cyan-200" },
  "Viva Voce": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500", border: "border-purple-200" },
  "Medical & Verification": { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500", border: "border-teal-200" },
  Screening: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200" },
  Interview: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", border: "border-indigo-200" },
  Offer: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", border: "border-rose-200" },
  Ghosted: { bg: "bg-amber-50/60", text: "text-amber-800", dot: "bg-amber-400", border: "border-amber-200" },
  Withdrawn: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400", border: "border-slate-300" },
};

export default function ApplicationStatusBadge({
  status,
  passedRounds,
  failedStage,
  latestRoundName,
}: Props) {
  const style = STATUS_MAP[status] ?? { bg: "bg-[#f0f5ed]", text: "text-[#315f41]", dot: "bg-[#5e9870]", border: "border-[#d9e7d4]" };
  const isRejected = status?.toLowerCase() === "rejected";
  const isInterview = status?.toLowerCase() === "interview";

  let displayLabel = status;
  if (isRejected && (passedRounds ?? 0) > 0) {
    displayLabel = `Rejected (${passedRounds} passed)`;
  } else if (isInterview && (passedRounds ?? 0) > 0) {
    displayLabel = `Interview (${passedRounds} passed)`;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
      title={failedStage ? `Dropped at ${failedStage}` : latestRoundName ? `Stage: ${latestRoundName}` : undefined}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {displayLabel}
    </span>
  );
}
