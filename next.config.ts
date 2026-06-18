import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit loads .afm font metrics from disk via __dirname; must not be bundled by Turbopack
  serverExternalPackages: ["pdfkit"],
  images: {
    localPatterns: [
      {
        pathname: "/assets/images/**",
      },
    ],
  },
};

export default nextConfig;
