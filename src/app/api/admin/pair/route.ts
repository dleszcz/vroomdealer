import { NextRequest, NextResponse } from 'next/server';
import { PAIRING_SECRET, DEVICE_LOCK_COOKIE, AUTHORIZED_VALUE } from '@/lib/device-lock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pair = searchParams.get('pair');

  if (pair && pair.trim() === PAIRING_SECRET) {
    const redirectUrl = new URL('/admin', req.url);
    const res = NextResponse.redirect(redirectUrl);
    res.cookies.set(DEVICE_LOCK_COOKIE, AUTHORIZED_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 rok
    });
    return res;
  }

  // Jeśli błędny klucz lub brak – ukryj stronę (404)
  return new NextResponse('Not Found', { status: 404 });
}
