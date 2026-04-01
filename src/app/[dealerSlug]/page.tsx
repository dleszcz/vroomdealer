import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile, getCars } from "@/lib/data";
import { CarCard } from "@/components/car-card";
import { DealerServices } from "@/components/dealer-services";
import { DealerSchema } from "@/components/vehicle-schema";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

type Props = {
  params: Promise<{ dealerSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dealerSlug } = await params;
  const profile = await getProfile(dealerSlug);

  if (!profile) return {};

  const title = `${profile.business_name} — Samochody na sprzedaż${profile.city ? ` | ${profile.city}` : ""}`;
  const description =
    profile.business_description ||
    `Sprawdź ofertę samochodów w ${profile.business_name}. Uczciwy komis samochodowy${profile.city ? ` w ${profile.city}` : ""}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function DealerPage({ params }: Props) {
  const { dealerSlug } = await params;
  const profile = await getProfile(dealerSlug);

  if (!profile) {
    notFound();
  }

  const cars = await getCars(profile.id);
  const availableCars = cars.filter((c) => !c.is_sold);
  const soldCars = cars.filter((c) => c.is_sold);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vroomdealer.pl";

  return (
    <>
      <DealerSchema
        name={profile.business_name}
        description={profile.business_description}
        address={profile.address}
        city={profile.city}
        phone={profile.phone_number}
        url={`${baseUrl}/${profile.slug}`}
      />

      <div className="dealer-page" id="dealer-page">
        {profile.business_description && (
          <div className="dealer-page__intro">
            <p className="dealer-page__description">
              {profile.business_description}
            </p>
          </div>
        )}

        {availableCars.length > 0 ? (
          <section>
            <h2 className="dealer-page__section-title">
              Dostępne samochody ({availableCars.length})
            </h2>
            <div className="car-grid">
              {availableCars.map((car) => (
                <CarCard key={car.id} car={car} dealerSlug={dealerSlug} />
              ))}
            </div>
          </section>
        ) : (
          <div className="dealer-page__empty">
            <p>Obecnie brak dostępnych samochodów.</p>
          </div>
        )}

        {soldCars.length > 0 && (
          <section style={{ marginTop: "3rem", opacity: 0.7 }}>
            <h2 className="dealer-page__section-title">
              Sprzedane ({soldCars.length})
            </h2>
            <div className="car-grid">
              {soldCars.map((car) => (
                <CarCard key={car.id} car={car} dealerSlug={dealerSlug} />
              ))}
            </div>
          </section>
        )}

        <DealerServices
          hasTowing={profile.has_towing}
          hasBuying={profile.has_buying}
          whatsappNumber={profile.whatsapp_number}
        />
      </div>

      {profile.whatsapp_number && (
        <FloatingWhatsApp
          phone={profile.whatsapp_number}
          slug={dealerSlug}
        />
      )}
    </>
  );
}
