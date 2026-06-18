"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { requestLeaveChapterConfirm } from "@/store/leave-confirm-store";
import {
  isMidChapterScroll,
  isLeavingReadPath,
  resolveLinkPath,
} from "@/lib/reading-leave";

type NavigateOptions = { scroll?: boolean };

/**
 * Router wrapper that shows the in-app leave modal before navigating away mid-chapter.
 */
export function useGuardedReaderNavigation(
  chapterTitle: string,
  enabled: boolean,
  onFlush: () => void
) {
  const router = useRouter();
  const leavingRef = useRef(false);

  const tryLeave = useCallback(
    (navigate: () => void) => {
      if (!enabled || !isMidChapterScroll()) {
        navigate();
        return;
      }
      onFlush();
      void requestLeaveChapterConfirm(chapterTitle).then((ok) => {
        if (ok) {
          leavingRef.current = true;
          navigate();
        }
      });
    },
    [chapterTitle, enabled, onFlush]
  );

  const push = useCallback(
    (href: string, options?: NavigateOptions) => {
      if (!enabled) {
        router.push(href, options);
        return;
      }
      const path = resolveLinkPath(href) ?? href;
      if (!isLeavingReadPath(path)) {
        router.push(href, options);
        return;
      }
      tryLeave(() => router.push(href, options));
    },
    [enabled, router, tryLeave]
  );

  const replace = useCallback(
    (href: string, options?: NavigateOptions) => {
      if (!enabled) {
        router.replace(href, options);
        return;
      }
      const path = resolveLinkPath(href) ?? href;
      if (!isLeavingReadPath(path)) {
        router.replace(href, options);
        return;
      }
      tryLeave(() => router.replace(href, options));
    },
    [enabled, router, tryLeave]
  );

  useEffect(() => {
    if (!enabled) return;

    const onPopState = () => {
      if (leavingRef.current) {
        leavingRef.current = false;
        return;
      }
      if (!isMidChapterScroll()) return;

      onFlush();
      history.pushState(null, "", window.location.href);

      void requestLeaveChapterConfirm(chapterTitle).then((ok) => {
        if (ok) {
          leavingRef.current = true;
          history.back();
        }
      });
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [chapterTitle, enabled, onFlush]);

  return { push, replace, router };
}
