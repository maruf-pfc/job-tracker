import { describe, it, expect, vi } from "vitest";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../companyService";
import { api } from "../api";

vi.mock("../api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("companyService", () => {
  it("getCompanies should return company list", async () => {
    const mockCompanies = [{ id: "1", name: "Google", location: "Remote" }];
    (api.get as any).mockResolvedValueOnce({ data: { data: mockCompanies } });

    const result = await getCompanies();
    expect(result).toEqual(mockCompanies);
    expect(api.get).toHaveBeenCalledWith("/companies");
  });

  it("createCompany should POST new company payload", async () => {
    const newCompany = { name: "Microsoft", location: "Hybrid" };
    (api.post as any).mockResolvedValueOnce({ data: { data: { id: "2", ...newCompany } } });

    const result = await createCompany(newCompany as any);
    expect(result.name).toBe("Microsoft");
    expect(api.post).toHaveBeenCalledWith("/companies", newCompany);
  });

  it("updateCompany should PUT updated payload", async () => {
    const updatedCompany = { name: "Google Inc." };
    (api.put as any).mockResolvedValueOnce({ data: { data: { id: "1", ...updatedCompany } } });

    const result = await updateCompany("1", updatedCompany as any);
    expect(result.name).toBe("Google Inc.");
    expect(api.put).toHaveBeenCalledWith("/companies/1", updatedCompany);
  });

  it("deleteCompany should send DELETE request", async () => {
    (api.delete as any).mockResolvedValueOnce({});

    await deleteCompany("1");
    expect(api.delete).toHaveBeenCalledWith("/companies/1");
  });
});
