'use server';

import { redirect } from 'next/navigation';
import { verifyAdminPin, setAdminSession, clearAdminSession } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

export async function loginWithPinAction(_prevState: any, formData: FormData) {
  const pin = formData.get('pin')?.toString() || '';
  const email = formData.get('email')?.toString() || '';

  if (!verifyAdminPin(pin, email)) {
    return {
      success: false,
      error: 'Nieprawidłowy kod PIN lub adres e-mail.',
    };
  }

  await setAdminSession();
  redirect('/admin');
}

export async function logoutAction() {
  await clearAdminSession();
  redirect('/admin/login');
}

export async function updateLeadStatusAction(leadId: string, status: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return { success: false, error: 'Brak konfiguracji bazy' };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase
      .from('scout_leads')
      .update({ status })
      .eq('id', leadId);

    if (error) {
      console.warn('[Admin status update note]:', error.message);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAiValuationAction(leadData: any) {
  const { getAiValuationForLead } = await import('@/lib/ai-valuation');
  try {
    const valuation = await getAiValuationForLead({
      id: leadData.id,
      make_model: leadData.make_model,
      year: leadData.year,
      fuel: leadData.fuel,
      price_bracket: leadData.price_bracket,
      condition: leadData.condition,
      condition_notes: leadData.condition_notes,
      city: leadData.city,
      mileage: leadData.mileage,
    });
    return { success: true, valuation };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

