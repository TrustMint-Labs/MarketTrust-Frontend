"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TxStatus } from "@/components/ui/TxStatus";
import { useTx } from "@/hooks/useTx";
import { api } from "@/lib/api";
import { formatXLM } from "@/lib/utils";
import type { Escrow } from "@/types/escrow";

type ActionType = "release" | "refund" | "dispute" | "resolve";

interface Props {
  escrow: Escrow;
  action: ActionType;
  onClose: () => void;
  onSuccess: () => void;
}

const ACTION_META: Record<ActionType, { title: string; description: string; cta: string; variant: "primary" | "danger" | "secondary" }> = {
  release: {
    title: "Release Funds",
    description: "Release the escrowed funds to the seller. This action is irreversible.",
    cta: "Release Funds",
    variant: "primary",
  },
  refund: {
    title: "Request Refund",
    description: "The deadline has passed. Reclaim your funds from escrow.",
    cta: "Claim Refund",
    variant: "secondary",
  },
  dispute: {
    title: "Raise Dispute",
    description: "Escalate this escrow to the arbiter for resolution.",
    cta: "Raise Dispute",
    variant: "danger",
  },
  resolve: {
    title: "Resolve Dispute",
    description: "As arbiter, decide who receives the escrowed funds.",
    cta: "Confirm Resolution",
    variant: "primary",
  },
};

export function EscrowActionModal({ escrow, action, onClose, onSuccess }: Props) {
  const { tx, execute } = useTx();
  const meta = ACTION_META[action];
  const [disputeReason, setDisputeReason] = useState("");
  const [winner, setWinner] = useState<"buyer" | "seller">("seller");

  const handleConfirm = async () => {
    await execute(
      () =>
        api.escrowAction({
          escrowId: escrow.id,
          action,
          ...(action === "dispute" && { reason: disputeReason }),
          ...(action === "resolve" && { winner }),
        }).then((r) => r.txXdr),
      onSuccess
    );
  };

  return (
    <Modal open title={meta.title} onClose={onClose}>
      <p className="text-sm text-text-secondary mb-4">{meta.description}</p>

      {/* Escrow summary */}
      <div className="rounded-lg border border-border bg-surface-2 p-3 mb-4 text-sm">
        <div className="flex justify-between text-text-secondary mb-1">
          <span>Escrow ID</span>
          <span className="font-mono text-text-primary">#{escrow.id.slice(0, 12)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Amount</span>
          <span className="font-semibold text-text-primary">{formatXLM(escrow.amount)}</span>
        </div>
      </div>

      {/* Dispute reason */}
      {action === "dispute" && (
        <div className="mb-4">
          <Input
            label="Reason (optional)"
            placeholder="Describe the issue…"
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
          />
        </div>
      )}

      {/* Arbiter resolve: pick winner */}
      {action === "resolve" && (
        <div className="mb-4 flex gap-2">
          {(["buyer", "seller"] as const).map((party) => (
            <button
              key={party}
              onClick={() => setWinner(party)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition-colors ${
                winner === party
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface-2 text-text-secondary hover:text-text-primary"
              }`}
            >
              {party}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={tx.status === "pending"}>
          Cancel
        </Button>
        <Button
          variant={meta.variant}
          size="sm"
          loading={tx.status === "pending"}
          onClick={handleConfirm}
        >
          {meta.cta}
        </Button>
      </div>

      <TxStatus tx={tx} />
    </Modal>
  );
}
