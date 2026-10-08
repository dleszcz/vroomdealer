import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
