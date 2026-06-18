"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import type { Illustration } from "@/types";

interface IllustrationBlockProps {
  illustration: Illustration;
  className?: string;
}

export function IllustrationBlock({
  illustration,
  className = "",
}: IllustrationBlockProps) {
  const [lightbox, setLightbox] = useState(false);
  const color = illustration.color ?? "#8b6b2e";

  return (
    <>
      <motion.figure
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className={`my-6 ${className}`}
      >
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="illustration-frame group relative block w-full cursor-zoom-in overflow-hidden rounded-sm"
          style={{ aspectRatio: illustration.aspectRatio ?? "16/10" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(145deg, ${color}22 0%, ${color}44 40%, #2d241a88 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(ellipse at 30% 20%, ${color}66, transparent 60%), radial-gradient(ellipse at 70% 80%, #0b090888, transparent 50%)`,
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-volume text-ink/40">{illustration.type}</span>
            <p className="mt-2 font-display text-sm tracking-widest text-ink/70 uppercase">
              {illustration.title}
            </p>
            {illustration.subtitle && (
              <p className="mt-1 font-serif text-xs italic text-ink/50">
                {illustration.subtitle}
              </p>
            )}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-ink/20 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-3 w-3 text-parchment" />
          </div>
        </button>
        {illustration.caption && (
          <figcaption className="mt-2 text-center font-serif text-xs italic text-ink/45">
            {illustration.caption}
          </figcaption>
        )}
      </motion.figure>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-void/90 p-8 backdrop-blur-md"
            onClick={() => setLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="relative max-h-[85vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightbox(false)}
                className="absolute -right-2 -top-10 text-parchment/60 hover:text-gold"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div
                className="illustration-frame rounded-md"
                style={{
                  aspectRatio: illustration.aspectRatio ?? "16/10",
                  width: "min(85vw, 900px)",
                  background: `linear-gradient(145deg, ${color}33, ${color}66, #2d241a)`,
                }}
              >
                <div className="flex h-full flex-col items-center justify-center p-12 text-center">
                  <span className="text-volume text-parchment/40">{illustration.type}</span>
                  <h3 className="mt-4 font-display text-2xl tracking-widest text-gold">
                    {illustration.title}
                  </h3>
                  {illustration.subtitle && (
                    <p className="mt-2 font-serif text-lg italic text-parchment/60">
                      {illustration.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
