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
      nameEnglish: "Software Engineer",
      presentDivision: "Dhaka",
      presentPostCode: "1219",
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: { data: mockProfile },
    });

    const data = await getProfile();
    expect(data.nameEnglish).toBe("Software Engineer");
    expect(data.presentDivision).toBe("Dhaka");
    expect(api.get).toHaveBeenCalledWith("/profile");
  });

  it("updateProfile should send PUT request with updated data", async () => {
    const updatedProfile = {
      nameEnglish: "Demo User Updated",
      presentDivision: "Dhaka",
    };

    vi.mocked(api.put).mockResolvedValueOnce({
      data: { data: updatedProfile },
    });

    const data = await updateProfile(updatedProfile);
    expect(data.nameEnglish).toBe("Demo User Updated");
    expect(api.put).toHaveBeenCalledWith("/profile", updatedProfile);
  });
});
