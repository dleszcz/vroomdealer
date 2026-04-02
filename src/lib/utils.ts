import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace(/\s|\u202f|\u00a0/g, " ");
}

export function formatMileage(km: number): string {
  return new Intl.NumberFormat("pl-PL").format(km).replace(/\s|\u202f|\u00a0/g, " ") + " km";
}

export function generateCarSlug(make: string, model: string, year?: number | null, fuelType?: string | null): string {
  const parts = [make, model];
  if (year) parts.push(year.toString());
  if (fuelType) parts.push(fuelType);

  return parts
    .join("-")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9]+/g, "-")    // replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, "");        // trim leading/trailing dashes
}
