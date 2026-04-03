import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile, getCar } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { CarGallery } from "@/components/car-gallery";
import { CarSpecs } from "@/components/car-specs";
import { VehicleSchema } from "@/components/vehicle-schema";
import { ContactBar } from "@/components/contact-bar";

type Props = {
  params: Promise<{ dealerSlug: string; carSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dealerSlug, carSlug } = await params;
  const [profile, car] = await Promise.all([
    getProfile(dealerSlug),
    getCar(carSlug),
  ]);

  if (!profile || !car) return {};

  const carName = `${car.make} ${car.model}${car.year ? ` (${car.year})` : ""}`;
  const priceStr = car.price ? `${formatPrice(car.price)} PLN` : "Zapytaj o cenę";
  const title = `${carName} - ${priceStr} | ${profile.business_name}`;
  const description = `${carName}${car.mileage ? `, ${car.mileage.toLocaleString("pl-PL")} km` : ""}${car.fuel_type ? `, ${car.fuel_type}` : ""}. Sprawdź ogłoszenie w ${profile.business_name}${profile.city ? `, ${profile.city}` : ""}.`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vroomdealer.pl";
  const pageUrl = `${baseUrl}/${dealerSlug}/${carSlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      images: car.images?.[0]
        ? [
            {
              url: car.images[0],
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    facebook: {
      appId: process.env.NEXT_PUBLIC_FB_APP_ID || "",
    },
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { dealerSlug, carSlug } = await params;
  const [profile, car] = await Promise.all([
    getProfile(dealerSlug),
    getCar(carSlug),
  ]);

  if (!profile || !car) {
    notFound();
  }

  const carName = `${car.make} ${car.model}${car.year ? ` ${car.year}` : ""}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vroomdealer.pl";
  const pageUrl = `${baseUrl}/${dealerSlug}/${carSlug}`;

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

            {/* CROSS-SELLING: Uslugi Dodatkowe */}
            {(profile.has_towing || profile.has_buying) && (
              <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: '0.75rem' }}>Usługi zadilerowane dla Ciebie</h3>
                {profile.has_towing && (
                  <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #bfdbfe', marginBottom: '0.5rem' }}>
                    <p style={{ fontWeight: 600, color: '#1e40af', margin: 0 }}>🚨 Potrzebna Laweta? Zadzwoń: {profile.contact_phone}</p>
                  </div>
                )}
                {profile.has_buying && (
                  <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #bbf7d0' }}>
                    <p style={{ fontWeight: 600, color: '#166534', margin: 0 }}>💰 Skupujemy Auta za Gotówkę. Kliknij po wycenę</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </article>

      {(!car.is_sold) && (
        <ContactBar profile={profile} car={car} />
      )}
    </>
  );
}
