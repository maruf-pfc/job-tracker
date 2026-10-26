import type { ReactNode } from "react";

type Props = { title: string; subtitle: string; children: ReactNode };
export default function AuthCard({ title, subtitle, children }: Props) {
  return <section className="w-full max-w-[460px] rounded-[20px] border border-[#e0e7dc] bg-white px-6 py-8 shadow-[0_20px_70px_rgba(15,36,24,.08)] sm:px-9 sm:py-10">
    <div className="mb-8"><div className="mb-3 h-1 w-9 rounded-full bg-[#3f8156]"/><h1 className="text-[27px] font-semibold tracking-[-.045em] text-[#192c24]">{title}</h1><p className="mt-2 text-[13px] leading-6 text-[#728177]">{subtitle}</p></div>
    {children}
  </section>;
}
