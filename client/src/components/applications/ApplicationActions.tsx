import Button from "@/components/ui/Button";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function ApplicationActions({ onEdit, onDelete }: Props) {
  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="secondary" onClick={onEdit}>
        Edit
      </Button>

      <Button size="sm" variant="danger" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}
