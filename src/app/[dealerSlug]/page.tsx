import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveTenant } from "@/lib/tenant";
import { DealerSchema } from "@/components/vehicle-schema";
import { SectionRenderer } from "@/components/sections/section-renderer";

type Props = {
  params: Promise<{ dealerSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dealerSlug } = await params;
  const tenant = await resolveTenant({ slug: dealerSlug });

  if (!tenant) return {};

  const title = (
    tenant.seo?.metaTitle ||
    `${tenant.businessName} - Skup aut za gotówkę i sprzedaż samochodów${
      tenant.location?.city ? ` | ${tenant.location.city}` : ""
    }`
  ).replace(/—|–/g, "-");

  const description = (
    tenant.seo?.metaDescription ||
    tenant.businessDescription ||
    `Profesjonalny skup aut za gotówkę oraz sprawdzone samochody używane z gwarancją w ${tenant.businessName}. Bezpłatna wycena i dojazd.`
  ).replace(/—|–/g, "-");

  const baseUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `https://vroomdealer.pl/${dealerSlug}`;

  const heroImage = tenant.branding.media?.heroImageUrl;
  const ogImageUrl = heroImage
    ? heroImage.startsWith("http")
      ? heroImage
      : `${baseUrl}${heroImage}`
    : undefined;

  const themeColor =
    tenant.branding.colors.headerBg || tenant.branding.colors.primary || "#080808";

  return {
    title,
    description,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: tenant.businessName,
      locale: "pl_PL",
      type: "website",
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "theme-color": themeColor,
    },
  };
}

export default async function DealerPage({ params }: Props) {
  const { dealerSlug } = await params;
  const tenant = await resolveTenant({ slug: dealerSlug });

  if (!tenant) {
    notFound();
  }

  const baseUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `https://vroomdealer.pl/${tenant.slug}`;

  return (
    <>
      <DealerSchema
        name={tenant.businessName}
        description={tenant.businessDescription || undefined}
        address={tenant.location?.address || undefined}
        city={tenant.location?.city || undefined}
        phone={tenant.contact.phone || undefined}
        url={baseUrl}
      />

      <SectionRenderer tenant={tenant} />
    </>
  );
}
