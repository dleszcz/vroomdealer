import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/app/admin/actions";

export default async function AdminPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");

  if (profile.is_super_admin) {
    redirect("/admin/tenants");
  } else {
    redirect("/admin/leads");
  }
}
