type Props = {
  status: string;
};

const STATUS_MAP: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  Saved: { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-400", border: "border-slate-200" },
  Applied: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200" },
  Screening: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200" },
  Interview: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", border: "border-indigo-200" },
  Offer: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", border: "border-rose-200" },
  Ghosted: { bg: "bg-amber-50/60", text: "text-amber-800", dot: "bg-amber-400", border: "border-amber-200" },
  Withdrawn: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400", border: "border-slate-300" },
};

export default function ApplicationStatusBadge({ status }: Props) {
  const style = STATUS_MAP[status] ?? STATUS_MAP.Saved;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
