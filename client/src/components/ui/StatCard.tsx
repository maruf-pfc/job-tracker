import Card from "./Card";

type Props = {
  title: string;
  value: string;
  description?: string;
};

export default function StatCard({ title, value, description }: Props) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-[#738478]">{title}</p>

      <h3 className="mt-2 text-3xl font-semibold text-[#203629]">{value}</h3>

      {description && (
        <p className="mt-2 text-sm text-[#738478]">{description}</p>
      )}
    </Card>
  );
}
