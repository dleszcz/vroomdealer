import { notFound } from "next/navigation";
import { resolveTenant } from "@/lib/tenant";
import { BrandProvider } from "@/components/brand-provider";
import { DealerHeader } from "@/components/dealer-header";
import { Footer } from "@/components/footer";
import { MetaPixel } from "@/components/meta-pixel";
import { CookieConsent } from "@/components/cookie-consent";

export default async function DealerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ dealerSlug: string }>;
}) {
  const { dealerSlug } = await params;
  const tenant = await resolveTenant({ slug: dealerSlug });

  if (!tenant) {
    notFound();
  }

  return (
    <BrandProvider branding={tenant.branding}>
      {tenant.analytics?.pixelId && <MetaPixel pixelId={tenant.analytics.pixelId} />}
      <div className="dealer-layout">
        <DealerHeader tenant={tenant} />
        <main className="dealer-main">{children}</main>
        <Footer tenant={tenant} />
      </div>
      <CookieConsent
        primaryColor={tenant.branding.colors.primary}
        privacyPolicyUrl={`/${tenant.slug}/polityka-prywatnosci`}
      />
    </BrandProvider>
  );
}
