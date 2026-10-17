import { cookies, headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export const DEVICE_LOCK_COOKIE = 'vroom_device_lock';
export const PAIRING_SECRET = process.env.ADMIN_DEVICE_SECRET || 'vroom468';
export const AUTHORIZED_VALUE = 'authorized_vroom_daniel_iphone_468';

export async function isDeviceAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  const lockCookie = cookieStore.get(DEVICE_LOCK_COOKIE);
  return lockCookie?.value === AUTHORIZED_VALUE;
}

/**
 * Weryfikuje czy urządzenie jest autoryzowane.
 * - Na localhost (development) dostęp jest automatyczny (brak wymogu parowania na komputerze).
 * - Na produkcji: wymagane jest jednorazowe sparowanie przez ?pair=vroom468.
 * - Jeśli brak autoryzacji na produkcji -> rzuca 404 Not Found.
 */
export async function enforceDeviceLock(pairKey?: string | null): Promise<void> {
  // Jeśli podano klucz w URL, przekieruj do Route Handlera, który ustawi ciasteczko urządzenia
  if (pairKey && pairKey.trim() === PAIRING_SECRET) {
    redirect(`/api/admin/pair?pair=${encodeURIComponent(pairKey.trim())}`);
  }

  // Na localhost / dev nie blokujemy komputera roboczego
  const headerList = await headers();
  const host = headerList.get('host') || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || process.env.NODE_ENV !== 'production';

  if (isLocal) {
    return;
  }

  const authorized = await isDeviceAuthorized();
  if (authorized) {
    return;
  }

  // Produkcja bez autoryzacji urządzenia – 404 (strona nie istnieje dla obcych urządzeń)
  notFound();
}
