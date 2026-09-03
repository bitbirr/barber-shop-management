import { SaaSPage } from "@/components/saas-page";

export default function CustomersPage() {
  return (
    <SaaSPage
      eyebrow="Regulars"
      title="Client book"
      description="Track who comes back, who is overdue, and who spends in ETB."
      action="Add client"
      metrics={[
        { label: "Total regulars", value: "846", change: "6.1%" },
        { label: "New this month", value: "72", change: "14.0%" },
        { label: "Returning", value: "64%", change: "7.1%" },
        { label: "Overdue 90 days", value: "28", change: "2.4%" },
      ]}
      panelTitle="Addis segments"
      panelDescription="Groups that need a WhatsApp nudge"
      rows={[
        { name: "VIP regulars", detail: "Visited 8+ times in 12 months", value: "126", status: "+12 this month" },
        { name: "New fades", detail: "First visit in the last 30 days", value: "72", status: "+14.0%" },
        { name: "Needs follow-up", detail: "No visit in 90+ days", value: "48", status: "SMS ready" },
        { name: "High ticket", detail: "Average ticket above 1,200 ETB", value: "35", status: "+5 this week" },
      ]}
    />
  );
}
