import { CodexDetailProfile } from "@/components/codex/codex-detail-profile";
import { dungeonDetailConfig } from "@/lib/codex-details";

export default async function DungeonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CodexDetailProfile config={dungeonDetailConfig(id)} />;
}
