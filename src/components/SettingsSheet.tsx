import { X, Globe, Volume2, Bell, Moon, Sun } from "lucide-react";
import { useState } from "react";

interface SettingsSheetProps {
  onClose: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative flex-shrink-0 transition-all duration-200 active:scale-95"
      style={{ width: 36, height: 20 }}
      aria-checked={enabled}
      role="switch"
    >
      <span
        className="absolute inset-0 rounded-full transition-colors duration-200"
        style={{ backgroundColor: enabled ? "#f0b90b" : "rgba(128,128,128,0.25)" }}
      />
      <span
        className="absolute top-[3px] rounded-full bg-white shadow-sm transition-all duration-200"
        style={{ width: 14, height: 14, left: enabled ? 19 : 3 }}
      />
    </button>
  );
}

export function SettingsSheet({ onClose, theme, toggleTheme }: SettingsSheetProps) {
  const [fillSound, setFillSound] = useState(false);
  const [alertSound, setAlertSound] = useState(true);

  const rows = [
    {
      icon: theme === "dark" ? Moon : Sun,
      iconColor: "#f0b90b",
      iconBg: "rgba(240,185,11,0.12)",
      label: "Theme",
      right: (
        <Toggle enabled={theme === "dark"} onToggle={toggleTheme} />
      ),
      sub: theme === "dark" ? "Dark" : "Light",
    },
    {
      icon: Globe,
      iconColor: "#22c55e",
      iconBg: "rgba(34,197,94,0.12)",
      label: "Language",
      right: <span className="text-[13px] text-trade-text-muted">English</span>,
      sub: undefined,
    },
    {
      icon: Volume2,
      iconColor: "#3b82f6",
      iconBg: "rgba(59,130,246,0.12)",
      label: "Fill Sounds",
      right: <Toggle enabled={fillSound} onToggle={() => setFillSound(v => !v)} />,
      sub: "Play a sound when an order is filled",
    },
    {
      icon: Bell,
      iconColor: "#a855f7",
      iconBg: "rgba(168,85,247,0.12)",
      label: "Price Alert Sound",
      right: <Toggle enabled={alertSound} onToggle={() => setAlertSound(v => !v)} />,
      sub: "Play a sound when a price alert fires",
    },
  ];

  return (
    <div
      className={`fixed inset-0 flex flex-col justify-end ${theme === "dark" ? "dark" : ""}`}
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative bg-trade-card rounded-t-3xl shadow-2xl"
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

        {/* Header */}
        <div className="px-5 pt-2 pb-4">
          <p className="text-[11px] text-trade-text-muted uppercase tracking-widest font-medium">Preferences</p>
          <p className="text-[18px] font-bold text-trade-text leading-tight">Settings</p>
        </div>

        {/* Rows */}
        <div className="px-5 divide-y divide-trade-text/5">
          {rows.map(({ icon: Icon, iconColor, iconBg, label, sub, right }) => (
            <div key={label} className="flex items-center gap-3 py-3.5">
              <span
                className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: iconBg }}
              >
                <Icon className="h-4 w-4" style={{ color: iconColor }} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-trade-text leading-tight">{label}</p>
                {sub && <p className="text-[11px] text-trade-text-muted mt-0.5">{sub}</p>}
              </div>
              {right}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
