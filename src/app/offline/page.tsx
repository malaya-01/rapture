import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center text-text">
      <h1 className="font-display text-2xl text-gold">You are offline</h1>
      <p className="mt-4 font-serif text-text-muted">
        Cached pages may still be available. Reconnect to sync reading progress.
      </p>
      <Link href="/" className="text-ui mt-8 text-sm text-gold hover:underline">
        Return home
      </Link>
    </div>
  );
}
