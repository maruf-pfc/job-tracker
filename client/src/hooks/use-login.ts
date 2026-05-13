import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth.api";
import { saveAuth } from "@/stores/auth-store";

export function useLogin() {
  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      saveAuth(data.token, {
        email: data.email,
        name: data.name,
      });
    },
  });
}
