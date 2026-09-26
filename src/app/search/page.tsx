"use client";

import { Suspense } from "react";
import { SearchWing } from "@/components/archive/wings/search-wing";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <SearchWing />
    </Suspense>
  );
}
