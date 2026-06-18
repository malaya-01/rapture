"use client";

import { useEffect, useRef } from "react";
import type { AmbientTrack } from "@/types";

const TRACK_VOLUME: Record<Exclude<AmbientTrack, "none">, number> = {
  library: 0.4,
  rain: 0.35,
  wind: 0.3,
  fireplace: 0.45,
  music: 0.25,
};

const AUDIO_EXTENSIONS = [".mp3", ".ogg", ".wav", ".m4a"] as const;

let activeAudio: HTMLAudioElement | null = null;
let synthStop: (() => void) | null = null;

function stopAll() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = "";
    activeAudio = null;
  }
  synthStop?.();
  synthStop = null;
}

/** Procedural fallback when no audio file exists on disk. */
function startSynthFallback(track: Exclude<AmbientTrack, "none">) {
  if (typeof window === "undefined") return;

  const audioCtx = new AudioContext();
  const gain = audioCtx.createGain();
  gain.gain.value = TRACK_VOLUME[track] * 0.15;
  gain.connect(audioCtx.destination);

  const makeNoise = (seconds: number) => {
    const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * seconds, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  };

  const sources: AudioScheduledSourceNode[] = [];

  if (track === "library" || track === "wind" || track === "rain") {
    const src = audioCtx.createBufferSource();
    src.buffer = makeNoise(2);
    src.loop = true;
    const filter = audioCtx.createBiquadFilter();
    if (track === "library") {
      filter.type = "lowpass";
      filter.frequency.value = 400;
    } else if (track === "wind") {
      filter.type = "bandpass";
      filter.frequency.value = 800;
    } else {
      filter.type = "highpass";
      filter.frequency.value = 1200;
    }
    src.connect(filter);
    filter.connect(gain);
    src.start();
    sources.push(src);
  } else if (track === "fireplace") {
    const osc = audioCtx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 60;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 200;
    osc.connect(filter);
    filter.connect(gain);
    osc.start();
    sources.push(osc);
  } else {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 110;
    osc.connect(gain);
    osc.start();
    sources.push(osc);
  }

  synthStop = () => {
    for (const s of sources) {
      try {
        s.stop();
      } catch {
        /* already stopped */
      }
    }
    gain.disconnect();
    void audioCtx.close();
  };
}

function tryPlayFile(track: Exclude<AmbientTrack, "none">): Promise<boolean> {
  return new Promise((resolve) => {
    let extIndex = 0;

    const attempt = () => {
      if (extIndex >= AUDIO_EXTENSIONS.length) {
        resolve(false);
        return;
      }

      const ext = AUDIO_EXTENSIONS[extIndex++];
      const audio = new Audio(`/assets/audio/${track}${ext}`);
      audio.loop = true;
      audio.volume = TRACK_VOLUME[track];
      audio.preload = "auto";

      const onReady = () => {
        audio.removeEventListener("error", onError);
        void audio.play().then(
          () => {
            activeAudio = audio;
            resolve(true);
          },
          () => resolve(false)
        );
      };

      const onError = () => {
        audio.removeEventListener("canplaythrough", onReady);
        attempt();
      };

      audio.addEventListener("canplaythrough", onReady, { once: true });
      audio.addEventListener("error", onError, { once: true });
      audio.load();
    };

    attempt();
  });
}

async function startTrack(track: AmbientTrack) {
  stopAll();
  if (track === "none") return;

  const played = await tryPlayFile(track);
  if (!played) startSynthFallback(track);
}

export function useAmbientSound(track: AmbientTrack) {
  const prev = useRef<AmbientTrack>("none");

  useEffect(() => {
    if (prev.current === track) return;
    void startTrack(track);
    prev.current = track;
    return () => stopAll();
  }, [track]);
}
