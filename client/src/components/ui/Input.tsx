import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export default function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-[9px] border border-[#dbe4d8] bg-white text-[#23392b] placeholder:text-[#95a398] px-3 py-2.5 text-sm outline-none transition focus:border-[#4f8961] focus:ring-2 focus:ring-[#4f8961]/15",
        className,
      )}
      {...props}
    />
  );
}
