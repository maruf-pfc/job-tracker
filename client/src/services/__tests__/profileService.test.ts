import { describe, it, expect, vi } from "vitest";
import { getProfile, updateProfile } from "../profileService";
import { api } from "../api";

vi.mock("../api", () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe("profileService", () => {
  it("getProfile should return user profile data from API", async () => {
    const mockProfile = {
      nameEnglish: "Demo User",
      presentDivision: "Dhaka",
      presentPostCode: "1219",
    };

    (api.get as any).mockResolvedValueOnce({
      data: { data: mockProfile },
    });

    const data = await getProfile();
    expect(data.nameEnglish).toBe("Demo User");
    expect(data.presentDivision).toBe("Dhaka");
    expect(api.get).toHaveBeenCalledWith("/profile");
  });

  it("updateProfile should send PUT request with updated data", async () => {
    const updatedProfile = {
      nameEnglish: "Demo User UPDATED",
      presentDivision: "Dhaka",
    };

    (api.put as any).mockResolvedValueOnce({
      data: { data: updatedProfile },
    });

    const data = await updateProfile(updatedProfile);
    expect(data.nameEnglish).toBe("Demo User UPDATED");
    expect(api.put).toHaveBeenCalledWith("/profile", updatedProfile);
  });
});
