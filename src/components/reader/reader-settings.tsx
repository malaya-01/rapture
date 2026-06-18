"use client";

import { useState } from "react";
import { Settings, X, Download, Upload } from "lucide-react";
import type { ReaderFontSize, ReaderLineWidth, ReaderTheme } from "@/types";
import { useReadingStore } from "@/store/reading-store";
import { cn } from "@/lib/utils";

interface ReaderSettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function ReaderSettingsPanel({ open, onClose }: ReaderSettingsPanelProps) {
  const {
    fontSize,
    lineWidth,
    theme,
    reducedMotion,
    setReaderSettings,
    exportProgress,
    importProgress,
  } = useReadingStore();
  const [importMsg, setImportMsg] = useState<string | null>(null);

  if (!open) return null;

  const handleImport = () => {
    const raw = window.prompt("Paste your exported reading progress JSON:");
    if (!raw) return;
    const ok = importProgress(raw);
    setImportMsg(ok ? "Progress restored." : "Invalid backup file.");
    setTimeout(() => setImportMsg(null), 3000);
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-bg/60 backdrop-blur-sm"
        aria-label="Close settings"
        onClick={onClose}
      />
      <div className="text-ui fixed bottom-28 left-3 right-3 z-[61] mx-auto max-w-md rounded-sm border border-gold/15 bg-bg-elevated p-5 shadow-2xl md:bottom-20 md:left-auto md:right-6 md:w-96">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gold">
            <Settings className="h-4 w-4" />
            <span className="text-sm tracking-wide">Reader Settings</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4 text-text-muted hover:text-gold" />
          </button>
        </div>

        <SettingGroup label="Font size">
          {(["sm", "md", "lg"] as ReaderFontSize[]).map((v) => (
            <Toggle
              key={v}
              active={fontSize === v}
              onClick={() => setReaderSettings({ fontSize: v })}
              label={v === "sm" ? "Small" : v === "md" ? "Medium" : "Large"}
            />
          ))}
        </SettingGroup>

        <SettingGroup label="Line width">
          {(["narrow", "default", "wide"] as ReaderLineWidth[]).map((v) => (
            <Toggle
              key={v}
              active={lineWidth === v}
              onClick={() => setReaderSettings({ lineWidth: v })}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
            />
          ))}
        </SettingGroup>

        <SettingGroup label="Theme">
          {(["dark", "sepia", "paper"] as ReaderTheme[]).map((v) => (
            <Toggle
              key={v}
              active={theme === v}
              onClick={() => setReaderSettings({ theme: v })}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
            />
          ))}
        </SettingGroup>

        <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 text-sm text-text-muted">
          <span>Reduce motion</span>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => setReaderSettings({ reducedMotion: e.target.checked })}
            className="accent-gold"
          />
        </label>

        <div className="mt-6 border-t border-gold/10 pt-4">
          <p className="mb-2 text-xs text-text-muted">Sync across devices</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([exportProgress()], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `rapture-progress-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-gold/20 px-3 py-2 text-xs text-gold hover:bg-gold/10"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button
              type="button"
              onClick={handleImport}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-gold/20 px-3 py-2 text-xs text-gold hover:bg-gold/10"
            >
              <Upload className="h-3.5 w-3.5" />
              Import
            </button>
          </div>
          {importMsg && (
            <p className="mt-2 text-center text-xs text-gold/80">{importMsg}</p>
          )}
        </div>
      </div>
    </>
  );
}

function SettingGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs text-text-muted">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-sm border px-3 py-1.5 text-xs transition-colors",
        active
          ? "border-gold/40 bg-gold/15 text-gold"
          : "border-gold/10 text-text-muted hover:border-gold/25"
      )}
    >
      {label}
    </button>
  );
}

export function readerSettingsClassName(settings: {
  fontSize: ReaderFontSize;
  lineWidth: ReaderLineWidth;
  theme: ReaderTheme;
  reducedMotion: boolean;
}) {
  return cn(
    settings.fontSize === "sm" && "reader-font-sm",
    settings.fontSize === "md" && "reader-font-md",
    settings.fontSize === "lg" && "reader-font-lg",
    settings.lineWidth === "narrow" && "reader-width-narrow",
    settings.lineWidth === "default" && "reader-width-default",
    settings.lineWidth === "wide" && "reader-width-wide",
    settings.theme === "sepia" && "reader-theme-sepia",
    settings.theme === "paper" && "reader-theme-paper",
    settings.reducedMotion && "reader-reduced-motion"
  );
}
