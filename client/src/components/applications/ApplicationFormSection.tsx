import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function ApplicationFormSection({
  title,
  description,
  children,
}: Props) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>

        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}
