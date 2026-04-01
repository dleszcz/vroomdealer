import { Car } from "@/types/database";

export function generateWhatsAppLink(
  phone: string,
  car?: Car,
  slug?: string
): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  let message: string;
  if (car && slug) {
    message = `Cześć! Pytam o ${car.make} ${car.model}${car.year ? ` ${car.year}` : ""}. Link: https://vroomdealer.pl/${slug}/${car.slug}`;
  } else {
    message = "Cześć! Chciałbym dowiedzieć się więcej o Waszej ofercie.";
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
