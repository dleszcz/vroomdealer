import { createClient } from "@/lib/supabase/server";
import { Car } from "@/types/database";
import { CarInput } from "../types";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export class CarRepository {
  /**
   * Pobiera listę aut dla konkretnego komisu (tenantId)
   */
  static async getCarsByTenantId(tenantId: string): Promise<ServiceResult<Car[]>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        return { data: null, error: `Błąd odczytu bazy aut: ${error.message}` };
      }

      return { data: (data as Car[]) || [], error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nieznany błąd serwera";
      return { data: null, error: message };
    }
  }

  /**
   * Pobiera pojedyncze auto po ID
   */
  static async getCarById(carId: string): Promise<ServiceResult<Car>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .maybeSingle();

      if (error) {
        return { data: null, error: `Błąd pobierania auta: ${error.message}` };
      }

      if (!data) {
        return { data: null, error: "Nie znaleziono pojazdu" };
      }

      return { data: data as Car, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nieznany błąd serwera";
      return { data: null, error: message };
    }
  }

  /**
   * Tworzy nowy rekord w tabeli cars
   */
  static async insertCar(carData: CarInput): Promise<ServiceResult<Car>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("cars")
        .insert({
          tenant_id: carData.tenant_id,
          slug: carData.slug,
          make: carData.make,
          model: carData.model,
          year: carData.year,
          price: carData.price,
          mileage: carData.mileage,
          fuel_type: carData.fuel_type,
          engine_capacity: carData.engine_capacity,
          transmission: carData.transmission,
          color: carData.color,
          description: carData.description,
          images: carData.images,
          is_sold: carData.is_sold,
          is_featured: carData.is_featured,
          vin: carData.vin,
          first_registration_date: carData.first_registration_date,
          export_to_autoplac: carData.export_to_autoplac,
          autoplac_status: carData.export_to_autoplac ? "ready" : "draft",
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: `Błąd zapisu auta: ${error.message}` };
      }

      return { data: data as Car, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nieznany błąd serwera";
      return { data: null, error: message };
    }
  }

  /**
   * Aktualizuje istniejący rekord auta
   */
  static async updateCar(carId: string, carData: Partial<CarInput>): Promise<ServiceResult<Car>> {
    try {
      const supabase = await createClient();
      const updatePayload: Record<string, unknown> = {};

      if (carData.make !== undefined) updatePayload.make = carData.make;
      if (carData.model !== undefined) updatePayload.model = carData.model;
      if (carData.year !== undefined) updatePayload.year = carData.year;
      if (carData.price !== undefined) updatePayload.price = carData.price;
      if (carData.mileage !== undefined) updatePayload.mileage = carData.mileage;
      if (carData.fuel_type !== undefined) updatePayload.fuel_type = carData.fuel_type;
      if (carData.engine_capacity !== undefined) updatePayload.engine_capacity = carData.engine_capacity;
      if (carData.transmission !== undefined) updatePayload.transmission = carData.transmission;
      if (carData.color !== undefined) updatePayload.color = carData.color;
      if (carData.description !== undefined) updatePayload.description = carData.description;
      if (carData.images !== undefined) updatePayload.images = carData.images;
      if (carData.is_sold !== undefined) updatePayload.is_sold = carData.is_sold;
      if (carData.is_featured !== undefined) updatePayload.is_featured = carData.is_featured;
      if (carData.vin !== undefined) updatePayload.vin = carData.vin;
      if (carData.first_registration_date !== undefined) updatePayload.first_registration_date = carData.first_registration_date;
      if (carData.export_to_autoplac !== undefined) {
        updatePayload.export_to_autoplac = carData.export_to_autoplac;
        updatePayload.autoplac_status = carData.export_to_autoplac ? "ready" : "draft";
      }

      const { data, error } = await supabase
        .from("cars")
        .update(updatePayload)
        .eq("id", carId)
        .select()
        .single();

      if (error) {
        return { data: null, error: `Błąd aktualizacji auta: ${error.message}` };
      }

      return { data: data as Car, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nieznany błąd serwera";
      return { data: null, error: message };
    }
  }

  /**
   * Usuwa auto z bazy
   */
  static async deleteCar(carId: string): Promise<ServiceResult<boolean>> {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("cars").delete().eq("id", carId);

      if (error) {
        return { data: null, error: `Błąd usuwania auta: ${error.message}` };
      }

      return { data: true, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nieznany błąd serwera";
      return { data: null, error: message };
    }
  }
}
