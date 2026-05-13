import { Card } from "./Card";

type Props = {
  title: string;
  value: string;
  description?: string;
};

export function StatCard({ title, value, description }: Props) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <h3 className="mt-2 text-3xl font-semibold text-slate-900">{value}</h3>

      {description && (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      )}
    </Card>
  );
}
