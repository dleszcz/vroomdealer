import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveTenant } from "@/lib/tenant";
import { DealerSchema } from "@/components/vehicle-schema";
import { ContactBar } from "@/components/contact-bar";
import { SectionRenderer } from "@/components/sections/section-renderer";

type Props = {
  params: Promise<{ dealerSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dealerSlug } = await params;
  const tenant = await resolveTenant({ slug: dealerSlug });

  if (!tenant) return {};

  const title = tenant.seo?.metaTitle || `${tenant.businessName} — Samochody i skup aut${tenant.location?.city ? ` | ${tenant.location.city}` : ""}`;
  const description =
    tenant.seo?.metaDescription ||
    tenant.businessDescription ||
    `Sprawdź ofertę samochodów w ${tenant.businessName}. Uczciwy komis samochodowy i skup aut.`;

  const baseUrl = tenant.customDomain ? `https://${tenant.customDomain}` : `https://vroomdealer.pl/${dealerSlug}`;

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
      type: "website",
    },
  };
}

export default async function DealerPage({ params }: Props) {
  const { dealerSlug } = await params;
  const tenant = await resolveTenant({ slug: dealerSlug });

  if (!tenant) {
    notFound();
  }

  const baseUrl = tenant.customDomain ? `https://${tenant.customDomain}` : `https://vroomdealer.pl/${tenant.slug}`;

  // Build profile shim for ContactBar & DealerSchema compatibility
  const profileShim = {
    id: tenant.id,
    slug: tenant.slug,
    business_name: tenant.businessName,
    business_description: tenant.businessDescription || null,
    logo_url: tenant.logoUrl || null,
    pixel_id: tenant.analytics?.pixelId || null,
    whatsapp_number: tenant.contact.whatsapp || null,
    contact_phone: tenant.contact.phone || null,
    address: tenant.location?.address || null,
    city: tenant.location?.city || null,
    created_at: new Date().toISOString(),
  };

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

      {(tenant.contact.whatsapp || tenant.contact.phone) && (
        <ContactBar profile={profileShim} />
      )}
    </>
  );
}
