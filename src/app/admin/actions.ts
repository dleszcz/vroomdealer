"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return profile;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const updates: Record<string, unknown> = {};

  const notificationEmail = formData.get("notification_email");
  if (notificationEmail !== null) updates.notification_email = notificationEmail;

  const googleSheetsWebhook = formData.get("google_sheets_webhook_url");
  if (googleSheetsWebhook !== null) updates.google_sheets_webhook_url = googleSheetsWebhook;

  const contactPhone = formData.get("contact_phone");
  if (contactPhone !== null) updates.contact_phone = contactPhone;

  const whatsappNumber = formData.get("whatsapp_number");
  if (whatsappNumber !== null) updates.whatsapp_number = whatsappNumber;

  const pixelId = formData.get("pixel_id");
  const googleAnalyticsId = formData.get("google_analytics_id");
  if (pixelId !== null || googleAnalyticsId !== null) {
    updates.analytics = {
      pixelId: pixelId || null,
      googleAnalyticsId: googleAnalyticsId || null,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Błąd zapisu: ${error.message}`);
  }

  redirect("/admin/settings?saved=true");
}

export async function updateLeadStatus(leadId: string, status: string, notes?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Nie jesteś zalogowany");
  }

  // Verify ownership via RLS
  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  const { error } = await supabase
    .from("leads")
    .update(updateData)
    .eq("id", leadId);

  if (error) {
    throw new Error(`Błąd aktualizacji: ${error.message}`);
  }
}
