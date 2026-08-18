import { useState } from "react";
import { toast } from "sonner";
import { useJobRoles } from "@/hooks/useJobRoles";
import type { JobRole, CreateJobRoleRequest } from "@/services/jobRoleService";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ApplicationActions from "@/components/applications/ApplicationActions";
import { RolesSkeleton } from "@/components/common/Skeletons";
import { UserCheck, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<JobRole | null>(null);

  // Form state
  const [name, setName] = useState("");

  const {
    roles,
    isLoading,
    createRole,
    updateRole,
    deleteRole,
    isCreating,
    isUpdating,
  } = useJobRoles();

  const openCreateModal = () => {
    setEditingRole(null);
    setName("");
    setIsModalOpen(true);
  };

  const openEditModal = (role: JobRole) => {
    setEditingRole(role);
    setName(role.name);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Role title is required");
      return;
    }

    const payload: CreateJobRoleRequest = {
      name: name.trim(),
    };

    try {
      if (editingRole) {
        await updateRole({ id: editingRole.id, data: payload });
      } else {
        await createRole(payload);
      }
      setIsModalOpen(false);
    } catch {
      // Handled in hook
    }
  };

  const filteredRoles = roles?.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredRoles.length / ITEMS_PER_PAGE) || 1;
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return <RolesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Roles & Titles
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage target job roles, titles, and career positions.
          </p>
        </div>

        <Button onClick={openCreateModal} className="flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Role
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search roles..."
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
        <table className="w-full min-w-[450px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Role Title</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm">
            {!filteredRoles.length ? (
              <tr>
                <td colSpan={2} className="p-12 text-center">
                  <UserCheck className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <h3 className="text-base font-semibold text-slate-900">No roles found</h3>
                  <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                    Add custom job roles and positions to personalize your job tracker.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedRoles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Role Title */}
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{role.name}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <ApplicationActions
                      onEdit={() => openEditModal(role)}
                      onDelete={async () => {
                        if (confirm(`Are you sure you want to delete ${role.name}?`)) {
                          await deleteRole(role.id);
                        }
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600 gap-2">
          <span>
            Showing <span className="font-bold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredRoles.length)}</span> of{" "}
            <span className="font-bold text-slate-900">{filteredRoles.length}</span> roles
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

      {/* Create / Edit Role Modal */}
      <ApplicationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? "Edit Job Role" : "Add Job Role"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Role Title</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frontend Engineer, Fullstack Developer"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating
                ? "Saving..."
                : editingRole
                ? "Update Role"
                : "Save Role"}
            </Button>
          </div>
        </form>
      </ApplicationModal>
    </div>
  );
}
