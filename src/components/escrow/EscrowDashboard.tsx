"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EscrowCard } from "./EscrowCard";
import { EscrowActionModal } from "./EscrowActionModal";
import { useEscrows } from "@/hooks/useEscrows";
import { useWallet } from "@/context/WalletContext";
import type { Escrow } from "@/types/escrow";

type ActionType = "release" | "refund" | "dispute" | "resolve";

export function EscrowDashboard() {
  const { address } = useWallet();
  const { escrows, loading, error, refetch } = useEscrows(address);
  const [selected, setSelected] = useState<{ escrow: Escrow; action: ActionType } | null>(null);

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle size={40} className="text-text-secondary mb-4" />
        <h2 className="text-lg font-semibold text-text-primary mb-2">Wallet not connected</h2>
        <p className="text-sm text-text-secondary">Connect your Freighter wallet to view escrows.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Escrows</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {escrows.length} escrow{escrows.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
          <Link href="/escrow/new">
            <Button size="sm">
              <Plus size={14} /> New Escrow
            </Button>
          </Link>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-text-secondary gap-2">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading escrows…</span>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {!loading && !error && escrows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-text-secondary text-sm mb-4">No escrows yet.</p>
          <Link href="/escrow/new">
            <Button size="sm">
              <Plus size={14} /> Create your first escrow
            </Button>
          </Link>
        </div>
      )}

      {!loading && escrows.length > 0 && (
        <div className="flex flex-col gap-3">
          {escrows.map((e) => (
            <EscrowCard
              key={e.id}
              escrow={e}
              walletAddress={address}
              onAction={(escrow, action) => setSelected({ escrow, action })}
            />
          ))}
        </div>
      )}

      {selected && (
        <EscrowActionModal
          escrow={selected.escrow}
          action={selected.action}
          onClose={() => setSelected(null)}
          onSuccess={() => { setSelected(null); refetch(); }}
        />
      )}
    </div>
  );
}
