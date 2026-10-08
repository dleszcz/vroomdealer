import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vroomdealer.pl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VroomDealer: Uniwersalny ekosystem i strona WWW dla Twojego komisu",
    template: "%s | VroomDealer",
  },
  description:
    "Elastyczna platforma sprzedażowa, narzędzia do pozyskiwania aut ze skupu i profesjonalna strona internetowa z mocnym SEO. Rozwiązania wspierające cele biznesowe dealerów samochodowych.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "VroomDealer",
    title: "VroomDealer: Nowoczesne narzędzia dla dealerów aut",
    description: "Szybka strona internetowa z pełnym SEO, gotowe karty aut do udostępnienia oraz zaawansowane narzędzia do zarządzania ofertą i skupem samochodów.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fbfaf7]">{children}</body>
    </html>
  );
}
