import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'danielxleszczynski@gmail.com';
const ADMIN_PIN = process.env.ADMIN_PIN || '468478';
const COOKIE_NAME = 'vroom_admin_session';

// Simple signed token: base64(email:timestamp:hash)
function generateToken(): string {
  const timestamp = Date.now();
  const raw = `${ADMIN_EMAIL}:${timestamp}:${ADMIN_PIN}`;
  return Buffer.from(raw).toString('base64');
}

export function verifyAdminPin(pin: string, email?: string): boolean {
  if (email && email.trim().toLowerCase() !== ADMIN_EMAIL) {
    return false;
  }
  return pin.trim() === ADMIN_PIN;
}

export function isTokenValid(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, timestampStr, pin] = decoded.split(':');
    if (email !== ADMIN_EMAIL || pin !== ADMIN_PIN) return false;
    
    const timestamp = parseInt(timestampStr, 10);
    // Token valid for 30 days
    const maxAgeMs = 1000 * 60 * 60 * 24 * 30;
    if (Date.now() - timestamp > maxAgeMs) return false;

    return true;
  } catch {
    return false;
  }
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = generateToken();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return false;
  return isTokenValid(cookie.value);
}
