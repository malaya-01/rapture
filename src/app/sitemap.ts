import type { MetadataRoute } from "next";
import { characters } from "@/data/characters";
import { monsters } from "@/data/monsters";
import { chapters } from "@/data/chapters";
import { manifestChapters } from "@/data/chapter-manifest";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/read`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/library`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/encyclopedia`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/relationships`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/map`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/bestiary`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/timeline`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/images`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  const chapterRoutes = manifestChapters
    .filter((c) => c.status === "published" && chapters.some((ch) => ch.id === c.id))
    .map((c) => ({
      url: `${baseUrl}/read/${c.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const characterRoutes = characters.map((c) => ({
    url: `${baseUrl}/encyclopedia/characters/${c.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  const monsterRoutes = monsters.map((m) => ({
    url: `${baseUrl}/bestiary/${m.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...chapterRoutes, ...characterRoutes, ...monsterRoutes];
}
