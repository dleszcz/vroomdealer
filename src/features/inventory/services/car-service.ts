import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Car } from "@/types/database";
import { carInputSchema, carUpdateSchema, CarInput } from "../types";
import { CarRepository, ServiceResult } from "./car-repository";

export function generateVehicleSlug(make: string, model: string, year: number | null): string {
  const base = `${make}-${model}-${year || ""}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export class CarService {
  /**
   * Waliduje dane wejściowe Zod i zapisuje nowe auto w bazie
   */
  static async createCar(
    rawInput: unknown,
    tenantId: string,
    tenantSlug?: string
  ): Promise<ServiceResult<Car>> {
    // 1. Walidacja schematem Zod
    const validationResult = carInputSchema.safeParse(rawInput);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues
        .map((issue: z.ZodIssue) => issue.message)
        .join("; ");
      return { data: null, error: `Błąd walidacji: ${errorMessage}` };
    }

    const validatedData = validationResult.data;
    const slug = validatedData.slug || generateVehicleSlug(validatedData.make, validatedData.model, validatedData.year);

    const carDataToInsert: CarInput = {
      ...validatedData,
      tenant_id: tenantId,
      slug,
    };

    const insertResult = await CarRepository.insertCar(carDataToInsert);

    if (insertResult.data && tenantSlug) {
      this.revalidateVehiclePaths(tenantSlug);
    }

    return insertResult;
  }

  /**
   * Aktualizuje auto po uprzedniej walidacji
   */
  static async updateCar(
    carId: string,
    rawInput: unknown,
    tenantSlug?: string
  ): Promise<ServiceResult<Car>> {
    const validationResult = carUpdateSchema.safeParse(rawInput);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues
        .map((issue: z.ZodIssue) => issue.message)
        .join("; ");
      return { data: null, error: `Błąd walidacji: ${errorMessage}` };
    }

    const updateResult = await CarRepository.updateCar(carId, validationResult.data);

    if (updateResult.data && tenantSlug) {
      this.revalidateVehiclePaths(tenantSlug);
    }

    return updateResult;
  }

  /**
   * Zmienia status sprzedaży pojazdu
   */
  static async toggleSoldStatus(
    carId: string,
    isSold: boolean,
    tenantSlug?: string
  ): Promise<ServiceResult<Car>> {
    const result = await CarRepository.updateCar(carId, { is_sold: isSold });
    if (result.data && tenantSlug) {
      this.revalidateVehiclePaths(tenantSlug);
    }
    return result;
  }

  /**
   * Zmienia status wyróżnienia pojazdu
   */
  static async toggleFeaturedStatus(
    carId: string,
    isFeatured: boolean,
    tenantSlug?: string
  ): Promise<ServiceResult<Car>> {
    const result = await CarRepository.updateCar(carId, { is_featured: isFeatured });
    if (result.data && tenantSlug) {
      this.revalidateVehiclePaths(tenantSlug);
    }
    return result;
  }

  /**
   * Usuwa pojazd z bazy
   */
  static async deleteCar(carId: string, tenantSlug?: string): Promise<ServiceResult<boolean>> {
    const result = await CarRepository.deleteCar(carId);
    if (result.data && tenantSlug) {
      this.revalidateVehiclePaths(tenantSlug);
    }
    return result;
  }

  /**
   * Pomocnicza rewalidacja ścieżek Next.js
   */
  private static revalidateVehiclePaths(tenantSlug: string): void {
    try {
      revalidatePath(`/${tenantSlug}`);
      revalidatePath(`/${tenantSlug}/samochody`);
      revalidatePath(`/admin/cars`);
    } catch {
      // Ignorujemy błędy revalidate poza kontekstem żądania HTTP
    }
  }
}
