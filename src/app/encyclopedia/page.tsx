import { Suspense } from "react";
import { CodexIndex } from "@/components/codex/codex-index";

export default function EncyclopediaPage() {
  return (
    <Suspense fallback={null}>
      <CodexIndex />
    </Suspense>
  );
}
