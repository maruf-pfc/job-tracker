import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  MapPin,
  Globe,
  Landmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ApplicationActions from "@/components/applications/ApplicationActions";
import { CompaniesSkeleton } from "@/components/common/Skeletons";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "@/services/companyService";
import type { Company } from "@/types/company";
import Label from "@/components/ui/Label";

const ITEMS_PER_PAGE = 8;

export default function CompaniesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [careerPageUrl, setCareerPageUrl] = useState("");
  const [notes, setNotes] = useState("");

  const { data: companies = [], isPending } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const resetForm = () => {
    setName("");
    setLocation("");
    setWebsiteUrl("");
    setCareerPageUrl("");
    setNotes("");
    setEditingCompany(null);
  };

  const openCreateModal = () => {
    resetForm();
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
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Organization added successfully");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || "Failed to add organization");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; location?: string; websiteUrl?: string; careerPageUrl?: string; notes?: string } }) =>
      updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Organization updated successfully");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || "Failed to update organization");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Organization deleted successfully");
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || "Failed to delete organization");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const payload = {
      name: name.trim(),
      location: location.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      careerPageUrl: careerPageUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (editingCompany) {
      updateMutation.mutate({ id: editingCompany.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isGovtEntity = (name: string, url?: string) => {
    const n = name.toLowerCase();
    const u = (url || "").toLowerCase();
    return (
      n.includes("govt") ||
      n.includes("bpsc") ||
      n.includes("bank") ||
      n.includes("ministry") ||
      n.includes("board") ||
      n.includes("bpdb") ||
      n.includes("desco") ||
      n.includes("wasa") ||
      n.includes("commission") ||
      u.includes("teletalk") ||
      u.includes(".gov.bd") ||
      u.includes("bb.org.bd")
    );
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE) || 1;
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isPending) {
    return <CompaniesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Organizations & Companies
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Target government ministries, public autonomous bodies, state banks, and corporate entities.
          </p>
        </div>

        <Button onClick={openCreateModal} className="flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Organization
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search organizations by name or location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Organization / Entity</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Location</th>
              <th className="px-5 py-3.5">Official Website</th>
              <th className="px-5 py-3.5">Recruitment / Circular Link</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm">
            {!filteredCompanies.length ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <Building2 className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <h3 className="text-base font-semibold text-slate-900">No organizations found</h3>
                  <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                    Start adding target ministries, banks, or companies to organize your applications.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedCompanies.map((company) => {
                const isGovt = isGovtEntity(company.name, company.careerPageUrl);
                return (
                  <tr key={company.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Organization Name */}
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        {isGovt ? (
                          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                            <Landmark className="w-4 h-4 shrink-0" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                            <Building2 className="w-4 h-4 shrink-0" />
                          </div>
                        )}
                        <span>{company.name}</span>
                      </div>
                    </td>

                    {/* Organization Type */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {isGovt ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 border border-emerald-200/60">
                          🏛️ Govt / Public / Bank
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          🏢 Corporate
                        </span>
                      )}
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
                          <Globe className="w-3.5 h-3.5" /> Visit Website
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">N/A</span>
                      )}
                    </td>

                    {/* Recruitment Portal Link */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs">
                      {company.careerPageUrl ? (
                        <a
                          href={company.careerPageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                            isGovt
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                          }`}
                        >
                          {isGovt ? "Recruitment Circular" : "Career Portal"} <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">N/A</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <ApplicationActions
                        onEdit={() => openEditModal(company)}
                        onDelete={() => {
                          if (confirm(`Are you sure you want to delete ${company.name}?`)) {
                            deleteMutation.mutate(company.id);
                          }
                        }}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600 gap-2">
          <span>
            Showing <span className="font-bold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredCompanies.length)}</span> of{" "}
            <span className="font-bold text-slate-900">{filteredCompanies.length}</span> organizations
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <span className="px-2 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit Company Modal */}
      <ApplicationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompany ? "Edit Organization" : "Add Organization"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Organization / Company Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bangladesh Bank, BPSC, Google, Brain Station 23"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Location / Headquarter</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Motijheel, Dhaka or Agargaon, Dhaka"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Official Website URL</Label>
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="e.g. https://bb.org.bd or http://bpsc.gov.bd"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Recruitment Portal / Circular Notice URL</Label>
            <Input
              value={careerPageUrl}
              onChange={(e) => setCareerPageUrl(e.target.value)}
              placeholder="e.g. https://erecruiter.bb.org.bd or http://bpsc.teletalk.com.bd"
            />
            <p className="text-xs text-slate-500">
              For Govt/Bank: paste the Teletalk / eRecruiter / circular link. For Corporate: career portal link.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Notes & Recruitment Details</Label>
            <Textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Recruitment body (BPSC, Bankers Selection Committee), syllabus patterns, exam committee notes..."
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
                ? "Update Organization"
                : "Save Organization"}
            </Button>
          </div>
        </form>
      </ApplicationModal>
    </div>
  );
}
