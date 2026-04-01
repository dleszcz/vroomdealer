import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile, getCar } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { CarGallery } from "@/components/car-gallery";
import { CarSpecs } from "@/components/car-specs";
import { VehicleSchema } from "@/components/vehicle-schema";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

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

  const carName = `${car.make} ${car.model}${car.year ? ` ${car.year}` : ""}`;
  const priceStr = car.price ? ` — ${formatPrice(car.price)}` : "";
  const title = `${carName}${priceStr}`;
  const description = `${carName}${car.mileage ? `, ${car.mileage.toLocaleString("pl-PL")} km` : ""}${car.fuel_type ? `, ${car.fuel_type}` : ""}. Sprawdź ogłoszenie w ${profile.business_name}${profile.city ? `, ${profile.city}` : ""}.`;

  return {
    title,
    description,
    openGraph: {
      title: `${carName}${priceStr} | ${profile.business_name}`,
      description,
      type: "website",
      images: car.images?.[0]
        ? [
            {
              url: car.images[0],
              width: 800,
              height: 600,
              alt: carName,
            },
          ]
        : [],
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
          </div>
        </div>
      </article>

      {profile.whatsapp_number && !car.is_sold && (
        <FloatingWhatsApp
          phone={profile.whatsapp_number}
          car={car}
          slug={dealerSlug}
        />
      )}
    </>
  );
}
