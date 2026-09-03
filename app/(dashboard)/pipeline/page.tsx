import { SaaSPage } from "@/components/saas-page";

export default function PipelinePage() {
  return (
    <SaaSPage
      action="Add lead"
      description="Track every shop from first WhatsApp to signed pack."
      eyebrow="Growth"
      metrics={[
        { label: "Open pipeline", value: "2.8M ETB", change: "14.2%" },
        { label: "Qualified shops", value: "48", change: "8.6%" },
        { label: "Win rate", value: "31%", change: "3.4%" },
        { label: "Average cycle", value: "24d", change: "5.1%" },
      ]}
      panelDescription="Shops that need a call this week"
      panelTitle="Priority pipeline"
      rows={[
        { name: "Bole Fade House 2", detail: "Proposal · closes Sep 12", value: "42,000 ETB", status: "72% likely" },
        { name: "Piassa Lineup", detail: "Discovery · closes Sep 18", value: "31,500 ETB", status: "58% likely" },
        { name: "Merkato Kings", detail: "Negotiation · closes Sep 21", value: "28,400 ETB", status: "81% likely" },
        { name: "Hawassa Clip", detail: "Qualified · closes Oct 02", value: "19,800 ETB", status: "46% likely" },
      ]}
      title="Shop pipeline"
    />
  );
}
