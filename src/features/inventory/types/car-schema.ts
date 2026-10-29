import { z } from "zod";

export const fuelTypes = ["Benzyna", "Diesel", "LPG", "Hybryda", "Elektryczny"] as const;
export type FuelType = typeof fuelTypes[number];

export const transmissionTypes = ["Manualna", "Automatyczna"] as const;
export type TransmissionType = typeof transmissionTypes[number];

export const autoplacStatusTypes = ["draft", "ready", "synced", "error"] as const;
export type AutoplacStatus = typeof autoplacStatusTypes[number];

export const carBaseSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid(),
  slug: z.string().min(3),
  make: z.string().min(1, "Marka jest wymagana"),
  model: z.string().min(1, "Model jest wymagany"),
  year: z.coerce
    .number()
    .int()
    .min(1950, "Rocznik nie może być wcześniejszy niż 1950")
    .max(new Date().getFullYear() + 1, "Rocznik nie może wykraczać w przyszłość"),
  price: z.coerce.number().min(0, "Cena musi być większa lub równa 0"),
  mileage: z.coerce.number().int().min(0, "Przebieg nie może być ujemny"),
  fuel_type: z.enum(fuelTypes),
  engine_capacity: z.string().trim().optional().nullable(),
  transmission: z.enum(transmissionTypes),
  color: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  images: z.array(z.string().url("Nieprawidłowy adres URL zdjęcia")).default([]),
  is_sold: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .nullable(),
  first_registration_date: z
    .string()
    .trim()
    .optional()
    .nullable(),
  export_to_autoplac: z.boolean().default(false),
  autoplac_status: z.enum(autoplacStatusTypes).default("draft"),
  autoplac_error_message: z.string().trim().optional().nullable(),
});

// Walidacja rozszerzona o specyficzne wymagania Autoplac.pl
export const carInputSchema = carBaseSchema.superRefine((data, ctx) => {
  if (data.export_to_autoplac) {
    if (!data.vin || data.vin.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Numer VIN jest wymagany do synchronizacji z portalem Autoplac.pl",
        path: ["vin"],
      });
    } else {
      // VIN musi mieć 17 znaków bez liter I, O, Q
      const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
      if (!vinRegex.test(data.vin)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Niepoprawny format VIN (wymagane 17 znaków alfanumerycznych bez I, O, Q)",
          path: ["vin"],
        });
      }
    }
  }
});

export type CarInput = z.infer<typeof carInputSchema>;

export const carUpdateSchema = carBaseSchema.partial().superRefine((data, ctx) => {
  if (data.export_to_autoplac) {
    if (!data.vin || data.vin.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Numer VIN jest wymagany do synchronizacji z portalem Autoplac.pl",
        path: ["vin"],
      });
    } else {
      const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
      if (!vinRegex.test(data.vin)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Niepoprawny format VIN (wymagane 17 znaków alfanumerycznych bez I, O, Q)",
          path: ["vin"],
        });
      }
    }
  }
});

export type CarUpdateInput = z.infer<typeof carUpdateSchema>;

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
