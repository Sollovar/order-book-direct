import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Search,
  Star,
  Settings,
  Maximize2,
  Sun,
  Moon,
  Bell,
  Globe,
  Grid3x3,
  LineChart as LineChartIcon,
  Repeat,
} from "lucide-react";

type Row = { price: string; size: string; total: string; pct: number };

const asks: Row[] = [
  { price: "61,208.0", size: "16.89K", total: "601.60K", pct: 88 },
  { price: "61,207.4", size: "299.91K", total: "584.70K", pct: 82 },
  { price: "61,207.3", size: "175.05K", total: "284.79K", pct: 42 },
  { price: "61,206.6", size: "24.97K", total: "109.73K", pct: 18 },
  { price: "61,205.0", size: "122.41K", total: "84.76K", pct: 14 },
  { price: "61,204.7", size: "16.89K", total: "84.64K", pct: 14 },
  { price: "61,204.6", size: "6.18K", total: "67.75K", pct: 11 },
  { price: "61,204.4", size: "1.04K", total: "61.57K", pct: 10 },
  { price: "61,204.0", size: "3.73K", total: "60.53K", pct: 10 },
  { price: "61,203.7", size: "56.79K", total: "56.79K", pct: 9 },
];

const bids: Row[] = [
  { price: "61,195.3", size: "24.96K", total: "24.96K", pct: 6 },
  { price: "61,195.2", size: "673.15", total: "25.64K", pct: 6 },
  { price: "61,194.4", size: "673.14", total: "26.31K", pct: 7 },
  { price: "61,192.1", size: "9.97K", total: "36.28K", pct: 9 },
  { price: "61,191.3", size: "16.88K", total: "53.17K", pct: 13 },
  { price: "61,190.1", size: "183.57", total: "53.36K", pct: 13 },
  { price: "61,189.5", size: "183.57", total: "53.54K", pct: 13 },
  { price: "61,189.3", size: "51.03K", total: "104.57K", pct: 26 },
  { price: "61,189.1", size: "79.97K", total: "184.54K", pct: 45 },
  { price: "61,186.6", size: "673.05", total: "185.22K", pct: 46 },
];

const NAV = ["Trade", "Portfolio", "Referral", "Aster Chain", "Rewards", "More"];

type Props = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export default function DesktopTrade({ theme, onToggleTheme }: Props) {
  const [orderMode, setOrderMode] = useState<"Market" | "Limit" | "Stop Limit">("Limit");
  const [price, setPrice] = useState("61789.0");
  const [size, setSize] = useState("");
  const [pct, setPct] = useState(0);
  const [countdown, setCountdown] = useState(1 * 3600 + 52 * 60 + 56);

  useEffect(() => {
    const id = setInterval(() => setCountdown((s) => (s > 0 ? s - 1 : 3600)), 1000);
    return () => clearInterval(id);
  }, []);

  const fmtCd = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-trade-bg text-trade-text font-sans text-[13px]">
      {/* ============ TOP HEADER ============ */}
      <header className="flex items-center justify-between px-5 h-14 border-b border-trade-text/5">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full border-2 border-trade-text/80 border-t-transparent rotate-45" />
            <span className="text-[18px] font-bold tracking-wide">ASTER</span>
          </div>
          <nav className="flex items-center gap-6 text-[13px] text-trade-text/85">
            {NAV.map((n) => (
              <button key={n} className="flex items-center gap-1 hover:text-trade-text transition-colors">
                {n}
                {(n === "Trade" || n === "Aster Chain" || n === "Rewards" || n === "More") && (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-8 w-8 rounded-full bg-trade-surface flex items-center justify-center">
            <span className="h-5 w-5 rounded-full bg-[#f0b90b] flex items-center justify-center text-black text-[10px] font-bold">◆</span>
          </button>
          <button className="rounded-full bg-trade-primary text-trade-primary-text px-5 h-9 text-[13px] font-medium">
            Connect Wallet
          </button>
          <button className="h-8 w-8 rounded-full bg-trade-surface flex items-center justify-center">
            <Globe className="h-4 w-4 text-trade-text/80" />
          </button>
          <button
            onClick={onToggleTheme}
            className="h-8 w-8 rounded-full bg-trade-surface flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="h-8 w-8 rounded-full bg-trade-surface flex items-center justify-center">
            <Settings className="h-4 w-4 text-trade-text/80" />
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-trade-surface px-3 h-8 text-[12px] text-trade-text/80">
            To Old Version <Repeat className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* ============ PAIR STATS BAR ============ */}
      <div className="flex items-center gap-8 px-5 h-16 border-b border-trade-text/5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#f7931a] flex items-center justify-center text-white font-bold">₿</div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[16px] font-bold">BTCUSDT</span>
              <span className="text-[10px] text-trade-primary bg-trade-primary/15 px-1.5 py-0.5 rounded">Perp</span>
              <ChevronDown className="h-3 w-3 text-trade-text/60" />
            </div>
            <span className="text-[13px] text-trade-ask font-medium">61,203.6 -0.70%</span>
          </div>
        </div>

        <Stat label="Mark" value="61,207.5" />
        <Stat label="Index" value="61,241.4" />
        <Stat label="Funding(8h)/Countdown" value={<span><span className="text-trade-ask">-0.0024%</span> / {fmtCd(countdown)}</span>} />
        <Stat label="24h Volume (USDT)" value="1,002,644,028.04" />
        <Stat label="Open Interest" value="686,203.4" />

        <div className="ml-auto flex items-center gap-3">
          <Star className="h-5 w-5 text-trade-text/40" />
        </div>
      </div>

      {/* ============ MAIN GRID ============ */}
      <div className="grid grid-cols-[1fr_320px_320px] gap-px bg-trade-text/5">
        {/* LEFT: chart */}
        <div className="bg-trade-bg">
          <ChartArea />
        </div>

        {/* MIDDLE: order book */}
        <div className="bg-trade-bg px-3 py-3">
          {/* tabs */}
          <div className="flex items-center gap-1 border-b border-trade-text/5 mb-3">
            <button className="px-3 py-1.5 text-[14px] font-medium text-trade-text border-b-2 border-trade-primary">
              Order Book
            </button>
            <button className="px-3 py-1.5 text-[13px] text-trade-text-muted">Trades</button>
          </div>

          {/* depth mode + tick */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <button className="h-6 w-6 rounded bg-trade-surface flex items-center justify-center">
                <Grid3x3 className="h-3.5 w-3.5 text-trade-text/70" />
              </button>
              <button className="h-6 w-6 rounded flex items-center justify-center">
                <span className="block h-3 w-3 bg-trade-ask/70 rounded-sm" />
              </button>
              <button className="h-6 w-6 rounded flex items-center justify-center">
                <span className="block h-3 w-3 bg-trade-bid/70 rounded-sm" />
              </button>
            </div>
            <button className="flex items-center gap-1 text-[12px] text-trade-text/70">
              0.1 <ChevronDown className="h-3 w-3" /> <span className="ml-1">USDT</span> <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          {/* header */}
          <div className="grid grid-cols-3 text-[11px] text-trade-text-muted mb-1">
            <span>Price (USDT)</span>
            <span className="text-right">Size (USDT)</span>
            <span className="text-right">Total (USDT)</span>
          </div>

          {/* asks */}
          <div className="space-y-[2px]">
            {asks.map((r, i) => <BookRow key={i} row={r} side="ask" />)}
          </div>

          {/* spread / mark */}
          <div className="my-2 flex items-center gap-2">
            <span className="text-trade-ask text-[18px] font-bold">61,203.6</span>
            <span className="text-trade-ask">↓</span>
            <span className="text-trade-text-muted text-[12px]">61,207.5</span>
          </div>

          {/* bids */}
          <div className="space-y-[2px]">
            {bids.map((r, i) => <BookRow key={i} row={r} side="bid" />)}
          </div>
        </div>

        {/* RIGHT: order form */}
        <div className="bg-trade-bg p-4">
          {/* mode tabs */}
          <div className="flex items-center gap-5 border-b border-trade-text/5 mb-4 text-[14px]">
            {(["Market", "Limit", "Stop Limit"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setOrderMode(m)}
                className={`pb-2 ${orderMode === m ? "text-trade-text border-b-2 border-trade-primary" : "text-trade-text-muted"}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-[12px] mb-3">
            <span className="text-trade-text-muted">Avbl <span className="text-trade-text">0.00 USDT</span></span>
            <button className="text-trade-text-muted">+</button>
          </div>

          {/* leverage row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button className="rounded bg-trade-surface h-10 text-[13px]">Cross</button>
            <button className="rounded bg-trade-surface h-10 text-[13px]">20x</button>
            <button className="rounded bg-trade-surface h-10 text-[13px]">M</button>
          </div>

          {/* price */}
          <div className="rounded bg-trade-surface h-11 px-3 flex items-center justify-between mb-2">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-transparent outline-none text-[15px] flex-1"
            />
            <span className="text-[11px] text-trade-text-muted">USDT</span>
            <span className="mx-2 text-trade-text/20">|</span>
            <button className="text-[12px] text-trade-text-muted">BBO</button>
          </div>

          {/* size */}
          <div className="rounded bg-trade-surface h-11 px-3 flex items-center justify-between mb-3">
            <input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Size"
              className="bg-transparent outline-none text-[15px] flex-1 placeholder:text-trade-text/40"
            />
            <span className="text-[11px] text-trade-text-muted">USDT</span>
            <ChevronDown className="h-3 w-3 text-trade-text-muted ml-1" />
          </div>

          {/* slider */}
          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={100}
              value={pct}
              onChange={(e) => setPct(Number(e.target.value))}
              className="w-full accent-trade-primary"
            />
          </div>

          {/* checkboxes */}
          <div className="space-y-2 mb-4 text-[12px]">
            <label className="flex items-center gap-2 text-trade-text-muted">
              <input type="checkbox" className="accent-trade-primary" />
              TP/SL
            </label>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-trade-text-muted">
                <input type="checkbox" className="accent-trade-primary" />
                Hidden Order
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-trade-text-muted">
                <input type="checkbox" className="accent-trade-primary" />
                Reduce-Only
              </label>
              <button className="text-trade-text-muted flex items-center gap-1">
                GTC <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* connect */}
          <button className="w-full h-11 rounded bg-trade-primary text-trade-primary-text font-medium mb-4">
            Connect Wallet
          </button>

          {/* footer stats */}
          <div className="grid grid-cols-2 gap-y-2 text-[11px] text-trade-text-muted">
            <span>Liq.Price <span className="text-trade-text">--</span></span>
            <span className="text-right">Liq.Price <span className="text-trade-text">--</span></span>
            <span>Margin <span className="text-trade-text">0.00</span></span>
            <span className="text-right">Margin <span className="text-trade-text">0.00</span></span>
            <span>Max <span className="text-trade-text">0.00</span> USDT</span>
            <span className="text-right">Max <span className="text-trade-text">0.00</span> USDT</span>
          </div>
        </div>
      </div>

      {/* ============ FOOTER TICKER ============ */}
      <footer className="flex items-center gap-6 px-5 h-9 border-t border-trade-text/5 text-[11px] text-trade-text-muted overflow-hidden">
        <span className="flex items-center gap-1.5 text-trade-bid">
          <span className="h-2 w-2 rounded-full bg-trade-bid" /> Connected 451ms
        </span>
        <span>6, 00:00 UTC</span>
        <span>Small Amount Exchange Now Available on Spot</span>
        <span>0% Fee on USDC ⇌ USDT for 30 Days</span>
        <span>Migrate to Aster Pro API | V1 API Sunset Notice</span>
        <span>Staking is live on Aster</span>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-[11px] text-trade-text-muted">{label}</span>
      <span className="text-[13px] text-trade-text font-medium">{value}</span>
    </div>
  );
}

function BookRow({ row, side }: { row: Row; side: "ask" | "bid" }) {
  const color = side === "ask" ? "var(--trade-ask)" : "var(--trade-bid)";
  return (
    <div className="relative grid grid-cols-3 text-[12px] h-[19px] items-center">
      <div
        className="absolute inset-y-0 right-0 opacity-15"
        style={{ width: `${row.pct}%`, background: color }}
      />
      <span className="relative" style={{ color }}>{row.price}</span>
      <span className="relative text-right text-trade-text/85">{row.size}</span>
      <span className="relative text-right text-trade-text/85">{row.total}</span>
    </div>
  );
}

/* ============= CHART ============= */
function ChartArea() {
  const candles = useMemo(() => generateCandles(90, 61200), []);
  return (
    <div className="flex flex-col h-full">
      {/* toolbar */}
      <div className="flex items-center justify-between px-3 h-10 border-b border-trade-text/5 text-[12px] text-trade-text/80">
        <div className="flex items-center gap-3">
          {["5m", "15m", "1H", "4H", "1D", "1W"].map((t, i) => (
            <button key={t} className={i === 4 ? "text-trade-text font-medium" : "text-trade-text-muted"}>
              {t}
            </button>
          ))}
          <ChevronDown className="h-3 w-3 text-trade-text-muted" />
          <div className="mx-2 h-4 w-px bg-trade-text/10" />
          <button className="text-trade-text-muted">⇌</button>
          <button className="text-trade-text-muted">≡</button>
          <button className="text-trade-text-muted"><Settings className="h-3.5 w-3.5" /></button>
          <span className="text-trade-text-muted">Last Price</span>
          <ChevronDown className="h-3 w-3 text-trade-text-muted" />
        </div>
        <div className="flex items-center gap-4 text-trade-text/70">
          <button className="text-trade-text">Chart</button>
          <button>Depth</button>
          <button>Details</button>
          <Maximize2 className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* OHLC line */}
      <div className="px-3 pt-2 pb-1 text-[11px] flex items-center gap-3 text-trade-text-muted">
        <span>O<span className="text-trade-text ml-1">61697.8</span></span>
        <span>H<span className="text-trade-text ml-1">62817.6</span></span>
        <span>L<span className="text-trade-text ml-1">60705.4</span></span>
        <span>C<span className="text-trade-text ml-1">61203.3</span></span>
        <span className="text-trade-ask">-494.2 (-0.80%)</span>
      </div>
      <div className="px-3 text-[11px] flex items-center gap-4">
        <span className="text-[#a06cd5]">MA 7 close 0 SMA 9 62140.6</span>
        <span className="text-[#e8b84b]">MA 30 close 0 SMA 9 72427.8</span>
        <span className="text-[#4a90e2]">MA 99 close 0 SMA 9 72891.9</span>
      </div>

      {/* candles svg */}
      <div className="flex-1 min-h-[420px] px-3 pb-2">
        <CandlesSVG candles={candles} />
      </div>

      {/* volume + x axis */}
      <div className="px-3 pb-3 text-[11px] text-trade-text-muted">
        <span>Volume SMA 9 <span className="text-trade-text">15.721K</span></span>
      </div>
    </div>
  );
}

type Candle = { o: number; h: number; l: number; c: number };
function generateCandles(n: number, start: number): Candle[] {
  const out: Candle[] = [];
  let p = start;
  // deterministic pseudo random
  let seed = 42;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < n; i++) {
    const o = p;
    const change = (rnd() - 0.5) * 800;
    const c = o + change;
    const h = Math.max(o, c) + rnd() * 300;
    const l = Math.min(o, c) - rnd() * 300;
    out.push({ o, h, l, c });
    p = c;
  }
  return out;
}

function CandlesSVG({ candles }: { candles: Candle[] }) {
  const W = 900;
  const H = 440;
  const padY = 20;
  const min = Math.min(...candles.map((c) => c.l));
  const max = Math.max(...candles.map((c) => c.h));
  const y = (v: number) => padY + ((max - v) / (max - min)) * (H - padY * 2);
  const cw = W / candles.length;
  const bw = Math.max(2, cw * 0.65);

  // MA lines
  const ma = (period: number) => {
    return candles.map((_, i) => {
      const from = Math.max(0, i - period + 1);
      const slice = candles.slice(from, i + 1);
      const avg = slice.reduce((s, c) => s + c.c, 0) / slice.length;
      return { x: i * cw + cw / 2, y: y(avg) };
    });
  };
  const line = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {/* grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line key={i} x1={0} x2={W} y1={padY + t * (H - padY * 2)} y2={padY + t * (H - padY * 2)}
          stroke="currentColor" strokeOpacity={0.06} strokeDasharray="2 3" />
      ))}
      {/* MAs */}
      <path d={line(ma(7))} stroke="#a06cd5" strokeWidth={1.2} fill="none" />
      <path d={line(ma(30))} stroke="#e8b84b" strokeWidth={1.2} fill="none" />
      <path d={line(ma(99))} stroke="#4a90e2" strokeWidth={1.2} fill="none" />
      {/* candles */}
      {candles.map((c, i) => {
        const up = c.c >= c.o;
        const color = up ? "var(--trade-bid)" : "var(--trade-ask)";
        const x = i * cw + cw / 2;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth={1} />
            <rect
              x={x - bw / 2}
              y={y(Math.max(c.o, c.c))}
              width={bw}
              height={Math.max(1, Math.abs(y(c.o) - y(c.c)))}
              fill={color}
            />
          </g>
        );
      })}
      {/* last price tag */}
      <g>
        <line x1={0} x2={W} y1={y(candles[candles.length - 1].c)} y2={y(candles[candles.length - 1].c)}
          stroke="var(--trade-ask)" strokeDasharray="3 3" strokeOpacity={0.6} />
      </g>
    </svg>
  );
}
