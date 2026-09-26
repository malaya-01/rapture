import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Marcellus, Inter } from "next/font/google";
import { Navigation } from "@/components/layout/navigation";
import { MaturityGate } from "@/components/layout/maturity-gate";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";
import { BookJsonLd } from "@/components/seo/json-ld";
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

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Aether Vale Digital Library",
    template: "%s | Aether Vale Library",
  },
  description:
    "Premium digital novels — immersive reading, volume libraries, and living world codexes. Featuring Rapture and Echoes of the Void.",
  openGraph: {
    title: "Aether Vale Digital Library",
    description:
      "Premium digital novels — Rapture, Echoes of the Void, and more.",
    type: "book",
    authors: ["Aether Vale"],
    images: [{ url: "/window.svg", width: 1200, height: 630, alt: "Aether Vale Digital Library" }],
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
      className={`${cinzel.variable} ${cormorant.variable} ${marcellus.variable} ${inter.variable} h-full antialiased`}
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
