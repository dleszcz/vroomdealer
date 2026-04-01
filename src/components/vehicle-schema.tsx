import { Car } from "@/types/database";

interface VehicleSchemaProps {
  car: Car;
  dealerName: string;
  url: string;
}

export function VehicleSchema({ car, dealerName, url }: VehicleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${car.make} ${car.model}${car.year ? ` ${car.year}` : ""}`,
    brand: { "@type": "Brand", name: car.make },
    model: car.model,
    vehicleModelDate: car.year?.toString(),
    color: car.color,
    fuelType: car.fuel_type,
    vehicleTransmission: car.transmission,
    mileageFromOdometer: car.mileage
      ? {
          "@type": "QuantitativeValue",
          value: car.mileage,
          unitCode: "KMT",
        }
      : undefined,
    vehicleEngine: car.engine_capacity
      ? { "@type": "EngineSpecification", name: car.engine_capacity }
      : undefined,
    description: car.description,
    image: car.images?.[0],
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "PLN",
      price: car.price,
      availability: car.is_sold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      seller: {
        "@type": "AutoDealer",
        name: dealerName,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface DealerSchemaProps {
  name: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  url: string;
}

export function DealerSchema({
  name,
  description,
  address,
  city,
  phone,
  url,
}: DealerSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name,
    description: description || undefined,
    address: address
      ? {
          "@type": "PostalAddress",
          streetAddress: address,
          addressLocality: city,
          addressCountry: "PL",
        }
      : undefined,
    telephone: phone || undefined,
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
