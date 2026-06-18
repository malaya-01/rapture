import { NextResponse } from "next/server";
import {
  VolumeExportError,
  buildVolumePdfBuffer,
  volumePdfFilename,
} from "@/lib/volume-export-pdf";
import { manifestVolumes } from "@/data/chapter-manifest";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ volumeId: string }> }
) {
  const { volumeId } = await context.params;

  try {
    const volume = manifestVolumes.find((v) => v.id === volumeId);
    if (!volume) {
      return NextResponse.json({ error: "Volume not found." }, { status: 404 });
    }

    const pdf = await buildVolumePdfBuffer(volumeId);
    const filename = volumePdfFilename(volume);

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (err instanceof VolumeExportError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Volume PDF export failed:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF. Please try again." },
      { status: 500 }
    );
  }
}
