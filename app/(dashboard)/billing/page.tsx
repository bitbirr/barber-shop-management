import { SaaSPage } from "@/components/saas-page";

export default function BillingPage() {
  return (
    <SaaSPage
      eyebrow="Plan and usage"
      title="Billing"
      description="Shop plan, SMS packs, invoices, and Telebirr checkout."
      action="Manage plan"
      metrics={[
        { label: "Current plan", value: "Shop", change: "Monthly" },
        { label: "Monthly spend", value: "1,499 ETB", change: "0.0%" },
        { label: "Seats used", value: "8 / 12", change: "4 open" },
        { label: "Next invoice", value: "Oct 03", change: "30 days" },
      ]}
      panelTitle="Recent invoices"
      panelDescription="Invoices for this Ethiopian shop"
      rows={[
        { name: "Invoice #1048", detail: "September 2026 · Shop monthly", value: "1,499 ETB", status: "Paid" },
        { name: "Invoice #1036", detail: "August 2026 · Shop monthly", value: "1,499 ETB", status: "Paid" },
        { name: "Invoice #1024", detail: "July 2026 · Shop monthly", value: "1,499 ETB", status: "Paid" },
        { name: "Invoice #1012", detail: "June 2026 · Shop monthly", value: "1,499 ETB", status: "Paid" },
      ]}
    />
  );
}
