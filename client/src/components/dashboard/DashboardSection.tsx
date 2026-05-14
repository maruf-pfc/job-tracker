import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function DashboardSection({
  title,
  description,
  children,
}: Props) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}
