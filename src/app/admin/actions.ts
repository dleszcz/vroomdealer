"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Wpisz e-mail oraz hasło." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    console.error("[Server Action Login Error]:", error);
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Nieprawidłowy email lub hasło"
          : error.message,
    };
  }

  redirect("/admin/leads");
}

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("[getCurrentProfile] getUser:", user?.email || "NULL", "error:", userError?.message || "none");

  if (!user) return null;

  // Try matching user_id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  console.log("[getCurrentProfile] profile-by-user_id:", profile?.slug || "NULL", "error:", profileError?.message || "none");

  if (profile) return profile;

  // Fallback match by d-car or first profile in database
  const { data: fallbackProfile, error: fallbackError } = await supabase
    .from("profiles")
    .select("*")
    .or("slug.eq.d-car,id.neq.00000000-0000-0000-0000-000000000000")
    .limit(1)
    .maybeSingle();

  console.log("[getCurrentProfile] fallback:", fallbackProfile?.slug || "NULL", "error:", fallbackError?.message || "none");

  return fallbackProfile || null;
}

export async function getAllTenants() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, slug, business_name, custom_domain, contact_phone, notification_email, city, is_published, created_at")
    .order("created_at", { ascending: false });

  return profiles || [];
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const currentBranding = (currentProfile?.branding as Record<string, unknown>) || {};
  const currentAnalytics = (currentProfile?.analytics as Record<string, unknown>) || {};
  const currentSeo = (currentProfile?.seo as Record<string, unknown>) || {};
  const currentBusinessRules = (currentProfile?.business_rules as Record<string, unknown>) || {};
  const currentOpeningHours = (currentProfile?.opening_hours as Record<string, unknown>) || {};

  const updates: Record<string, unknown> = {};

  // Basic info
  const businessName = formData.get("business_name");
  if (businessName !== null) updates.business_name = businessName;

  const businessDescription = formData.get("business_description");
  if (businessDescription !== null) updates.business_description = businessDescription;

  const customDomain = formData.get("custom_domain");
  if (customDomain !== null) updates.custom_domain = customDomain || null;

  const notificationEmail = formData.get("notification_email");
  if (notificationEmail !== null) updates.notification_email = notificationEmail;

  const googleSheetsWebhook = formData.get("google_sheets_webhook_url");
  if (googleSheetsWebhook !== null) updates.google_sheets_webhook_url = googleSheetsWebhook;

  // Contact & Address
  const contactPhone = formData.get("contact_phone");
  if (contactPhone !== null) updates.contact_phone = contactPhone;

  const whatsappNumber = formData.get("whatsapp_number");
  if (whatsappNumber !== null) updates.whatsapp_number = whatsappNumber;

  const address = formData.get("address");
  if (address !== null) updates.address = address;

  const city = formData.get("city");
  if (city !== null) updates.city = city;

  const postalCode = formData.get("postal_code");
  if (postalCode !== null) updates.postal_code = postalCode;

  const county = formData.get("county");
  if (county !== null) updates.county = county;

  const region = formData.get("region");
  if (region !== null) updates.region = region;

  // Branding JSONB
  const primaryColor = formData.get("branding_primary_color");
  const accentColor = formData.get("branding_accent_color");
  const logoUrl = formData.get("branding_logo_url");
  const heroTitle = formData.get("branding_hero_title");
  const heroSubtitle = formData.get("branding_hero_subtitle");

  updates.branding = {
    ...currentBranding,
    primaryColor: primaryColor || currentBranding.primaryColor || "#10b981",
    accentColor: accentColor || currentBranding.accentColor || "#f59e0b",
    logoUrl: logoUrl || currentBranding.logoUrl || null,
    heroTitle: heroTitle || currentBranding.heroTitle || null,
    heroSubtitle: heroSubtitle || currentBranding.heroSubtitle || null,
  };

  // Analytics JSONB
  const pixelId = formData.get("pixel_id");
  const googleAnalyticsId = formData.get("google_analytics_id");
  updates.analytics = {
    ...currentAnalytics,
    pixelId: pixelId || null,
    googleAnalyticsId: googleAnalyticsId || null,
  };
  if (pixelId !== null) updates.pixel_id = pixelId;

  // Opening Hours JSONB
  const hoursWeekdays = formData.get("hours_weekdays");
  const hoursSaturday = formData.get("hours_saturday");
  const hoursSunday = formData.get("hours_sunday");
  updates.opening_hours = {
    ...currentOpeningHours,
    weekdays: hoursWeekdays || "08:00 - 18:00",
    saturday: hoursSaturday || "09:00 - 14:00",
    sunday: hoursSunday || "Zamknięte",
  };

  // Business Rules JSONB
  const minPurchasePrice = formData.get("min_purchase_price");
  const maxPurchasePrice = formData.get("max_purchase_price");
  const guaranteeText = formData.get("guarantee_text");
  updates.business_rules = {
    ...currentBusinessRules,
    minPurchasePrice: minPurchasePrice ? Number(minPurchasePrice) : 500,
    maxPurchasePrice: maxPurchasePrice ? Number(maxPurchasePrice) : 150000,
    guaranteeText: guaranteeText || null,
  };

  // SEO JSONB
  const metaTitle = formData.get("meta_title");
  const metaDescription = formData.get("meta_description");
  updates.seo = {
    ...currentSeo,
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
  };

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
