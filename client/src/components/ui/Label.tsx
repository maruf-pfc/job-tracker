import type { LabelHTMLAttributes } from "react";

export default function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className="mb-2 block text-sm font-medium text-slate-700"
      {...props}
    />
  );
}
