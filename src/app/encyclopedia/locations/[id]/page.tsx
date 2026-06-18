import { CodexDetailProfile } from "@/components/codex/codex-detail-profile";
import { locationDetailConfig } from "@/lib/codex-details";

export default async function LocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CodexDetailProfile config={locationDetailConfig(id)} />;
}
