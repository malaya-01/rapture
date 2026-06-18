"use client";

import { useEffect, useState } from "react";
import { useReadingStore } from "@/store/reading-store";

export function useStoreHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useReadingStore.persist;
    if (!persist) return;

    const markHydrated = () => setHydrated(true);

    if (persist.hasHydrated()) {
      queueMicrotask(markHydrated);
      return;
    }

    return persist.onFinishHydration(markHydrated);
  }, []);

  return hydrated;
}
