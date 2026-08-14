import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile, getCar } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { CarGallery } from "@/components/car-gallery";
import { CarSpecs } from "@/components/car-specs";
import { VehicleSchema } from "@/components/vehicle-schema";
import { ContactBar } from "@/components/contact-bar";
import { TrackVehicleView } from "@/components/track-vehicle-view";
import { resolveTenant } from "@/lib/tenant";
import { LocalSeoPage } from "@/components/local-seo-page";
import { SectionRenderer } from "@/components/sections/section-renderer";

type Props = {
  params: Promise<{ dealerSlug: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dealerSlug, slug } = await params;
  const tenant = await resolveTenant({ slug: dealerSlug });

  if (!tenant) return {};

  const baseUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `https://vroomdealer.pl/${dealerSlug}`;
  const canonicalUrl = `${baseUrl}/${slug}`;
  const heroImage = tenant.branding.media?.heroImageUrl;
  const ogImageUrl = heroImage ? (heroImage.startsWith("http") ? heroImage : `${baseUrl}${heroImage}`) : undefined;
  const themeColor = tenant.branding.colors.headerBg || tenant.branding.colors.primary || "#080808";

  // 1. Check if slug matches a Local SEO page
  const localPage = tenant.localSeo?.localPages?.find((lp) => lp.slug === slug);
  if (localPage) {
    if (!localPage.enabled) {
      return { title: "Not Found", robots: { index: false, follow: false } };
    }

    const title = localPage.seo?.title || `Skup aut ${localPage.city} | ${tenant.businessName}`;
    const description =
      localPage.seo?.metaDescription ||
      `Skup samochodów za gotówkę w ${localPage.city}. Bezpłatna wycena i dojazd.`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "website",
        images: ogImageUrl ? [{ url: ogImageUrl, alt: title }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImageUrl ? [ogImageUrl] : [],
      },
      robots: {
        index: localPage.indexable,
        follow: true,
      },
      other: {
        "theme-color": themeColor,
      },
    };
  }

  // 2. Service subpages: /skup-aut, /samochody, /kontakt, /o-nas
  if (slug === "skup-aut") {
    const title = `Skup aut za gotówkę | ${tenant.businessName}`;
    const description = `Profesjonalny i bezpieczny skup aut w ${tenant.location?.city || "Twojej okolicy"}. Bezpłatna wycena, natychmiastowa wypłata gotówki.`;
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl, type: "website" },
      twitter: { card: "summary_large_image", title, description },
      other: { "theme-color": themeColor },
    };
  }

  if (slug === "samochody") {
    const title = `Samochody używane na sprzedaż | ${tenant.businessName}`;
    const description = `Sprawdź naszą aktualną ofertę samochodów używanych z gwarancją. Pewne auta w ${tenant.businessName}.`;
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl, type: "website" },
      twitter: { card: "summary_large_image", title, description },
      other: { "theme-color": themeColor },
    };
  }

  if (slug === "kontakt") {
    const title = `Kontakt | ${tenant.businessName}`;
    const description = `Skontaktuj się z ${tenant.businessName}. Telefon: ${tenant.contact.phone || ""}, Adres: ${tenant.location?.address || ""}, ${tenant.location?.city || ""}.`;
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl, type: "website" },
      twitter: { card: "summary_large_image", title, description },
      other: { "theme-color": themeColor },
    };
  }

  if (slug === "o-nas") {
    const title = `O nas | ${tenant.businessName}`;
    const description = `Poznaj ${tenant.businessName} — lokalny komis samochodowy i skup aut z wieloletnim doświadczeniem.`;
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl, type: "website" },
      twitter: { card: "summary_large_image", title, description },
      other: { "theme-color": themeColor },
    };
  }

  // 3. Check if slug matches a car listing
  const profile = await getProfile(dealerSlug);
  const car = await getCar(slug);

  if (!profile || !car) return {};

  const carName = `${car.make} ${car.model}${car.year ? ` (${car.year})` : ""}`;
  const priceStr = car.price ? `${formatPrice(car.price)} PLN` : "Zapytaj o cenę";
  const title = `${carName} - ${priceStr} | ${profile.business_name}`;
  const description = `${carName}${car.mileage ? `, ${car.mileage.toLocaleString("pl-PL")} km` : ""}${car.fuel_type ? `, ${car.fuel_type}` : ""}. Sprawdź ogłoszenie w ${profile.business_name}${profile.city ? `, ${profile.city}` : ""}.`;

  const pageUrl = `${baseUrl}/${slug}`;
  const carImage = car.images?.[0]
    ? car.images[0].startsWith("http")
      ? car.images[0]
      : `${baseUrl}${car.images[0]}`
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      images: carImage ? [{ url: carImage, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: carImage ? [carImage] : [],
    },
    other: {
      "fb:app_id": process.env.NEXT_PUBLIC_FB_APP_ID || "",
      "theme-color": themeColor,
    },
  };
}

export default async function DynamicSlugPage({ params }: Props) {
  const { dealerSlug, slug } = await params;
  const tenant = await resolveTenant({ slug: dealerSlug });

  if (!tenant) {
    notFound();
  }

  const baseUrl = tenant.customDomain
    ? `https://${tenant.customDomain}`
    : `https://vroomdealer.pl/${tenant.slug}`;

  // 1. Check if slug is a Local SEO Page
  const localPage = tenant.localSeo?.localPages?.find((lp) => lp.slug === slug);
  if (localPage) {
    if (!localPage.enabled) {
      notFound();
    }
    return <LocalSeoPage tenant={tenant} localPage={localPage} baseUrl={baseUrl} />;
  }

  // 2. Service subpages (/skup-aut, /samochody, /kontakt, /o-nas) -> Render main landing with appropriate view
  if (["skup-aut", "samochody", "kontakt", "o-nas"].includes(slug)) {
    return <SectionRenderer tenant={tenant} />;
  }

  // 3. Check if slug is a Car Listing
  const [profile, car] = await Promise.all([
    getProfile(dealerSlug),
    getCar(slug),
  ]);

  if (!profile || !car) {
    notFound();
  }

  const carName = `${car.make} ${car.model}${car.year ? ` ${car.year}` : ""}`;
  const pageUrl = `${baseUrl}/${slug}`;

  // Get cross-sell services from tenant config
  const crossSellServices = tenant.services.filter(
    (s) => s.enabled && (s.type === "towing" || s.type === "car_buying")
  );

  return (
    <>
      <VehicleSchema
        car={car}
        dealerName={profile.business_name}
        url={pageUrl}
      />

      <article className="car-detail" id="car-detail">
        <Link href={`/${dealerSlug}`} className="car-detail__back">
          ← Wróć do listy
        </Link>

        <div className="car-detail__grid">
          {/* Left — Gallery */}
          <div>
            <CarGallery images={car.images ?? []} alt={carName} />
          </div>

          {/* Right — Info */}
          <div>
            <div className="car-detail__header">
              <h1 className="car-detail__title">{carName}</h1>
              {car.price && !car.is_sold && (
                <div className="car-detail__price">
                  {formatPrice(car.price)}
                  <span className="car-detail__price-currency">PLN</span>
                </div>
              )}
              {car.is_sold && (
                <div className="car-detail__sold-notice">
                  To auto zostało sprzedane
                </div>
              )}
            </div>

            <CarSpecs car={car} />

            {car.description && (
              <div className="car-detail__description">
                <h2>Opis</h2>
                <p>{car.description}</p>
              </div>
            )}

            {/* Trade-In Banner if enabled in tenant businessRules */}
            {tenant.businessRules?.tradeIn?.enabled && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "12px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ fontSize: "1.5rem" }}>🔄</div>
                <div>
                  <h4 style={{ margin: "0 0 2px", fontSize: "0.95rem", fontWeight: 700 }}>
                    {tenant.businessRules.tradeIn.title || "Auto w rozliczeniu"}
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-soft)" }}>
                    {tenant.businessRules.tradeIn.description ||
                      "Chcesz kupić to auto? Zostaw swój dotychczasowy samochód w rozliczeniu przy zakupie!"}
                  </p>
                </div>
              </div>
            )}

            {/* Cross-sell: services from tenant config */}
            {crossSellServices.length > 0 && (
              <div style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: '0.25rem' }}>Usługi dodatkowe</h3>
                {crossSellServices.map((service) => (
                  <a
                    key={service.id}
                    href={
                      service.ctaType === "phone"
                        ? `tel:${(service.ctaValue || profile.contact_phone || "").replace(/\s/g, "")}`
                        : service.ctaType === "lead_form"
                        ? "#lead-form"
                        : service.ctaValue || "#"
                    }
                    className={`cta-banner cta-banner--${service.type}`}
                  >
                    <p>
                      {service.type === "towing" ? "🚨" : "💰"} {service.title}
                    </p>
                    <span className="cta-banner__action-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>
            )}

          </div>
        </div>
      </article>

      <TrackVehicleView car={car} />

      {!car.is_sold && (
        <ContactBar profile={profile} car={car} />
      )}
    </>
  );
}
