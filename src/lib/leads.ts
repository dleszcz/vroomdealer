import { Lead } from "@/types/landing";

async function sendLeadNotificationEmail(leadData: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL || "danielxleszczynski@gmail.com";

  if (!apiKey) {
    console.log("ℹ️ [Lead Engine] RESEND_API_KEY nie jest skonfigurowany. Powiadomienie e-mail pominięte.");
    return;
  }

  const isSaasApp = leadData.source === "vroomdealer_saas_test_application" || leadData.dealerId === "vroomdealer_saas";
  if (!isSaasApp) {
    // Leady poszczególnych komisów trafiają do ich własnych kanałów/bazy danych Supabase
    return;
  }
  const subject = isSaasApp
    ? `🚀 Nowe zgłoszenie do testów VroomDealer: ${leadData.customerName}`
    : `📩 Nowy lead dla komisu (${leadData.dealerId}): ${leadData.customerName || leadData.customerPhone}`;

  const detailsHtml = leadData.vehicleDetails
    ? `<div style="background:#f4f4f5;padding:12px;border-radius:8px;margin-top:12px;"><pre style="margin:0;font-family:sans-serif;">${JSON.stringify(leadData.vehicleDetails, null, 2)}</pre></div>`
    : "";

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e4e4e7;border-radius:12px;">
      <h2 style="color:#10B981;margin-top:0;">${isSaasApp ? "🚀 Nowe zgłoszenie do zamkniętych testów VroomDealer.pl" : "📩 Nowy Lead Zgłoszeniowy"}</h2>
      <p><strong>Imię / Nazwisko / Komis:</strong> ${leadData.customerName || "Brak danych"}</p>
      <p><strong>Telefon kontaktowy:</strong> <a href="tel:${leadData.customerPhone}">${leadData.customerPhone}</a></p>
      <p><strong>Źródło:</strong> <code>${leadData.source}</code></p>
      <p><strong>Identyfikator dealera:</strong> <code>${leadData.dealerId}</code></p>
      ${detailsHtml}
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:20px 0;" />
      <p style="font-size:12px;color:#71717a;margin:0;">Wysłane automatycznie przez system VroomDealer.pl</p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VroomDealer <onboarding@resend.dev>",
        to: [toEmail],
        subject,
        html,
      }),
    });

    if (res.ok) {
      console.log("📧 [Lead Engine] Powiadomienie e-mail zostało wysłane na adres:", toEmail);
    } else {
      const errData = await res.json();
      console.error("❌ Błąd wysyłania maila przez Resend API:", errData);
    }
  } catch (err) {
    console.error("❌ Błąd wysyłania powiadomienia e-mail:", err);
  }
}

export async function createLead(leadData: Lead): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Triggujemy powiadomienie e-mail asynchronicznie (nie blokuje odpowiedzi)
    sendLeadNotificationEmail(leadData).catch((e) => console.error(e));

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isSupabaseConfigured) {
      try {
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
          return { success: true, id: `mock-lead-${Date.now()}` };
        }

        return { success: true, id: data?.id };
      } catch (sbErr) {
        console.error("Supabase lead insert notice:", sbErr);
        return { success: true, id: `lead-${Date.now()}` };
      }
    }

    // In dev / seed mode: log lead and return mock success
    console.log("📝 [Lead Engine] Lead captured in seed/mock mode:", leadData);
    return { success: true, id: `mock-lead-${Date.now()}` };
  } catch (err: unknown) {
    console.error("Failed to submit lead:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unspecified error" };
  }
}

