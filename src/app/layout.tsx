import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import { Navigation } from "@/components/layout/navigation";
import { MaturityGate } from "@/components/layout/maturity-gate";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";
import { BookJsonLd } from "@/components/seo/json-ld";
import { bookMeta } from "@/data/book";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${bookMeta.title}: ${bookMeta.subtitle}`,
    template: `%s | ${bookMeta.title}`,
  },
  description: bookMeta.description,
  openGraph: {
    title: `${bookMeta.title}: ${bookMeta.subtitle}`,
    description: bookMeta.description,
    type: "book",
    authors: [bookMeta.author],
    images: [{ url: "/window.svg", width: 1200, height: 630, alt: bookMeta.title }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-text">
        <BookJsonLd />
        <MaturityGate>
          <ServiceWorkerRegister />
          <Navigation />
          <main>{children}</main>
        </MaturityGate>
      </body>
    </html>
  );
}
