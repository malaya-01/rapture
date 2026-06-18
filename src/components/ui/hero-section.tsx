"use client";

import { motion } from "framer-motion";
import { ChapterOrnament } from "./ornament";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

export function HeroSection({
  title,
  subtitle,
  eyebrow,
  children,
}: HeroSectionProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      className="relative mb-12 text-center"
    >
      {eyebrow && (
        <p className="text-volume mb-4 text-gold/50">{eyebrow}</p>
      )}
      <h1 className="text-legend embossed-title">{title}</h1>
      <ChapterOrnament />
      {subtitle && (
        <p className="mx-auto mt-2 max-w-xl font-serif text-lg italic text-parchment/55">
          {subtitle}
        </p>
      )}
      {children}
    </motion.header>
  );
}
