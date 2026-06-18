"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "rapture-maturity-accepted-v1";

export function MaturityGate({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    setAccepted(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  if (accepted === null) return null;

  return (
    <>
      {children}
      <AnimatePresence>
        {!accepted && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="maturity-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center bg-bg/95 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="codex-panel max-w-lg rounded-sm p-8"
            >
              <p className="label-volume text-gold/60">Content Notice</p>
              <h2 id="maturity-title" className="title-chapter mt-3 text-gold">
                Adult Fiction (18+)
              </h2>
              <div className="reader-prose mt-6 space-y-4 !text-lg text-text/90">
                <p>
                  <strong>Rapture: The Fractured Sky</strong> is written for adult
                  readers. It includes graphic survival violence, injury, death,
                  hazard, and moral compromise — not sanitized for younger audiences.
                </p>
                <p>
                  Romance develops slowly and may include affection and kissing when
                  earned. Explicit sexual content is not depicted on the page.
                </p>
                <p className="text-text-muted">
                  By continuing, you confirm you are at least 18 years old.
                </p>
              </div>
              <div className="text-ui mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem(STORAGE_KEY, "true");
                    setAccepted(true);
                  }}
                  className="flex-1 rounded-sm border border-gold/40 bg-gold/15 px-4 py-3 text-sm text-gold hover:bg-gold/25"
                >
                  I am 18 or older — Enter
                </button>
                <a
                  href="https://www.google.com"
                  className="flex-1 rounded-sm border border-gold/15 px-4 py-3 text-center text-sm text-text-muted hover:text-text"
                >
                  Leave
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
