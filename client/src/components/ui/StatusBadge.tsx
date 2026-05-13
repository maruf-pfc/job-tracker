import { Badge } from "./Badge";

const variants = {
  Applied: "bg-blue-100 text-blue-700",
  Interview: "bg-violet-100 text-violet-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Saved: "bg-slate-100 text-slate-700",
};

type Props = {
  status: keyof typeof variants;
};

export function StatusBadge({ status }: Props) {
  return <Badge className={variants[status]}>{status}</Badge>;
}
