"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, ChevronDown, LogOut, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/Button";
import { truncateAddress } from "@/lib/utils";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/escrow/new", label: "New Escrow" },
];

export function Navbar() {
  const { address, connecting, connect, disconnect } = useWallet();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-text-primary">
          <Shield size={18} className="text-accent" />
          <span>MarketTrust</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                pathname === href
                  ? "text-text-primary bg-surface-2"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Wallet */}
        {address ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-text-primary hover:bg-border transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-success" />
              {truncateAddress(address)}
              <ChevronDown size={14} className="text-text-secondary" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 w-52 rounded-xl border border-border bg-surface p-1 shadow-xl">
                  <button
                    onClick={copyAddress}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
                  >
                    {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy address"}
                  </button>
                  <button
                    onClick={() => { disconnect(); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut size={14} />
                    Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Button size="sm" loading={connecting} onClick={connect}>
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
