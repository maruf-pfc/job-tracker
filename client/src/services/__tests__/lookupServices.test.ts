import { describe, it, expect, vi, beforeEach } from "vitest";
import { getJobTypes } from "../jobTypeService";
import { getWorkTypes } from "../workTypeService";
import { getSourcePlatforms } from "../sourcePlatformService";
import { getApplicationStatuses } from "../applicationStatusService";
import { getPriorities } from "../priorityService";
import { api } from "../api";

vi.mock("../api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("Lookup Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getJobTypes should call /job-types", async () => {
    const mockData = [{ id: "1", name: "Corporate" }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockData } });

    const result = await getJobTypes();
    expect(api.get).toHaveBeenCalledWith("/job-types");
    expect(result).toEqual(mockData);
  });

  it("getWorkTypes should call /work-types", async () => {
    const mockData = [{ id: "2", name: "Remote" }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockData } });

    const result = await getWorkTypes();
    expect(api.get).toHaveBeenCalledWith("/work-types");
    expect(result).toEqual(mockData);
  });

  it("getSourcePlatforms should call /source-platforms", async () => {
    const mockData = [{ id: "3", name: "LinkedIn" }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockData } });

    const result = await getSourcePlatforms();
    expect(api.get).toHaveBeenCalledWith("/source-platforms");
    expect(result).toEqual(mockData);
  });

  it("getApplicationStatuses should call /application-statuses", async () => {
    const mockData = [{ id: "4", name: "Applied" }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockData } });

    const result = await getApplicationStatuses();
    expect(api.get).toHaveBeenCalledWith("/application-statuses");
    expect(result).toEqual(mockData);
  });

  it("getPriorities should call /priorities", async () => {
    const mockData = [{ id: "5", name: "High" }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockData } });

    const result = await getPriorities();
    expect(api.get).toHaveBeenCalledWith("/priorities");
    expect(result).toEqual(mockData);
  });
});
