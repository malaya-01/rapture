import { mkdirSync, writeFileSync, statSync } from "fs";
import { spawnSync } from "child_process";
import { join } from "path";
import type { ImageCategory } from "@/data/image-manifest";
import {
  findManifestEntry,
  imageDirForCategory,
  isImageUploadAllowed,
  mimeToExtension,
  removeSiblingImageFiles,
  validateUploadMime,
} from "@/lib/image-upload-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isImageUploadAllowed()) {
    return Response.json(
      {
        error:
          "Image upload is disabled. Set ALLOW_IMAGE_UPLOAD=true to enable in production.",
      },
      { status: 403 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const category = String(formData.get("category") ?? "");
  const id = String(formData.get("id") ?? "");
  const file = formData.get("file");

  if (!category || !id || !(file instanceof File)) {
    return Response.json(
      { error: "Missing category, id, or file" },
      { status: 400 }
    );
  }

  const entry = findManifestEntry(category, id);
  if (!entry) {
    return Response.json({ error: "Unknown manifest entry" }, { status: 404 });
  }

  if (!validateUploadMime(file.type)) {
    return Response.json(
      { error: "Only PNG, JPEG, and WebP images are allowed" },
      { status: 400 }
    );
  }

  const maxBytes = 15 * 1024 * 1024;
  if (file.size > maxBytes) {
    return Response.json(
      { error: "Image must be 15 MB or smaller" },
      { status: 400 }
    );
  }

  const ext = mimeToExtension(file.type);
  const dir = imageDirForCategory(entry.category as ImageCategory);
  mkdirSync(dir, { recursive: true });

  const filename = `${id}${ext}`;
  const absolutePath = join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  writeFileSync(absolutePath, buffer);
  removeSiblingImageFiles(dir, id, ext);

  const sync = spawnSync(
    "node",
    [join(process.cwd(), "seed/scripts/sync-app-data.mjs")],
    { cwd: process.cwd(), encoding: "utf8", timeout: 120_000 }
  );

  if (sync.status !== 0) {
    return Response.json(
      {
        error: "Image saved but manifest refresh failed. Run npm run seed:sync manually.",
        stderr: sync.stderr?.slice(0, 500),
        savedPath: `public/assets/images/${entry.category}/${filename}`,
      },
      { status: 500 }
    );
  }

  const version = statSync(absolutePath).mtimeMs;
  const publicPath = `/assets/images/${entry.category}/${filename}`;

  return Response.json({
    ok: true,
    id: entry.id,
    category: entry.category,
    filename,
    relativePath: `assets/images/${entry.category}/${filename}`,
    publicPath,
    version,
    cacheBustUrl: `${publicPath}?v=${version}`,
  });
}
