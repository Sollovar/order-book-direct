import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChartOverlay } from "../components/ChartOverlay";
import { PairSelectorPanel } from "../components/PairSelectorPanel";
import {
  ChevronDown,
  Search,
  Link2,
  Sun,
  Moon,
  BarChart2,
  UserCircle,
  Wallet,
  X,
  Check,
  Bell,
  Settings,
  Menu,
  TrendingUp,
  Activity,
  ArrowLeftRight,
  PieChart,
  Trophy,
  Users,
  Github,
  Twitter,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { PAIRS } from "../lib/pairs";

export const Route = createFileRoute("/trade")({
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


function Index() {
  const [tab, setTab] = useState("Open Orders");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hasManualOverride, setHasManualOverride] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [navTab, setNavTab] = useState("Trade");
  const [chartOpen, setChartOpen] = useState(false);
  const [pairsOpen, setPairsOpen] = useState(false);
  const [pairsSearch, setPairsSearch] = useState("");
  const [pairsCat, setPairsCat] = useState("Futures");
  const [pairsSub, setPairsSub] = useState("All markets");
  const [countdown, setCountdown] = useState(39 * 60 + 58); // seconds
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabs = ["Open Orders", "Positions", "Assets", "Predictions"];
  const [orderType, setOrderType] = useState("Limit");
  const [orderTypeSheetOpen, setOrderTypeSheetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookVisible, setBookVisible] = useState(true);
  const [bookFilter, setBookFilter] = useState<"both" | "bids" | "asks">("both");
  const [ladderPriceStart, setLadderPriceStart] = useState("");
  const [ladderPriceEnd, setLadderPriceEnd] = useState("");
  const [ladderLevels, setLadderLevels] = useState(5);
  const [limitPrice, setLimitPrice] = useState("");
  const [orderSize, setOrderSize] = useState("");
  const [sliderPct, setSliderPct] = useState(0);
  const availableBalance = 0; // replace with real balance when connected
  const [tpslEnabled, setTpslEnabled] = useState(false);
  const [tpPrice, setTpPrice] = useState("");
  const [slPrice, setSlPrice] = useState("");
  const [hiddenOrder, setHiddenOrder] = useState(false);
  const [postOnly, setPostOnly] = useState(false);
  const ORDER_TYPES: { label: string; desc: string }[] = [
    { label: "Limit",  desc: "Set your price" },
    { label: "Market", desc: "Fill instantly" },
    { label: "Ladder", desc: "Split entries" },
  ];

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
      <header className="flex items-center justify-between px-3 pt-4 pb-3">
        <div className="h-8 w-8 rounded-full border border-trade-text/15 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full border-2 border-trade-text/70 border-t-transparent rotate-45" />
        </div>
        <div className="flex items-center gap-2">
          {/* Connect — gold, wallet icon, matches trading panel */}
          <button className="flex items-center gap-1.5 rounded-full bg-[#f0b90b] text-[#1a1200] pl-2.5 pr-3.5 py-1.5 text-[13px] font-bold active:brightness-90 transition-all shadow-sm">
            <Wallet className="h-3.5 w-3.5" />
            Connect
          </button>
          {/* Notification */}
          <button
            className="h-8 w-8 rounded-full border border-trade-text/15 bg-trade-surface/50 flex items-center justify-center active:bg-trade-surface transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-[15px] w-[15px] text-trade-text/70" />
          </button>
          {/* Settings */}
          <button
            className="h-8 w-8 rounded-full border border-trade-text/15 bg-trade-surface/50 flex items-center justify-center active:bg-trade-surface transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-[15px] w-[15px] text-trade-text/70" />
          </button>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="h-8 w-8 rounded-full border border-trade-text/15 bg-trade-surface/50 flex items-center justify-center active:bg-trade-surface transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-[15px] w-[15px] text-trade-text/70" />
            ) : (
              <Moon className="h-[15px] w-[15px] text-trade-text/70" />
            )}
          </button>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="h-8 w-8 flex items-center justify-center active:opacity-60 transition-opacity"
            aria-label="Menu"
          >
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

          {/* Right: price + change + dropdown toggle + order book toggle */}
          <div className="flex items-center gap-2.5">
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

            {/* Order book toggle */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[8px] font-semibold tracking-wide text-trade-text-muted uppercase leading-none">OB</span>
              <button
                onClick={() => setBookVisible(v => !v)}
                aria-label="Toggle order book"
                className="relative flex-shrink-0 transition-all duration-200 active:scale-95"
                style={{ width: 30, height: 17 }}
              >
                <span
                  className="absolute inset-0 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: bookVisible ? "#f0b90b" : "rgba(128,128,128,0.25)" }}
                />
                <span
                  className="absolute top-[2px] rounded-full bg-white shadow-sm transition-all duration-200"
                  style={{
                    width: 13, height: 13,
                    left: bookVisible ? 15 : 2,
                  }}
                />
              </button>
            </div>
          </div>
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

        <div className={`grid gap-3 mt-3 ${bookVisible ? "grid-cols-2" : "grid-cols-1"}`}>
          {/* LEFT: order book */}
          {bookVisible && <div>
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

            {/* Asks — hidden when bids-only */}
            {bookFilter !== "bids" && (
              <div className="mt-1 space-y-[3px]">
                {asks.map((r, i) => (
                  <BookRow key={i} row={r} side="ask" />
                ))}
              </div>
            )}

            {/* Mid price */}
            <div className="my-2 border-y border-dashed border-trade-text/10 py-1.5">
              <div className="text-trade-ask text-[18px] font-medium leading-tight">
                66,007.4
              </div>
              <div className="text-trade-text-muted text-[11px]">$66,008.9</div>
            </div>

            {/* Bids — hidden when asks-only */}
            {bookFilter !== "asks" && (
              <div className="space-y-[3px]">
                {bids.map((r, i) => (
                  <BookRow key={i} row={r} side="bid" />
                ))}
              </div>
            )}

            {/* Filter buttons + depth selector */}
            <div className="flex items-center justify-between mt-3">
              {/* Three view-mode buttons */}
              <div className="flex items-center gap-1">
                {/* Bids only */}
                <button
                  onClick={() => setBookFilter("bids")}
                  className={`flex flex-col gap-[3px] p-1.5 rounded-md transition-colors ${bookFilter === "bids" ? "bg-trade-bid/15" : "hover:bg-trade-text/5"}`}
                  aria-label="Show bids only"
                >
                  <div className="flex gap-[3px]">
                    <div className="h-[5px] w-[5px] rounded-[1px] bg-trade-bid" />
                    <div className="h-[5px] w-[7px] rounded-[1px] bg-trade-bid/40" />
                  </div>
                  <div className="flex gap-[3px]">
                    <div className="h-[5px] w-[5px] rounded-[1px] bg-trade-bid" />
                    <div className="h-[5px] w-[7px] rounded-[1px] bg-trade-bid/40" />
                  </div>
                </button>

                {/* Both */}
                <button
                  onClick={() => setBookFilter("both")}
                  className={`flex flex-col gap-[3px] p-1.5 rounded-md transition-colors ${bookFilter === "both" ? "bg-trade-text/10" : "hover:bg-trade-text/5"}`}
                  aria-label="Show both"
                >
                  <div className="flex gap-[3px]">
                    <div className="h-[5px] w-[5px] rounded-[1px] bg-trade-ask" />
                    <div className="h-[5px] w-[7px] rounded-[1px] bg-trade-ask/40" />
                  </div>
                  <div className="flex gap-[3px]">
                    <div className="h-[5px] w-[5px] rounded-[1px] bg-trade-bid" />
                    <div className="h-[5px] w-[7px] rounded-[1px] bg-trade-bid/40" />
                  </div>
                </button>

                {/* Asks only */}
                <button
                  onClick={() => setBookFilter("asks")}
                  className={`flex flex-col gap-[3px] p-1.5 rounded-md transition-colors ${bookFilter === "asks" ? "bg-trade-ask/15" : "hover:bg-trade-text/5"}`}
                  aria-label="Show asks only"
                >
                  <div className="flex gap-[3px]">
                    <div className="h-[5px] w-[5px] rounded-[1px] bg-trade-ask" />
                    <div className="h-[5px] w-[7px] rounded-[1px] bg-trade-ask/40" />
                  </div>
                  <div className="flex gap-[3px]">
                    <div className="h-[5px] w-[5px] rounded-[1px] bg-trade-ask" />
                    <div className="h-[5px] w-[7px] rounded-[1px] bg-trade-ask/40" />
                  </div>
                </button>
              </div>

              <button className="flex items-center gap-1 text-trade-text/70 text-[12px]">
                0.1 <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>
          }

          {/* RIGHT: order form */}
          <div className="space-y-2">



            <button
              onClick={() => setOrderTypeSheetOpen(true)}
              className="w-full rounded-md bg-trade-surface py-2 flex items-center justify-center gap-1 text-[13px]"
            >
              {orderType} <span className="text-[8px] leading-none">▼</span>
            </button>

            {/* Price box — Limit only */}
            {orderType === "Limit" && (
              <div className="rounded-md bg-trade-surface p-2 flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-[10px] text-trade-text-muted mb-0.5">Order price</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={limitPrice}
                    onChange={e => setLimitPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-trade-text placeholder:text-trade-text/30 outline-none"
                    style={{ fontSize: '16px' }}
                  />
                </div>
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <span className="text-[11px] text-trade-text/70 px-1.5">USDT</span>
                  <span className="text-trade-text/20">|</span>
                  <span className="text-[11px] text-trade-text/70 px-1.5">BBO</span>
                </div>
              </div>
            )}

            {/* Ladder fields — Price Start, Price End, Levels */}
            {orderType === "Ladder" && (
              <>
                <div className="rounded-md bg-trade-surface p-2 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-[10px] text-trade-text-muted mb-0.5">Price Start</div>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={ladderPriceStart}
                      onChange={e => setLadderPriceStart(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent text-trade-text placeholder:text-trade-text/30 outline-none"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  <span className="text-[11px] text-trade-text/50 ml-2 shrink-0">USDT</span>
                </div>

                <div className="rounded-md bg-trade-surface p-2 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-[10px] text-trade-text-muted mb-0.5">Price End</div>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={ladderPriceEnd}
                      onChange={e => setLadderPriceEnd(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent text-trade-text placeholder:text-trade-text/30 outline-none"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  <span className="text-[11px] text-trade-text/50 ml-2 shrink-0">USDT</span>
                </div>

                <div className="rounded-md bg-trade-surface p-2 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-[10px] text-trade-text-muted mb-0.5">Levels</div>
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        onClick={() => setLadderLevels(l => Math.max(1, l - 1))}
                        className="h-6 w-6 rounded-full bg-trade-text/10 flex items-center justify-center text-trade-text text-[14px] font-bold active:opacity-60"
                      >−</button>
                      <span className="text-[14px] text-trade-text font-semibold w-6 text-center">{ladderLevels}</span>
                      <button
                        onClick={() => setLadderLevels(l => Math.min(50, l + 1))}
                        className="h-6 w-6 rounded-full bg-trade-text/10 flex items-center justify-center text-trade-text text-[14px] font-bold active:opacity-60"
                      >+</button>
                    </div>
                  </div>
                  <span className="text-[11px] text-trade-text/50 shrink-0">1 – 50</span>
                </div>
              </>
            )}

            {/* Size — always visible */}
            <div className="rounded-md bg-trade-surface p-2 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-[10px] text-trade-text-muted mb-0.5">Size</div>
                <input
                  type="number"
                  inputMode="decimal"
                  value={orderSize}
                  onChange={e => setOrderSize(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-trade-text placeholder:text-trade-text/30 outline-none"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div className="flex items-center gap-1 ml-2 shrink-0 text-[12px] text-trade-text/70">
                USDT <ChevronDown className="h-3 w-3" />
              </div>
            </div>

            {/* Slider */}
            <div className="py-2 px-1">
              <div className="relative">
                <style>{`
                  .gold-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 2px; border-radius: 9999px; outline: none; background: transparent; }
                  .gold-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 9999px; background: #f0b90b; cursor: pointer; border: 2px solid #f0b90b; box-shadow: 0 0 0 3px rgba(240,185,11,0.15); }
                  .gold-slider::-moz-range-thumb { width: 14px; height: 14px; border-radius: 9999px; background: #f0b90b; cursor: pointer; border: 2px solid #f0b90b; }
                `}</style>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliderPct}
                  onChange={e => {
                    const pct = Number(e.target.value);
                    setSliderPct(pct);
                    const filled = ((availableBalance * pct) / 100);
                    setOrderSize(filled > 0 ? filled.toFixed(2) : "");
                  }}
                  className="gold-slider"
                  style={{
                    background: `linear-gradient(to right, #f0b90b ${sliderPct}%, rgba(128,128,128,0.2) ${sliderPct}%)`,
                  }}
                />
                {/* Tick marks at 25 / 50 / 75 */}
                <div className="flex justify-between mt-1 px-[1px]">
                  {["25%", "50%", "75%", "100%"].map((label, i) => (
                    <button
                      key={label}
                      onClick={() => {
                        const pct = (i + 1) * 25;
                        setSliderPct(pct);
                        const filled = ((availableBalance * pct) / 100);
                        setOrderSize(filled > 0 ? filled.toFixed(2) : "");
                      }}
                      className="text-[10px] text-trade-text-muted active:text-[#f0b90b] transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[12px]">
              <span className="text-trade-text/60">Avbl</span>
              <span className="text-trade-text/80">0.00 USDT</span>
            </div>

            {/* Toggles */}
            <div className="space-y-1.5 pt-1">

              {/* TP/SL toggle */}
              <button
                onClick={() => setTpslEnabled(v => !v)}
                className="flex items-center gap-2 text-[12px] text-trade-text/70 w-full text-left"
              >
                <span className={`h-3.5 w-3.5 rounded-sm border flex items-center justify-center transition-colors ${tpslEnabled ? "bg-[#f0b90b] border-[#f0b90b]" : "border-trade-text/30"}`}>
                  {tpslEnabled && <Check className="h-2.5 w-2.5 text-black" strokeWidth={3} />}
                </span>
                <span className="border-b border-dashed border-trade-text/20">TP/SL</span>
              </button>

              {/* TP/SL trigger price inputs */}
              {tpslEnabled && (
                <div className="space-y-1.5 pl-5">
                  {/* Take Profit */}
                  <div className="rounded-md bg-trade-surface flex items-center overflow-hidden">
                    <span className="px-3 py-3 text-[12px] font-bold text-trade-text shrink-0">TP</span>
                    <span className="text-trade-text/20 text-[13px]">|</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={tpPrice}
                      onChange={e => setTpPrice(e.target.value)}
                      placeholder="Take Profit price"
                      className="flex-1 bg-transparent text-trade-text/60 placeholder:text-trade-text/30 outline-none px-3 py-3"
                      style={{ fontSize: '16px' }}
                    />
                    <span className="px-3 text-[12px] font-bold text-trade-text shrink-0">USDT</span>
                  </div>
                  {/* Stop Loss */}
                  <div className="rounded-md bg-trade-surface flex items-center overflow-hidden">
                    <span className="px-3 py-3 text-[12px] font-bold text-trade-text shrink-0">SL</span>
                    <span className="text-trade-text/20 text-[13px]">|</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={slPrice}
                      onChange={e => setSlPrice(e.target.value)}
                      placeholder="Stop Loss price"
                      className="flex-1 bg-transparent text-trade-text/60 placeholder:text-trade-text/30 outline-none px-3 py-3"
                      style={{ fontSize: '16px' }}
                    />
                    <span className="px-3 text-[12px] font-bold text-trade-text shrink-0">USDT</span>
                  </div>
                </div>
              )}

              {/* Post Only */}
              <button
                onClick={() => setPostOnly(v => !v)}
                className="flex items-center gap-2 text-[12px] text-trade-text/70 w-full text-left"
              >
                <span className={`h-3.5 w-3.5 rounded-sm border flex items-center justify-center transition-colors ${postOnly ? "bg-[#f0b90b] border-[#f0b90b]" : "border-trade-text/30"}`}>
                  {postOnly && <Check className="h-2.5 w-2.5 text-black" strokeWidth={3} />}
                </span>
                <span className="border-b border-dashed border-trade-text/20">Post Only</span>
              </button>
            </div>

            {/* Order value */}
            <div className="pt-1 text-[12px]">
              <Line label="Order value" value="0.00 USDT" />
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
          <div className="flex items-center justify-between flex-1">
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
      <PairSelectorPanel open={pairsOpen} onClose={() => setPairsOpen(false)} />

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
              onClick={() => {
                setNavTab(label);
                if (label === "Markets") setChartOpen(true);
              }}
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

      {/* Chart overlay — opens when Markets nav tab is tapped */}
      <ChartOverlay
        open={chartOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        countdown={countdown}
        navTab={navTab}
        setNavTab={(t) => {
          setNavTab(t);
          if (t !== "Markets") setChartOpen(false);
        }}
        onOpenChart={() => setChartOpen(true)}
      />

      {/* Mobile Menu Bottom Sheet */}
      {menuOpen && typeof document !== "undefined" && createPortal(
        <MobileMenuSheet onClose={() => setMenuOpen(false)} theme={theme} />,
        document.body
      )}

      {/* Order Type Bottom Sheet — rendered via portal to escape stacking contexts */}
      {orderTypeSheetOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 flex flex-col justify-end" style={{ zIndex: 9999 }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOrderTypeSheetOpen(false)}
          />
          {/* Sheet */}
          <div className="relative bg-trade-card rounded-t-3xl pb-10 shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-[4px] w-9 rounded-full bg-trade-text/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-1 pb-4">
              <div>
                <p className="text-[11px] text-trade-text-muted uppercase tracking-widest font-medium">Select</p>
                <p className="text-[18px] font-bold text-trade-text leading-tight">Order Type</p>
              </div>
              <button
                onClick={() => setOrderTypeSheetOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-trade-text/8 active:scale-95 transition-transform"
              >
                <X className="h-[15px] w-[15px] text-trade-text/70" />
              </button>
            </div>

            {/* 2-column grid */}
            <div className="px-4 grid grid-cols-2 gap-3 pb-2">
              {ORDER_TYPES.map(({ label, desc }) => {
                const active = orderType === label;
                return (
                  <button
                    key={label}
                    onClick={() => { setOrderType(label); setOrderTypeSheetOpen(false); }}
                    className={`relative flex flex-col items-start text-left rounded-2xl px-4 py-4 transition-all active:scale-[0.97] ${
                      active
                        ? "ring-1 ring-[#f0b90b]/70"
                        : "bg-trade-text/5 ring-1 ring-transparent"
                    }`}
                    style={active ? { backgroundColor: "rgba(240,185,11,0.12)" } : undefined}
                  >
                    {active && (
                      <span className="absolute top-3 right-3 h-[18px] w-[18px] rounded-full flex items-center justify-center" style={{ backgroundColor: "#f0b90b" }}>
                        <Check className="h-[10px] w-[10px] text-black" strokeWidth={3} />
                      </span>
                    )}
                    <span className={`text-[14px] font-semibold mb-0.5 ${active ? "text-trade-text" : "text-trade-text/80"}`}>
                      {label}
                    </span>
                    <span className="text-[11px] text-trade-text-muted leading-snug">{desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}

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

/* ─── Mobile Menu Bottom Sheet ─────────────────────────────────────────────── */

const APP_ITEMS = [
  { label: "Trade",       icon: TrendingUp,     href: "/trade" },
  { label: "Markets",     icon: BarChart2,       href: "/trade" },
  { label: "Portfolio",   icon: Wallet,          href: "/trade" },
  { label: "Leaderboard", icon: Trophy,          href: "/trade" },
];

const PRODUCT_ITEMS = [
  { label: "Perpetuals",  icon: Activity,        href: "/trade" },
  { label: "Spot",        icon: ArrowLeftRight,  href: "/trade" },
  { label: "Referrals",   icon: Users,           href: "/trade" },
  { label: "Analytics",   icon: PieChart,        href: "/trade" },
];

const COLLAPSIBLE_SECTIONS = ["Protocol", "Company", "Legal & Privacy"];

function MobileMenuSheet({ onClose, theme }: { onClose: () => void; theme: "light" | "dark" }) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className={`fixed inset-0 flex flex-col justify-end ${theme === "dark" ? "dark" : ""}`} style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-trade-card rounded-t-3xl shadow-2xl overflow-y-auto max-h-[90vh]"
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
          aria-label="Close menu"
        >
          <X className="h-[15px] w-[15px] text-trade-text/70" />
        </button>

        <div className="px-5 pt-3 pb-2">

          {/* App section */}
          <p className="text-[12px] text-trade-text-muted font-medium mb-3">App</p>
          <div className="space-y-1 mb-6">
            {APP_ITEMS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={onClose}
                className="w-full flex items-center gap-3.5 py-2.5 active:opacity-60 transition-opacity"
              >
                <span className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(240,185,11,0.12)" }}>
                  <Icon className="h-4 w-4" style={{ color: "#f0b90b" }} />
                </span>
                <span className="text-[16px] font-medium text-trade-text">{label}</span>
              </button>
            ))}
          </div>

          {/* Products section */}
          <p className="text-[12px] text-trade-text-muted font-medium mb-3">Products</p>
          <div className="space-y-1 mb-6">
            {PRODUCT_ITEMS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={onClose}
                className="w-full flex items-center gap-3.5 py-2.5 active:opacity-60 transition-opacity"
              >
                <span className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(240,185,11,0.12)" }}>
                  <Icon className="h-4 w-4" style={{ color: "#f0b90b" }} />
                </span>
                <span className="text-[16px] font-medium text-trade-text">{label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-trade-text/8 mb-4" />

          {/* Collapsible sections */}
          <div className="space-y-0">
            {COLLAPSIBLE_SECTIONS.map((section) => {
              const isOpen = openSection === section;
              return (
                <button
                  key={section}
                  onClick={() => setOpenSection(isOpen ? null : section)}
                  className="w-full flex items-center justify-between py-3.5 active:opacity-60 transition-opacity"
                >
                  <span className="text-[15px] text-trade-text-muted font-medium">{section}</span>
                  <ChevronRight
                    className="h-4 w-4 text-trade-text/40 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                  />
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-trade-text/8 mt-4 mb-5" />

          {/* Social icons */}
          <div className="flex items-center justify-between px-1">
            <button
              className="h-9 w-9 flex items-center justify-center rounded-full bg-trade-surface active:opacity-60 transition-opacity"
              aria-label="Help"
            >
              <span className="text-[14px] font-bold text-trade-text-muted">?</span>
            </button>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-trade-surface active:opacity-60 transition-opacity"
                aria-label="GitHub"
              >
                <Github className="h-[18px] w-[18px] text-trade-text/70" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-trade-surface active:opacity-60 transition-opacity"
                aria-label="X / Twitter"
              >
                <Twitter className="h-[18px] w-[18px] text-trade-text/70" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-trade-surface active:opacity-60 transition-opacity"
                aria-label="Discord"
              >
                <MessageCircle className="h-[18px] w-[18px] text-trade-text/70" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
