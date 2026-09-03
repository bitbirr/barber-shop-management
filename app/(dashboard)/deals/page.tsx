import { SaaSPage } from "@/components/saas-page";

export default function DealsPage() {
  return (
    <SaaSPage
      action="Add pack"
      description="Membership packs, chair rentals, and forecasted till."
      eyebrow="Packs"
      metrics={[
        { label: "Open packs", value: "36", change: "12.8%" },
        { label: "Forecast", value: "1.4M ETB", change: "9.1%" },
        { label: "Won this month", value: "14", change: "16.4%" },
        { label: "Average pack", value: "12,400 ETB", change: "4.7%" },
      ]}
      panelDescription="Recently updated shop packs"
      panelTitle="Pack activity"
      rows={[
        { name: "Bole monthly fade club", detail: "Negotiation · Meklit Assefa", value: "28,400 ETB", status: "Updated today" },
        { name: "Piassa Saturday block", detail: "Proposal · Kidus Bekele", value: "42,000 ETB", status: "Updated 2h ago" },
        { name: "Merkato chair rental", detail: "Discovery · Yonas Haile", value: "31,500 ETB", status: "Updated yesterday" },
        { name: "Hawassa Clip seats", detail: "Qualified · Meklit Assefa", value: "19,800 ETB", status: "Updated Sep 1" },
      ]}
      title="Memberships and packs"
    />
  );
}
