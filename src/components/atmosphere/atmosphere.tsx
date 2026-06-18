"use client";

import { DustParticles } from "./dust-particles";
import { CandleGlow } from "./candle-glow";

interface AtmosphereProps {
  children: React.ReactNode;
  className?: string;
  particles?: boolean;
  vignette?: boolean;
}

export function Atmosphere({
  children,
  className = "",
  particles = true,
  vignette = true,
}: AtmosphereProps) {
  return (
    <div className={`atmosphere relative min-h-screen ${vignette ? "vignette" : ""} ${className}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {particles && (
          <>
            <CandleGlow className="left-[6%] top-[8%] h-72 w-72 opacity-70" delay={0} />
            <CandleGlow className="right-[8%] top-[15%] h-56 w-56 opacity-50" delay={3} />
            <DustParticles count={24} />
          </>
        )}
      </div>
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
