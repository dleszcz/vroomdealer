import { Lead } from "@/types/landing";

async function sendLeadNotificationEmail(leadData: Lead) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("ℹ️ [Lead Engine] RESEND_API_KEY nie jest skonfigurowany. Powiadomienie e-mail pominięte.");
    return;
  }

  // Resolve target recipients
  const toEmail =
    leadData.tenantEmail ||
    process.env.NOTIFICATION_EMAIL ||
    process.env.DEV_NOTIFICATION_EMAIL ||
    "danielxleszczynski@gmail.com";

  // Optional BCC copy only if explicitly configured via environment variable
  const bccEmail = process.env.CC_NOTIFICATION_EMAIL || undefined;

  if (!toEmail) {
    console.log("ℹ️ [Lead Engine] Brak adresu e-mail odbiorcy. Pomijam powiadomienie.");
    return;
  }

  const isScoutPartner =
    leadData.source === "vroomscout_partner_application" ||
    leadData.dealerId === "vroomscout_network";

  const isSaasApp =
    leadData.source === "vroomdealer_saas_test_application" ||
    leadData.source === "vroomdealer_pilot_application" ||
    leadData.dealerId === "vroomdealer_saas";

  const rawDetails = leadData.vehicleDetails as string | Record<string, unknown> | undefined;
  const partnerDetails = (rawDetails && typeof rawDetails === "object" ? rawDetails : {}) as Record<string, unknown>;
  const partnerCompany = (partnerDetails.dealerName as string) || leadData.customerName || "Partner";
  const partnerCity = (partnerDetails.city as string) || "Polska";

  const subject = isScoutPartner
    ? `[VroomScout] Zgłoszenie partnerskie: ${partnerCompany} (${partnerCity})`
    : isSaasApp
    ? `Nowe zgłoszenie do testów VroomDealer: ${leadData.customerName || leadData.customerPhone}`
    : `Nowy lead odkupu: ${leadData.customerName || leadData.customerPhone}`;

  let vehicleHtml = "";

  if (!isScoutPartner) {
    if (typeof rawDetails === "string" && rawDetails.trim()) {
      vehicleHtml = `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:10px;margin:16px 0;">
          <h4 style="margin:0 0 8px;color:#0f172a;font-size:15px;">🚗 Szczegóły pojazdu:</h4>
          <p style="margin:0;font-size:14px;color:#334155;line-height:1.5;">${rawDetails}</p>
        </div>
      `;
    } else if (rawDetails && typeof rawDetails === "object") {
      const vehicleObj = rawDetails as Record<string, unknown>;
      vehicleHtml = `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:10px;margin:16px 0;">
          <h4 style="margin:0 0 10px;color:#0f172a;font-size:15px;">🚗 Dane pojazdu:</h4>
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#334155;">
            ${vehicleObj.brand ? `<tr><td style="padding:4px 0;font-weight:bold;width:40%;">Marka i Model:</td><td>${vehicleObj.brand} ${vehicleObj.model || ""}</td></tr>` : ""}
            ${vehicleObj.year ? `<tr><td style="padding:4px 0;font-weight:bold;">Rok produkcji:</td><td>${vehicleObj.year}</td></tr>` : ""}
            ${vehicleObj.mileage ? `<tr><td style="padding:4px 0;font-weight:bold;">Przebieg:</td><td>${vehicleObj.mileage} km</td></tr>` : ""}
            ${vehicleObj.fuelType ? `<tr><td style="padding:4px 0;font-weight:bold;">Paliwo / Skrzynia:</td><td>${vehicleObj.fuelType} ${vehicleObj.transmission ? `(${vehicleObj.transmission})` : ""}</td></tr>` : ""}
            ${vehicleObj.condition ? `<tr><td style="padding:4px 0;font-weight:bold;">Stan auta:</td><td>${vehicleObj.condition}</td></tr>` : ""}
            ${vehicleObj.expectedPrice ? `<tr><td style="padding:4px 0;font-weight:bold;">Oczekiwana cena:</td><td><strong style="color:#059669;">${vehicleObj.expectedPrice} zł</strong></td></tr>` : ""}
            ${vehicleObj.city ? `<tr><td style="padding:4px 0;font-weight:bold;">Lokalizacja:</td><td>${vehicleObj.city}</td></tr>` : ""}
          </table>
        </div>
      `;
    }
  }

  // Photos rendering in HTML + attachments for Resend API
  const photos = Array.isArray(leadData.photos) ? (leadData.photos as string[]) : [];
  let photosHtml = "";
  const attachments: Array<{ filename: string; content: string }> = [];

  if (photos.length > 0) {
    photosHtml = `
      <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:10px;margin:16px 0;">
        <h4 style="margin:0 0 6px;color:#0f172a;font-size:15px;">📷 Załączone zdjęcia (${photos.length}):</h4>
        <p style="margin:0;font-size:13px;color:#475569;">Do niniejszej wiadomości załączono <strong>${photos.length} zdjęć pojazdu</strong> (zobacz załączniki poniżej).</p>
      </div>
    `;

    photos.forEach((dataUrl, idx) => {
      const base64Content = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
      attachments.push({
        filename: `zdjecie-${idx + 1}.jpg`,
        content: base64Content,
      });
    });
  }

  const attributionObj = leadData.attribution as Record<string, unknown> | undefined;
  const attributionHtml = attributionObj
    ? `
      <div style="background:#f1f5f9;padding:12px;border-radius:8px;margin:12px 0;font-size:13px;color:#475569;">
        <strong>📊 Źródło ruchu:</strong> 
        <code>${attributionObj.utm_source || "Organiczne / Bezpośrednie"}</code>
      </div>
    `
    : "";

  const html = isScoutPartner
    ? `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">
        <div style="border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:20px;">
          <div style="font-size:11px;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">
            VroomScout • Sieć Partnerska
          </div>
          <h2 style="color:#0f172a;margin:0;font-size:20px;font-weight:800;">
            Nowe zgłoszenie do sieci odkupu
          </h2>
          <p style="color:#64748b;margin:4px 0 0;font-size:13px;">
            Rejon: <strong>${partnerCity}</strong> | Źródło: <code>scout.vroomdealer.pl</code>
          </p>
        </div>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin-bottom:20px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#334155;">
            <tr>
              <td style="padding:6px 0;font-weight:600;color:#64748b;width:38%;">Nazwa firmy/komisu:</td>
              <td style="padding:6px 0;font-weight:700;color:#0f172a;font-size:15px;">${partnerCompany}</td>
            </tr>
            ${partnerDetails.contactName ? `<tr><td style="padding:6px 0;font-weight:600;color:#64748b;">Osoba do kontaktu:</td><td style="padding:6px 0;font-weight:600;color:#0f172a;">${partnerDetails.contactName}</td></tr>` : ""}
            <tr>
              <td style="padding:6px 0;font-weight:600;color:#64748b;">Telefon:</td>
              <td style="padding:6px 0;"><a href="tel:${leadData.customerPhone}" style="color:#2563eb;font-size:16px;font-weight:700;text-decoration:none;">${leadData.customerPhone}</a></td>
            </tr>
            ${leadData.customerEmail ? `<tr><td style="padding:6px 0;font-weight:600;color:#64748b;">E-mail:</td><td style="padding:6px 0;color:#0f172a;">${leadData.customerEmail}</td></tr>` : ""}
            <tr>
              <td style="padding:6px 0;font-weight:600;color:#64748b;">Miasto / Rejon:</td>
              <td style="padding:6px 0;font-weight:600;color:#0f172a;">${partnerCity}</td>
            </tr>
            ${partnerDetails.stockProfile ? `<tr><td style="padding:6px 0;font-weight:600;color:#64748b;">Profil skupowanych aut:</td><td style="padding:6px 0;color:#0f172a;">${partnerDetails.stockProfile}</td></tr>` : ""}
            ${partnerDetails.targetVolume ? `<tr><td style="padding:6px 0;font-weight:600;color:#64748b;">Szacowany wolumen:</td><td style="padding:6px 0;color:#0f172a;">${partnerDetails.targetVolume}</td></tr>` : ""}
          </table>
        </div>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0 16px;" />
        <p style="font-size:12px;color:#94a3b8;margin:0;text-align:center;">Wysłane automatycznie przez system VroomScout Partner Engine</p>
      </div>
    `
    : `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #cbd5e1;border-radius:16px;background:#ffffff;">
        <div style="background:#0f172a;padding:16px 20px;border-radius:12px;margin-bottom:20px;">
          <h2 style="color:#10b981;margin:0;font-size:18px;">${isSaasApp ? "Zgłoszenie do testów VroomDealer.pl" : "Nowy lead skupu pojazdów"}</h2>
          <p style="color:#94a3b8;margin:4px 0 0;font-size:13px;">Komis: <strong>${leadData.dealerId}</strong> | Ścieżka: <code>${leadData.landingPath}</code></p>
        </div>

        <div style="font-size:15px;color:#1e293b;line-height:1.6;margin-bottom:16px;">
          <p style="margin:6px 0;"><strong>👤 Imię i nazwisko:</strong> ${leadData.customerName || "Brak danych"}</p>
          <p style="margin:6px 0;font-size:17px;"><strong>📞 Telefon:</strong> <a href="tel:${leadData.customerPhone}" style="color:#2563eb;font-weight:bold;text-decoration:none;">${leadData.customerPhone}</a></p>
          ${leadData.customerEmail ? `<p style="margin:6px 0;"><strong>✉️ Email:</strong> ${leadData.customerEmail}</p>` : ""}
        </div>

        ${vehicleHtml}
        ${photosHtml}
        ${attributionHtml}

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0 16px;" />
        <p style="font-size:12px;color:#94a3b8;margin:0;text-align:center;">Wysłane automatycznie przez system VroomDealer.pl Engine</p>
      </div>
    `;

  try {
    const resendBody: Record<string, unknown> = {
      from: process.env.RESEND_FROM_EMAIL || "VroomDealer <biuro@vroomdealer.pl>",
      to: [toEmail],
      subject,
      html,
    };

    if (bccEmail && bccEmail !== toEmail) {
      resendBody.bcc = [bccEmail];
    }

    if (attachments.length > 0) {
      resendBody.attachments = attachments;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendBody),
    });

    if (res.ok) {
      console.log(
        `📧 [Lead Engine] Powiadomienie e-mail wysłane do: ${toEmail}${
          bccEmail ? ` (BCC: ${bccEmail})` : ""
        }`
      );
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
    // Wysyłamy powiadomienie e-mail (awaitowane, aby Vercel Serverless nie ubił procesu)
    try {
      await sendLeadNotificationEmail(leadData);
    } catch (emailErr) {
      console.error("❌ Błąd wysyłania maila powiadomienia:", emailErr);
    }

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
            attribution: leadData.attribution || null,
            local_seo_city: leadData.localSeoCity || null,
            photos: Array.isArray(leadData.photos) ? leadData.photos.length : null,
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
