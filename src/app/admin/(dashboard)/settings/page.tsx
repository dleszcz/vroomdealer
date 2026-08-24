import { getCurrentProfile } from "@/app/admin/actions";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = {
  title: "Ustawienia | Panel Admina",
};

export default async function AdminSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");

  return (
    <div>
      <div style={headerStyles.wrapper}>
        <h1 style={headerStyles.title}>⚙️ Ustawienia komisu</h1>
        <p style={headerStyles.subtitle}>
          Konfiguracja powiadomień, integracji i danych kontaktowych
        </p>
      </div>

      <SettingsForm
        profile={{
          notification_email: profile.notification_email ?? null,
          google_sheets_webhook_url: profile.google_sheets_webhook_url ?? null,
          contact_phone: profile.contact_phone ?? null,
          whatsapp_number: profile.whatsapp_number ?? null,
          pixel_id: profile.pixel_id ?? null,
          analytics: profile.analytics as Record<string, string> | null,
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
