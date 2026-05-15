import Link from "next/link";
import { Shield, ArrowRight, Lock, Zap, Scale } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";

const FEATURES = [
  { icon: Lock, title: "Trustless", desc: "Funds locked on-chain. No intermediary holds your money." },
  { icon: Zap, title: "Instant Settlement", desc: "Release funds in seconds on the Stellar network." },
  { icon: Scale, title: "Dispute Resolution", desc: "Arbiter-based resolution for contested transactions." },
];

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center text-center py-20 gap-6">
        <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
          <Shield size={12} /> Stellar Testnet
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary max-w-2xl leading-tight">
          Trustless escrow for the{" "}
          <span className="text-accent">Stellar</span> ecosystem
        </h1>
        <p className="text-text-secondary max-w-md text-base">
          Create, manage, and resolve escrow agreements on-chain. No trust required.
        </p>
        <div className="flex gap-3">
          <Link href="/escrow/new">
            <Button size="lg">
              Create Escrow <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <Icon size={18} className="text-accent" />
            </div>
            <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
            <p className="text-sm text-text-secondary">{desc}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
