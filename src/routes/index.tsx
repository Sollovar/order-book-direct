import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Star,
  LineChart,
  ChevronDown,
  Menu,
  Plus,
  ArrowLeft,
  RefreshCw,
  MoreHorizontal,
  FileText,
  CandlestickChart,
  Search,
  Link2,
  Sun,
  Moon,
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

function Index() {
  const [tab, setTab] = useState("Open Orders");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hasManualOverride, setHasManualOverride] = useState(false);
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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    setHasManualOverride(true);
  };

  return (
    <div
      className={`min-h-screen bg-trade-bg text-trade-text font-sans text-[13px] pb-6 ${
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

      {/* Main trading card */}
      <section className="mx-1 rounded-xl bg-trade-card border border-trade-text/5 p-3">
        {/* Symbol row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[15px]">BTCUSDT</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-trade-text/10 text-trade-text/80">
              Perp
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-trade-text/60" />
            <span className="text-trade-ask text-[13px] ml-1">-0.30%</span>
          </div>
          <div className="flex items-center gap-3 text-trade-text/70">
            <Star className="h-4 w-4" />
            <LineChart className="h-4 w-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          {/* LEFT: order book */}
          <div>
            <div className="text-[11px] text-trade-text-muted border-b border-dashed border-trade-text/15 pb-1">
              Funding (8h) / Countdown
            </div>
            <div className="text-[12px] mt-1">0.0043% / 07:45:54</div>

            <div className="flex items-center justify-between text-[10px] text-trade-text-muted mt-3">
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
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-md bg-trade-surface py-2 text-[13px]">Cross</button>
              <button className="rounded-md bg-trade-surface py-2 text-[13px]">20x</button>
            </div>

            <button className="w-full rounded-md bg-trade-surface py-2 flex items-center justify-center gap-1 text-[13px]">
              Limit <ChevronDown className="h-3 w-3" />
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

            <button className="w-full rounded-full bg-trade-primary text-trade-primary-text py-2.5 text-[14px] font-medium mt-1">
              Connect
            </button>
          </div>
        </div>
      </section>

      {/* Bottom tabs */}
      <section className="mx-1 mt-3 rounded-xl bg-trade-card border border-trade-text/5">
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
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="h-14 w-14 rounded-lg bg-trade-surface flex items-center justify-center relative">
            <Link2 className="h-6 w-6 text-trade-text/40" />
            <Search className="h-3.5 w-3.5 text-trade-text/60 absolute bottom-2 right-2" />
          </div>
          <div className="text-trade-text-muted text-[13px]">Please connect a wallet first</div>
        </div>
      </section>

      {/* Floating pill */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-1 bg-trade-card border border-trade-text/10 rounded-full p-1">
          <button className="h-9 w-16 rounded-full bg-trade-surface flex items-center justify-center">
            <FileText className="h-4 w-4 text-trade-text/80" />
          </button>
          <button className="h-9 w-16 rounded-full flex items-center justify-center">
            <CandlestickChart className="h-4 w-4 text-trade-text/60" />
          </button>
        </div>
      </div>

      {/* Fake browser chrome */}
      <div className="mt-6 mx-1 flex items-center justify-between">
        <IconBtn>
          <ArrowLeft className="h-4 w-4 text-trade-text/80" />
        </IconBtn>
        <div className="flex items-center gap-2 bg-trade-surface rounded-full px-4 py-2 text-[13px] text-trade-text/80">
          <FileText className="h-4 w-4" />
          asterdex.com
          <RefreshCw className="h-3.5 w-3.5" />
        </div>
        <IconBtn>
          <MoreHorizontal className="h-4 w-4 text-trade-text/80" />
        </IconBtn>
      </div>
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
