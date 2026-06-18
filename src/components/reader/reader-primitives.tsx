"use client";

import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Illustration } from "@/types";
import { ImagePromptButton } from "@/components/ui/image-prompt-modal";
import { getImageSrc } from "@/lib/images";

interface ArtworkProps {
  illustration?: Illustration;
  title: string;
  subtitle?: string;
  aspectRatio?: string;
  className?: string;
  parallax?: boolean;
  promptId?: string;
}

export function Artwork({
  illustration,
  title,
  subtitle,
  aspectRatio = "21/9",
  className = "",
  promptId,
}: ArtworkProps) {
  const color = illustration?.color ?? "#8b6b2e";
  const imageSrc = promptId ? getImageSrc(promptId) : undefined;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      className={`relative ${className}`}
    >
      <div
        className="artwork-frame w-full rounded-sm"
        style={{
          aspectRatio: illustration?.aspectRatio ?? aspectRatio,
          background: imageSrc
            ? undefined
            : `linear-gradient(155deg, ${color}33 0%, ${color}18 40%, #090807 100%)`,
        }}
      >
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt={illustration?.title ?? title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
            {promptId && (
              <ImagePromptButton
                promptId={promptId}
                className="absolute right-3 top-3 z-10"
                size="md"
              />
            )}
          </>
        ) : (
          <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
            {promptId && (
              <ImagePromptButton
                promptId={promptId}
                className="absolute right-3 top-3 z-10"
                size="md"
              />
            )}
            <span className="label-volume text-text-muted">
              {illustration?.type ?? "illustration"}
            </span>
            <p className="mt-3 font-display text-sm tracking-[0.25em] text-text/70 uppercase">
              {illustration?.title ?? title}
            </p>
            {(illustration?.subtitle ?? subtitle) && (
              <p className="mt-2 font-serif text-base italic text-text-muted">
                {illustration?.subtitle ?? subtitle}
              </p>
            )}
          </div>
        )}
      </div>
      {illustration?.caption && (
        <figcaption className="mt-3 text-center font-serif text-sm italic text-text-muted">
          {illustration.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX, width: "100%" }}
    />
  );
}
