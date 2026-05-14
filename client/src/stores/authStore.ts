import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id?: string;
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;

  setAuth: (token: string, user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      initialized: false,

      setAuth: (token, user) => {
        set({
          token,
          user,
          isAuthenticated: true,
          initialized: true,
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          initialized: true,
        });
      },

      initializeAuth: () => {
        const state = get();

        set({
          initialized: true,
          isAuthenticated: !!state.token,
        });
      },
    }),

    {
      name: "job-tracker-auth",
    },
  ),
);
