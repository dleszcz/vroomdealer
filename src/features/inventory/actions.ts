"use server";

import { CarService } from "./services/car-service";
import { CarRepository, ServiceResult } from "./services/car-repository";
import { Car } from "@/types/database";

export async function saveCarAction(
  carData: unknown,
  tenantId: string,
  tenantSlug: string,
  editingCarId?: string | null
): Promise<{ success: boolean; data?: Car; error?: string }> {
  let result: ServiceResult<Car>;
  if (editingCarId) {
    result = await CarService.updateCar(editingCarId, carData, tenantSlug);
  } else {
    result = await CarService.createCar(carData, tenantId, tenantSlug);
  }

  if (result.error || !result.data) {
    return { success: false, error: result.error || "Błąd zapisu pojazdu" };
  }

  return { success: true, data: result.data };
}

export async function toggleSoldAction(
  carId: string,
  isSold: boolean,
  tenantSlug: string
): Promise<{ success: boolean; error?: string }> {
  const result = await CarService.toggleSoldStatus(carId, isSold, tenantSlug);
  if (result.error) {
    return { success: false, error: result.error };
  }
  return { success: true };
}

export async function toggleFeaturedAction(
  carId: string,
  isFeatured: boolean,
  tenantSlug: string
): Promise<{ success: boolean; error?: string }> {
  const result = await CarService.toggleFeaturedStatus(carId, isFeatured, tenantSlug);
  if (result.error) {
    return { success: false, error: result.error };
  }
  return { success: true };
}

export async function deleteCarAction(
  carId: string,
  tenantSlug: string
): Promise<{ success: boolean; error?: string }> {
  const result = await CarService.deleteCar(carId, tenantSlug);
  if (result.error) {
    return { success: false, error: result.error };
  }
  return { success: true };
}

export async function fetchCarsByTenantAction(
  tenantId: string
): Promise<{ success: boolean; data?: Car[]; error?: string }> {
  const result = await CarRepository.getCarsByTenantId(tenantId);
  if (result.error || !result.data) {
    return { success: false, error: result.error || "Błąd pobierania aut" };
  }
  return { success: true, data: result.data };
}
