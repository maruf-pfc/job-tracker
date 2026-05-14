import type { ReactNode } from "react";

type Props = {
  title: string;

  subtitle: string;

  children: ReactNode;
};

export default function AuthCard({ title, subtitle, children }: Props) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}
