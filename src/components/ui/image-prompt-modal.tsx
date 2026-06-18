"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Copy, Check } from "lucide-react";
import { getImagePrompt } from "@/data/image-prompts";
import { getImageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";

interface ImagePromptButtonProps {
  promptId: string;
  className?: string;
  size?: "sm" | "md";
}

export function ImagePromptButton({
  promptId,
  className,
  size = "sm",
}: ImagePromptButtonProps) {
  const [open, setOpen] = useState(false);
  const data = getImagePrompt(promptId);

  if (!data) return null;

  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const btnSize = size === "sm" ? "h-6 w-6" : "h-8 w-8";

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        title="Image generation prompt"
        aria-label={`View image prompt for ${data.title}`}
        className={cn(
          "text-ui flex items-center justify-center rounded-full border border-gold/25 bg-bg/80 text-gold/70 backdrop-blur-sm transition-colors hover:border-gold/50 hover:bg-gold/10 hover:text-gold",
          btnSize,
          className
        )}
      >
        <Info className={iconSize} />
      </button>
      <ImagePromptModal
        open={open}
        onClose={() => setOpen(false)}
        title={data.title}
        contentPrompt={data.contentPrompt}
        imagePrompt={data.imagePrompt}
      />
    </>
  );
}

interface ImagePromptModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  contentPrompt: string;
  imagePrompt: string;
}

type PromptTab = "content" | "image";

export function ImagePromptModal({
  open,
  onClose,
  title,
  contentPrompt,
  imagePrompt,
}: ImagePromptModalProps) {
  const [tab, setTab] = useState<PromptTab>("content");
  const [mounted, setMounted] = useState(false);
  const [copiedSection, setCopiedSection] = useState<
    "content" | "image" | "both" | null
  >(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const copy = useCallback(async (section: "content" | "image" | "both") => {
    const text =
      section === "content"
        ? contentPrompt
        : section === "image"
          ? imagePrompt
          : `--- CONTENT BRIEF (read first) ---\n\n${contentPrompt}\n\n--- IMAGE GENERATION PROMPT ---\n\n${imagePrompt}`;
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  }, [contentPrompt, imagePrompt]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="prompt-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-3 pt-14 pb-[5.75rem] max-md:pb-[5.75rem] sm:p-4 sm:pt-20 sm:pb-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-bg/90 backdrop-blur-md" aria-hidden />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="codex-panel relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-sm max-h-[min(calc(100dvh-7.5rem),880px)] sm:max-h-[min(calc(100dvh-6rem),880px)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 border-b border-gold/10 px-5 py-4 md:px-6">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 text-text-muted hover:text-gold"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <p className="label-volume text-gold/60">Illustration Brief</p>
              <h2 id="prompt-modal-title" className="mt-1 pr-8 font-display text-lg text-gold md:text-xl">
                {title}
              </h2>
              <p className="text-ui mt-1 text-xs text-text-muted">
                Read the content brief, then copy the image prompt into your generator.
              </p>

              <div className="mt-4 flex gap-1 rounded-sm border border-gold/10 bg-bg/50 p-1">
                {(
                  [
                    { id: "content" as const, label: "Content brief" },
                    { id: "image" as const, label: "Image prompt" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "text-ui flex-1 rounded-sm px-3 py-2 text-xs transition-colors",
                      tab === t.id
                        ? "bg-gold/15 text-gold"
                        : "text-text-muted hover:text-text"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 md:px-6">
              {tab === "content" ? (
                <div>
                  <p className="text-ui text-xs text-text-muted">
                    Story, lore, and what the image must communicate.
                  </p>
                  <pre className="mt-3 whitespace-pre-wrap rounded-sm border border-gold/10 bg-bg-elevated p-4 font-serif text-sm leading-relaxed text-text/90">
                    {contentPrompt}
                  </pre>
                </div>
              ) : (
                <div>
                  <p className="text-ui text-xs text-text-muted">
                    Paste into your image generator (style, composition, technical).
                  </p>
                  <pre className="mt-3 whitespace-pre-wrap rounded-sm border border-gold/10 bg-bg-elevated p-4 font-serif text-sm leading-relaxed text-text/90">
                    {imagePrompt}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 flex flex-wrap gap-2 border-t border-gold/10 px-5 py-4 md:px-6">
              <button
                type="button"
                onClick={() => void copy(tab)}
                className="text-ui flex flex-1 items-center justify-center gap-2 rounded-sm border border-gold/20 px-4 py-2.5 text-sm text-gold hover:bg-gold/10"
              >
                {copiedSection === tab ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy {tab === "content" ? "brief" : "prompt"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => void copy("both")}
                className="text-ui flex flex-1 items-center justify-center gap-2 rounded-sm border border-gold/25 bg-gold/10 px-4 py-2.5 text-sm text-gold hover:bg-gold/20"
              >
                {copiedSection === "both" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied both
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy both
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

interface PortraitPlaceholderProps {
  promptId: string;
  label?: string;
  color?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  /** Set false inside other interactive elements (e.g. selection cards). */
  showPrompt?: boolean;
}

export function PortraitPlaceholder({
  promptId,
  label,
  color = "#8b6b2e",
  className,
  size = "md",
  children,
  showPrompt = true,
}: PortraitPlaceholderProps) {
  const dims =
    size === "sm" ? "h-16 w-16 text-lg" : size === "lg" ? "h-28 w-28 text-3xl" : "h-20 w-20 text-xl";
  const imageSrc = getImageSrc(promptId);

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden rounded-sm", dims, className)}
      style={
        imageSrc
          ? undefined
          : { background: `linear-gradient(145deg, ${color}55, ${color})` }
      }
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={label ?? promptId}
          className="h-full w-full object-cover"
        />
      ) : (
        children ?? (label && (
          <span className="flex h-full w-full items-center justify-center font-display text-text/80">
            {label}
          </span>
        ))
      )}
      {showPrompt && (
        <ImagePromptButton promptId={promptId} className="absolute -right-1 -top-1 z-10" size="sm" />
      )}
    </div>
  );
}
