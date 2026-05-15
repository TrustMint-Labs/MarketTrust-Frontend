"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getAddress,
  isConnected,
  requestAccess,
} from "@stellar/freighter-api";

interface WalletContextValue {
  address: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue>({
  address: null,
  connecting: false,
  connect: async () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      const { isConnected: connected } = await isConnected();
      if (!connected) return;
      const res = await getAddress();
      if (res.address && !res.error) setAddress(res.address);
    })();
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const res = await requestAccess();
      if (res.error) throw new Error(res.error.message);
      setAddress(res.address);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => setAddress(null), []);

  return (
    <WalletContext.Provider value={{ address, connecting, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
