"use client";

import { useRef, useState } from "react";
import { Upload, Check, Loader2, AlertCircle } from "lucide-react";
import type { ImageManifestEntry } from "@/data/image-manifest";
import { cn } from "@/lib/utils";

interface ImageUploadButtonProps {
  entry: ImageManifestEntry;
  onUploaded?: (entry: ImageManifestEntry) => void;
  className?: string;
}

export function ImageUploadButton({
  entry,
  onUploaded,
  className,
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const onPick = () => {
    if (state === "uploading") return;
    inputRef.current?.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setState("uploading");
    setMessage(null);

    const form = new FormData();
    form.append("category", entry.category);
    form.append("id", entry.id);
    form.append("file", file);

    try {
      const res = await fetch("/api/images/upload", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        publicPath?: string;
        version?: number;
        filename?: string;
        relativePath?: string;
        manifestNote?: string;
      };

      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(data.error ?? "Upload failed");
        return;
      }

      setState("done");
      setMessage(data.manifestNote ?? data.filename ?? "Uploaded");
      onUploaded?.({
        ...entry,
        status: "present",
        filename: data.filename ?? entry.filename,
        relativePath: data.relativePath ?? entry.relativePath,
        publicPath: data.publicPath ?? entry.publicPath,
        version: data.version,
      });
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
      setMessage("Network error");
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(e) => void onFile(e)}
      />
      <button
        type="button"
        onClick={onPick}
        disabled={state === "uploading"}
        title={`Upload to ${entry.relativePath}`}
        className={cn(
          "text-ui flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs transition-colors",
          state === "uploading" && "border-gold/25 text-gold",
          state === "done" && "border-success/40 text-success",
          state === "error" && "border-danger/40 text-danger",
          state === "idle" &&
            "border-gold/20 text-text-muted hover:border-gold/35 hover:text-gold"
        )}
      >
        {state === "uploading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {state === "done" && <Check className="h-3.5 w-3.5" />}
        {state === "error" && <AlertCircle className="h-3.5 w-3.5" />}
        {state === "idle" && <Upload className="h-3.5 w-3.5" />}
        {state === "uploading"
          ? "Uploading…"
          : state === "done"
            ? "Uploaded"
            : state === "error"
              ? "Retry"
              : "Upload"}
      </button>
      {message && state === "error" && (
        <p className="absolute right-0 top-full z-10 mt-1 max-w-[14rem] rounded-sm border border-danger/30 bg-bg-elevated px-2 py-1 text-[0.65rem] text-danger">
          {message}
        </p>
      )}
    </div>
  );
}
