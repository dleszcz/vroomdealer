import React from 'react';
import { checkAdminSession } from '@/lib/admin-auth';
import { enforceDeviceLock } from '@/lib/device-lock';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface AdminPageProps {
  searchParams: Promise<{ pair?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { pair } = await searchParams;
  await enforceDeviceLock(pair);

  const isAuth = await checkAdminSession();
  if (!isAuth) {
    redirect('/admin/login');
  }

  // Fetch leads from Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let leads: any[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch from dedicated scout_leads first
      const { data: scoutLeads } = await supabase
        .from('scout_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (scoutLeads && scoutLeads.length > 0) {
        leads = scoutLeads;
      } else {
        // Fallback to leads table
        const { data: generalLeads } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (generalLeads && generalLeads.length > 0) {
          leads = generalLeads.map((gl: any) => {
            const veh = (gl.vehicle_details || {}) as Record<string, any>;
            return {
              id: gl.id,
              access_token: gl.id,
              source_domain: gl.source || 'VroomDealer',
              category: 'osobowe',
              make_model: veh.brand ? `${veh.brand} ${veh.model || ''}`.trim() : (gl.customer_name || 'Zgłoszenie'),
              year: veh.year || 2018,
              fuel: veh.fuelType || 'diesel',
              condition: veh.condition || 'bardzo_dobry',
              condition_notes: veh.note || null,
              price_bracket: veh.expectedPrice ? `${veh.expectedPrice} zł` : 'Czeka na wycenę',
              city: veh.city || gl.local_seo_city || 'Polska',
              customer_name: gl.customer_name || 'Klient',
              customer_phone: gl.customer_phone,
              photo_urls: [],
              created_at: gl.created_at,
              status: gl.status || 'new',
            };
          });
        }
      }
    } catch (err) {
      console.error('[Admin Page Fetch Error]:', err);
    }
  }

  return <AdminDashboardClient initialLeads={leads} />;
}
