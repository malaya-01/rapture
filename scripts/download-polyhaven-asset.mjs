#!/usr/bin/env node
/**
 * Download a Poly Haven model (GLTF + textures) into public/assets/models/landing/
 * Usage: node scripts/download-polyhaven-asset.mjs <asset_id> <output_name> [1k|2k|4k]
 */
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "assets", "models", "landing");
const UA = "AetherValeLibrary/1.0";

const [assetId, outputName, res = "1k"] = process.argv.slice(2);
if (!assetId || !outputName) {
  console.error("Usage: node scripts/download-polyhaven-asset.mjs <asset_id> <output_name> [1k]");
  process.exit(1);
}

const filesRes = await fetch(`https://api.polyhaven.com/files/${assetId}`, {
  headers: { "User-Agent": UA },
});
if (!filesRes.ok) throw new Error(`API failed: ${assetId}`);
const files = await filesRes.json();

const gltfEntry = files.gltf?.[res]?.gltf;
if (!gltfEntry?.url) {
  const sizes = Object.keys(files.gltf ?? {});
  throw new Error(`No gltf/${res} for ${assetId}. Available: ${sizes.join(", ")}`);
}

const assetDir = join(outDir, outputName);
mkdirSync(assetDir, { recursive: true });

async function download(url, dest) {
  if (existsSync(dest)) return;
  mkdirSync(dirname(dest), { recursive: true });
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`Download failed ${url}: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  writeFileSync(dest, buf);
  console.log(`  ${dest.replace(outDir, "")}`);
}

const gltfDest = join(assetDir, `${outputName}.gltf`);
await download(gltfEntry.url, gltfDest);

for (const [rel, info] of Object.entries(gltfEntry.include ?? {})) {
  const dest = join(assetDir, rel);
  await download(info.url, dest);
}

console.log(`✓ ${assetId} → ${outputName}/ (${res})`);
