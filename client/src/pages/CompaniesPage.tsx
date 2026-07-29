import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "@/services/companyService";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Building2, ExternalLink, Globe, MapPin } from "lucide-react";

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const filteredCompanies = companies?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Companies
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Target companies, career portals, and recruitment pipelines.
          </p>
        </div>
        <Button>Add Company</Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative max-w-md">
          <Input
            placeholder="Search companies by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table / Cards List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading companies...
          </div>
        ) : !filteredCompanies?.length ? (
          <div className="p-12 text-center">
            <Building2 className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <h3 className="text-lg font-semibold text-slate-900">No companies found</h3>
            <p className="mt-1 text-sm text-slate-600">
              Start adding target companies to organize your application workflow.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Company Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Website
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Career Portal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {company.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {company.location || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {company.websiteUrl ? (
                      <a
                        href={company.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" /> Visit Site
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {company.careerPageUrl ? (
                      <a
                        href={company.careerPageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                      >
                        Careers <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
