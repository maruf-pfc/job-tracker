import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  toggleFavoriteCompany,
  toggleRedFlagCompany,
} from "@/services/companyService";
import type { Company, CreateCompanyRequest } from "@/types/company";
import { QUERY_KEYS } from "@/constants/queryKeys";

export function useCompanies() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.COMPANIES,
    queryFn: getCompanies,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCompanyRequest) => createCompany(data),
    onSuccess: async (newCompany) => {
      toast.success("Company created successfully");
      queryClient.setQueryData<Company[]>(QUERY_KEYS.COMPANIES, (old) => {
        if (!old) return [newCompany];
        return [...old.filter((c) => c.id !== newCompany.id), newCompany].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES });
      await queryClient.refetchQueries({ queryKey: QUERY_KEYS.COMPANIES });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to create company");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCompanyRequest }) =>
      updateCompany(id, data),
    onSuccess: async (updatedCompany) => {
      toast.success("Company updated successfully");
      queryClient.setQueryData<Company[]>(QUERY_KEYS.COMPANIES, (old) => {
        if (!old) return [updatedCompany];
        return old.map((c) => (c.id === updatedCompany.id ? updatedCompany : c));
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES });
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
      await queryClient.refetchQueries({ queryKey: QUERY_KEYS.COMPANIES });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to update company");
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (id: string) => toggleFavoriteCompany(id),
    onSuccess: async (updatedCompany) => {
      toast.success(
        updatedCompany.isFavorite
          ? `Marked ${updatedCompany.name} as favorite`
          : `Removed ${updatedCompany.name} from favorites`
      );
      queryClient.setQueryData<Company[]>(QUERY_KEYS.COMPANIES, (old) => {
        if (!old) return [updatedCompany];
        return old.map((c) => (c.id === updatedCompany.id ? updatedCompany : c));
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES });
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to update favorite status");
    },
  });

  const toggleRedFlagMutation = useMutation({
    mutationFn: ({
      id,
      isRedFlagged,
      reason,
    }: {
      id: string;
      isRedFlagged: boolean;
      reason?: string;
    }) => toggleRedFlagCompany(id, isRedFlagged, reason),
    onSuccess: async (updatedCompany) => {
      toast.success(
        updatedCompany.isRedFlagged
          ? `🚩 Marked ${updatedCompany.name} as a Red Flag`
          : `Removed red flag for ${updatedCompany.name}`
      );
      queryClient.setQueryData<Company[]>(QUERY_KEYS.COMPANIES, (old) => {
        if (!old) return [updatedCompany];
        return old.map((c) => (c.id === updatedCompany.id ? updatedCompany : c));
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES });
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to update red flag status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: async (_, deletedId) => {
      toast.success("Company deleted successfully");
      queryClient.setQueryData<Company[]>(QUERY_KEYS.COMPANIES, (old) => {
        if (!old) return [];
        return old.filter((c) => c.id !== deletedId);
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES });
      await queryClient.refetchQueries({ queryKey: QUERY_KEYS.COMPANIES });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to delete company");
    },
  });

  return {
    companies: query.data ?? ([] as Company[]),
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    createCompany: createMutation.mutateAsync,
    updateCompany: updateMutation.mutateAsync,
    deleteCompany: deleteMutation.mutateAsync,
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
    toggleRedFlag: toggleRedFlagMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isTogglingFavorite: toggleFavoriteMutation.isPending,
    isTogglingRedFlag: toggleRedFlagMutation.isPending,
  };
}
