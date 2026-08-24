"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";

interface TenantItem {
  slug: string;
  businessName: string;
  customDomain?: string | null;
}

interface AdminSidebarProps {
  businessName: string;
  slug: string;
  isSuperAdmin?: boolean;
  allTenants?: TenantItem[];
}

export function AdminSidebar({
  businessName,
  slug,
  isSuperAdmin = false,
  allTenants = [],
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brandSection}>
        <div style={styles.brandIcon}>🚗</div>
        <div>
          <div style={styles.brandName}>
            {businessName}
            {isSuperAdmin && <span style={styles.crownBadge}>👑</span>}
          </div>
          <div style={styles.brandSlug}>/{slug}</div>
        </div>
      </div>

      {/* Superadmin Tenant Selector */}
      {isSuperAdmin && (
        <div style={styles.superadminSection}>
          <div style={styles.superadminLabel}>👑 PRZEŁĄCZ KOMIS (SUPERADMIN)</div>
          <select
            onChange={(e) => {
              const selectedSlug = e.target.value;
              if (selectedSlug === "all") {
                window.location.href = "/admin/tenants";
              } else if (selectedSlug) {
                window.location.href = `/admin/leads?tenant=${selectedSlug}`;
              }
            }}
            defaultValue=""
            style={styles.tenantSelect}
          >
            <option value="" disabled>
              -- Wybierz komis --
            </option>
            {allTenants.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.businessName} ({t.slug})
              </option>
            ))}
            <option value="all">👑 Wszystkie komisy (/admin/tenants)</option>
          </select>
        </div>
      )}

      {/* Navigation */}
      <nav style={styles.nav}>
        <Link
          href="/admin/leads"
          style={{
            ...styles.navItem,
            ...(pathname.startsWith("/admin/leads") ? styles.navItemActive : {}),
          }}
        >
          <span style={styles.navIcon}>📋</span>
          <span>Zgłoszenia (Leady)</span>
        </Link>

        <Link
          href="/admin/settings"
          style={{
            ...styles.navItem,
            ...(pathname.startsWith("/admin/settings") ? styles.navItemActive : {}),
          }}
        >
          <span style={styles.navIcon}>⚙️</span>
          <span>Ustawienia komisu</span>
        </Link>

        {isSuperAdmin && (
          <Link
            href="/admin/tenants"
            style={{
              ...styles.navItem,
              ...(pathname.startsWith("/admin/tenants") ? styles.navItemActive : {}),
            }}
          >
            <span style={styles.navIcon}>🏢</span>
            <span>Komisy (SaaS)</span>
          </Link>
        )}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <a
          href={`/${slug}`}
          target="_blank"
          rel="noreferrer"
          style={styles.liveSiteLink}
        >
          🌐 Otwórz landing ↗
        </a>

        <button onClick={() => signOut()} style={styles.logoutBtn}>
          🚪 Wyloguj się
        </button>
        <div style={styles.poweredBy}>VroomDealer.pl SaaS</div>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: "260px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
    borderRight: "1px solid rgba(148, 163, 184, 0.1)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    position: "sticky",
    top: 0,
    flexShrink: 0,
  },
  brandSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    marginBottom: "16px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
    paddingBottom: "16px",
  },
  brandIcon: {
    fontSize: "32px",
  },
  brandName: {
    color: "#f1f5f9",
    fontSize: "15px",
    fontWeight: "700",
    lineHeight: "1.2",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  crownBadge: {
    fontSize: "14px",
  },
  brandSlug: {
    color: "#64748b",
    fontSize: "12px",
    fontFamily: "monospace",
  },
  superadminSection: {
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "20px",
  },
  superadminLabel: {
    color: "#10b981",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "6px",
    letterSpacing: "0.5px",
  },
  tenantSelect: {
    width: "100%",
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "6px",
    color: "#f1f5f9",
    padding: "6px 8px",
    fontSize: "12px",
    outline: "none",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "10px",
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.15s ease",
  },
  navItemActive: {
    background: "rgba(16, 185, 129, 0.12)",
    color: "#10b981",
  },
  navIcon: {
    fontSize: "18px",
  },
  footer: {
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
    paddingTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  liveSiteLink: {
    display: "block",
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#60a5fa",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s ease",
  },
  poweredBy: {
    textAlign: "center",
    color: "#475569",
    fontSize: "11px",
  },
};
