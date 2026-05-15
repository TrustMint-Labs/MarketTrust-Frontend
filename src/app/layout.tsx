import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { WalletProvider } from "@/context/WalletContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketTrust — Stellar Escrow",
  description: "Trustless escrow protocol on Stellar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                fontSize: "13px",
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}
