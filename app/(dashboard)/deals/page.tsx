import { SaaSPage } from "@/components/saas-page";

export default function DealsPage() {
  return (
    <SaaSPage
      action="Create deal"
      description="Review active deals, next steps, and forecasted revenue."
      eyebrow="Revenue"
      metrics={[
        { label: "Active deals", value: "36", change: "12.8%" },
        { label: "Forecast", value: "$96k", change: "9.1%" },
        { label: "Won this month", value: "14", change: "16.4%" },
        { label: "Average value", value: "$8.2k", change: "4.7%" },
      ]}
      panelDescription="Recently updated opportunities across the team"
      panelTitle="Deal activity"
      rows={[
        { name: "Lumen Works expansion", detail: "Negotiation · Maya Chen", value: "$28,400", status: "Updated today" },
        { name: "Aperture annual plan", detail: "Proposal · Sam Okoro", value: "$42,000", status: "Updated 2h ago" },
        { name: "Northstar rollout", detail: "Discovery · Jamie Park", value: "$31,500", status: "Updated yesterday" },
        { name: "Frame Studio seats", detail: "Qualified · Maya Chen", value: "$19,800", status: "Updated Sep 1" },
      ]}
      title="Deals"
    />
  );
}
