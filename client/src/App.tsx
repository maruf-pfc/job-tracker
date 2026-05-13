import { useState } from "react";
import { Badge } from "./components/ui/Badge";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { DataTable } from "./components/ui/DataTable";
import { EmptyState } from "./components/ui/EmptyState";
import { Input } from "./components/ui/Input";
import { Label } from "./components/ui/Label";
import { Modal } from "./components/ui/Modal";
import { Select } from "./components/ui/Select";
import { Skeleton } from "./components/ui/Skeleton";
import { StatCard } from "./components/ui/StatCard";
import { StatusBadge } from "./components/ui/StatusBadge";
import { Textarea } from "./components/ui/Textarea";
import { Title } from "./components/ui/Title";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Title>Job Tracker</Title>

            <p className="mt-2 text-sm text-slate-500">
              Human-centered productivity dashboard components.
            </p>
          </div>

          <Button onClick={() => setOpen(true)}>Open Modal</Button>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="Applications"
            value="24"
            description="+4 this week"
          />

          <StatCard title="Interviews" value="7" description="2 scheduled" />

          <StatCard title="Offers" value="2" description="1 active" />
        </section>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Application Filters</h3>
              <p className="text-sm text-slate-500">
                Search and filter tracked opportunities.
              </p>
            </div>

            <Badge>Productivity Focused</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Search</Label>
              <Input placeholder="Frontend Developer" />
            </div>

            <div>
              <Label>Status</Label>
              <Select>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea placeholder="Add short note..." />
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status="Applied" />
          <StatusBadge status="Interview" />
          <StatusBadge status="Offer" />
          <StatusBadge status="Rejected" />
          <StatusBadge status="Saved" />
        </div>

        <DataTable />

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Skeleton Loading</h3>

          <div className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </Card>

        <EmptyState />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Application"
      >
        <div className="space-y-4">
          <div>
            <Label>Role</Label>
            <Input placeholder="Frontend Engineer" />
          </div>

          <div>
            <Label>Company</Label>
            <Input placeholder="Softvence" />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button>Create</Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
