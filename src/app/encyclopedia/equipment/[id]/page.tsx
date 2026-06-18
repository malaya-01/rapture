import { CodexDetailProfile } from "@/components/codex/codex-detail-profile";
import { equipmentDetailConfig } from "@/lib/codex-details";

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CodexDetailProfile config={equipmentDetailConfig(id)} />;
}
