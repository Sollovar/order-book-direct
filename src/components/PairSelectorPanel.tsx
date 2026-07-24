import { Search, Star, X } from "lucide-react";
import { useState } from "react";
import { PAIRS } from "../lib/pairs";

interface PairSelectorPanelProps {
  open: boolean;
  onClose: () => void;
}

export function PairSelectorPanel({ open, onClose }: PairSelectorPanelProps) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Futures");
  const [sub, setSub] = useState("All markets");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-trade-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <span className="text-[11px] font-semibold tracking-widest text-trade-text-muted uppercase">
          Select Market
        </span>
        <button onClick={onClose} className="p-1 text-trade-text/60 active:opacity-50">
          <X className="h-5 w-5" />
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
        {PAIRS.filter(
          (p) =>
            search === "" || p.symbol.toLowerCase().includes(search.toLowerCase()),
        ).map((p) => (
          <button
            key={p.symbol}
            onClick={onClose}
            className="w-full flex items-center px-4 py-3 border-b border-trade-text/5 active:bg-trade-surface transition-colors"
          >
            {/* Star */}
            <Star className="h-4 w-4 text-trade-text/25 mr-3 flex-shrink-0" />
            {/* Icon */}
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mr-2.5"
              style={{ backgroundColor: p.color }}
            >
              {p.base.slice(0, 2)}
            </div>
            {/* Symbol + lev */}
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-[13px] font-semibold text-trade-text leading-tight">
                {p.symbol}
              </span>
              <span className="text-[10px] text-trade-text-muted bg-trade-surface rounded px-1 mt-0.5">
                {p.lev}
              </span>
            </div>
            {/* Vol / OI */}
            <div className="flex flex-col items-end mr-4 text-right">
              <span className="text-[12px] text-trade-text">{p.vol}</span>
              <span className="text-[11px] text-trade-text-muted">{p.oi}</span>
            </div>
            {/* Price / change */}
            <div className="flex flex-col items-end text-right w-[70px]">
              <span className="text-[12px] text-trade-text">{p.price}</span>
              <span
                className={`text-[11px] font-medium ${
                  p.up ? "text-trade-bid" : "text-trade-ask"
                }`}
              >
                {p.change}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
