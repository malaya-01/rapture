import { CharacterProfile } from "@/components/codex/character-profile";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CharacterProfile id={id} />;
}
