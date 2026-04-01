import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://vroomdealer.pl"
  ),
  title: {
    default: "VroomDealer — Platforma sprzedażowa dla komisów samochodowych",
    template: "%s | VroomDealer",
  },
  description:
    "VroomDealer.pl — ultra-szybkie strony sprzedażowe dla komisów samochodowych. Zwiększ sprzedaż dzięki profesjonalnym ogłoszeniom z retargetingiem i integracją WhatsApp.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "VroomDealer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
