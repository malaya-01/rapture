"use client";

import { CodexDetailProfile, type CodexDetailConfig } from "@/components/codex/codex-detail-profile";

export function BookCodexDetailProfile({
  bookSlug,
  config,
}: {
  bookSlug: string;
  config: CodexDetailConfig | null;
}) {
  return <CodexDetailProfile config={config} bookSlug={bookSlug} />;
}
