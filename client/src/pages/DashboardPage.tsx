import { useQuery } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  CircleCheckBig,
  CircleX,
  Mail,
  Trophy,
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import AnalyticsPlaceholder from "@/components/dashboard/AnalyticsPlaceholder";
import { getDashboardStats } from "@/services/dashboardService";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],

    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Monitor your application pipeline and career progress.
        </p>
      </div>

      <DashboardSection
        title="Overview"
        description="Track your overall job search performance."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Applications"
            value={data?.totalApplications ?? 0}
            icon={<BriefcaseBusiness size={24} />}
          />

          <MetricCard
            title="Interviews"
            value={data?.interviews ?? 0}
            icon={<Mail size={24} />}
          />

          <MetricCard
            title="Offers"
            value={data?.offers ?? 0}
            icon={<Trophy size={24} />}
          />

          <MetricCard
            title="Rejected"
            value={data?.rejected ?? 0}
            icon={<CircleX size={24} />}
          />

          <MetricCard
            title="Response Rate"
            value={`${data?.responseRate ?? 0}%`}
            icon={<CircleCheckBig size={24} />}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        title="Analytics"
        description="Understand trends and optimize your workflow."
      >
        <AnalyticsPlaceholder />
      </DashboardSection>
    </div>
  );
}
