import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
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
    onSuccess: async () => {
      toast.success("Company created successfully");
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to create company");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCompanyRequest }) =>
      updateCompany(id, data),
    onSuccess: async () => {
      toast.success("Company updated successfully");
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to update company");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: async () => {
      toast.success("Company deleted successfully");
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES });
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
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
