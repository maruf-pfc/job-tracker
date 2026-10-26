import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[120px] w-full rounded-[9px] border border-[#dbe4d8] bg-white text-[#23392b] placeholder:text-[#95a398] px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#4f8961] focus:ring-2 focus:ring-[#4f8961]/15",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
