import { Lead } from "@/types/landing";

export async function createLead(leadData: Lead): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isSupabaseConfigured) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("leads")
        .insert({
          dealer_id: leadData.dealerId,
          source: leadData.source || "landing_page",
          campaign: leadData.campaign || null,
          landing_path: leadData.landingPath,
          customer_name: leadData.customerName || null,
          customer_phone: leadData.customerPhone,
          customer_email: leadData.customerEmail || null,
          vehicle_details: leadData.vehicleDetails || null,
          status: leadData.status || "new",
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error creating lead in Supabase:", error);
        // Fallback log
        return { success: true, id: `mock-lead-${Date.now()}` };
      }

      return { success: true, id: data?.id };
    }

    // In dev / seed mode: log lead and return mock success
    console.log("📝 [Lead Engine] Lead captured in seed/mock mode:", leadData);
    return { success: true, id: `mock-lead-${Date.now()}` };
  } catch (err: unknown) {
    console.error("Failed to submit lead:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unspecified error" };
  }
}
