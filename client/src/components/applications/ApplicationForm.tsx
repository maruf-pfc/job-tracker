import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { getCompanies } from "@/services/companyService";
import { getPriorities } from "@/services/priorityService";
import { getApplicationStatuses } from "@/services/applicationStatusService";
import { getSourcePlatforms } from "@/services/sourcePlatformService";
import { getJobTypes } from "@/services/jobTypeService";
import { getWorkTypes } from "@/services/workTypeService";
import {
  createApplication,
  updateApplication,
} from "@/services/jobApplicationService";
import { createJobApplicationSchema } from "@/schemas/jobApplicationSchema";
import type { CreateJobApplicationRequest } from "@/types/job-application";
import ApplicationFormSection from "./ApplicationFormSection";
import type { JobApplication } from "@/types/job-application";

type Props = {
  onSuccess: () => void;
  initialData?: JobApplication | null;
};

const COMMON_ROLES = [
  "Frontend Engineer",
  "Backend Developer",
  "Fullstack Engineer",
  "Software Engineer",
  "DevOps Engineer",
  "Mobile Engineer (iOS/Android)",
  "UI/UX Designer",
  "Product Manager",
  "Data Engineer",
  "QA / Test Engineer",
  "Solutions Architect",
  "Engineering Manager",
];

export default function ApplicationForm({ onSuccess, initialData }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateJobApplicationRequest>({
    resolver: zodResolver(createJobApplicationSchema),
  });

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const { data: priorities } = useQuery({
    queryKey: ["priorities"],
    queryFn: getPriorities,
  });

  const { data: statuses } = useQuery({
    queryKey: ["statuses"],
    queryFn: getApplicationStatuses,
  });

  const { data: platforms } = useQuery({
    queryKey: ["platforms"],
    queryFn: getSourcePlatforms,
  });

  const { data: workTypes } = useQuery({
    queryKey: ["work-types"],
    queryFn: getWorkTypes,
  });

  const { data: jobTypes } = useQuery({
    queryKey: ["job-types"],
    queryFn: getJobTypes,
  });

  useEffect(() => {
    if (!initialData) {
      return;
    }

    reset({
      companyId: "",
      role: initialData.role,
      location: initialData.location || "",
      salaryRange: initialData.salaryRange || "",
      notes: initialData.notes || "",
      resumeDriveLink: initialData.resumeDriveLink || "",
      priorityId: "",
      sourcePlatformId: "",
      applicationStatusId: "",
      workTypeId: "",
      jobTypeId: "",
    });
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: (data: CreateJobApplicationRequest) => {
      // Auto-assign first platform ID if not set
      const payload = {
        ...data,
        sourcePlatformId: data.sourcePlatformId || platforms?.[0]?.id || "",
      };

      if (initialData) {
        return updateApplication(initialData.id, payload);
      }

      return createApplication(payload);
    },

    onSuccess: async () => {
      toast.success(
        initialData
          ? "Application updated successfully"
          : "Application created successfully",
      );

      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      reset();
      onSuccess();
    },

    onError: () => {
      toast.error(
        initialData
          ? "Failed to update application"
          : "Failed to create application",
      );
    },
  });

  const onSubmit = (data: CreateJobApplicationRequest) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Job Information */}
      <ApplicationFormSection
        title="Job Information"
        description="Basic application and role details."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Company Dropdown */}
          <div className="space-y-1.5">
            <Label>Company</Label>
            <Select {...register("companyId")}>
              <option value="">Select company</option>
              {companies?.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
            {errors.companyId && (
              <p className="text-xs text-red-600">{errors.companyId.message}</p>
            )}
          </div>

          {/* Role Dropdown */}
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select {...register("role")}>
              <option value="">Select role</option>
              {COMMON_ROLES.map((roleName) => (
                <option key={roleName} value={roleName}>
                  {roleName}
                </option>
              ))}
            </Select>
            {errors.role && (
              <p className="text-xs text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input
              placeholder="e.g. Dhaka, Bangladesh"
              {...register("location")}
            />
          </div>

          {/* Salary Range */}
          <div className="space-y-1.5">
            <Label>Salary Range</Label>
            <Input
              placeholder="e.g. 50,000 BDT - 80,000 BDT"
              {...register("salaryRange")}
            />
          </div>
        </div>
      </ApplicationFormSection>

      {/* Section 2: Application Workflow */}
      <ApplicationFormSection
        title="Application Workflow"
        description="Track application status, priority, and job types."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Status */}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select {...register("applicationStatusId")}>
              <option value="">Select status</option>
              {statuses?.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </Select>
            {errors.applicationStatusId && (
              <p className="text-xs text-red-600">{errors.applicationStatusId.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select {...register("priorityId")}>
              <option value="">Select priority</option>
              {priorities?.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </Select>
            {errors.priorityId && (
              <p className="text-xs text-red-600">{errors.priorityId.message}</p>
            )}
          </div>

          {/* Work Type */}
          <div className="space-y-1.5">
            <Label>Work Type</Label>
            <Select {...register("workTypeId")}>
              <option value="">Select work type</option>
              {workTypes?.map((workType) => (
                <option key={workType.id} value={workType.id}>
                  {workType.name}
                </option>
              ))}
            </Select>
            {errors.workTypeId && (
              <p className="text-xs text-red-600">{errors.workTypeId.message}</p>
            )}
          </div>

          {/* Job Type */}
          <div className="space-y-1.5">
            <Label>Job Type</Label>
            <Select {...register("jobTypeId")}>
              <option value="">Select job type</option>
              {jobTypes?.map((jobType) => (
                <option key={jobType.id} value={jobType.id}>
                  {jobType.name}
                </option>
              ))}
            </Select>
            {errors.jobTypeId && (
              <p className="text-xs text-red-600">{errors.jobTypeId.message}</p>
            )}
          </div>
        </div>
      </ApplicationFormSection>

      {/* Section 3: Notes & Documents */}
      <ApplicationFormSection
        title="Notes & Documents"
        description="Store markdown notes and supporting links."
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              rows={6}
              placeholder="Interview insights, company culture notes, follow-up reminders..."
              {...register("notes")}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Resume Link</Label>
            <Input
              placeholder="https://drive.google.com/..."
              {...register("resumeDriveLink")}
            />
          </div>
        </div>
      </ApplicationFormSection>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? initialData
              ? "Updating..."
              : "Saving..."
            : initialData
              ? "Update Application"
              : "Save Application"}
        </Button>
      </div>
    </form>
  );
}
