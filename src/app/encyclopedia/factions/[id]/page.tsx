import { CodexDetailProfile } from "@/components/codex/codex-detail-profile";
import { factionDetailConfig } from "@/lib/codex-details";

export default async function FactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CodexDetailProfile config={factionDetailConfig(id)} />;
}
