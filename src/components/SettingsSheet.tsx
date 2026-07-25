import { X, Bell, Volume2, Vibrate, Globe, Shield, Info, FileText, Trash2, Moon, Sun, ChevronRight } from "lucide-react";
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

function RowToggle({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  sub,
  enabled,
  onToggle,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  sub?: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}>
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-trade-text leading-tight">{label}</p>
        {sub && <p className="text-[11px] text-trade-text-muted mt-0.5">{sub}</p>}
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

function RowLink({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  onClick,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 active:opacity-60 transition-opacity"
    >
      <span className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}>
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
      </span>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[14px] font-medium text-trade-text leading-tight">{label}</p>
      </div>
      {value && <span className="text-[12px] text-trade-text-muted mr-1">{value}</span>}
      <ChevronRight className="h-4 w-4 text-trade-text/30 flex-shrink-0" />
    </button>
  );
}

export function SettingsSheet({ onClose, theme, toggleTheme }: SettingsSheetProps) {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);

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
        className="relative bg-trade-card rounded-t-3xl shadow-2xl overflow-y-auto max-h-[90vh]"
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

        <div className="px-5 space-y-6">

          {/* Notifications */}
          <div>
            <p className="text-[12px] text-trade-text-muted font-medium mb-1">Notifications</p>
            <div className="divide-y divide-trade-text/5">
              <RowToggle
                icon={Bell}
                iconColor="#f0b90b"
                iconBg="rgba(240,185,11,0.12)"
                label="Push Notifications"
                sub="Order fills, liquidations, alerts"
                enabled={notifEnabled}
                onToggle={() => setNotifEnabled(v => !v)}
              />
              <RowToggle
                icon={Volume2}
                iconColor="#3b82f6"
                iconBg="rgba(59,130,246,0.12)"
                label="Sound Effects"
                sub="Play sounds on fills and alerts"
                enabled={soundEnabled}
                onToggle={() => setSoundEnabled(v => !v)}
              />
              <RowToggle
                icon={Vibrate}
                iconColor="#8b5cf6"
                iconBg="rgba(139,92,246,0.12)"
                label="Haptic Feedback"
                sub="Vibrate on key interactions"
                enabled={hapticEnabled}
                onToggle={() => setHapticEnabled(v => !v)}
              />
            </div>
          </div>

          {/* Display */}
          <div>
            <p className="text-[12px] text-trade-text-muted font-medium mb-1">Display</p>
            <div className="divide-y divide-trade-text/5">
              <RowLink
                icon={theme === "dark" ? Moon : Sun}
                iconColor="#f0b90b"
                iconBg="rgba(240,185,11,0.12)"
                label="Theme"
                value={theme === "dark" ? "Dark" : "Light"}
                onClick={() => { toggleTheme(); }}
              />
              <RowLink
                icon={Globe}
                iconColor="#22c55e"
                iconBg="rgba(34,197,94,0.12)"
                label="Language"
                value="English"
              />
            </div>
          </div>

          {/* Security */}
          <div>
            <p className="text-[12px] text-trade-text-muted font-medium mb-1">Security</p>
            <div className="divide-y divide-trade-text/5">
              <RowLink
                icon={Shield}
                iconColor="#3b82f6"
                iconBg="rgba(59,130,246,0.12)"
                label="Privacy & Security"
              />
            </div>
          </div>

          {/* App */}
          <div>
            <p className="text-[12px] text-trade-text-muted font-medium mb-1">App</p>
            <div className="divide-y divide-trade-text/5">
              <RowLink
                icon={Trash2}
                iconColor="#8b8b8b"
                iconBg="rgba(139,139,139,0.12)"
                label="Clear Cache"
              />
              <RowLink
                icon={FileText}
                iconColor="#8b8b8b"
                iconBg="rgba(139,139,139,0.12)"
                label="Terms of Service"
              />
              <RowLink
                icon={Info}
                iconColor="#8b8b8b"
                iconBg="rgba(139,139,139,0.12)"
                label="About AsterDex"
                value="v1.0.0"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
