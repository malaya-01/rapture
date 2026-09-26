"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { FormEvent, useState } from "react";

export function ArchiveSearchBar({
  defaultQuery = "",
  large = false,
}: {
  defaultQuery?: string;
  large?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <form
      onSubmit={onSubmit}
      className={large ? "archive-search archive-search-lg mx-auto max-w-2xl" : "archive-search"}
      role="search"
    >
      <Search className="archive-search-icon h-4 w-4 text-gold/50" aria-hidden />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search books, characters, lore…"
        className="archive-search-input"
        aria-label="Search the archive"
      />
      <button type="submit" className="archive-search-submit">
        Search
      </button>
    </form>
  );
}
