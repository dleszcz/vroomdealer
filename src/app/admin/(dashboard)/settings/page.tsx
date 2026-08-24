import { getCurrentProfile } from "@/app/admin/actions";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = {
  title: "Ustawienia Komisu | Panel Admina",
};

export default async function AdminSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");

  return (
    <div>
      <div style={headerStyles.wrapper}>
        <h1 style={headerStyles.title}>⚙️ Ustawienia komisu</h1>
        <p style={headerStyles.subtitle}>
          Kompleksowa konfiguracja wizytówki, brandingu, kontaktów, integracji i SEO
        </p>
      </div>

      <SettingsForm
        profile={{
          business_name: profile.business_name ?? null,
          business_description: profile.business_description ?? null,
          custom_domain: profile.custom_domain ?? null,
          notification_email: profile.notification_email ?? null,
          google_sheets_webhook_url: profile.google_sheets_webhook_url ?? null,
          contact_phone: profile.contact_phone ?? null,
          whatsapp_number: profile.whatsapp_number ?? null,
          address: profile.address ?? null,
          city: profile.city ?? null,
          postal_code: profile.postal_code ?? null,
          county: profile.county ?? null,
          region: profile.region ?? null,
          pixel_id: profile.pixel_id ?? null,
          branding: (profile.branding as Record<string, unknown>) ?? null,
          analytics: (profile.analytics as Record<string, unknown>) ?? null,
          opening_hours: (profile.opening_hours as Record<string, unknown>) ?? null,
          business_rules: (profile.business_rules as Record<string, unknown>) ?? null,
          seo: (profile.seo as Record<string, unknown>) ?? null,
        }}
      />
    </div>
  );
}

const headerStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    marginBottom: "24px",
  },
  title: {
    color: "#f1f5f9",
    fontSize: "24px",
    fontWeight: "800",
    margin: "0 0 4px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0",
  },
};
