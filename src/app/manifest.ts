import type { MetadataRoute } from "next";
import { characters } from "@/data/characters";
import { monsters } from "@/data/monsters";
import { chapters } from "@/data/chapters";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rapture: The Fractured Sky",
    short_name: "Rapture",
    description:
      "When the sky fractures, an ordinary omega survives among strangers who will become family.",
    start_url: "/read",
    display: "standalone",
    background_color: "#090807",
    theme_color: "#090807",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/window.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
