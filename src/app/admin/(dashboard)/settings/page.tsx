import { getCurrentProfile, getProfileBySlug } from "@/app/admin/actions";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = {
  title: "Ustawienia Komisu | Panel Admina",
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string }>;
}) {
  const currentProfile = await getCurrentProfile();
  if (!currentProfile) redirect("/admin/login");

  const resolvedParams = await searchParams;
  const isSuperAdmin = Boolean(currentProfile.is_super_admin);

  let targetProfile = currentProfile;

  if (isSuperAdmin && resolvedParams.tenant) {
    const fetched = await getProfileBySlug(resolvedParams.tenant);
    if (fetched) {
      targetProfile = fetched;
    }
  }

  return (
    <div>
      <div style={headerStyles.wrapper}>
        <h1 style={headerStyles.title}>
          ⚙️ Ustawienia komisu{" "}
          {isSuperAdmin && targetProfile.slug !== currentProfile.slug && (
            <span style={headerStyles.tenantTag}>[{targetProfile.slug}]</span>
          )}
        </h1>
        <p style={headerStyles.subtitle}>
          Kompleksowa konfiguracja wizytówki, brandingu, kontaktów, integracji i SEO
          {isSuperAdmin && ` (Zarządzany komis: ${targetProfile.business_name || targetProfile.slug})`}
        </p>
      </div>

      <SettingsForm
        targetSlug={isSuperAdmin && targetProfile.slug !== currentProfile.slug ? targetProfile.slug : undefined}
        profile={{
          business_name: targetProfile.business_name ?? null,
          business_description: targetProfile.business_description ?? null,
          custom_domain: targetProfile.custom_domain ?? null,
          notification_email: targetProfile.notification_email ?? null,
          google_sheets_webhook_url: targetProfile.google_sheets_webhook_url ?? null,
          contact_phone: targetProfile.contact_phone ?? null,
          whatsapp_number: targetProfile.whatsapp_number ?? null,
          address: targetProfile.address ?? null,
          city: targetProfile.city ?? null,
          postal_code: targetProfile.postal_code ?? null,
          county: targetProfile.county ?? null,
          region: targetProfile.region ?? null,
          pixel_id: targetProfile.pixel_id ?? null,
          branding: (targetProfile.branding as Record<string, unknown>) ?? null,
          analytics: (targetProfile.analytics as Record<string, unknown>) ?? null,
          opening_hours: (targetProfile.opening_hours as Record<string, unknown>) ?? null,
          business_rules: (targetProfile.business_rules as Record<string, unknown>) ?? null,
          seo: (targetProfile.seo as Record<string, unknown>) ?? null,
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
  tenantTag: {
    color: "#10b981",
    fontSize: "18px",
    fontWeight: "600",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0",
  },
};
