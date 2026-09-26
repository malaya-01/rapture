import { redirect } from "next/navigation";

export async function GET(
  _request: Request,
  context: { params: Promise<{ volumeId: string }> }
) {
  const { volumeId } = await context.params;
  redirect(`/api/export/rapture/volume/${volumeId}`);
}
