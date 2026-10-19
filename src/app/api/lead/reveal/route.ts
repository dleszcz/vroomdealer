import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { formatClickRevealTag, formatRevealTag } from '@/lib/lead-reveal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { token, buyerName, buyerPhone, offerPrice } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Brak tokena leada.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xfagkubntiqvrvbmoira.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jVG5YKjSeT7YwPk188_jxg_yFlMFt0A';

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Find lead by access_token or id
    let lead: any = null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);

    const { data: byToken } = await supabase
      .from('scout_leads')
      .select('id, access_token, customer_name, customer_phone, condition_notes, status')
      .eq('access_token', token)
      .maybeSingle();

    if (byToken) {
      lead = byToken;
    } else if (token.length >= 6 && token.length <= 12) {
      const { data: byPrefix } = await supabase
        .from('scout_leads')
        .select('id, access_token, customer_name, customer_phone, condition_notes, status')
        .ilike('access_token', `${token}%`)
        .limit(1)
        .maybeSingle();
      if (byPrefix) lead = byPrefix;
    } else if (isUuid) {
      const { data: byId } = await supabase
        .from('scout_leads')
        .select('id, access_token, customer_name, customer_phone, condition_notes, status')
        .eq('id', token)
        .maybeSingle();
      if (byId) lead = byId;
    }

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Nie znaleziono zgłoszenia pojazdu.' },
        { status: 404 }
      );
    }

    // 2. Prepare reveal tag
    const dateFormatted = new Date().toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Warsaw',
    });

    const revealTag = buyerName && buyerPhone
      ? formatRevealTag({ buyerName, buyerPhone, offerPrice, timestamp: dateFormatted })
      : formatClickRevealTag(dateFormatted);

    const currentNotes = lead.condition_notes ? lead.condition_notes.trim() : '';
    const updatedNotes = currentNotes ? `${currentNotes} | ${revealTag}` : revealTag;

    const updates: Record<string, any> = {
      condition_notes: updatedNotes,
    };

    if (lead.status === 'new') {
      updates.status = 'sent_to_buyer';
    }

    const { error: updateError } = await supabase
      .from('scout_leads')
      .update(updates)
      .eq('id', lead.id);

    if (updateError) {
      console.error('[Reveal Lead Error]:', updateError);
    }

    return NextResponse.json({
      success: true,
      phone: lead.customer_phone,
      name: lead.customer_name || 'Klient',
    });
  } catch (err: any) {
    console.error('[Reveal API Exception]:', err);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas odkrywania kontaktu.' },
      { status: 500 }
    );
  }
}
