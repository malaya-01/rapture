"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark } from "lucide-react";
import { useLeaveConfirmStore } from "@/store/leave-confirm-store";

export function LeaveChapterConfirm() {
  const pending = useLeaveConfirmStore((s) => s.pending);
  const confirm = useLeaveConfirmStore((s) => s.confirm);
  const cancel = useLeaveConfirmStore((s) => s.cancel);

  useEffect(() => {
    if (!pending) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [pending]);

  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, cancel]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {pending && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-chapter-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[350] flex items-center justify-center bg-bg/85 p-6 backdrop-blur-md"
          onClick={cancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="codex-panel w-full max-w-md rounded-sm p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm border border-gold/25 bg-gold/10">
              <Bookmark className="h-5 w-5 text-gold" />
            </div>

            <p className="label-volume text-gold/60">Saved place</p>
            <h2 id="leave-chapter-title" className="title-chapter mt-2 text-gold">
              Leave this chapter?
            </h2>

            <p className="reader-prose mt-5 !text-lg leading-relaxed text-text/90">
              You&apos;re partway through{" "}
              <em className="text-gold/90">{pending.chapterTitle}</em>. Your
              reading place is already saved — you&apos;ll return here when you
              open Read again.
            </p>

            <div className="text-ui mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancel}
                className="rounded-sm border border-gold/15 px-5 py-2.5 text-sm text-text-muted transition-colors hover:border-gold/30 hover:text-text"
              >
                Keep reading
              </button>
              <button
                type="button"
                onClick={confirm}
                className="rounded-sm border border-gold/40 bg-gold/15 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/25"
              >
                Leave chapter
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
