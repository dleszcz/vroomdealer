import React from "react";
import { checkAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Tenant } from "@/types/database";
import { CarRepository } from "@/features/inventory";
import { CarsInventoryView } from "@/features/inventory/components/cars-inventory-view";

export const dynamic = "force-dynamic";

export default async function AdminCarsPage() {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  // Pobranie profilu tenanta (domyślnie D-Car lub pierwszy zarejestrowany)
  const { data: tenantData } = await supabase
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const tenant: Tenant = tenantData
    ? {
        ...(tenantData as Tenant),
        autoplac_enabled: Boolean(tenantData.autoplac_enabled),
      }
    : {
        id: "a0000000-0000-0000-0000-000000000001",
        slug: "d-car",
        business_name: "D-Car Auto Skup & Komis",
        business_description: null,
        logo_url: null,
        pixel_id: null,
        whatsapp_number: null,
        contact_phone: "+48 500 000 000",
        address: null,
        city: "Polska",
        created_at: new Date().toISOString(),
        autoplac_feed_token: "a0000000-0000-0000-0000-000000000001",
        autoplac_enabled: false,
      };

  // Pobranie aut komisu
  const carsResult = await CarRepository.getCarsByTenantId(tenant.id);
  const cars = carsResult.data || [];

  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const feedIdentifier = tenant.slug || tenant.autoplac_feed_token || tenant.id;
  const feedUrl = `${baseUrl}/api/integrations/autoplac/${feedIdentifier}/feed.xml`;

  return (
    <CarsInventoryView
      initialCars={cars}
      tenant={tenant}
      feedUrl={feedUrl}
    />
  );
}
