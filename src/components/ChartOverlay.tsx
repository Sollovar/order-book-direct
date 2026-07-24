import { useEffect, useRef, useState } from "react";
import { X, Star, ChevronDown, LayoutGrid, CandlestickChart } from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */
type Candle = { t: number; o: number; h: number; l: number; c: number };

/* ─── Seeded PRNG so candles are stable across renders ── */
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/* ─── Generate daily OHLC data ──────────────────────── */
function generateCandles(): Candle[] {
  const rand = seededRand(42);
  const candles: Candle[] = [];
  const startMs = new Date("2024-05-01").getTime();
  let price = 60200;
  for (let i = 0; i < 90; i++) {
    const t = startMs + i * 86400_000;
    const move = (rand() - 0.46) * 1600;
    const open = price;
    const close = Math.max(55000, Math.min(70000, price + move));
    const high = Math.max(open, close) + rand() * 900;
    const low = Math.min(open, close) - rand() * 900;
    candles.push({ t, o: open, h: high, l: low, c: close });
    price = close;
  }
  return candles;
}

const ALL_CANDLES = generateCandles();

/* ─── Price axis labels ─────────────────────────────── */
function priceLabels(minP: number, maxP: number, count = 6) {
  const step = (maxP - minP) / (count - 1);
  return Array.from({ length: count }, (_, i) =>
    Math.round((maxP - i * step) / 500) * 500
  );
}

/* ─── Month label positions ─────────────────────────── */
function monthLabels(candles: Candle[], width: number) {
  const cw = width / candles.length;
  const seen = new Set<string>();
  return candles.flatMap((c, i) => {
    const d = new Date(c.t);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ x: i * cw, label: d.toLocaleString("en", { month: "short" }) }];
  });
}

/* ─── Candle chart SVG ──────────────────────────────── */
function CandleChart({
  candles,
  currentPrice,
}: {
  candles: Candle[];
  currentPrice: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 320, h: 260 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const PAD_LEFT = 4;
  const PAD_RIGHT = 60;
  const PAD_TOP = 30;
  const PAD_BOT = 26;
  const chartW = dims.w - PAD_LEFT - PAD_RIGHT;
  const chartH = dims.h - PAD_TOP - PAD_BOT;

  const maxP = Math.max(...candles.map((c) => c.h)) + 400;
  const minP = Math.min(...candles.map((c) => c.l)) - 400;
  const range = maxP - minP;

  const toY = (p: number) => PAD_TOP + ((maxP - p) / range) * chartH;
  const cw = chartW / candles.length;
  const bodyW = Math.max(1.5, cw * 0.55);

  const labels = priceLabels(minP, maxP, 6);
  const months = monthLabels(candles, chartW);
  const curY = toY(currentPrice);

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      <svg
        width={dims.w}
        height={dims.h}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        className="absolute inset-0"
      >
        {/* Grid lines */}
        {labels.map((p) => (
          <line
            key={p}
            x1={PAD_LEFT}
            x2={dims.w - PAD_RIGHT}
            y1={toY(p)}
            y2={toY(p)}
            stroke="rgba(255,255,255,0.055)"
            strokeWidth={1}
          />
        ))}

        {/* Current price dashed line */}
        <line
          x1={PAD_LEFT}
          x2={dims.w - PAD_RIGHT}
          y1={curY}
          y2={curY}
          stroke="#ef4444"
          strokeWidth={0.8}
          strokeDasharray="3 4"
        />

        {/* Candles */}
        {candles.map((c, i) => {
          const x = PAD_LEFT + i * cw + cw / 2;
          const up = c.c >= c.o;
          const color = up ? "#22c55e" : "#ef4444";
          const bodyTop = toY(Math.max(c.o, c.c));
          const bodyBot = toY(Math.min(c.o, c.c));
          const bodyH = Math.max(1, bodyBot - bodyTop);
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={toY(c.h)} y2={toY(c.l)} stroke={color} strokeWidth={0.8} />
              <rect x={x - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={color} rx={0.5} />
            </g>
          );
        })}

        {/* Right axis price labels */}
        {labels.map((p) => (
          <text key={p} x={dims.w - PAD_RIGHT + 5} y={toY(p) + 4} fill="rgba(255,255,255,0.32)" fontSize={9} fontFamily="monospace">
            {p.toLocaleString()}
          </text>
        ))}

        {/* Current price pill */}
        <rect x={dims.w - PAD_RIGHT + 1} y={curY - 9} width={PAD_RIGHT - 3} height={17} fill="#ef4444" rx={3} />
        <text x={dims.w - PAD_RIGHT + 4} y={curY + 4} fill="white" fontSize={9} fontFamily="monospace" fontWeight="600">
          {currentPrice.toFixed(1)}
        </text>

        {/* Month labels */}
        {months.map((m) => (
          <text key={m.label + m.x} x={PAD_LEFT + m.x + 2} y={dims.h - 6} fill="rgba(255,255,255,0.28)" fontSize={9} fontFamily="sans-serif">
            {m.label}
          </text>
        ))}

        {/* Chart label */}
        <text x={PAD_LEFT + 4} y={PAD_TOP - 12} fill="rgba(255,255,255,0.45)" fontSize={10} fontFamily="sans-serif" fontWeight="600">
          BTCUSDT · 1D · Aster
        </text>
        <text x={PAD_LEFT + 4} y={PAD_TOP - 1} fill="#22c55e" fontSize={9.5} fontFamily="monospace">
          {currentPrice.toFixed(1)}{"  0.0 (0.00%)"}
        </text>
      </svg>

      {/* TV watermark */}
      <div className="absolute bottom-8 left-3 flex items-center justify-center h-8 w-8 rounded-full" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>TV</span>
      </div>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────── */
export function ChartOverlay({
  open,
  onClose,
  countdown,
}: {
  open: boolean;
  onClose: () => void;
  theme: "light" | "dark";
  countdown: number;
}) {
  const [chartTab, setChartTab] = useState("Chart");
  const [timeframe, setTimeframe] = useState("1D");
  const [bottomTab, setBottomTab] = useState("Open Orders");
  const currentPrice = 63934.3;

  const fmtCountdown = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  if (!open) return null;

  const chartTabs = ["Chart", "Order Book", "Trades", "Depth", "Details"];
  const timeframes = ["5m", "1H", "1D"];
  const bottomTabs = ["Open Orders", "Positions", "Assets", "Predictions"];

  return (
    /* Full-screen backdrop — same bg as the trade page */
    <div className="fixed inset-0 z-[70] bg-trade-bg overflow-y-auto px-2 pt-4 pb-24">

      {/* ── ONE rounded card wrapping everything — matches trade-page panel style ── */}
      <div className="rounded-xl bg-trade-card border border-trade-text/5 overflow-hidden">

        {/* ── Header ── */}
        <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Top row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-[17px] tracking-tight">BTCUSDT</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded font-medium" style={{ background: "rgba(240,185,11,0.15)", color: "#f0b90b" }}>
                Perp
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-white/35" />
              <span className="text-[#ef4444] text-[13px] font-medium ml-0.5">-1.32%</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4.5 w-4.5 text-white/25" />
              <button
                onClick={onClose}
                className="h-7 w-7 flex items-center justify-center rounded-full active:opacity-60 transition-opacity"
                style={{ background: "rgba(255,255,255,0.09)" }}
              >
                <X className="h-4 w-4 text-white/65" />
              </button>
            </div>
          </div>

          {/* Price + stats row */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-white/38 text-[11px]">Index price</span>
                <ChevronDown className="h-2.5 w-2.5 text-white/25" />
              </div>
              <div className="text-white font-bold text-[26px] leading-none tracking-tight">
                {currentPrice.toLocaleString("en", { minimumFractionDigits: 1 })}
              </div>
              <div className="text-white/35 text-[11px] mt-1.5">Last price 63,911.9</div>
            </div>
            <div className="text-right text-[11px] space-y-1">
              <div>
                <span className="text-white/35">24h Vol (USDT) </span>
                <span className="text-white/35">OI (USDT)</span>
              </div>
              <div className="text-white/75 font-medium">850.72M &nbsp;&nbsp; 768.73M</div>
              <div className="text-white/35">Funding (8h) / Countdown</div>
              <div className="text-white/75 font-medium">0.0076% / {fmtCountdown(countdown)}</div>
            </div>
          </div>
        </div>

        {/* ── Chart tab bar ── */}
        <div
          className="flex items-center gap-5 px-4 pt-2.5 pb-0 overflow-x-auto"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          {chartTabs.map((t) => (
            <button
              key={t}
              onClick={() => setChartTab(t)}
              className={`flex-shrink-0 text-[13px] font-medium pb-2.5 border-b-2 transition-colors ${
                chartTab === t ? "text-white border-white" : "text-white/30 border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Timeframe row ── */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-4">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`text-[13px] font-medium transition-colors ${
                  timeframe === tf ? "text-white" : "text-white/30"
                }`}
              >
                {tf}
              </button>
            ))}
            <button className="text-white/30">
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-md" style={{ background: "rgba(255,255,255,0.06)" }}>
              <LayoutGrid className="h-3.5 w-3.5 text-white/45" />
            </button>
            <button className="p-1.5 rounded-md" style={{ background: "rgba(255,255,255,0.06)" }}>
              <CandlestickChart className="h-3.5 w-3.5 text-white/45" />
            </button>
          </div>
        </div>

        {/* ── Candlestick chart ── */}
        <div className="relative bg-trade-card" style={{ height: 300 }}>
          {chartTab === "Chart" ? (
            <CandleChart candles={ALL_CANDLES.slice(-60)} currentPrice={currentPrice} />
          ) : (
            <div className="flex items-center justify-center h-full text-white/18 text-[13px]">
              {chartTab} view
            </div>
          )}

          {/* Bottom time bar inside chart */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-1.5 text-[10px]"
            style={{ background: "rgba(11,11,11,0.9)", borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="font-mono text-white/28">
              {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} UTC+1
            </span>
            <div className="flex items-center gap-3 text-white/28">
              <span>%</span>
              <span>log</span>
              <span className="text-white/50 font-medium">auto</span>
            </div>
          </div>
        </div>

        {/* ── Bottom panel ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            className="flex items-center justify-between px-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-4">
              {bottomTabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setBottomTab(t)}
                  className={`py-3 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
                    bottomTab === t ? "text-white border-white" : "text-white/28 border-transparent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="text-white/25">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-8 gap-1.5">
            <div className="text-white/20 text-[13px]">No {bottomTab.toLowerCase()}</div>
            <div className="text-white/12 text-[11px]">Connect a wallet to get started</div>
          </div>
        </div>

      </div>
    </div>
  );
}
