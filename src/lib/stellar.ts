import { signTransaction } from "@stellar/freighter-api";
import { Horizon, Transaction } from "@stellar/stellar-sdk";
import { HORIZON_URL, NETWORK_PASSPHRASE } from "./constants";

const server = new Horizon.Server(HORIZON_URL);

export async function signAndSubmit(txXdr: string): Promise<string> {
  const { signedTxXdr, error } = await signTransaction(txXdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  if (error) throw new Error(error.message);

  const tx = new Transaction(signedTxXdr, NETWORK_PASSPHRASE);
  const result = await server.submitTransaction(tx);
  return result.hash;
}
