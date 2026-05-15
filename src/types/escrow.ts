export type EscrowStatus =
  | "pending"
  | "active"
  | "released"
  | "refunded"
  | "disputed"
  | "resolved";

export interface Escrow {
  id: string;
  buyer: string;
  seller: string;
  arbiter: string;
  amount: string; // in XLM stroops as string
  deadline: number; // unix timestamp
  status: EscrowStatus;
  createdAt: number;
  disputeReason?: string;
}

export interface CreateEscrowParams {
  seller: string;
  arbiter: string;
  amount: string;
  deadline: number;
}

export interface EscrowAction {
  escrowId: string;
  action: "release" | "refund" | "dispute" | "resolve";
  winner?: "buyer" | "seller"; // for resolve
  reason?: string; // for dispute
}

export type TxStatus = "idle" | "pending" | "success" | "error";

export interface TxState {
  status: TxStatus;
  hash?: string;
  error?: string;
}
