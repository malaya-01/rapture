"use client";

import { cn } from "@/lib/utils";

interface CandleGlowProps {
  className?: string;
  delay?: number;
}

export function CandleGlow({ className, delay = 0 }: CandleGlowProps) {
  return (
    <div
      className={cn("candle-glow pointer-events-none", className)}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}
