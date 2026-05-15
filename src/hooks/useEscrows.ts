import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Escrow } from "@/types/escrow";

export function useEscrows(wallet: string | null) {
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEscrows(wallet);
      setEscrows(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load escrows");
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  useEffect(() => { fetch(); }, [fetch]);

  return { escrows, loading, error, refetch: fetch };
}
