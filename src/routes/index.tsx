import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Menu,
  Plus,
  FileText,
  Search,
  Link2,
  Sun,
  Moon,
  BarChart2,
  UserCircle,
  Wallet,
  X,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BTCUSDT Perp — Order Book | AsterDex" },
      {
        name: "description",
        content:
          "Trade BTCUSDT perpetual futures with a real-time order book, limit orders, and leverage up to 20x.",
      },
      { property: "og:title", content: "BTCUSDT Perp — Order Book | AsterDex" },
      {
        property: "og:description",
        content:
          "Trade BTCUSDT perpetual futures with a real-time order book, limit orders, and leverage up to 20x.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Row = { price: string; size: string; pct: number };

const asks: Row[] = [
  { price: "66,008.3", size: "249.97K", pct: 78 },
  { price: "66,008.2", size: "96.30K", pct: 32 },
  { price: "66,007.7", size: "24.95K", pct: 12 },
  { price: "66,007.6", size: "24.95K", pct: 12 },
  { price: "66,007.5", size: "231.29K", pct: 72 },
];

const bids: Row[] = [
  { price: "66,007.4", size: "25.34K", pct: 14 },
  { price: "66,004.3", size: "12.07K", pct: 8 },
  { price: "66,003.0", size: "392.38K", pct: 96 },
  { price: "66,002.9", size: "14.45K", pct: 10 },
  { price: "66,002.3", size: "170.87K", pct: 55 },
];

type Pair = { symbol: string; base: string; lev: string; vol: string; oi: string; price: string; change: string; up: boolean; color: string };
const PAIRS: Pair[] = [
  { symbol: "BTCUSDT",  base: "BTC",  lev: "20x", vol: "$38,291,044", oi: "$2,104,983,221", price: "66,007.4", change: "-0.52%", up: false, color: "#f7931a" },
  { symbol: "ETHUSDT",  base: "ETH",  lev: "20x", vol: "$21,847,203", oi: "$1,341,002,104", price: "3,487.2",  change: "+1.14%", up: true,  color: "#627eea" },
  { symbol: "WLDUSDT",  base: "WLD",  lev: "50x", vol: "$247,066",    oi: "$1,693,667",    price: "0.3850",    change: "-0.47%", up: false, color: "#1a1a2e" },
  { symbol: "FETUSDT",  base: "FET",  lev: "10x", vol: "$15,430",     oi: "$184,540",      price: "0.1532",    change: "-1.42%", up: false, color: "#2d7dd2" },
  { symbol: "SOLUSDT",  base: "SOL",  lev: "20x", vol: "$14,203,991", oi: "$891,234,001",  price: "178.45",    change: "+2.31%", up: true,  color: "#9945ff" },
  { symbol: "SAHARAUSDT",base:"SAH", lev: "5x",  vol: "$3,235",      oi: "$130,043",      price: "0.00874",   change: "-2.02%", up: false, color: "#e8b84b" },
  { symbol: "TAGUSDT",  base: "TAG",  lev: "5x",  vol: "$63,625",     oi: "$138,674",      price: "0.000997",  change: "-6.30%", up: false, color: "#00c896" },
  { symbol: "CUSDT",    base: "C",    lev: "5x",  vol: "$83",         oi: "$13,890",       price: "0.06457",   change: "-0.94%", up: false, color: "#888" },
  { symbol: "OPENUSDT", base: "OPEN", lev: "5x",  vol: "$3,218",      oi: "$433,066",      price: "0.1707",    change: "+4.60%", up: true,  color: "#ff6b35" },
  { symbol: "FLOCKUSDT",base: "FLK",  lev: "5x",  vol: "$5,110",      oi: "$16,060",       price: "0.03158",   change: "-0.63%", up: false, color: "#4a90e2" },
  { symbol: "HOLOUSDT", base: "HOL",  lev: "5x",  vol: "$2,021",      oi: "$25,487",       price: "0.06649",   change: "+0.20%", up: true,  color: "#1db954" },
  { symbol: "RECALLUSDT",base:"REC",  lev: "5x",  vol: "$3,777",      oi: "$24,127",       price: "0.03067",   change: "-4.05%", up: false, color: "#aaa" },
  { symbol: "KITEUSDT", base: "KITE", lev: "5x",  vol: "$6,433",      oi: "$877,955",      price: "0.11364",   change: "-6.97%", up: false, color: "#c0392b" },
  { symbol: "TRUSTUSDT",base: "TRS",  lev: "5x",  vol: "$25,657",     oi: "$80,754",       price: "0.05005",   change: "+2.79%", up: true,  color: "#27ae60" },
];

function Index() {
  const [tab, setTab] = useState("Open Orders");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hasManualOverride, setHasManualOverride] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [navTab, setNavTab] = useState("Trade");
  const [pairsOpen, setPairsOpen] = useState(false);
  const [pairsSearch, setPairsSearch] = useState("");
  const [pairsCat, setPairsCat] = useState("Futures");
  const [pairsSub, setPairsSub] = useState("All markets");
  const [countdown, setCountdown] = useState(39 * 60 + 58); // seconds
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabs = ["Open Orders", "Positions", "Assets", "Predictions"];

  useEffect(() => {
    const saved = localStorage.getItem("asterdex-theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      setHasManualOverride(true);
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(media.matches ? "dark" : "light");

    const listener = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (hasManualOverride) {
      localStorage.setItem("asterdex-theme", theme);
    }
  }, [theme, hasManualOverride]);

  // Keep html/body background in sync so safe-area gaps match the theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.backgroundColor = "oklch(0.1 0 0)";
      document.body.style.backgroundColor = "oklch(0.1 0 0)";
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "oklch(0.98 0 0)";
      document.body.style.backgroundColor = "oklch(0.98 0 0)";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    setHasManualOverride(true);
  };

  // Funding countdown ticker
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((s) => (s > 0 ? s - 1 : 3600));
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const fmtCountdown = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div
      className={`min-h-screen bg-trade-bg text-trade-text font-sans text-[13px] pb-20 ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      {/* Top nav */}
      <header className="flex items-center justify-between px-2 pt-4 pb-3">
        <div className="h-8 w-8 rounded-full border border-trade-text/15 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full border-2 border-trade-text/70 border-t-transparent rotate-45" />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-full border border-trade-text/15 pl-1.5 pr-2 py-1">
            <span className="h-5 w-5 rounded-full bg-[#f0b90b] flex items-center justify-center text-trade-primary-text text-[10px] font-bold">
              ◆
            </span>
            <ChevronDown className="h-3 w-3 text-trade-text/70" />
          </button>
          <button className="rounded-full border border-trade-primary/40 text-trade-primary px-4 py-1.5 text-[13px]">
            Connect
          </button>
          <button className="flex items-center gap-1 rounded-full border border-trade-text/15 px-3 py-1.5 text-trade-text/80">
            Old <span className="text-trade-text/50">⇌</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-trade-text/15"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-trade-text/80" />
            ) : (
              <Moon className="h-4 w-4 text-trade-text/80" />
            )}
          </button>
          <button className="p-1">
            <Menu className="h-5 w-5 text-trade-text/80" />
          </button>
        </div>
      </header>

      {/* Pair header */}
      <div className="mb-1 rounded-xl bg-trade-card border border-trade-text/5 overflow-hidden">
        {/* Top row */}
        <div className="px-3 py-2.5 flex items-center justify-between">
          {/* Left: icon + symbol (tappable → market selector) */}
          <button
            onClick={() => setPairsOpen(true)}
            className="flex items-center gap-2 active:opacity-70 transition-opacity"
          >
            <div className="h-7 w-7 rounded-full bg-[#f7931a] flex items-center justify-center text-white font-bold text-[13px] shadow-sm">
              ₿
            </div>
            <span className="text-trade-text font-semibold text-[15px] tracking-tight">BTC</span>
            <span className="text-[9px] text-trade-text/50 leading-none">▼</span>
          </button>

          {/* Right: price + change + dropdown toggle */}
          <button
            onClick={() => setStatsOpen((o) => !o)}
            className="flex items-center gap-2 active:opacity-70 transition-opacity"
          >
            <span className="text-trade-text font-medium text-[15px]">66,007.4</span>
            <span className="text-trade-ask text-[13px] font-medium">-0.52%</span>
            <span
              className={`text-[9px] text-trade-text/50 leading-none transition-transform duration-200 inline-block ${statsOpen ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>
        </div>

        {/* Expanded stats panel */}
        {statsOpen && (
          <div className="border-t border-trade-text/5 px-3 pt-3 pb-3 grid grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <div className="text-[11px] text-trade-text-muted border-b border-dashed border-trade-text/15 pb-0.5 mb-1">
                Exchange Price
              </div>
              <div className="text-[13px] font-medium">
                <span className="text-trade-text">66,009.1</span>
                <span className="text-trade-ask"> / -0.52%</span>
              </div>
            </div>
            <StatCell
              label="24h Volume"
              value="$2,847,391,204"
            />
            <StatCell
              label="24h High"
              value="67,245.0"
            />
            <StatCell
              label="24h Low"
              value="65,102.3"
            />
          </div>
        )}
      </div>

      {/* Main trading card */}
      <section className="rounded-xl bg-trade-card border border-trade-text/5 p-3">

        <div className="grid grid-cols-2 gap-3 mt-3">
          {/* LEFT: order book */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-trade-text-muted">

              <div>
                Price
                <div>(USDT)</div>
              </div>
              <div className="flex items-center gap-1">
                Size
                <div className="flex items-center gap-1">
                  (USDT) <ChevronDown className="h-3 w-3" />
                </div>
              </div>
            </div>

            {/* Asks */}
            <div className="mt-1 space-y-[3px]">
              {asks.map((r, i) => (
                <BookRow key={i} row={r} side="ask" />
              ))}
            </div>

            {/* Mid price */}
            <div className="my-2 border-y border-dashed border-trade-text/10 py-1.5">
              <div className="text-trade-ask text-[18px] font-medium leading-tight">
                66,007.4
              </div>
              <div className="text-trade-text-muted text-[11px]">$66,008.9</div>
            </div>

            {/* Bids */}
            <div className="space-y-[3px]">
              {bids.map((r, i) => (
                <BookRow key={i} row={r} side="bid" />
              ))}
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="h-2 w-2 rounded-sm bg-trade-bid" />
                <div className="h-2 w-3 bg-trade-text/40 rounded-sm" />
                <div className="h-2 w-2 rounded-sm bg-trade-ask" />
                <div className="h-2 w-3 bg-trade-text/40 rounded-sm" />
              </div>
              <button className="flex items-center gap-1 text-trade-text/70 text-[12px]">
                0.1 <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* RIGHT: order form */}
          <div className="space-y-2">



            <button className="w-full rounded-md bg-trade-surface py-2 flex items-center justify-center gap-1 text-[13px]">
              Limit <span className="text-[8px] leading-none">▼</span>
            </button>

            <div className="rounded-md bg-trade-surface p-2 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-trade-text-muted">Order price</div>
                <div className="text-[14px]">66015.6</div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-trade-text/70 px-1.5">USDT</span>
                <span className="text-trade-text/20">|</span>
                <span className="text-[11px] text-trade-text/70 px-1.5">BBO</span>
              </div>
            </div>

            <div className="rounded-md bg-trade-surface p-2 flex items-center justify-between">
              <div className="text-[12px] text-trade-text/40">Size</div>
              <div className="flex items-center gap-1 text-[12px] text-trade-text/70">
                USDT <ChevronDown className="h-3 w-3" />
              </div>
            </div>

            {/* Slider */}
            <div className="py-2">
              <div className="relative h-[2px] bg-trade-text/10 rounded-full">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-trade-text border border-trade-text/60" />
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-trade-text/30"
                    style={{ left: `${i * 20 + 5}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[12px]">
              <span className="text-trade-text/60">Avbl</span>
              <span className="flex items-center gap-1">
                0.00 USDT
                <span className="h-4 w-4 rounded-full border border-trade-primary/60 text-trade-primary flex items-center justify-center">
                  <Plus className="h-2.5 w-2.5" />
                </span>
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              {["TP/SL", "Hidden Order"].map((l) => (
                <label key={l} className="flex items-center gap-2 text-[12px] text-trade-text/70">
                  <span className="h-3.5 w-3.5 rounded-sm border border-trade-text/30" />
                  <span className="border-b border-dashed border-trade-text/20">{l}</span>
                </label>
              ))}
              <div className="flex items-center justify-between text-[12px] text-trade-text/70">
                <label className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-sm border border-trade-text/30" />
                  <span className="border-b border-dashed border-trade-text/20">Reduce-Only</span>
                </label>
                <span className="flex items-center gap-1">
                  GTC <ChevronDown className="h-3 w-3" />
                </span>
              </div>
            </div>

            <div className="space-y-1 pt-1 text-[12px]">
              <Line label="Est. liq. price" value="-- USDT" />
              <Line label="Margin" value="0.00 USDT" />
              <Line label="Max" value="0.00 USDT" />
            </div>

            <button className="w-full rounded-full bg-[#f0b90b] text-[#1a1200] py-2.5 text-[14px] font-bold mt-1 flex items-center justify-center gap-2">
              <Wallet className="h-4 w-4" />
              Connect
            </button>
          </div>
        </div>
      </section>

      {/* Bottom tabs */}
      <section className="mt-2 rounded-xl bg-trade-card border border-trade-text/5">
        <div className="flex items-center justify-between border-b border-trade-text/5 px-3">
          <div className="flex items-center gap-4 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`py-3 text-[13px] whitespace-nowrap ${
                  tab === t ? "text-trade-text border-b-2 border-trade-text -mb-px" : "text-trade-text-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <FileText className="h-4 w-4 text-trade-text/60" />
        </div>
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <div className="h-14 w-14 rounded-lg bg-trade-surface flex items-center justify-center relative">
            <Link2 className="h-6 w-6 text-trade-text/40" />
            <Search className="h-3.5 w-3.5 text-trade-text/60 absolute bottom-2 right-2" />
          </div>
          <div className="text-trade-text-muted text-[13px]">Please connect a wallet first</div>
        </div>
      </section>

      {/* Market selector panel */}
      {pairsOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-trade-card">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-5 pb-3">
            <span className="text-[11px] font-semibold tracking-widest text-trade-text-muted uppercase">Select Market</span>
            <button onClick={() => setPairsOpen(false)} className="p-1 text-trade-text/60 active:opacity-50">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 rounded-xl bg-trade-card border border-trade-text/8 px-3 py-2.5">
              <Search className="h-4 w-4 text-trade-text/40 flex-shrink-0" />
              <input
                value={pairsSearch}
                onChange={(e) => setPairsSearch(e.target.value)}
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
                onClick={() => setPairsCat(c)}
                className={`pb-2.5 text-[14px] font-medium border-b-2 transition-colors ${
                  pairsCat === c
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
          <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto">
            {["All markets", "Top", "New", "Meme", "AI", "Pre-launch", "Stocks"].map((s) => (
              <button
                key={s}
                onClick={() => setPairsSub(s)}
                className={`flex-shrink-0 rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  pairsSub === s
                    ? "bg-[#f0b90b] text-[#1a1200]"
                    : "bg-trade-surface text-trade-text-muted"
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
            {PAIRS.filter((p) =>
              pairsSearch === "" || p.symbol.toLowerCase().includes(pairsSearch.toLowerCase())
            ).map((p) => (
              <button
                key={p.symbol}
                onClick={() => setPairsOpen(false)}
                className="w-full flex items-center px-4 py-3 border-b border-trade-text/5 active:bg-trade-card transition-colors"
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
                  <span className="text-[13px] font-semibold text-trade-text leading-tight">{p.symbol}</span>
                  <span className="text-[10px] text-trade-text-muted bg-trade-surface rounded px-1 mt-0.5">{p.lev}</span>
                </div>
                {/* Vol / OI */}
                <div className="flex flex-col items-end mr-4 text-right">
                  <span className="text-[12px] text-trade-text">{p.vol}</span>
                  <span className="text-[11px] text-trade-text-muted">{p.oi}</span>
                </div>
                {/* Price / change */}
                <div className="flex flex-col items-end text-right w-[70px]">
                  <span className="text-[12px] text-trade-text">{p.price}</span>
                  <span className={`text-[11px] font-medium ${p.up ? "text-trade-bid" : "text-trade-ask"}`}>{p.change}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav — Hyperliquid style */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-trade-card border-t border-trade-text/5 flex items-center justify-around px-8 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        {[
          {
            label: "Markets",
            icon: (active: boolean) => (
              <BarChart2 className={`h-[18px] w-[18px] ${active ? "text-[#f0b90b]" : "text-trade-text/40"}`} />
            ),
          },
          {
            label: "Trade",
            icon: (active: boolean) => (
              /* Two overlapping circles — Hyperliquid logo mark */
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                <circle cx="6.5" cy="9" r="5.5" fill="currentColor" className={active ? "text-[#f0b90b]" : "text-trade-text/40"} />
                <circle cx="11.5" cy="9" r="5.5" fill="currentColor" fillOpacity="0.65" className={active ? "text-[#f0b90b]" : "text-trade-text/40"} />
              </svg>
            ),
          },
          {
            label: "Account",
            icon: (active: boolean) => (
              <UserCircle className={`h-[18px] w-[18px] ${active ? "text-[#f0b90b]" : "text-trade-text/40"}`} />
            ),
          },
        ].map(({ label, icon }) => {
          const active = navTab === label;
          return (
            <button
              key={label}
              onClick={() => setNavTab(label)}
              className="flex items-center gap-2 transition-opacity active:opacity-60"
            >
              {icon(active)}
              <span className={`text-[14px] font-medium tracking-tight ${active ? "text-[#f0b90b]" : "text-trade-text/40"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}

function BookRow({ row, side }: { row: Row; side: "ask" | "bid" }) {
  const color = side === "ask" ? "text-trade-ask" : "text-trade-bid";
  const bar = side === "ask" ? "bg-trade-ask/15" : "bg-trade-bid/15";
  return (
    <div className="relative flex items-center justify-between text-[12px] leading-5">
      <div
        className={`absolute right-0 top-0 bottom-0 ${bar} rounded-sm`}
        style={{ width: `${row.pct}%` }}
      />
      <span className={`${color} relative z-10`}>{row.price}</span>
      <span className="relative z-10 text-trade-text/85">{row.size}</span>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-trade-text-muted border-b border-dashed border-trade-text/15">{label}</span>
      <span className="text-trade-text/85">{value}</span>
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-10 w-10 rounded-full bg-trade-surface flex items-center justify-center">
      {children}
    </button>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] text-trade-text-muted border-b border-dashed border-trade-text/15 pb-0.5 mb-1">
        {label}
      </div>
      <div className="text-[13px] text-trade-text font-medium">{value}</div>
    </div>
  );
}
