"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DustParticlesProps {
  count?: number;
}

/** Deterministic pseudo-random — stable across renders. */
function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function round(n: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function DustParticles({ count = 30 }: DustParticlesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const base = i * 7 + 1;
        return {
          id: i,
          x: round(seeded(base) * 100),
          y: round(seeded(base + 1) * 100),
          size: round(seeded(base + 2) * 2.5 + 0.5),
          duration: round(seeded(base + 3) * 12 + 10),
          delay: round(seeded(base + 4) * 8),
          drift: round((seeded(base + 5) - 0.5) * 40),
          floatY: round(-(20 + seeded(base + 6) * 30)),
        };
      }),
    [count]
  );

  // Framer Motion applies inline styles differently on server vs client — render only after mount.
  if (!mounted) {
    return (
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, p.floatY, 0],
            x: [0, p.drift, 0],
            opacity: [0.05, 0.35, 0.05],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
