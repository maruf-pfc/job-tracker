import { api } from "./api";

export const InterviewResult = {
  Pending: 0,
  Passed: 1,
  Failed: 2,
  Cancelled: 3,
} as const;

export type InterviewResultType = (typeof InterviewResult)[keyof typeof InterviewResult];

export type InterviewRoundDto = {
  id: string;
  jobApplicationId: string;
  roundName: string;
  roundDate: string;
  experience?: string;
  result: InterviewResultType;
  createdAt: string;
};

export type CreateInterviewRoundDto = {
  roundName: string;
  roundDate?: string;
  experience?: string;
  result?: InterviewResultType;
};

export const interviewRoundService = {
  getByApplication: async (jobApplicationId: string): Promise<InterviewRoundDto[]> => {
    const res = await api.get(`/jobapplications/${jobApplicationId}/rounds`);
    return res.data.data;
  },

  create: async (jobApplicationId: string, dto: CreateInterviewRoundDto): Promise<InterviewRoundDto> => {
    const res = await api.post(`/jobapplications/${jobApplicationId}/rounds`, dto);
    return res.data.data;
  },

  update: async (roundId: string, dto: Partial<CreateInterviewRoundDto>): Promise<InterviewRoundDto> => {
    const res = await api.put(`/rounds/${roundId}`, dto);
    return res.data.data;
  },

  delete: async (roundId: string): Promise<void> => {
    await api.delete(`/rounds/${roundId}`);
  },
};
