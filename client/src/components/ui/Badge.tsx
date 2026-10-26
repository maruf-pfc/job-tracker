import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export default function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[#f1f5ee] px-2.5 py-1 text-xs font-medium text-[#42594a]",
        className,
      )}
      {...props}
    />
  );
}
