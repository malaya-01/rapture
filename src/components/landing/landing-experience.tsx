"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useGLTF } from "@react-three/drei";
import { useLandingStore } from "@/store/landing-store";
import { LANDING_PRELOAD_URLS } from "@/lib/landing/asset-registry";
import { useScrollJourney } from "@/lib/landing/use-scroll-journey";
import { LandingUI } from "./landing-ui";
import { MagicalNav } from "./magical-nav";
import { LandingLoader } from "./landing-loader";

const LandingCanvas = dynamic(
  () => import("./landing-canvas").then((m) => m.LandingCanvas),
  { ssr: false, loading: () => <div className="fixed inset-0 bg-[#050505]" /> }
);

export function LandingExperience() {
  const setMouse = useLandingStore((s) => s.setMouse);
  const setIsMobile = useLandingStore((s) => s.setIsMobile);
  const setReducedMotion = useLandingStore((s) => s.setReducedMotion);
  const reducedMotion = useLandingStore((s) => s.reducedMotion);

  useScrollJourney();

  useEffect(() => {
    LANDING_PRELOAD_URLS.forEach((url) => useGLTF.preload(url));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMq);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", onMove);
    };
  }, [setMouse, setIsMobile, setReducedMotion]);

  return (
    <div className="landing-root fixed inset-0 bg-[#050505] text-[#F5EFE2]">
      <div className="absolute inset-0 z-0">
        {reducedMotion ? (
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 50% 35%, #1a1510 0%, #090807 50%, #050505 100%)",
            }}
          />
        ) : (
          <LandingCanvas />
        )}
        <div className="landing-atmosphere-overlay pointer-events-none absolute inset-0" />
      </div>

      <MagicalNav />
      <LandingLoader />
      <LandingUI />
    </div>
  );
}
