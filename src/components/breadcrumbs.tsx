import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: "default" | "dark" | "transparent";
}

export function Breadcrumbs({ items, variant = "default" }: BreadcrumbsProps) {
  const isDark = variant === "dark" || variant === "transparent";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`vd-breadcrumbs ${isDark ? "vd-breadcrumbs--dark" : ""}`}
      style={{
        padding: isDark ? "0" : "12px 0",
        background: isDark ? "transparent" : "var(--color-surface)",
        borderBottom: isDark ? "none" : "1px solid var(--color-border)",
      }}
    >
      <div className={isDark ? "" : "vd-container"}>
        <ol
          className="vd-breadcrumbs__list"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li
                key={index}
                className="vd-breadcrumbs__item"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: isDark ? "rgba(255,255,255,0.7)" : "var(--color-text-soft)",
                }}
              >
                {index > 0 && (
                  <ChevronRight
                    className="vd-breadcrumbs__separator"
                    size={14}
                    style={{ color: isDark ? "rgba(255,255,255,0.4)" : "var(--color-text-faint)", flexShrink: 0 }}
                  />
                )}
                {isLast || !item.href ? (
                  <span
                    className="vd-breadcrumbs__current"
                    aria-current="page"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: 600,
                      color: isDark ? "#ffffff" : "var(--color-foreground)",
                    }}
                  >
                    {index === 0 && <Home size={14} className="vd-breadcrumbs__icon" />}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="vd-breadcrumbs__link"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: isDark ? "#94a3b8" : "var(--color-text-soft)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {index === 0 && <Home size={14} className="vd-breadcrumbs__icon" />}
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
