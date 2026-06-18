import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="label-volume text-gold/50">Lost in the Fracture</p>
      <h1 className="title-chapter mt-4 text-gold">Page not found</h1>
      <p className="mt-4 max-w-md font-serif text-lg text-text-muted">
        This path does not exist in the archives — perhaps it unlocks in a later chapter.
      </p>
      <div className="text-ui mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-sm border border-gold/30 px-5 py-2.5 text-sm text-gold hover:bg-gold/10"
        >
          Home
        </Link>
        <Link
          href="/read"
          className="rounded-sm border border-gold/15 px-5 py-2.5 text-sm text-text-muted hover:text-text"
        >
          Continue reading
        </Link>
      </div>
    </div>
  );
}
