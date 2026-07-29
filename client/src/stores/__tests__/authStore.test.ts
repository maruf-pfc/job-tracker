import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../authStore";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("should initialize with unauthenticated state", () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should update auth state on setAuth", () => {
    const mockUser = { name: "John Doe", email: "john@example.com" };
    useAuthStore.getState().setAuth("mock-token-123", mockUser);

    const state = useAuthStore.getState();
    expect(state.token).toBe("mock-token-123");
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should clear state on logout", () => {
    const mockUser = { name: "Jane Doe", email: "jane@example.com" };
    useAuthStore.getState().setAuth("mock-token-456", mockUser);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
