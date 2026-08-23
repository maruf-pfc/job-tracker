import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getJobRoles,
  createJobRole,
  updateJobRole,
  deleteJobRole,
} from "@/services/jobRoleService";
import type { JobRole, CreateJobRoleRequest } from "@/services/jobRoleService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export function useJobRoles() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.ROLES,
    queryFn: getJobRoles,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateJobRoleRequest) => createJobRole(data),
    onSuccess: async (newRole) => {
      toast.success("Job role created successfully");
      queryClient.setQueryData<JobRole[]>(QUERY_KEYS.ROLES, (old) => {
        if (!old) return [newRole];
        return [...old.filter((r) => r.id !== newRole.id), newRole].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES });
      await queryClient.refetchQueries({ queryKey: QUERY_KEYS.ROLES });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to create job role");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateJobRoleRequest }) =>
      updateJobRole(id, data),
    onSuccess: async (updatedRole) => {
      toast.success("Job role updated successfully");
      queryClient.setQueryData<JobRole[]>(QUERY_KEYS.ROLES, (old) => {
        if (!old) return [updatedRole];
        return old.map((r) => (r.id === updatedRole.id ? updatedRole : r));
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES });
      await queryClient.refetchQueries({ queryKey: QUERY_KEYS.ROLES });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to update job role");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJobRole(id),
    onSuccess: async (_, deletedId) => {
      toast.success("Job role deleted successfully");
      queryClient.setQueryData<JobRole[]>(QUERY_KEYS.ROLES, (old) => {
        if (!old) return [];
        return old.filter((r) => r.id !== deletedId);
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES });
      await queryClient.refetchQueries({ queryKey: QUERY_KEYS.ROLES });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to delete job role");
    },
  });

  return {
    roles: query.data ?? ([] as JobRole[]),
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    createRole: createMutation.mutateAsync,
    updateRole: updateMutation.mutateAsync,
    deleteRole: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
