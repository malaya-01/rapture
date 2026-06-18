import { MonsterProfile } from "@/components/bestiary/bestiary-view";

export default async function MonsterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MonsterProfile id={id} />;
}
