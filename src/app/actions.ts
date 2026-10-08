"use server";

import { z } from "zod";
import { createLead } from "@/lib/leads";

export type PilotFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"dealerName" | "phone" | "city", string>>;
};

const schema = z.object({
  dealerName: z.string().trim().min(2, "Podaj nazwę komisu"),
  contactName: z.string().trim().max(120).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,}$/, "Podaj poprawny numer telefonu"),
  email: z.string().trim().email().optional().or(z.literal("")),
  city: z.string().trim().min(2, "Podaj miasto"),
  adSpend: z.string().trim().max(40).optional(),
  stock: z.string().trim().max(40).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export async function submitPilotApplication(_prev: PilotFormState, formData: FormData): Promise<PilotFormState> {
  const parsed = schema.safeParse({
    dealerName: formData.get("dealerName") ?? "",
    contactName: formData.get("contactName") ?? undefined,
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    city: formData.get("city") ?? "",
    adSpend: formData.get("adSpend") ?? undefined,
    stock: formData.get("stock") ?? undefined,
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    // Honeypot filled: pretend success, drop silently.
    if (errors.website) return { status: "success" };
    return {
      status: "error",
      message: "Uzupełnij zaznaczone pola.",
      fieldErrors: {
        dealerName: errors.dealerName?.[0],
        phone: errors.phone?.[0],
        city: errors.city?.[0],
      },
    };
  }

  const d = parsed.data;
  const note = [
    d.adSpend ? `Miesięczny koszt ogłoszeń: ${d.adSpend}` : null,
    d.stock ? `Aut na stanie: ${d.stock}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const result = await createLead({
    dealerId: "vroomdealer_saas",
    source: "vroomdealer_pilot_application",
    landingPath: "/",
    customerName: d.contactName || d.dealerName,
    customerPhone: d.phone,
    customerEmail: d.email || undefined,
    vehicleDetails: { dealerName: d.dealerName, city: d.city, note: note || undefined },
    status: "new",
  });

  if (!result.success) {
    return { status: "error", message: "Nie udało się wysłać zgłoszenia. Napisz do nas: biuro@vroomdealer.pl" };
  }
  return { status: "success" };
}
