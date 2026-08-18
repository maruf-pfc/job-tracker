import { describe, it, expect, vi } from "vitest";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../companyService";
import { api } from "../api";
import type { CreateCompanyRequest } from "@/types/company";

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
    vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockCompanies } });

    const result = await getCompanies();
    expect(result).toEqual(mockCompanies);
    expect(api.get).toHaveBeenCalledWith("/companies");
  });

  it("createCompany should POST new company payload", async () => {
    const newCompany: CreateCompanyRequest = { name: "Microsoft", location: "Hybrid" };
    vi.mocked(api.post).mockResolvedValueOnce({ data: { data: { id: "2", ...newCompany } } });

    const result = await createCompany(newCompany);
    expect(result.name).toBe("Microsoft");
    expect(api.post).toHaveBeenCalledWith("/companies", newCompany);
  });

  it("updateCompany should PUT updated payload", async () => {
    const updatedCompany: CreateCompanyRequest = { name: "Google Inc." };
    vi.mocked(api.put).mockResolvedValueOnce({ data: { data: { id: "1", ...updatedCompany } } });

    const result = await updateCompany("1", updatedCompany);
    expect(result.name).toBe("Google Inc.");
    expect(api.put).toHaveBeenCalledWith("/companies/1", updatedCompany);
  });

  it("deleteCompany should send DELETE request", async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({});

    await deleteCompany("1");
    expect(api.delete).toHaveBeenCalledWith("/companies/1");
  });
});
