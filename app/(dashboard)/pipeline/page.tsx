import { SaaSPage } from "@/components/saas-page";

export default function PipelinePage() {
  return (
    <SaaSPage
      action="Add opportunity"
      description="Track every opportunity from first conversation to closed deal."
      eyebrow="Sales workspace"
      metrics={[
        { label: "Open pipeline", value: "$184k", change: "14.2%" },
        { label: "Qualified leads", value: "48", change: "8.6%" },
        { label: "Win rate", value: "31%", change: "3.4%" },
        { label: "Average cycle", value: "24d", change: "5.1%" },
      ]}
      panelDescription="Opportunities that need attention this week"
      panelTitle="Priority pipeline"
      rows={[
        { name: "Aperture Labs", detail: "Proposal · closes Sep 12", value: "$42,000", status: "72% likely" },
        { name: "Northstar Health", detail: "Discovery · closes Sep 18", value: "$31,500", status: "58% likely" },
        { name: "Lumen Works", detail: "Negotiation · closes Sep 21", value: "$28,400", status: "81% likely" },
        { name: "Frame Studio", detail: "Qualified · closes Oct 02", value: "$19,800", status: "46% likely" },
      ]}
      title="Sales pipeline"
    />
  );
}
