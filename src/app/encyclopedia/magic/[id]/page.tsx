import { CodexDetailProfile } from "@/components/codex/codex-detail-profile";
import { magicDetailConfig } from "@/lib/codex-details";

export default async function MagicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CodexDetailProfile config={magicDetailConfig(id)} />;
}
