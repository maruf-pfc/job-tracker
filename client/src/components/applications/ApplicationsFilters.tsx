import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function ApplicationsFilters() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Input placeholder="Search applications..." />

        <Select>
          <option value="">All Statuses</option>
        </Select>

        <Select>
          <option value="">All Priorities</option>
        </Select>

        <Select>
          <option value="">All Platforms</option>
        </Select>
      </div>
    </div>
  );
}
