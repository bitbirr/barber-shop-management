import { AnalyticsDashboardHeader } from "@/components/analytics-dashboard-header";
import { SaaSPage } from "@/components/saas-page";

export default function AnalyticsPage() {
  return (
    <SaaSPage
      header={<AnalyticsDashboardHeader />}
      eyebrow="Analytics"
      title="Floor analytics"
      description="Till in ETB, chair fill, service mix, and who is coming back."
      action="Export report"
      metrics={[
        { label: "Monthly till", value: "428k ETB", change: "12.8%" },
        { label: "Chair utilization", value: "78%", change: "4.2%" },
        { label: "Repeat rate", value: "64%", change: "7.1%" },
        { label: "Average ticket", value: "850 ETB", change: "3.8%" },
      ]}
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
