import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";
import type { TxState } from "@/types/escrow";

const HORIZON_TX = "https://stellar.expert/explorer/testnet/tx/";

export function TxStatus({ tx }: { tx: TxState }) {
  if (tx.status === "idle") return null;

  return (
    <div className="mt-4 rounded-lg border border-border bg-surface-2 p-3 text-sm">
      {tx.status === "pending" && (
        <div className="flex items-center gap-2 text-text-secondary">
          <Loader2 size={14} className="animate-spin" />
          Processing transaction…
        </div>
      )}
      {tx.status === "success" && (
        <div className="flex items-center gap-2 text-success">
          <CheckCircle size={14} />
          <span>Confirmed!</span>
          {tx.hash && (
            <a
              href={`${HORIZON_TX}${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
            >
              View <ExternalLink size={11} />
            </a>
          )}
        </div>
      )}
      {tx.status === "error" && (
        <div className="flex items-center gap-2 text-danger">
          <XCircle size={14} />
          {tx.error ?? "Transaction failed"}
        </div>
      )}
    </div>
  );
}
