import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import type { TxState } from "@/types/escrow";
import { signAndSubmit } from "@/lib/stellar";

export function useTx() {
  const [tx, setTx] = useState<TxState>({ status: "idle" });

  const execute = useCallback(
    async (getXdr: () => Promise<string>, onSuccess?: (hash: string) => void) => {
      setTx({ status: "pending" });
      const toastId = toast.loading("Waiting for signature…");
      try {
        const xdr = await getXdr();
        toast.loading("Submitting transaction…", { id: toastId });
        const hash = await signAndSubmit(xdr);
        setTx({ status: "success", hash });
        toast.success("Transaction confirmed!", { id: toastId });
        onSuccess?.(hash);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Transaction failed";
        setTx({ status: "error", error: message });
        toast.error(message, { id: toastId });
      }
    },
    []
  );

  const reset = useCallback(() => setTx({ status: "idle" }), []);

  return { tx, execute, reset };
}
