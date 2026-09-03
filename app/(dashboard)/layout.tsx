import { DashboardShell } from "@/components/dashboard-shell";

export default function SaaSLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
