type AuthUser = {
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

const AUTH_STORAGE_KEY = "job-tracker-auth";

export function saveAuth(token: string, user: AuthUser) {
  const state: AuthState = {
    token,
    user,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));

  localStorage.setItem("accessToken", token);
}

export function getAuth() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) return null;

  return JSON.parse(raw) as AuthState;
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("accessToken");
}
