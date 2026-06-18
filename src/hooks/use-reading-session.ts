"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useReadingStore } from "@/store/reading-store";
import { requestLeaveChapterConfirm } from "@/store/leave-confirm-store";
import {
  getWindowScrollPercent,
  scrollWindowToPercent,
  clampScrollPercent,
} from "@/lib/reading-scroll";
import {
  isMidChapterScroll,
  isLeavingReadPath,
  resolveLinkPath,
} from "@/lib/reading-leave";

interface UseReadingSessionOptions {
  chapterId: string;
  chapterTitle: string;
  enabled?: boolean;
}

/**
 * Tracks scroll position, auto-saves progress + bookmark, restores on return,
 * and prompts before leaving mid-chapter.
 */
export function useReadingSession({
  chapterId,
  chapterTitle,
  enabled = true,
}: UseReadingSessionOptions) {
  const router = useRouter();
  const setScrollProgress = useReadingStore((s) => s.setScrollProgress);

  const restoredRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushSave = useCallback(() => {
    if (!enabled) return;
    const pct = clampScrollPercent(getWindowScrollPercent());
    setScrollProgress(chapterId, pct);
  }, [chapterId, enabled, setScrollProgress]);

  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(flushSave, 400);
  }, [flushSave]);

  // Restore scroll when chapter loads or user returns to /read
  useEffect(() => {
    if (!enabled) return;
    restoredRef.current = false;

    const state = useReadingStore.getState();
    const bookmark = state.bookmarks[chapterId];
    const saved = state.progress[chapterId]?.scrollPercent ?? 0;
    const target = bookmark ?? saved;
    if (target <= 0) return;

    const restore = () => {
      if (restoredRef.current) return;
      scrollWindowToPercent(target, "auto");
      restoredRef.current = true;
    };

    requestAnimationFrame(restore);
    const t1 = setTimeout(restore, 50);
    const t2 = setTimeout(restore, 300);
    const t3 = setTimeout(restore, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [chapterId, enabled]);

  // Scroll listener — debounced auto-save + auto-bookmark
  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => scheduleSave();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, scheduleSave]);

  // Flush on tab hide, unmount, or page leave
  useEffect(() => {
    if (!enabled) return;

    const onHide = () => {
      if (document.visibilityState === "hidden") flushSave();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flushSave);

    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flushSave);
      flushSave();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [enabled, flushSave]);

  // Intercept in-app navigation away from /read (custom modal, not window.confirm)
  useEffect(() => {
    if (!enabled) return;

    const onDocumentClick = (e: MouseEvent) => {
      if (!isMidChapterScroll()) return;

      const anchor = (e.target as Element).closest("a");
      if (!anchor || anchor.target === "_blank") return;

      const href = anchor.getAttribute("href");
      const path = href ? resolveLinkPath(href) : null;
      if (!path || !isLeavingReadPath(path)) return;

      e.preventDefault();
      e.stopPropagation();

      flushSave();
      void requestLeaveChapterConfirm(chapterTitle).then((ok) => {
        if (ok) router.push(path);
      });
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [chapterTitle, enabled, flushSave, router]);

  // Browser tab close — only native dialog is possible here
  useEffect(() => {
    if (!enabled) return;

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isMidChapterScroll()) return;
      flushSave();
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [enabled, flushSave]);

  return { flushSave, getScrollPercent: getWindowScrollPercent };
}
