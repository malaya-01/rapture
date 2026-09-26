"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLandingStore } from "@/store/landing-store";

const SCROLL_SENSITIVITY = 0.00035;
const TOUCH_SENSITIVITY = 0.0012;

/** Shared journey position — kept in sync for wheel + nav jumps */
export const journeyTarget = { value: 0 };
const journeyCurrent = { value: 0 };

/**
 * Wheel / touch drives camera journey (0–1). No page scroll.
 */
export function useScrollJourney() {
  const tween = useRef<gsap.core.Tween | null>(null);
  const setScrollProgress = useLandingStore((s) => s.setScrollProgress);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    journeyCurrent.value = useLandingStore.getState().scrollProgress;

    const animateToTarget = (duration = 1.4) => {
      tween.current?.kill();
      tween.current = gsap.to(journeyCurrent, {
        value: journeyTarget.value,
        duration,
        ease: "power3.out",
        onUpdate: () => setScrollProgress(journeyCurrent.value),
      });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      journeyTarget.value = Math.min(
        1,
        Math.max(0, journeyTarget.value + e.deltaY * SCROLL_SENSITIVITY)
      );
      animateToTarget();
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      journeyTarget.value = Math.min(
        1,
        Math.max(0, journeyTarget.value + dy * TOUCH_SENSITIVITY)
      );
      animateToTarget(0.8);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      tween.current?.kill();
    };
  }, [setScrollProgress]);
}

export function scrollToProgress(ratio: number) {
  journeyTarget.value = Math.min(1, Math.max(0, ratio));
  gsap.to(journeyCurrent, {
    value: journeyTarget.value,
    duration: 2.2,
    ease: "power3.inOut",
    onUpdate: () => useLandingStore.getState().setScrollProgress(journeyCurrent.value),
  });
}
