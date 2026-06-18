import { getWindowScrollPercent } from "@/lib/reading-scroll";

export function isMidChapterScroll() {
  const pct = getWindowScrollPercent();
  return pct > 4 && pct < 96;
}

export function isLeavingReadPath(pathname: string) {
  return pathname !== "/read" && !pathname.startsWith("/read/");
}

export function resolveLinkPath(href: string): string | null {
  if (!href || href.startsWith("#")) return null;
  try {
    return new URL(href, window.location.origin).pathname;
  } catch {
    return null;
  }
}
