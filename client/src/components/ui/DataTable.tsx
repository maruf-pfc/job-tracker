import { Table, TBody, TD, TH, THead, TR } from "./Table";
import { StatusBadge } from "./StatusBadge";

const jobs = [
  {
    role: "Frontend Developer",
    company: "Softvence",
    status: "Interview",
  },
  {
    role: "React Developer",
    company: "WPXPO",
    status: "Applied",
  },
  {
    role: "Frontend Intern",
    company: "CodersBucket",
    status: "Offer",
  },
] as const;

export function DataTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <Table>
        <THead>
          <TR>
            <TH>Role</TH>
            <TH>Company</TH>
            <TH>Status</TH>
          </TR>
        </THead>

        <TBody>
          {jobs.map((job) => (
            <TR key={job.role}>
              <TD>{job.role}</TD>
              <TD>{job.company}</TD>
              <TD>
                <StatusBadge status={job.status} />
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
