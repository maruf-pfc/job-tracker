import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Title({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-2xl font-semibold tracking-tight text-slate-900",
        className,
      )}
      {...props}
    />
  );
}
