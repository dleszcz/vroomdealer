import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/app/admin/actions";
import { redirect } from "next/navigation";
import { LeadsTable } from "@/components/admin/leads-table";

export const metadata = {
  title: "Leady | Panel Admina",
};

export default async function AdminLeadsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");

  const supabase = await createClient();

  // Fetch leads for this dealer (RLS ensures only own leads)
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("dealer_id", profile.slug)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Error fetching leads:", error);
  }

  return (
    <div>
      <div style={headerStyles.wrapper}>
        <div>
          <h1 style={headerStyles.title}>📋 Zgłoszenia (Leady)</h1>
          <p style={headerStyles.subtitle}>
            Zarządzaj zgłoszeniami wycen od klientów
          </p>
        </div>
        <div style={headerStyles.badge}>
          {leads?.length || 0} zgłoszeń
        </div>
      </div>

      <LeadsTable leads={leads || []} />
    </div>
  );
}

const headerStyles: Record<string, React.CSSProperties> = {
  wrapper: {
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
};
