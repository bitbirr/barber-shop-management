import { AnalyticsDashboardHeader } from "@/components/analytics-dashboard-header";
import { AnalyticsKpiCards } from "@/components/analytics-kpi-cards";
import { ConversionFunnelChart } from "@/components/conversion-funnel-chart";
import { CustomerGrowthAreaChart } from "@/components/customer-growth-area-chart";
import { CustomerHealthScoreSection } from "@/components/customer-health-score-section";
import { FeatureUsageBarChart } from "@/components/feature-usage-bar-chart";
import { PlanDistributionDonut } from "@/components/plan-distribution-donut";
import { RealtimeMetricCards } from "@/components/realtime-metric-cards";
import { RevenueAnalyticsSection } from "@/components/revenue-analytics-section";
import { RevenueLineChart } from "@/components/revenue-line-chart";
import { SaaSPage } from "@/components/saas-page";

export default function AnalyticsPage() {
  return (
    <SaaSPage
      header={<AnalyticsDashboardHeader />}
      eyebrow="Analytics"
      title="Floor analytics"
      description="Till in ETB, chair fill, service mix, and who is coming back."
      action="Export report"
      kpiCards={
        <>
          <RealtimeMetricCards />
          <AnalyticsKpiCards />
        </>
      }
      chart={
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-5">
          <div className="xl:col-span-3">
            <RevenueAnalyticsSection />
          </div>
          <div className="xl:col-span-2">
            <RevenueLineChart />
          </div>
          <PlanDistributionDonut />
          <div className="xl:col-span-2">
            <CustomerGrowthAreaChart />
          </div>
          <FeatureUsageBarChart />
          <div className="xl:col-span-3">
            <ConversionFunnelChart />
          </div>
          <div className="xl:col-span-3">
            <CustomerHealthScoreSection />
          </div>
        </div>
      }
      panelTitle="Top-performing services"
      panelDescription="Ranked by till over the last 30 days"
      rows={[
        { name: "Skin fade + beard", detail: "184 bookings", value: "156,400 ETB", status: "+14.2%" },
        { name: "Classic haircut", detail: "162 bookings", value: "97,200 ETB", status: "+8.6%" },
        { name: "Full grooming", detail: "74 bookings", value: "88,800 ETB", status: "+11.4%" },
        { name: "Buzz cut", detail: "96 bookings", value: "43,200 ETB", status: "+3.2%" },
      ]}
    />
  );
}
