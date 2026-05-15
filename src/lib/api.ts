import { API_BASE_URL } from "./constants";
import type { CreateEscrowParams, Escrow, EscrowAction } from "@/types/escrow";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Request failed");
  }
  return res.json();
}

export const api = {
  getEscrows: (wallet: string) =>
    request<Escrow[]>(`/escrows?wallet=${wallet}`),

  getEscrow: (id: string) =>
    request<Escrow>(`/escrows/${id}`),

  createEscrow: (params: CreateEscrowParams) =>
    request<{ txXdr: string }>("/escrows", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  escrowAction: (params: EscrowAction) =>
    request<{ txXdr: string }>("/escrows/action", {
      method: "POST",
      body: JSON.stringify(params),
    }),
};
