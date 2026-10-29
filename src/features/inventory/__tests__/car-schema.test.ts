import { describe, it, expect } from "vitest";
import { carInputSchema, carUpdateSchema } from "../types/car-schema";

describe("carInputSchema", () => {
  const validCar = {
    tenant_id: "a0000000-0000-0000-0000-000000000001",
    slug: "audi-a4-2015-abcd",
    make: "Audi",
    model: "A4",
    year: 2015,
    price: 45000,
    mileage: 180000,
    fuel_type: "Diesel",
    transmission: "Manualna",
    images: ["https://example.com/car.jpg"],
    export_to_autoplac: false,
  };

  it("should validate a standard vehicle successfully without VIN when Autoplac export is disabled", () => {
    const result = carInputSchema.safeParse(validCar);
    expect(result.success).toBe(true);
  });

  it("should fail validation if Autoplac export is enabled but VIN is missing", () => {
    const carWithExportNoVin = {
      ...validCar,
      export_to_autoplac: true,
      vin: "",
    };

    const result = carInputSchema.safeParse(carWithExportNoVin);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Numer VIN jest wymagany");
    }
  });

  it("should fail validation if Autoplac export is enabled but VIN has invalid characters or length", () => {
    const carWithInvalidVin = {
      ...validCar,
      export_to_autoplac: true,
      vin: "INVALIDVIN123", // too short (13 chars)
    };

    const result = carInputSchema.safeParse(carWithInvalidVin);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Niepoprawny format VIN");
    }
  });

  it("should pass validation if Autoplac export is enabled and VIN is a valid 17-character string", () => {
    const carWithValidVin = {
      ...validCar,
      export_to_autoplac: true,
      vin: "WAUZZZ8K8BA123456", // exactly 17 characters without I, O, Q
    };

    const result = carInputSchema.safeParse(carWithValidVin);
    expect(result.success).toBe(true);
  });
});

describe("carUpdateSchema", () => {
  it("should allow partial updates without VIN when export_to_autoplac is not modified", () => {
    const result = carUpdateSchema.safeParse({ price: 42000 });
    expect(result.success).toBe(true);
  });

  it("should enforce valid VIN if partial update turns on export_to_autoplac", () => {
    const result = carUpdateSchema.safeParse({ export_to_autoplac: true, vin: "SHORT" });
    expect(result.success).toBe(false);
  });
});

