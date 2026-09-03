import { SaaSPage } from "@/components/saas-page";

export default function SettingsPage() {
  return (
    <SaaSPage
      eyebrow="Shop"
      title="Settings"
      description="Floor profile, barber access, SMS alerts, and security. Timezone Africa/Addis_Ababa."
      action="Invite barber"
      metrics={[
        { label: "Active barbers", value: "8", change: "2 new" },
        { label: "Locations", value: "2", change: "1 planned" },
        { label: "Automations", value: "6", change: "2 active" },
        { label: "Security score", value: "92%", change: "4.0%" },
      ]}
      panelTitle="Shop configuration"
      panelDescription="Review key settings and ownership"
      rows={[
        { name: "Shop profile", detail: "Branding, Bole address, Addis time", value: "Complete", status: "Up to date" },
        { name: "Team permissions", detail: "4 roles · 8 barbers", value: "Review", status: "2 changes" },
        { name: "Notifications", detail: "SMS and booking alerts", value: "6 rules", status: "Active" },
        { name: "Security", detail: "MFA and session policies", value: "Strong", status: "92% score" },
      ]}
    />
  );
}
