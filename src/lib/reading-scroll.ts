/** Window-based scroll helpers for the immersive reader. */

export function getWindowScrollPercent() {
  if (typeof window === "undefined") return 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return (window.scrollY / max) * 100;
}

export function scrollWindowToPercent(percent: number, behavior: ScrollBehavior = "auto") {
  if (typeof window === "undefined") return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: (percent / 100) * max, behavior });
}

export function clampScrollPercent(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}
