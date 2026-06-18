import { CodexDetailProfile } from "@/components/codex/codex-detail-profile";
import { companionDetailConfig } from "@/lib/codex-details";

export default async function CompanionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CodexDetailProfile config={companionDetailConfig(id)} />;
}
