import { describe, it, expect, vi } from "vitest";
import {
  getJobRoles,
  createJobRole,
  updateJobRole,
  deleteJobRole,
} from "../jobRoleService";
import { api } from "../api";

vi.mock("../api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("jobRoleService", () => {
  it("getJobRoles should return job role list", async () => {
    const mockRoles = [{ id: "1", name: "Frontend Engineer" }];
    (api.get as any).mockResolvedValueOnce({ data: { data: mockRoles } });

    const result = await getJobRoles();
    expect(result).toEqual(mockRoles);
    expect(api.get).toHaveBeenCalledWith("/job-roles");
  });

  it("createJobRole should POST new job role payload", async () => {
    const newRole = { name: "Backend Developer" };
    (api.post as any).mockResolvedValueOnce({ data: { data: { id: "2", ...newRole } } });

    const result = await createJobRole(newRole);
    expect(result.name).toBe("Backend Developer");
    expect(api.post).toHaveBeenCalledWith("/job-roles", newRole);
  });

  it("updateJobRole should PUT updated job role payload", async () => {
    const updatedRole = { name: "Senior Fullstack Engineer" };
    (api.put as any).mockResolvedValueOnce({ data: { data: { id: "1", ...updatedRole } } });

    const result = await updateJobRole("1", updatedRole);
    expect(result.name).toBe("Senior Fullstack Engineer");
    expect(api.put).toHaveBeenCalledWith("/job-roles/1", updatedRole);
  });

  it("deleteJobRole should send DELETE request", async () => {
    (api.delete as any).mockResolvedValueOnce({});

    await deleteJobRole("1");
    expect(api.delete).toHaveBeenCalledWith("/job-roles/1");
  });
});
