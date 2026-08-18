import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
} from "@/services/jobApplicationService";
import type {
  JobApplication,
  CreateJobApplicationRequest,
  UpdateJobApplicationRequest,
} from "@/types/job-application";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { triggerWebhooks } from "@/services/webhookService";

export function useApplications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.APPLICATIONS,
    queryFn: getApplications,
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_ANALYTICS }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AI_ADVISOR }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateJobApplicationRequest) => createApplication(data),
    onSuccess: async (createdApp) => {
      toast.success("Job application created successfully");
      await invalidate();
      if (createdApp) {
        triggerWebhooks("application_created", createdApp).catch(console.error);
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to create application");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobApplicationRequest }) =>
      updateApplication(id, data),
    onSuccess: async (updatedApp) => {
      toast.success("Job application updated successfully");
      await invalidate();
      if (updatedApp) {
        triggerWebhooks("application_updated", updatedApp).catch(console.error);
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to update application");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: async () => {
      toast.success("Application deleted successfully");
      await invalidate();
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to delete application");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, statusId }: { id: string; statusId: string }) =>
      updateApplicationStatus(id, statusId),
    onSuccess: async (updatedApp) => {
      toast.success("Status updated");
      await invalidate();
      if (updatedApp) {
        triggerWebhooks("status_updated", updatedApp).catch(console.error);
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    },
  });

  return {
    applications: query.data?.items ?? ([] as JobApplication[]),
    totalCount: query.data?.totalCount ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    createApplication: createMutation.mutateAsync,
    updateApplication: updateMutation.mutateAsync,
    deleteApplication: deleteMutation.mutateAsync,
    updateStatus: statusMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
  };
}
