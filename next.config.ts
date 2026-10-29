import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const vroomsitesUrl =
      process.env.VROOMSITES_URL ||
      (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://d-car.com.pl");

    return {
      beforeFiles: [
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
