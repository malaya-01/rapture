import { CodexDetailProfile } from "@/components/codex/codex-detail-profile";
import { artifactDetailConfig } from "@/lib/codex-details";

export default async function ArtifactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CodexDetailProfile config={artifactDetailConfig(id)} />;
}
