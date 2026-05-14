import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem("job-tracker-auth");

  if (authStorage) {
    const parsed = JSON.parse(authStorage);
    const token = parsed.state?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
