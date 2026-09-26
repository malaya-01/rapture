import { getWindowScrollPercent } from "@/lib/reading-scroll";

export function isMidChapterScroll() {
  const pct = getWindowScrollPercent();
  return pct > 4 && pct < 96;
}

function isReadPath(pathname: string) {
  if (pathname === "/read" || pathname.startsWith("/read/")) return true;
  return /^\/books\/[^/]+\/read(\/|$)/.test(pathname);
}

export function isLeavingReadPath(pathname: string) {
  return !isReadPath(pathname);
}

export function resolveLinkPath(href: string): string | null {
  if (!href || href.startsWith("#")) return null;
  try {
    return new URL(href, window.location.origin).pathname;
  } catch {
    return null;
  }
}
