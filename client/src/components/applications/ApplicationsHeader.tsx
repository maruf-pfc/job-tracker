import Button from "@/components/ui/Button";

type Props = {
  onCreate: () => void;
};

export default function ApplicationsHeader({ onCreate }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Applications
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Track your job pipeline, follow-ups, and interview progress.
        </p>
      </div>

      <Button onClick={onCreate}>Add Application</Button>
    </div>
  );
}
