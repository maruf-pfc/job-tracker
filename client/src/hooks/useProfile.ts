import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/services/profileService";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { UserProfile } from "@/types/profile";

export function useProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserProfile) => updateProfile(data),
    onSuccess: async (updatedData) => {
      toast.success("Profile saved successfully");
      queryClient.setQueryData(QUERY_KEYS.PROFILE, updatedData);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    },
  });

  return {
    profile: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
