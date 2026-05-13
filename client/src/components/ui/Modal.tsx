import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

          <button
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
