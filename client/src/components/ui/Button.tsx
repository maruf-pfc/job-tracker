import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md";
};

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          size === "sm" && "h-9 px-3 text-sm",
          size === "md" && "h-10 px-4 text-sm",
          variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
          variant === "secondary" &&
            "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
          variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export default Button;
