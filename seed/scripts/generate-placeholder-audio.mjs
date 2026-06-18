#!/usr/bin/env node
/**
 * Generates short loopable WAV placeholders for reader ambience tracks.
 * Run: npm run seed:audio
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "..", "public", "assets", "audio");
mkdirSync(outDir, { recursive: true });

const TRACKS = ["library", "rain", "wind", "fireplace", "music"];
const SAMPLE_RATE = 22050;
const DURATION_SEC = 2;

function writeWav(filename, samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = samples.length * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(v * 32767 * 0.25), 44 + i * 2);
  }

  writeFileSync(join(outDir, filename), buffer);
}

for (const track of TRACKS) {
  const n = SAMPLE_RATE * DURATION_SEC;
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    if (track === "rain" || track === "wind" || track === "library") {
      samples[i] = (Math.random() * 2 - 1) * (track === "rain" ? 0.4 : 0.25);
    } else if (track === "fireplace") {
      samples[i] = Math.sin(2 * Math.PI * 60 * t) * 0.3;
    } else {
      samples[i] = Math.sin(2 * Math.PI * 110 * t) * 0.2;
    }
  }
  writeWav(`${track}.wav`, samples);
  console.log(`Wrote ${track}.wav`);
}

console.log("Placeholder ambience files ready in public/assets/audio/");
