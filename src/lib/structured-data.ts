import { bookMeta } from "@/data/book";
import { chapters } from "@/data/chapters";

export function getBookJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: `${bookMeta.title}: ${bookMeta.subtitle}`,
    author: {
      "@type": "Person",
      name: bookMeta.author,
    },
    description: bookMeta.description,
    genre: "Epic Fantasy",
    inLanguage: "en",
    numberOfPages: chapters.reduce((sum, ch) => sum + (ch.blocks?.length ?? 0), 0),
    hasPart: chapters.map((ch) => ({
      "@type": "Chapter",
      name: ch.title,
      position: ch.number,
      description: ch.summary,
    })),
  };
}
