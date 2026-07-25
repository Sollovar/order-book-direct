import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Wallet, Copy, LogOut, Check, X } from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────────── */

function truncate(addr: string) {
  if (!addr) return "";
  if (addr.startsWith("0x")) return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

/* ─── Wallet detail sheet (hamburger texture) ─────────────────── */

function WalletSheet({
  address,
  onClose,
  onDisconnect,
}: {
  address: string | null;
  onClose: () => void;
  onDisconnect: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    if (!address) return;
    navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="fixed inset-0 flex flex-col justify-end" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet — same texture as hamburger menu */}
      <div
        className="relative bg-trade-card rounded-t-3xl shadow-2xl overflow-y-auto max-h-[70vh]"
        style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-[4px] w-9 rounded-full bg-trade-text/20" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-trade-surface active:opacity-60 transition-opacity"
          aria-label="Close"
        >
          <X className="h-[15px] w-[15px] text-trade-text/70" />
        </button>

        <div className="px-5 pt-3 pb-4">
          {/* Title */}
          <div className="flex items-center gap-2.5 mb-5">
            <span className="h-2 w-2 rounded-full bg-[#22c55e] flex-shrink-0" />
            <span className="text-[18px] font-bold text-trade-text">Connected</span>
          </div>

          {/* Address card */}
          <p className="text-[12px] text-trade-text-muted font-medium mb-3">Wallet Address</p>
          <div
            className="rounded-2xl px-4 py-3.5 mb-5 flex items-start justify-between gap-3"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-[13px] font-mono font-semibold text-trade-text break-all leading-relaxed">
              {address ?? "No address"}
            </p>
            <button
              onClick={copy}
              className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-trade-surface active:opacity-60 transition-opacity mt-0.5"
              aria-label="Copy address"
            >
              {copied
                ? <Check className="h-3.5 w-3.5 text-[#22c55e]" />
                : <Copy className="h-3.5 w-3.5 text-trade-text/50" />}
            </button>
          </div>

          <div className="border-t border-trade-text/8 mb-5" />

          {/* Disconnect */}
          <button
            onClick={onDisconnect}
            className="w-full py-3.5 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 active:opacity-70 transition-opacity"
            style={{ background: "rgba(220,38,38,0.12)", color: "#f87171" }}
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────── */

interface WalletButtonProps {
  /** Renders full-width inside the order form */
  fullWidth?: boolean;
}

export function WalletButton({ fullWidth = false }: WalletButtonProps) {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [sheetOpen, setSheetOpen] = useState(false);

  // useWallets returns all wallet types (EVM + Solana); pick the first available
  const address = wallets[0]?.address ?? null;

  /* ── Not ready (Privy loading) ── */
  if (!ready) {
    if (fullWidth) {
      return (
        <button
          disabled
          className="w-full rounded-full bg-trade-surface py-2.5 text-[14px] font-bold mt-1 flex items-center justify-center gap-2 opacity-40"
        >
          <Wallet className="h-4 w-4" />
          Loading…
        </button>
      );
    }
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-full bg-trade-surface pl-2.5 pr-3.5 py-1.5 text-[13px] font-bold opacity-40"
      >
        <Wallet className="h-3.5 w-3.5" />
        Connect
      </button>
    );
  }

  /* ── Not authenticated ── */
  if (!authenticated) {
    if (fullWidth) {
      return (
        <button
          onClick={login}
          className="w-full rounded-full bg-[#f0b90b] text-[#1a1200] py-2.5 text-[14px] font-bold mt-1 flex items-center justify-center gap-2 active:brightness-90 transition-all"
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </button>
      );
    }
    return (
      <button
        onClick={login}
        className="flex items-center gap-1.5 rounded-full bg-[#f0b90b] text-[#1a1200] pl-2.5 pr-3.5 py-1.5 text-[13px] font-bold active:brightness-90 transition-all shadow-sm"
      >
        <Wallet className="h-3.5 w-3.5" />
        Connect
      </button>
    );
  }

  /* ── Authenticated ── */
  if (fullWidth) {
    return (
      <button className="w-full rounded-full bg-[#f0b90b] text-[#1a1200] py-2.5 text-[14px] font-bold mt-1 flex items-center justify-center gap-2 active:brightness-90 transition-all">
        Place Order
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setSheetOpen(true)}
        className="flex items-center gap-1.5 rounded-full bg-trade-surface border border-[#f0b90b]/30 pl-2.5 pr-3 py-1.5 text-[13px] font-semibold text-trade-text active:opacity-70 transition-all"
      >
        <span className="h-2 w-2 rounded-full bg-[#22c55e] flex-shrink-0" />
        {truncate(address ?? "Connected")}
      </button>

      {sheetOpen && (
        <WalletSheet
          address={address}
          onClose={() => setSheetOpen(false)}
          onDisconnect={() => { logout(); setSheetOpen(false); }}
        />
      )}
    </>
  );
}
