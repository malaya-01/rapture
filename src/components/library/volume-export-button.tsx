"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VolumeExportButtonProps {
  volumeId: string;
  volumeTitle: string;
  publishedCount: number;
  className?: string;
}

export function VolumeExportButton({
  volumeId,
  volumeTitle,
  publishedCount,
  className,
}: VolumeExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (publishedCount === 0) return null;

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/export/volume/${volumeId}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Export failed.");
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = /filename="([^"]+)"/.exec(disposition);
      const filename =
        match?.[1] ??
        `Rapture_${volumeId}.pdf`;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void handleExport();
        }}
        disabled={loading}
        className="text-ui inline-flex items-center gap-2 rounded-sm border border-gold/25 bg-gold/5 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/15 disabled:opacity-60"
        title={`Download ${volumeTitle} as PDF`}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        {loading ? "Building PDF\u2026" : "Export PDF"}
      </button>
      {error && (
        <p className="text-ui max-w-[14rem] text-right text-[0.65rem] text-red-400/90">
          {error}
        </p>
      )}
    </div>
  );
}
