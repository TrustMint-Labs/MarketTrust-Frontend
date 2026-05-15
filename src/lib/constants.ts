export const NETWORK = "TESTNET" as const;
export const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  released: "Released",
  refunded: "Refunded",
  disputed: "Disputed",
  resolved: "Resolved",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  active: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  released: "text-green-400 bg-green-400/10 border-green-400/20",
  refunded: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  disputed: "text-red-400 bg-red-400/10 border-red-400/20",
  resolved: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};
