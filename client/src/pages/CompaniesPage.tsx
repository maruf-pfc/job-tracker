import { useState } from "react";
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
  Star,
  Archive,
  ArrowUpRight,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ApplicationActions from "@/components/applications/ApplicationActions";
import { CompaniesSkeleton } from "@/components/common/Skeletons";
import { useCompanies } from "@/hooks/useCompanies";
import type { Company } from "@/types/company";
import Label from "@/components/ui/Label";

const ITEMS_PER_PAGE = 8;

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"all" | "favorites" | "archived">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [careerPageUrl, setCareerPageUrl] = useState("");
  const [notes, setNotes] = useState("");

  const {
    companies,
    isLoading,
    createCompany,
    updateCompany,
    deleteCompany,
    isCreating,
    isUpdating,
  } = useCompanies();

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      if (editingCompany) {
        await updateCompany({ id: editingCompany.id, data: payload });
      } else {
        await createCompany(payload);
      }
      setIsModalOpen(false);
      resetForm();
    } catch {
      // Handled in hook
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

  const allCompanies = companies ?? [];
  const isFavorite = (company: Company) => Boolean((company as Company & { isFavorite?: boolean }).isFavorite);
  const isArchived = (company: Company) => Boolean((company as Company & { isArchived?: boolean }).isArchived);
  const favoriteCount = allCompanies.filter(isFavorite).length;
  const archivedCount = allCompanies.filter(isArchived).length;
  const activeCount = allCompanies.length - archivedCount;
  const filteredCompanies = allCompanies.filter((c) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.location?.toLowerCase().includes(q);
    const matchesView = view === "favorites" ? isFavorite(c) : view === "archived" ? isArchived(c) : !isArchived(c);
    return matchesSearch && matchesView;
  });

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedCompanies = filteredCompanies.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return <CompaniesSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-12 font-['Inter',sans-serif] text-[#172820] animate-[fadeIn_.35s_ease-out]">
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @media (prefers-reduced-motion: reduce) { .animate-\\[fadeIn_\\.35s_ease-out\\], .animate-\\[fadeIn_\\.2s_ease-out\\] { animation: none !important; } }`}</style>
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#658172]"><Building2 size={14}/> Workspace / Directory</div>
          <h1 className="text-[clamp(26px,3vw,34px)] font-semibold tracking-[-.045em]">Companies</h1>
          <p className="mt-1.5 text-sm text-[#748178]">Keep your target organizations, career links, and notes organized.</p>
        </div>
        <button onClick={openCreateModal} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#214b35] px-4 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#183e2a] hover:shadow-md active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214b35]"><Plus size={17}/> Add company</button>
      </header>
      <section aria-label="Company overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total companies", value: allCompanies.length, Icon: Building2 },
          { label: "Active companies", value: activeCount, Icon: Globe },
          { label: "Favorites", value: favoriteCount, Icon: Star },
          { label: "Archived", value: archivedCount, Icon: Archive },
        ].map(({ label, value, Icon }) => <div key={label} className="group flex min-h-[110px] items-center gap-4 rounded-2xl border border-[#e4e8e2] bg-white p-4 shadow-[0_3px_14px_rgba(21,38,28,.025)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#326448] group-hover:bg-[#dfeadc]"><Icon size={19} strokeWidth={1.8}/></span><div><div className="text-[27px] font-semibold leading-none tracking-[-.045em] tabular-nums">{value}</div><p className="mt-2 text-xs text-[#727d75]">{label}</p></div></div>)}
      </section>
      <section className="overflow-hidden rounded-2xl border border-[#e4e8e2] bg-white shadow-[0_3px_14px_rgba(21,38,28,.025)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebeee8] px-4 pt-3 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto" role="tablist" aria-label="Company views">
            {([{ id: "all", label: "All companies", count: activeCount }, { id: "favorites", label: "Favorites", count: favoriteCount }, { id: "archived", label: "Archived", count: archivedCount }] as const).map((item) => <button key={item.id} role="tab" aria-selected={view === item.id} onClick={() => {setView(item.id); setCurrentPage(1);}} className={`relative flex h-12 shrink-0 items-center gap-2 px-3 text-[13px] font-medium transition-colors ${view === item.id ? "text-[#24553a]" : "text-[#78847b] hover:text-[#24553a]"}`}>{item.label}<span className={`rounded-md px-1.5 py-0.5 text-[11px] ${view === item.id ? "bg-[#e5efe1] text-[#24553a]" : "bg-[#f1f3ef]"}`}>{item.count}</span>{view === item.id && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#285e40]"/>}</button>)}
          </div>
          <span className="pb-2 text-xs text-[#8a938c]">{filteredCompanies.length} results</span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="relative max-w-[430px]"><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#849187]"/><input value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value);setCurrentPage(1);}} placeholder="Search companies or locations…" aria-label="Search companies" className="h-10 w-full rounded-lg border border-[#dde4dd] bg-white pl-10 pr-10 text-[13px] outline-none transition-all focus:border-[#447b59] focus:ring-4 focus:ring-[#447b59]/10"/>{searchTerm && <button aria-label="Clear search" onClick={() => {setSearchTerm("");setCurrentPage(1);}} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e8a80]"><X size={15}/></button>}</div>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
            <thead className="bg-[#f7f9f5] text-[11px] font-semibold uppercase tracking-[.08em] text-[#748176]"><tr><th className="px-5 py-3.5 sm:pl-6">Company</th><th className="px-4 py-3.5">Location</th><th className="px-4 py-3.5">Links</th><th className="px-4 py-3.5">Notes</th><th className="px-5 py-3.5 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-[#edf0eb]">
              {paginatedCompanies.map((company) => { const govt = isGovtEntity(company.name, company.careerPageUrl); return <tr key={company.id} className="transition-colors duration-150 hover:bg-[#f7faf6]">
                <td className="px-5 py-4 sm:pl-6"><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#e5ece3] bg-[#eff5ed] text-[#39734b]">{govt ? <Landmark size={17}/> : <Building2 size={17}/>}</span><div className="min-w-0"><p className="max-w-[230px] truncate font-semibold text-[#213128]">{company.name}</p><p className="mt-0.5 text-[11px] text-[#89948a]">{govt ? "Government / Bank" : "Company"}{isFavorite(company) ? " · Favorite" : ""}</p></div></div></td>
                <td className="px-4 py-4 text-[#627165]"><span className="inline-flex items-center gap-1.5"><MapPin size={14} className="shrink-0 text-[#84998a]"/>{company.location || "Not specified"}</span></td>
                <td className="px-4 py-4"><div className="flex flex-wrap gap-x-4 gap-y-1.5">{company.websiteUrl && <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#306447] hover:underline"><Globe size={14}/> Website <ArrowUpRight size={12}/></a>}{company.careerPageUrl && <a href={company.careerPageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#306447] hover:underline">Careers <ExternalLink size={12}/></a>}{!company.websiteUrl && !company.careerPageUrl && <span className="text-[#a2aba3]">—</span>}</div></td>
                <td className="max-w-[240px] truncate px-4 py-4 text-[#748075]" title={company.notes || ""}>{company.notes || "—"}</td>
                <td className="px-5 py-4 text-right"><ApplicationActions onEdit={() => openEditModal(company)} onDelete={async () => {if (window.confirm(`Delete ${company.name}?`)) await deleteCompany(company.id);}}/></td>
              </tr>; })}
              {!paginatedCompanies.length && <tr><td colSpan={5} className="px-6 py-16 text-center"><Building2 className="mx-auto mb-3 text-[#9dab9e]" size={30}/><p className="font-semibold text-[#304438]">No companies found</p><p className="mt-1 text-xs text-[#879489]">Try another search or add a new company.</p></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-[#edf0eb] md:hidden">
          {paginatedCompanies.map((company) => <article key={company.id} className="space-y-3 p-4 transition-colors hover:bg-[#f8faf7]"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef4eb] text-[#36724c]"><Building2 size={18}/></span><div className="min-w-0"><h3 className="truncate text-sm font-semibold">{company.name}</h3><p className="mt-1 text-xs text-[#7b887e]">{company.location || "Location not specified"}</p></div></div><ApplicationActions onEdit={() => openEditModal(company)} onDelete={async () => {if (window.confirm(`Delete ${company.name}?`)) await deleteCompany(company.id);}}/></div>{company.notes && <p className="line-clamp-2 text-xs leading-relaxed text-[#6e7d71]">{company.notes}</p>}<div className="flex flex-wrap gap-3 text-xs font-medium text-[#376e4b]">{company.websiteUrl && <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">Website <ExternalLink size={12}/></a>}{company.careerPageUrl && <a href={company.careerPageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">Careers <ExternalLink size={12}/></a>}</div></article>)}
          {!paginatedCompanies.length && <div className="px-5 py-12 text-center text-sm text-[#7b887e]">No companies found for this view.</div>}
        </div>
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-[#eef0eb] bg-[#fbfcfa] px-5 py-4 text-xs text-[#718075] sm:flex-row sm:px-6"><span>Showing {filteredCompanies.length ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredCompanies.length)} of {filteredCompanies.length} companies</span><div className="flex items-center gap-2"><button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1,p-1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e0e7de] bg-white transition-colors hover:bg-[#eef4eb] disabled:opacity-35"><ChevronLeft size={16}/></button><span className="min-w-12 text-center font-semibold tabular-nums text-[#425b49]">{currentPage} / {totalPages}</span><button aria-label="Next page" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages,p+1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e0e7de] bg-white transition-colors hover:bg-[#eef4eb] disabled:opacity-35"><ChevronRight size={16}/></button></div></footer>
      </section>
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
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating
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
