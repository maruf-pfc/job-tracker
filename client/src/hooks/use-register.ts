import { useMutation } from "@tanstack/react-query";
import { register } from "@/api/auth.api";
import { saveAuth } from "@/stores/auth-store";

export function useRegister() {
  return useMutation({
    mutationFn: register,

    onSuccess: (data) => {
      saveAuth(data.token, {
        email: data.email,
        name: data.name,
      });
    },
  });
}
