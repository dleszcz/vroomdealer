"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";

interface AdminSidebarProps {
  businessName: string;
  slug: string;
}

const navItems = [
  { href: "/admin/leads", label: "Leady", icon: "📋" },
  { href: "/admin/settings", label: "Ustawienia", icon: "⚙️" },
];

export function AdminSidebar({ businessName, slug }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brandSection}>
        <div style={styles.brandIcon}>🚗</div>
        <div>
          <div style={styles.brandName}>{businessName}</div>
          <div style={styles.brandSlug}>/{slug}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <button
          onClick={() => signOut()}
          style={styles.logoutBtn}
        >
          🚪 Wyloguj się
        </button>
        <div style={styles.poweredBy}>
          VroomDealer.pl
        </div>
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
    marginBottom: "32px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
    paddingBottom: "24px",
  },
  brandIcon: {
    fontSize: "32px",
  },
  brandName: {
    color: "#f1f5f9",
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "1.2",
  },
  brandSlug: {
    color: "#64748b",
    fontSize: "12px",
    fontFamily: "monospace",
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
    gap: "12px",
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
