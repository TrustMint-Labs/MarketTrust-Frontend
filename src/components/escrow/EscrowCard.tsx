"use client";

import { ArrowUpRight, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatXLM, formatDate, truncateAddress, isDeadlinePassed } from "@/lib/utils";
import type { Escrow } from "@/types/escrow";

interface EscrowCardProps {
  escrow: Escrow;
  walletAddress: string;
  onAction: (escrow: Escrow, action: "release" | "refund" | "dispute" | "resolve") => void;
}

export function EscrowCard({ escrow, walletAddress, onAction }: EscrowCardProps) {
  const isBuyer = escrow.buyer === walletAddress;
  const isArbiter = escrow.arbiter === walletAddress;
  const deadlinePassed = isDeadlinePassed(escrow.deadline);
  const counterparty = isBuyer ? escrow.seller : escrow.buyer;
  const counterpartyLabel = isBuyer ? "Seller" : "Buyer";

  return (
    <Card className="hover:border-border/80 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-secondary">#{escrow.id.slice(0, 8)}</span>
            <Badge status={escrow.status} />
          </div>
          <p className="text-xl font-semibold text-text-primary mt-1">{formatXLM(escrow.amount)}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <User size={11} />
              {counterpartyLabel}: {truncateAddress(counterparty)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDate(escrow.deadline)}
              {deadlinePassed && <span className="text-danger ml-1">(expired)</span>}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0">
          {escrow.status === "active" && isBuyer && (
            <>
              <Button size="sm" onClick={() => onAction(escrow, "release")}>
                Release <ArrowUpRight size={13} />
              </Button>
              {deadlinePassed && (
                <Button size="sm" variant="secondary" onClick={() => onAction(escrow, "refund")}>
                  Refund
                </Button>
              )}
              <Button size="sm" variant="danger" onClick={() => onAction(escrow, "dispute")}>
                Dispute
              </Button>
            </>
          )}
          {escrow.status === "disputed" && isArbiter && (
            <Button size="sm" variant="secondary" onClick={() => onAction(escrow, "resolve")}>
              Resolve
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
