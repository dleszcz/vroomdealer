import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile, getCar, getCars } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { CarGallery } from "@/components/car-gallery";
import { CarSpecs } from "@/components/car-specs";
import { VehicleSchema } from "@/components/vehicle-schema";
import { ContactBar } from "@/components/contact-bar";
import { TrackVehicleView } from "@/components/track-vehicle-view";
import { resolveTenant } from "@/lib/tenant";
import { LocalSeoPage } from "@/components/local-seo-page";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { SingleCarPage } from "@/components/single-car-page";
import { InventoryPage } from "@/components/inventory-page";

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

    const title = (localPage.seo?.title || `Skup aut ${localPage.city} | ${tenant.businessName}`).replace(/—|–/g, "-");
    const description = (
      localPage.seo?.metaDescription ||
      `Skup samochodów za gotówkę w ${localPage.city}. Bezpłatna wycena i dojazd.`
    ).replace(/—|–/g, "-");

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
    const description = `Poznaj ${tenant.businessName} - lokalny komis samochodowy i skup aut z wieloletnim doświadczeniem.`;
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

  // 2. Subpages handling
  if (slug === "skup-aut") {
    return <SectionRenderer tenant={tenant} mode="skup-aut" />;
  }

  if (slug === "samochody") {
    const allCars = await getCars(tenant.id);
    return <InventoryPage tenant={tenant} cars={allCars} />;
  }

  if (["kontakt", "o-nas"].includes(slug)) {
    return <SectionRenderer tenant={tenant} mode="all" />;
  }

  // 3. Check if slug is a Car Listing
  const [profile, car, allCars] = await Promise.all([
    getProfile(dealerSlug),
    getCar(slug),
    getCars(tenant.id),
  ]);

  if (!profile || !car) {
    notFound();
  }

  const pageUrl = `${baseUrl}/${slug}`;
  const relatedCars = allCars.filter(
    (c) => String(c.id) !== String(car.id) && c.slug !== car.slug && !c.is_sold
  );

  return (
    <>
      <VehicleSchema
        car={car}
        dealerName={profile.business_name}
        url={pageUrl}
      />
      <SingleCarPage tenant={tenant} car={car} relatedCars={relatedCars} />
      <TrackVehicleView car={car} />
    </>
  );
}
