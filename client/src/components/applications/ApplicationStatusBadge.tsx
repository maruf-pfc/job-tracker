type Props = {
  status: string;
};

const statusStyles: Record<string, string> = {
  Saved: "bg-slate-100 text-slate-700",
  Applied: "bg-blue-100 text-blue-700",
  Screening: "bg-amber-100 text-amber-700",
  Interview: "bg-violet-100 text-violet-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Ghosted: "bg-zinc-100 text-zinc-700",
  Withdrawn: "bg-orange-100 text-orange-700",
};

export default function ApplicationStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] ?? "bg-slate-100 text-slate-700"}`}
    >
      {status}
    </span>
  );
}
