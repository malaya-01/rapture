import { getBookJsonLd } from "@/lib/structured-data";

export function BookJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getBookJsonLd()) }}
    />
  );
}
