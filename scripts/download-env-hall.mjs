#!/usr/bin/env node
/**
 * Download grand library hall GLB (Poly Pizza / CC0).
 * Source: https://poly.pizza — Castle Hall by Quaternius (low-poly environment)
 */
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "assets", "models", "landing", "env-hall");
const outFile = join(outDir, "env-hall.glb");

/** Poly Pizza CDN — Castle Hall environment (CC0, Quaternius) */
const HALL_URL =
  "https://static.poly.pizza/aa37bc35-ec24-454f-87a6-d54f0dbe9ebc.glb";

mkdirSync(outDir, { recursive: true });

if (existsSync(outFile)) {
  console.log(`✓ env-hall.glb already exists (${outFile})`);
  process.exit(0);
}

console.log("Downloading library hall GLB…");
const res = await fetch(HALL_URL, {
  headers: { "User-Agent": "AetherValeLibrary/1.0" },
});
if (!res.ok) throw new Error(`Download failed: ${res.status}`);
const buf = Buffer.from(await res.arrayBuffer());
writeFileSync(outFile, buf);
console.log(`✓ Saved ${(buf.length / 1024 / 1024).toFixed(1)} MB → env-hall/env-hall.glb`);
