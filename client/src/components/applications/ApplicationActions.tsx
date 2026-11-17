import { Calendar, Pencil, Trash2 } from "lucide-react";
type Props = { onEdit: () => void; onDelete: () => void; onManageRounds?: () => void };
export default function ApplicationActions({ onEdit, onDelete, onManageRounds }: Props) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {onManageRounds && (
        <button
          type="button"
          onClick={onManageRounds}
          aria-label="Interview rounds"
          title="Interview rounds"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#dce6da] bg-white text-[#2a6344] transition-colors hover:bg-[#edf5e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3e7952]"
        >
          <Calendar size={15} />
        </button>
      )}
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit"
        title="Edit"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#dce6da] bg-white text-[#45624d] transition-colors hover:bg-[#edf5e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3e7952]"
      >
        <Pencil size={15} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete"
        title="Delete"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#f0dedb] bg-white text-[#ae5950] transition-colors hover:bg-[#fff0ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#aa5749]"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}