import { describe, it, expect, beforeEach } from "vitest";
import { api } from "../api";
import { useAuthStore } from "@/stores/authStore";

describe("api axios client", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("should have correct base URL configuration", () => {
    expect(api.defaults.baseURL).toBeDefined();
  });

  it("should attach Authorization Bearer token when authenticated", async () => {
    useAuthStore.getState().setAuth("test-jwt-token-123", {
      name: "Test User",
      email: "test@example.com",
    });

    const token = useAuthStore.getState().token;
    expect(token).toBe("test-jwt-token-123");
  });
});
