import { AppShell } from "@/components/layout/AppShell";
import { EscrowDashboard } from "@/components/escrow/EscrowDashboard";

export default function DashboardPage() {
  return (
    <AppShell>
      <EscrowDashboard />
    </AppShell>
  );
}
