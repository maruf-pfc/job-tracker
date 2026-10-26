import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#e2e9df] bg-white shadow-[0_1px_2px_rgba(20,42,24,.035)]",
        className,
      )}
      {...props}
    />
  );
}
