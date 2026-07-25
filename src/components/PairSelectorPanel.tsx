import { Search, Star, X, Bell, BellPlus, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { PAIRS, type Pair } from "../lib/pairs";

interface PairSelectorPanelProps {
  open: boolean;
  onClose: () => void;
}

// ─── Price Alert Sheet ────────────────────────────────────────────────────────

interface Alert {
  id: number;
  symbol: string;
  direction: "above" | "below";
  price: string;
}

let alertIdCounter = 1;

function PriceAlertSheet({
  pair,
  onClose,
}: {
  pair: Pair;
  onClose: () => void;
}) {
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [targetPrice, setTargetPrice] = useState(pair.price.replace(/,/g, ""));
  const [alerts, setAlerts] = useState<Alert[]>([]);

  function addAlert() {
    if (!targetPrice) return;
    setAlerts((prev) => [
      ...prev,
      { id: alertIdCounter++, symbol: pair.symbol, direction, price: targetPrice },
    ]);
    setTargetPrice(pair.price.replace(/,/g, ""));
  }

  function removeAlert(id: number) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 1 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet — hamburger texture */}
      <div
        className="relative bg-trade-card rounded-t-3xl shadow-2xl overflow-hidden"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-[4px] w-9 rounded-full bg-trade-text/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <div>
            <p className="text-[11px] text-trade-text-muted uppercase tracking-widest font-medium">
              Price Alert
            </p>
            <p className="text-[18px] font-bold text-trade-text leading-tight flex items-center gap-2">
              {pair.symbol}
              <span
                className="text-[11px] font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "rgba(240,185,11,0.12)", color: "#f0b90b" }}
              >
                {pair.lev}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-trade-surface active:opacity-60 transition-opacity"
            aria-label="Close"
          >
            <X className="h-[15px] w-[15px] text-trade-text/70" />
          </button>
        </div>

        {/* Current price pill */}
        <div className="px-5 mb-4">
          <div className="flex items-center gap-2 bg-trade-surface rounded-xl px-4 py-3">
            <span className="text-[12px] text-trade-text-muted">Current price</span>
            <span className="flex-1" />
            <span className="text-[15px] font-semibold text-trade-text">{pair.price}</span>
            <span
              className={`text-[12px] font-medium ${pair.up ? "text-trade-bid" : "text-trade-ask"}`}
            >
              {pair.change}
            </span>
          </div>
        </div>

        {/* Direction toggle */}
        <div className="px-5 mb-4">
          <p className="text-[11px] text-trade-text-muted uppercase tracking-widest font-medium mb-2">
            Alert when price goes
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setDirection("above")}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold transition-all"
              style={{
                backgroundColor: direction === "above" ? "rgba(34,197,94,0.12)" : "var(--color-trade-surface, rgba(128,128,128,0.08))",
                color: direction === "above" ? "#22c55e" : "var(--color-trade-text-muted, gray)",
                border: direction === "above" ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent",
              }}
            >
              <ChevronUp className="h-4 w-4" />
              Above
            </button>
            <button
              onClick={() => setDirection("below")}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold transition-all"
              style={{
                backgroundColor: direction === "below" ? "rgba(239,68,68,0.12)" : "var(--color-trade-surface, rgba(128,128,128,0.08))",
                color: direction === "below" ? "#ef4444" : "var(--color-trade-text-muted, gray)",
                border: direction === "below" ? "1px solid rgba(239,68,68,0.25)" : "1px solid transparent",
              }}
            >
              <ChevronDown className="h-4 w-4" />
              Below
            </button>
          </div>
        </div>

        {/* Target price input */}
        <div className="px-5 mb-5">
          <p className="text-[11px] text-trade-text-muted uppercase tracking-widest font-medium mb-2">
            Target price (USDT)
          </p>
          <div className="flex items-center gap-2 rounded-xl bg-trade-surface border border-trade-text/10 px-4 py-3">
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="flex-1 bg-transparent text-trade-text outline-none text-[16px] font-semibold"
              placeholder="0.00"
              inputMode="decimal"
            />
            <span className="text-[12px] text-trade-text-muted font-medium">USDT</span>
          </div>
        </div>

        {/* Set Alert button */}
        <div className="px-5 mb-4">
          <button
            onClick={addAlert}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-bold transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#f0b90b", color: "#000" }}
          >
            <BellPlus className="h-4 w-4" />
            Set Alert
          </button>
        </div>

        {/* Active alerts */}
        {alerts.length > 0 && (
          <div className="px-5">
            <p className="text-[11px] text-trade-text-muted uppercase tracking-widest font-medium mb-2">
              Active alerts
            </p>
            <div className="divide-y divide-trade-text/5">
              {alerts.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-3">
                  <Bell className="h-4 w-4 text-trade-text/40 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-trade-text">
                      {a.symbol}
                    </p>
                    <p className="text-[11px] text-trade-text-muted">
                      {a.direction === "above" ? "↑ Above" : "↓ Below"} {Number(a.price).toLocaleString()} USDT
                    </p>
                  </div>
                  <button
                    onClick={() => removeAlert(a.id)}
                    className="h-7 w-7 flex items-center justify-center rounded-full bg-trade-surface active:opacity-60 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-trade-text/50" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pair Row ─────────────────────────────────────────────────────────────────

function PairRow({
  p,
  onSelect,
  onLongPress,
}: {
  p: Pair;
  onSelect: () => void;
  onLongPress: (pair: Pair) => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pressing, setPressing] = useState(false);

  function startPress() {
    setPressing(true);
    timerRef.current = setTimeout(() => {
      setPressing(false);
      onLongPress(p);
    }, 2000);
  }

  function cancelPress() {
    setPressing(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  return (
    <div
      className="relative w-full flex items-center px-4 py-3 border-b border-trade-text/5 select-none overflow-hidden"
      style={{ cursor: "pointer" }}
      onPointerDown={startPress}
      onPointerUp={() => {
        // Only fire onClick if we haven't hit the long-press threshold
        if (timerRef.current) {
          cancelPress();
          onSelect();
        }
      }}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
    >
      {/* Long-press fill progress */}
      {pressing && (
        <span
          className="absolute inset-0 origin-left bg-trade-text/8 animate-none"
          style={{
            animation: "lp-fill 2s linear forwards",
          }}
        />
      )}

      {/* Star */}
      <Star className="h-4 w-4 text-trade-text/25 mr-3 flex-shrink-0 relative z-10" />
      {/* Icon */}
      <div
        className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mr-2.5 relative z-10"
        style={{ backgroundColor: p.color }}
      >
        {p.base.slice(0, 2)}
      </div>
      {/* Symbol + lev */}
      <div className="flex flex-col items-start min-w-0 flex-1 relative z-10">
        <span className="text-[13px] font-semibold text-trade-text leading-tight">
          {p.symbol}
        </span>
        <span className="text-[10px] text-trade-text-muted bg-trade-surface rounded px-1 mt-0.5">
          {p.lev}
        </span>
      </div>
      {/* Vol / OI */}
      <div className="flex flex-col items-end mr-4 text-right relative z-10">
        <span className="text-[12px] text-trade-text">{p.vol}</span>
        <span className="text-[11px] text-trade-text-muted">{p.oi}</span>
      </div>
      {/* Price / change */}
      <div className="flex flex-col items-end text-right w-[70px] relative z-10">
        <span className="text-[12px] text-trade-text">{p.price}</span>
        <span
          className={`text-[11px] font-medium ${p.up ? "text-trade-bid" : "text-trade-ask"}`}
        >
          {p.change}
        </span>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function PairSelectorPanel({ open, onClose }: PairSelectorPanelProps) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Futures");
  const [sub, setSub] = useState("All markets");
  const [alertPair, setAlertPair] = useState<Pair | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-trade-card rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="h-[4px] w-9 rounded-full bg-trade-text/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-2 pb-3 flex-shrink-0">
          <span className="text-[11px] font-semibold tracking-widest text-trade-text-muted uppercase">
            Select Market
          </span>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-trade-surface active:opacity-60 transition-opacity"
            aria-label="Close"
          >
            <X className="h-[15px] w-[15px] text-trade-text/70" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-xl bg-trade-surface border border-trade-text/8 px-3 py-2.5">
            <Search className="h-4 w-4 text-trade-text/40 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent text-trade-text placeholder:text-trade-text/30 outline-none"
              style={{ fontSize: "16px" }}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-5 px-4 border-b border-trade-text/8">
          {["Favorites", "Futures", "Spot", "Prediction"].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`pb-2.5 text-[14px] font-medium border-b-2 transition-colors ${
                cat === c
                  ? "border-trade-text text-trade-text"
                  : "border-transparent text-trade-text-muted"
              }`}
            >
              {c}
              {c === "Prediction" && (
                <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-trade-ask align-middle" />
              )}
            </button>
          ))}
        </div>

        {/* Sub-category tabs */}
        <div className="flex items-center justify-between px-4 py-2.5">
          {["All markets", "Top", "New", "Meme", "AI", "Pre-launch", "Stocks"].map((s) => (
            <button
              key={s}
              onClick={() => setSub(s)}
              className={`flex-shrink-0 text-[13px] font-medium transition-colors ${
                sub === s ? "text-[#f0b90b]" : "text-trade-text-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Column headers */}
        <div className="flex items-end justify-between px-4 pb-2 pt-1">
          <span className="text-[11px] text-trade-text-muted">Symbols</span>
          <div className="flex flex-col items-end text-right">
            <span className="text-[11px] text-trade-text-muted">Volume</span>
            <span className="text-[11px] text-trade-text-muted">Open interest</span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-[11px] text-trade-text-muted">Price</span>
            <span className="text-[11px] text-trade-text-muted">24h change</span>
          </div>
        </div>

        {/* Pairs list */}
        <div className="flex-1 overflow-y-auto">
          {/* Hold-to-alert hint */}
          <div className="flex items-center gap-1.5 px-4 py-2 bg-trade-surface/50 border-b border-trade-text/5">
            <Bell className="h-3 w-3 text-trade-text/30 flex-shrink-0" />
            <span className="text-[11px] text-trade-text/30">Hold a pair for 2 seconds to set a price alert</span>
          </div>

          {PAIRS.filter(
            (p) =>
              search === "" || p.symbol.toLowerCase().includes(search.toLowerCase()),
          ).map((p) => (
            <PairRow
              key={p.symbol}
              p={p}
              onSelect={onClose}
              onLongPress={(pair) => setAlertPair(pair)}
            />
          ))}
        </div>

        {/* Price alert sheet — slides up over the pair list */}
        {alertPair && (
          <PriceAlertSheet
            pair={alertPair}
            onClose={() => setAlertPair(null)}
          />
        )}
      </div>

      {/* Long-press fill keyframe */}
      <style>{`
        @keyframes lp-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
