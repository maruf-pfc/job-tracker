import { create } from "zustand";

type User = {
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  initializeAuth: () => void;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  initializeAuth: () => {
    const raw = localStorage.getItem("job-tracker-auth");

    if (!raw) return;

    const parsed = JSON.parse(raw);

    set({
      token: parsed.token,
      user: parsed.user,
      isAuthenticated: true,
    });
  },

  setAuth: (token, user) => {
    localStorage.setItem(
      "job-tracker-auth",

      JSON.stringify({
        token,
        user,
      }),
    );

    localStorage.setItem("accessToken", token);

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("job-tracker-auth");
    localStorage.removeItem("accessToken");

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
