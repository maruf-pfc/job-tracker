import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "@/services/companyService";
import type { Company, CreateCompanyRequest } from "@/types/company";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import ApplicationModal from "@/components/applications/ApplicationModal";
import { Building2, ExternalLink, Globe, MapPin, Plus, Pencil, Trash2, Search } from "lucide-react";

export default function CompaniesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [careerPageUrl, setCareerPageUrl] = useState("");
  const [notes, setNotes] = useState("");

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const openCreateModal = () => {
    setEditingCompany(null);
    setName("");
    setLocation("");
    setWebsiteUrl("");
    setCareerPageUrl("");
    setNotes("");
    setIsModalOpen(true);
  };

  const openEditModal = (company: Company) => {
    setEditingCompany(company);
    setName(company.name);
    setLocation(company.location || "");
    setWebsiteUrl(company.websiteUrl || "");
    setCareerPageUrl(company.careerPageUrl || "");
    setNotes(company.notes || "");
    setIsModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (req: CreateCompanyRequest) => createCompany(req),
    onSuccess: () => {
      toast.success("Company created successfully");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to create company"),
  });

  const updateMutation = useMutation({
    mutationFn: (req: CreateCompanyRequest) => updateCompany(editingCompany!.id, req),
    onSuccess: () => {
      toast.success("Company updated successfully");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to update company"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: () => {
      toast.success("Company deleted");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: () => toast.error("Failed to delete company"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Company name is required");
      return;
    }

    const payload: CreateCompanyRequest = {
      name: name.trim(),
      location: location.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      careerPageUrl: careerPageUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (editingCompany) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredCompanies = companies?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Companies
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Target companies, career portals, and recruitment pipelines.
          </p>
        </div>

        <Button onClick={openCreateModal} className="flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Company
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search companies by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table / Cards List */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            Loading companies...
          </div>
        ) : !filteredCompanies?.length ? (
          <div className="p-12 text-center">
            <Building2 className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <h3 className="text-base font-semibold text-slate-900">No companies found</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
              Start adding target companies to organize your application workflow.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Company Name</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Website</th>
                <th className="px-5 py-3.5">Career Portal</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Company Name */}
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{company.name}</span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600 text-xs font-medium">
                    {company.location ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {company.location}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">N/A</span>
                    )}
                  </td>

                  {/* Website */}
                  <td className="px-5 py-4 whitespace-nowrap text-xs">
                    {company.websiteUrl ? (
                      <a
                        href={company.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                      >
                        <Globe className="w-3.5 h-3.5" /> Visit Site
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">N/A</span>
                    )}
                  </td>

                  {/* Career Portal */}
                  <td className="px-5 py-4 whitespace-nowrap text-xs">
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
                      <span className="text-slate-400 italic">N/A</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(company)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit company"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${company.name}?`)) {
                            deleteMutation.mutate(company.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete company"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Company Modal */}
      <ApplicationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompany ? "Edit Company" : "Add Company"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Company Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Google, Microsoft, Brain Station 23"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dhaka, Bangladesh"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Website URL</Label>
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Career Page URL</Label>
            <Input
              value={careerPageUrl}
              onChange={(e) => setCareerPageUrl(e.target.value)}
              placeholder="https://careers.example.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Company tech stack, recruiters, notes..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editingCompany
                ? "Update Company"
                : "Save Company"}
            </Button>
          </div>
        </form>
      </ApplicationModal>
    </div>
  );
}
