import type { HTMLAttributes, TableHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn("w-full border-collapse", className)} {...props} />
  );
}

export function THead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-slate-100" {...props} />;
}

export function TBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function TH(props: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className="px-4 py-3 text-left text-sm font-semibold text-slate-700"
      {...props}
    />
  );
}

export function TD(props: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600"
      {...props}
    />
  );
}

export function TR(props: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="hover:bg-slate-50" {...props} />;
}
