import { AppShell } from "@/components/layout/AppShell";
import { CreateEscrowForm } from "@/components/escrow/CreateEscrowForm";

export default function NewEscrowPage() {
  return (
    <AppShell>
      <CreateEscrowForm />
    </AppShell>
  );
}
