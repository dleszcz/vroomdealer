import { getCurrentProfile, getAllTenants } from "@/app/admin/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Zarządzanie Komisami (SaaS) | Panel Admina",
};

export default async function AdminTenantsPage() {
  const currentProfile = await getCurrentProfile();
  if (!currentProfile) redirect("/admin/login");

  // Check if current user is Superadmin
  if (!currentProfile.is_super_admin) {
    redirect("/admin/leads");
  }

  const tenants = await getAllTenants();

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👑 Zarządzanie Komisami (Superadmin SaaS)</h1>
          <p style={styles.subtitle}>
            Przeglądaj wszystkie uruchomione wizytówki komisów na tym środowisku
          </p>
        </div>
        <div style={styles.badge}>
          {tenants.length} aktywne komisy
        </div>
      </div>

      <div style={styles.grid}>
        {tenants.map((t) => (
          <div key={t.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.cardTitle}>{t.business_name || t.slug}</div>
              <div style={styles.slugBadge}>/{t.slug}</div>
            </div>

            <div style={styles.cardDetails}>
              {t.custom_domain && (
                <p style={styles.detailRow}>
                  <strong>🌐 Domena:</strong>{" "}
                  <a
                    href={`https://${t.custom_domain}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#3b82f6", textDecoration: "none" }}
                  >
                    {t.custom_domain} ↗
                  </a>
                </p>
              )}
              {t.contact_phone && (
                <p style={styles.detailRow}>
                  <strong>📞 Telefon:</strong> {t.contact_phone}
                </p>
              )}
              {t.notification_email && (
                <p style={styles.detailRow}>
                  <strong>✉️ Email:</strong> {t.notification_email}
                </p>
              )}
              {t.city && (
                <p style={styles.detailRow}>
                  <strong>📍 Miasto:</strong> {t.city}
                </p>
              )}
            </div>

            <div style={styles.cardActions}>
              <a
                href={`/${t.slug}`}
                target="_blank"
                rel="noreferrer"
                style={styles.viewWebsiteBtn}
              >
                🔗 Zobacz landing ↗
              </a>
              <Link
                href={`/admin/leads?tenant=${t.slug}`}
                style={styles.manageBtn}
              >
                📋 Przeglądaj leady
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  badge: {
    background: "rgba(16, 185, 129, 0.12)",
    color: "#10b981",
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  cardTitle: {
    color: "#f1f5f9",
    fontSize: "17px",
    fontWeight: "700",
  },
  slugBadge: {
    background: "rgba(148, 163, 184, 0.1)",
    color: "#94a3b8",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontFamily: "monospace",
  },
  cardDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "20px",
  },
  detailRow: {
    color: "#94a3b8",
    fontSize: "13px",
    margin: "0",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    paddingTop: "12px",
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
  },
  viewWebsiteBtn: {
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    color: "#60a5fa",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
    flex: 1,
  },
  manageBtn: {
    background: "rgba(16, 185, 129, 0.12)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    color: "#10b981",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
    flex: 1,
  },
};
