import Link from "next/link";
import { cn } from "@/lib/utils";

export function EncyclopediaSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-12", className)}>
      <h2 className="label-volume mb-4">{title}</h2>
      {children}
    </section>
  );
}

export function StatGrid({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  const visible = items.filter((i) => i.value && i.value !== "—");
  if (visible.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((item) => (
        <div
          key={item.label}
          className="rounded-sm border border-gold/10 bg-bg-elevated/50 px-4 py-3"
        >
          <p className="text-ui text-[0.65rem] tracking-wider text-text-muted uppercase">
            {item.label}
          </p>
          <p className="mt-1 font-serif text-text">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-gold/15 px-3 py-1 text-sm text-text-muted"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function LinkTagList({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full border border-gold/15 px-3 py-1 text-sm text-gold/80 transition-colors hover:border-gold/40 hover:text-gold"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  if (rows.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-sm border border-gold/10">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead>
          <tr className="border-b border-gold/10 bg-bg-elevated/60">
            {headers.map((h) => (
              <th
                key={h}
                className="text-ui px-4 py-2 text-[0.65rem] tracking-wider text-text-muted uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gold/5 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 font-serif text-text/90">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
