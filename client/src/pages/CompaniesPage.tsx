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
  ArrowUpRight,
  X,
  Flag,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ApplicationActions from "@/components/applications/ApplicationActions";
import { CompaniesSkeleton } from "@/components/common/Skeletons";
import { useCompanies } from "@/hooks/useCompanies";
import type { Company, CreateCompanyRequest } from "@/types/company";
import Label from "@/components/ui/Label";

const ITEMS_PER_PAGE = 8;
type ViewTab = "all" | "favorites" | "redflags" | "archived";

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<ViewTab>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Quick Red Flag modal
  const [flagModalCompany, setFlagModalCompany] = useState<Company | null>(null);
  const [flagReasonInput, setFlagReasonInput] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [careerPageUrl, setCareerPageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isFavoriteInput, setIsFavoriteInput] = useState(false);
  const [isRedFlaggedInput, setIsRedFlaggedInput] = useState(false);
  const [redFlagReason, setRedFlagReason] = useState("");

  const {
    companies,
    isLoading,
    createCompany,
    updateCompany,
    deleteCompany,
    toggleFavorite,
    toggleRedFlag,
    isCreating,
    isUpdating,
    isTogglingFavorite,
    isTogglingRedFlag,
  } = useCompanies();

  const resetForm = () => {
    setName("");
    setLocation("");
    setWebsiteUrl("");
    setCareerPageUrl("");
    setNotes("");
    setIsFavoriteInput(false);
    setIsRedFlaggedInput(false);
    setRedFlagReason("");
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
    setIsFavoriteInput(Boolean(company.isFavorite));
    setIsRedFlaggedInput(Boolean(company.isRedFlagged));
    setRedFlagReason(company.redFlagReason || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const payload: CreateCompanyRequest = {
      name: name.trim(),
      location: location.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      careerPageUrl: careerPageUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      isFavorite: isFavoriteInput,
      isRedFlagged: isRedFlaggedInput,
      redFlagReason: isRedFlaggedInput ? (redFlagReason.trim() || undefined) : undefined,
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

  const openQuickFlagModal = (company: Company) => {
    setFlagModalCompany(company);
    setFlagReasonInput(company.redFlagReason || "");
  };

  const handleQuickFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagModalCompany) return;

    try {
      await toggleRedFlag({
        id: flagModalCompany.id,
        isRedFlagged: true,
        reason: flagReasonInput.trim() || "Suspected fake job posts or unverified listings",
      });
      setFlagModalCompany(null);
    } catch {
      // Handled in hook
    }
  };

  const handleQuickUnflag = async (company: Company) => {
    try {
      await toggleRedFlag({
        id: company.id,
        isRedFlagged: false,
      });
      if (flagModalCompany?.id === company.id) {
        setFlagModalCompany(null);
      }
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
  const isFavorite = (c: Company) => Boolean(c.isFavorite);
  const isArchived = (c: Company) => Boolean(c.isArchived);
  const isRedFlagged = (c: Company) => Boolean(c.isRedFlagged);

  const favoriteCount = allCompanies.filter(isFavorite).length;
  const redFlagCount = allCompanies.filter(isRedFlagged).length;
  const archivedCount = allCompanies.filter(isArchived).length;
  const activeCount = allCompanies.length - archivedCount;

  const filteredCompanies = allCompanies.filter((c) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q) ||
      c.redFlagReason?.toLowerCase().includes(q);

    const matchesView =
      view === "favorites"
        ? isFavorite(c)
        : view === "redflags"
        ? isRedFlagged(c)
        : view === "archived"
        ? isArchived(c)
        : !isArchived(c);

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
      
      {/* Page Header */}
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#658172]">
            <Building2 size={14} /> Workspace / Directory
          </div>
          <h1 className="text-[clamp(26px,3vw,34px)] font-semibold tracking-[-.045em]">
            Companies
          </h1>
          <p className="mt-1.5 text-sm text-[#748178]">
            Manage target employers, favorite organizations, and flag suspected fake recruiters.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#214b35] px-4 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#183e2a] hover:shadow-md active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214b35]"
        >
          <Plus size={17} /> Add company
        </button>
      </header>

      {/* Overview Stat Cards */}
      <section
        aria-label="Company overview"
        className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: "Total companies", value: allCompanies.length, Icon: Building2, color: "text-[#326448]" },
          { label: "Active companies", value: activeCount, Icon: Globe, color: "text-[#326448]" },
          { label: "Favorites", value: favoriteCount, Icon: Star, color: "text-amber-600" },
          { label: "Red Flagged (Fake)", value: redFlagCount, Icon: Flag, color: "text-rose-600" },
        ].map(({ label, value, Icon, color }) => (
          <div
            key={label}
            className="group flex min-h-[105px] items-center gap-4 rounded-2xl border border-[#e4e8e2] bg-white p-4 shadow-[0_3px_14px_rgba(21,38,28,.025)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] ${color} group-hover:bg-[#dfeadc]`}
            >
              <Icon size={19} strokeWidth={1.8} />
            </span>
            <div>
              <div className="text-[26px] font-semibold leading-none tracking-[-.045em] tabular-nums">
                {value}
              </div>
              <p className="mt-2 text-xs text-[#727d75]">{label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Main Content Area */}
      <section className="overflow-hidden rounded-2xl border border-[#e4e8e2] bg-white shadow-[0_3px_14px_rgba(21,38,28,.025)]">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebeee8] px-4 pt-3 sm:px-6">
          <div
            className="flex items-center gap-1 overflow-x-auto scrollbar-none"
            role="tablist"
            aria-label="Company views"
          >
            {[
              { id: "all", label: "All companies", count: activeCount },
              { id: "favorites", label: "⭐ Favorites", count: favoriteCount },
              { id: "redflags", label: "🚩 Red Flags", count: redFlagCount },
              { id: "archived", label: "Archived", count: archivedCount },
            ].map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={view === item.id}
                onClick={() => {
                  setView(item.id as ViewTab);
                  setCurrentPage(1);
                }}
                className={`relative flex h-12 shrink-0 items-center gap-2 px-3 text-[13px] font-medium transition-colors ${
                  view === item.id
                    ? "text-[#24553a] font-semibold"
                    : "text-[#78847b] hover:text-[#24553a]"
                }`}
              >
                {item.label}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[11px] ${
                    view === item.id
                      ? "bg-[#e5efe1] text-[#24553a]"
                      : "bg-[#f1f3ef]"
                  }`}
                >
                  {item.count}
                </span>
                {view === item.id && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#285e40]" />
                )}
              </button>
            ))}
          </div>
          <span className="pb-2 text-xs text-[#8a938c]">
            {filteredCompanies.length} result{filteredCompanies.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-5">
          <div className="relative max-w-[440px]">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#849187]"
            />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by company name, location, or flag reason…"
              aria-label="Search companies"
              className="h-10 w-full rounded-lg border border-[#dde4dd] bg-white pl-10 pr-10 text-[13px] outline-none transition-all focus:border-[#447b59] focus:ring-4 focus:ring-[#447b59]/10"
            />
            {searchTerm && (
              <button
                aria-label="Clear search"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e8a80] hover:text-black"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Desktop / Laptop Table View */}
        <div className="hidden overflow-x-auto md:block scrollbar-thin scrollbar-thumb-[#c7d8cb] scrollbar-track-[#f2f6f1]">
          <table className="w-full min-w-[780px] border-collapse text-left text-[13px]">
            <thead className="bg-[#f7f9f5] text-[11px] font-semibold uppercase tracking-[.08em] text-[#748176]">
              <tr>
                <th className="px-5 py-3.5 sm:pl-6">Company</th>
                <th className="px-4 py-3.5">Status & Tags</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Links</th>
                <th className="px-4 py-3.5">Notes</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0eb]">
              {paginatedCompanies.map((company) => {
                const govt = isGovtEntity(company.name, company.careerPageUrl);
                const flagged = isRedFlagged(company);
                const fav = isFavorite(company);

                return (
                  <tr
                    key={company.id}
                    className={`transition-colors duration-150 hover:bg-[#f7faf6] ${
                      flagged ? "bg-rose-50/40" : ""
                    }`}
                  >
                    <td className="px-5 py-4 sm:pl-6">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border ${
                            flagged
                              ? "border-rose-200 bg-rose-100 text-rose-700"
                              : "border-[#e5ece3] bg-[#eff5ed] text-[#39734b]"
                          }`}
                        >
                          {govt ? (
                            <Landmark size={17} />
                          ) : (
                            <Building2 size={17} />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="max-w-[240px] truncate font-semibold text-[#213128] flex items-center gap-1.5">
                            <span>{company.name}</span>
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#89948a]">
                            {govt ? "Government / Bank" : "Company"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status & Quick Tags (Favorite / Red Flag) */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {/* Quick Favorite Star Button */}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(company.id)}
                          disabled={isTogglingFavorite}
                          title={fav ? "Remove from favorites" : "Mark as favorite"}
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                            fav
                              ? "border-amber-300 bg-amber-50 text-amber-500 hover:bg-amber-100"
                              : "border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50/50"
                          }`}
                        >
                          <Star
                            size={14}
                            className={fav ? "fill-amber-400 text-amber-500" : ""}
                          />
                        </button>

                        {/* Quick Red Flag Button / Badge */}
                        {flagged ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span
                              title={
                                company.redFlagReason
                                  ? `Reason: ${company.redFlagReason}`
                                  : "Suspected fake job posts"
                              }
                              className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800 border border-rose-300"
                            >
                              <Flag size={11} className="fill-rose-700 text-rose-700" />
                              <span>Fake / Red Flag</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuickUnflag(company)}
                              title="Clear Red Flag"
                              className="text-xs text-rose-600 underline hover:text-rose-800"
                            >
                              Clear
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openQuickFlagModal(company)}
                            title="Flag this company as suspicious or fake"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          >
                            <Flag size={12} />
                            <span>Flag Fake</span>
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-[#627165]">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="shrink-0 text-[#84998a]" />
                        {company.location || "Not specified"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {company.websiteUrl && (
                          <a
                            href={company.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#306447] hover:underline"
                          >
                            <Globe size={14} /> Website{" "}
                            <ArrowUpRight size={12} />
                          </a>
                        )}
                        {company.careerPageUrl && (
                          <a
                            href={company.careerPageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#306447] hover:underline"
                          >
                            Careers <ExternalLink size={12} />
                          </a>
                        )}
                        {!company.websiteUrl && !company.careerPageUrl && (
                          <span className="text-[#a2aba3]">—</span>
                        )}
                      </div>
                    </td>

                    <td
                      className="max-w-[200px] truncate px-4 py-4 text-[#748075]"
                      title={company.notes || ""}
                    >
                      {company.notes || "—"}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <ApplicationActions
                        onEdit={() => openEditModal(company)}
                        onDelete={async () => {
                          if (window.confirm(`Delete ${company.name}?`))
                            await deleteCompany(company.id);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}

              {!paginatedCompanies.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Building2 className="mx-auto mb-3 text-[#9dab9e]" size={30} />
                    <p className="font-semibold text-[#304438]">
                      No companies found
                    </p>
                    <p className="mt-1 text-xs text-[#879489]">
                      Try another search or add a new organization.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Responsive Cards */}
        <div className="divide-y divide-[#edf0eb] md:hidden">
          {paginatedCompanies.map((company) => {
            const flagged = isRedFlagged(company);
            const fav = isFavorite(company);

            return (
              <article
                key={company.id}
                className={`space-y-3 p-4 transition-colors hover:bg-[#f8faf7] ${
                  flagged ? "bg-rose-50/40" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        flagged
                          ? "bg-rose-100 text-rose-700"
                          : "bg-[#eef4eb] text-[#36724c]"
                      }`}
                    >
                      <Building2 size={18} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold flex items-center gap-1.5">
                        <span>{company.name}</span>
                      </h3>
                      <p className="mt-0.5 text-xs text-[#7b887e]">
                        {company.location || "Location not specified"}
                      </p>
                    </div>
                  </div>

                  <ApplicationActions
                    onEdit={() => openEditModal(company)}
                    onDelete={async () => {
                      if (window.confirm(`Delete ${company.name}?`))
                        await deleteCompany(company.id);
                    }}
                  />
                </div>

                {/* Badges / Quick Actions on Mobile */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(company.id)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium ${
                      fav
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    <Star
                      size={13}
                      className={fav ? "fill-amber-400 text-amber-500" : ""}
                    />
                    <span>{fav ? "Favorited" : "Favorite"}</span>
                  </button>

                  {flagged ? (
                    <div className="inline-flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-1 text-[11px] font-bold text-rose-800 border border-rose-300">
                        <Flag size={11} className="fill-rose-700 text-rose-700" />
                        <span>Red Flag</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickUnflag(company)}
                        className="text-xs text-rose-700 underline"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openQuickFlagModal(company)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 hover:border-rose-300 hover:text-rose-700"
                    >
                      <Flag size={12} />
                      <span>Flag Fake</span>
                    </button>
                  )}
                </div>

                {flagged && company.redFlagReason && (
                  <p className="text-xs text-rose-800 bg-rose-100/70 p-2 rounded-md">
                    Flag Note: &ldquo;{company.redFlagReason}&rdquo;
                  </p>
                )}

                {company.notes && (
                  <p className="line-clamp-2 text-xs leading-relaxed text-[#6e7d71]">
                    {company.notes}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 text-xs font-medium text-[#376e4b]">
                  {company.websiteUrl && (
                    <a
                      href={company.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1"
                    >
                      Website <ExternalLink size={12} />
                    </a>
                  )}
                  {company.careerPageUrl && (
                    <a
                      href={company.careerPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1"
                    >
                      Careers <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}

          {!paginatedCompanies.length && (
            <div className="px-5 py-12 text-center text-sm text-[#7b887e]">
              No companies found for this view.
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-[#eef0eb] bg-[#fbfcfa] px-5 py-4 text-xs text-[#718075] sm:flex-row sm:px-6">
          <span>
            Showing{" "}
            {filteredCompanies.length
              ? (safePage - 1) * ITEMS_PER_PAGE + 1
              : 0}
            –{Math.min(safePage * ITEMS_PER_PAGE, filteredCompanies.length)} of{" "}
            {filteredCompanies.length} companies
          </span>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous page"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e0e7de] bg-white transition-colors hover:bg-[#eef4eb] disabled:opacity-35 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="min-w-12 text-center font-semibold tabular-nums text-[#425b49]">
              {safePage} / {totalPages}
            </span>
            <button
              aria-label="Next page"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e0e7de] bg-white transition-colors hover:bg-[#eef4eb] disabled:opacity-35 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </footer>
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
              placeholder="e.g. https://bb.org.bd or https://google.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Recruitment Portal / Career URL</Label>
            <Input
              value={careerPageUrl}
              onChange={(e) => setCareerPageUrl(e.target.value)}
              placeholder="e.g. https://erecruiter.bb.org.bd or https://careers.google.com"
            />
          </div>

          {/* Favorite & Red Flag Checkboxes */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                checked={isFavoriteInput}
                onChange={(e) => setIsFavoriteInput(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#214b35] focus:ring-[#214b35]"
              />
              <span className="flex items-center gap-1.5">
                <Star size={15} className="fill-amber-400 text-amber-500" />
                <span>Mark as Favorite organization</span>
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-rose-900">
              <input
                type="checkbox"
                checked={isRedFlaggedInput}
                onChange={(e) => setIsRedFlaggedInput(e.target.checked)}
                className="h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="flex items-center gap-1.5">
                <Flag size={15} className="fill-rose-600 text-rose-600" />
                <span>Flag as Suspicious / Fake Job Posts (Red Flag)</span>
              </span>
            </label>

            {isRedFlaggedInput && (
              <div className="pt-1 space-y-1 animate-[fadeIn_.2s_ease-out]">
                <Label className="text-xs text-rose-900 font-semibold">
                  Red Flag Reason / Warning Note
                </Label>
                <Input
                  value={redFlagReason}
                  onChange={(e) => setRedFlagReason(e.target.value)}
                  placeholder="e.g. Posted ghost job, unverified recruiter, demands training fee"
                  className="border-rose-200 bg-white focus:border-rose-500 focus:ring-rose-100"
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Notes & Recruitment Details</Label>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Exam patterns, syllabus notes, interview tips..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? "Saving..."
                : editingCompany
                ? "Update Organization"
                : "Save Organization"}
            </Button>
          </div>
        </form>
      </ApplicationModal>

      {/* Quick Red Flag Modal */}
      {flagModalCompany && (
        <ApplicationModal
          open={Boolean(flagModalCompany)}
          onClose={() => setFlagModalCompany(null)}
          title={`🚩 Red Flag: ${flagModalCompany.name}`}
        >
          <form onSubmit={handleQuickFlagSubmit} className="space-y-4">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-900 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-950">
                  Mark as Red Flag (Fake/Scam Job Posts)
                </p>
                <p className="mt-1 text-rose-800">
                  Flagging this company will display clear warning alerts on the application board and whenever you add or edit applications for this organization.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Reason / Warning Note</Label>
              <Input
                value={flagReasonInput}
                onChange={(e) => setFlagReasonInput(e.target.value)}
                placeholder="e.g. Suspicious ghost listing, unsolicited WhatsApp test, fake exam fee"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => setFlagModalCompany(null)}
                className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isTogglingRedFlag}
                className="rounded-lg bg-rose-700 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-800 transition-colors shadow-sm"
              >
                {isTogglingRedFlag ? "Flagging..." : "Confirm Red Flag"}
              </button>
            </div>
          </form>
        </ApplicationModal>
      )}
    </div>
  );
}
