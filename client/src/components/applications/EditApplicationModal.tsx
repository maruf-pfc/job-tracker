import ApplicationModal from "./ApplicationModal";
import ApplicationForm from "./ApplicationForm";
import type { JobApplication } from "@/types/job-application";

type Props = {
  open: boolean;
  onClose: () => void;
  application: JobApplication | null;
};

export default function EditApplicationModal({
  open,
  onClose,
  application,
}: Props) {
  if (!application) {
    return null;
  }

  return (
    <ApplicationModal open={open} onClose={onClose} title="Edit Application">
      <ApplicationForm initialData={application} onSuccess={onClose} />
    </ApplicationModal>
  );
}
