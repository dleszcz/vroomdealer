import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/app/admin/actions";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Panel Admina | VroomDealer",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/admin/login");
  }

  return (
    <div style={layoutStyles.wrapper}>
      <AdminSidebar
        businessName={profile.business_name}
        slug={profile.slug}
      />
      <main style={layoutStyles.main}>
        <div style={layoutStyles.content}>{children}</div>
      </main>
    </div>
  );
}

const layoutStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f172a",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  main: {
    flex: 1,
    overflow: "auto",
    background: "#0f172a",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },
};
