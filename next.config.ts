import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const vroomsitesUrl =
      process.env.VROOMSITES_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://vroomsites-dleszczs-projects.vercel.app");

    return {
      beforeFiles: [
        {
          source: "/_next/image",
          destination: `${vroomsitesUrl}/_next/image`,
        },
        {
          source: "/scout/:token",
          destination: "/lead/:token",
        },
        // Wsteczna kompatybilność dla starych SMS-ów z pełnym tokenem UUID
        {
          source: "/:token([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
          destination: "/lead/:token",
        },
      ],
      afterFiles: [],
      fallback: [
        // Dowolna ścieżka komisu (np. /wadera, /wadera/samochody, /d-car) serwowana z vroomsites
        {
          source: "/:path*",
          destination: `${vroomsitesUrl}/:path*`,
        },
      ],
    };
  },
  images: {
    qualities: [75, 80, 85],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "**.olxcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "autoplac.pl",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.autoplac.pl",
        pathname: "/**",
      },
    ],
  },
  // Old B2C "skup" marketplace pages. Deliberately parked by the v2 strategy;
  // keep old links working by sending them to the dealer landing.
  async redirects() {
    return [
      { source: "/dla-komisow", destination: "/", permanent: true },
      { source: "/sprzedaj", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
