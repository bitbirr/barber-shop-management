import { AnalyticsDashboardHeader } from "@/components/analytics-dashboard-header";
import { SaaSPage } from "@/components/saas-page";

export default function AnalyticsPage() {
  return <SaaSPage header={<AnalyticsDashboardHeader />} eyebrow="Analytics" title="Performance analytics" description="Understand revenue, utilization, service mix, and customer behavior." action="Export report" metrics={[{ label: "Monthly revenue", value: "$28.4k", change: "12.8%" }, { label: "Chair utilization", value: "78%", change: "4.2%" }, { label: "Repeat rate", value: "64%", change: "7.1%" }, { label: "Average ticket", value: "$52", change: "3.8%" }]} panelTitle="Top-performing services" panelDescription="Ranked by revenue over the last 30 days" rows={[{ name: "Skin fade + beard", detail: "184 bookings", value: "$9,568", status: "+14.2%" }, { name: "Classic haircut", detail: "162 bookings", value: "$6,480", status: "+8.6%" }, { name: "Full grooming", detail: "74 bookings", value: "$5,920", status: "+11.4%" }, { name: "Buzz cut", detail: "96 bookings", value: "$2,880", status: "+3.2%" }]} />;
}
