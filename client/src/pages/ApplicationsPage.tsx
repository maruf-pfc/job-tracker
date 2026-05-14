import { useState } from "react";
import ApplicationsHeader from "@/components/applications/ApplicationsHeader";
import ApplicationsFilters from "@/components/applications/ApplicationsFilters";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ApplicationForm from "@/components/applications/ApplicationForm";

export default function ApplicationsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <ApplicationsHeader onCreate={() => setOpen(true)} />
      <ApplicationsFilters />
      <ApplicationsTable />
      <ApplicationModal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Application"
      >
        <ApplicationForm onSuccess={() => setOpen(false)} />
      </ApplicationModal>
    </div>
  );
}
